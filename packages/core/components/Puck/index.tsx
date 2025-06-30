import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { DragStart, DragUpdate } from "@measured/dnd";
import type {
  UiState,
  IframeConfig,
  OnAction,
  Overrides,
  Permissions,
  Plugin,
  InitialHistory,
  UserGenerics,
  Config,
  Data,
} from "../../types";
import { Button } from "../Button";
import DragTabs from "../DragTabs";

import { usePlaceholderStyle } from "../../lib/use-placeholder-style";

import { SidebarSection } from "../SidebarSection";
import {
  Brush,
  ChevronDown,
  ChevronUp,
  Globe,
  PanelLeft,
  PanelRight,
  PlusCircle,
} from "lucide-react";
import { Heading } from "../Heading";
import { IconButton } from "../IconButton/IconButton";
import { DropZoneProvider } from "../DropZone";
import { ItemSelector, getItem } from "../../lib/get-item";
import { PuckAction, StateReducer, createReducer } from "../../reducer";
import { flushZones } from "../../lib/flush-zones";
import getClassNameFactory from "../../lib/get-class-name-factory";
import {
  appContext,
  AppProvider,
  defaultAppState,
  useAppContext,
} from "./context";
import { MenuBar } from "../MenuBar";
import styles from "./styles.module.css";
import { Fields } from "./components/Fields";
import { Components } from "./components/Components";
import { Preview } from "./components/Preview";
import { Outline } from "./components/Outline";
import { usePuckHistory } from "../../lib/use-puck-history";
import { useHistoryStore } from "../../lib/use-history-store";
import { Canvas } from "./components/Canvas";
import { defaultViewports } from "../ViewportControls/default-viewports";
import { Viewports } from "../../types";
import { DragDropContext } from "../DragDropContext";
import { insertComponent } from "../../lib/insert-component";
import { useLoadedOverrides } from "../../lib/use-loaded-overrides";
import { DefaultOverride } from "../DefaultOverride";
import ColorPicker from "../../../../components/ColorPicker";
import FontSelector from "../../../../components/FontSelector";
import getSitePath from "../../../../hooks/getSitePath";
import EditTabs from "../EditTabs";
import { ViewportControls } from "../ViewportControls";
import { BrandSidebar, useBrand } from "./components/BrandSidebar";

const getClassName = getClassNameFactory("Puck", styles);
const getLayoutClassName = getClassNameFactory("PuckLayout", styles);

export function Puck<
  UserConfig extends Config = Config,
  G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>
>({
  children,
  config,
  data: initialData,
  ui: initialUi,
  onChange,
  onPublish,
  onAction,
  permissions = {},
  plugins,
  overrides,
  renderHeader,
  renderHeaderActions,
  headerTitle,
  headerPath,
  viewports = defaultViewports,
  iframe: _iframe,
  dnd,
  initialHistory: _initialHistory,
}: {
  children?: ReactNode;
  config: UserConfig;
  data: Partial<G["UserData"] | Data>;
  ui?: Partial<UiState>;
  onChange?: (data: G["UserData"]) => void;
  onPublish?: (data: G["UserData"]) => void;
  onAction?: OnAction<G["UserData"]>;
  permissions?: Partial<Permissions>;
  plugins?: Plugin[];
  overrides?: Partial<Overrides>;
  renderHeader?: (props: {
    children: ReactNode;
    dispatch: (action: PuckAction) => void;
    state: G["UserAppState"];
  }) => ReactElement;
  renderHeaderActions?: (props: {
    state: G["UserAppState"];
    dispatch: (action: PuckAction) => void;
  }) => ReactElement;
  headerTitle?: string;
  headerPath?: string;
  viewports?: Viewports;
  iframe?: IframeConfig;
  dnd?: {
    disableAutoScroll?: boolean;
  };
  initialHistory?: InitialHistory;
}) {
  const iframe: IframeConfig = {
    enabled: true,
    waitForStyles: true,
    ..._iframe,
  };

  const [generatedAppState] = useState<G["UserAppState"]>(() => {
    const initial = { ...defaultAppState.ui, ...initialUi };

    let clientUiState: Partial<G["UserAppState"]["ui"]> = {};

    if (typeof window !== "undefined") {
      // Hide side bars on mobile
      if (window.matchMedia("(max-width: 638px)").matches) {
        clientUiState = {
          ...clientUiState,
          leftSideBarVisible: false,
          rightSideBarVisible: false,
        };
      }

      const viewportWidth = window.innerWidth;

      const viewportDifferences = Object.entries(viewports)
        .map(([key, value]) => ({
          key,
          diff: Math.abs(viewportWidth - value.width),
        }))
        .sort((a, b) => (a.diff > b.diff ? 1 : -1));

      const closestViewport = viewportDifferences[0].key as any;

      if (iframe.enabled) {
        clientUiState = {
          ...clientUiState,
          viewports: {
            ...initial.viewports,

            current: {
              ...initial.viewports.current,
              height:
                initialUi?.viewports?.current?.height ||
                viewports[closestViewport]?.height ||
                "auto",
              width:
                initialUi?.viewports?.current?.width ||
                viewports[closestViewport]?.width,
            },
          },
        };
      }
    }

    // DEPRECATED
    if (
      Object.keys(initialData?.root || {}).length > 0 &&
      !initialData?.root?.props
    ) {
      console.error(
        "Warning: Defining props on `root` is deprecated. Please use `root.props`, or republish this page to migrate automatically."
      );
    }

    // Deprecated
    const rootProps = initialData?.root?.props || initialData?.root || {};

    const defaultedRootProps = {
      ...config.root?.defaultProps,
      ...rootProps,
    };

    return {
      ...defaultAppState,
      data: {
        ...initialData,
        root: { ...initialData?.root, props: defaultedRootProps },
        content: initialData.content || [],
      },
      ui: {
        ...initial,
        ...clientUiState,
        // Store categories under componentList on state to allow render functions and plugins to modify
        componentList: config.categories
          ? Object.entries(config.categories).reduce(
              (acc, [categoryName, category]) => {
                return {
                  ...acc,
                  [categoryName]: {
                    title: category.title,
                    components: category.components,
                    expanded: category.defaultExpanded,
                    visible: category.visible,
                  },
                };
              },
              {}
            )
          : {},
      },
    } as G["UserAppState"];
  });

  const { appendData = true } = _initialHistory || {};

  const histories = [
    ...(_initialHistory?.histories || []),
    ...(appendData ? [{ state: generatedAppState }] : []),
  ].map((history) => ({
    ...history,
    // Inject default data to enable partial history injections
    state: { ...generatedAppState, ...history.state },
  }));
  const initialHistoryIndex = _initialHistory?.index || histories.length - 1;
  const initialAppState = histories[initialHistoryIndex].state;

  const historyStore = useHistoryStore({
    histories,
    index: initialHistoryIndex,
  });

  const [reducer] = useState(() =>
    createReducer<UserConfig, G["UserData"]>({
      config,
      record: historyStore.record,
      onAction,
    })
  );

  const [appState, dispatch] = useReducer<StateReducer<G["UserData"]>>(
    reducer,
    flushZones<G["UserData"]>(initialAppState) as G["UserAppState"]
  );

  const { data, ui } = appState;

  const history = usePuckHistory({ dispatch, initialAppState, historyStore });

  const [menuOpen, setMenuOpen] = useState(false);

  const { itemSelector, leftSideBarVisible, rightSideBarVisible } = ui;

  const [activeComponent, setActiveComponent] = useState<
    "elements" | "components" | "sections"
  >("elements");
  const [editSection, setActiveEditSection] = useState<
    "global" | "content" | "style"
  >("content");

  const setItemSelector = useCallback(
    (newItemSelector: ItemSelector | null) => {
      if (newItemSelector === itemSelector) return;

      dispatch({
        type: "setUi",
        ui: { itemSelector: newItemSelector },
        recordHistory: true,
      });

      if (newItemSelector) {
        if (editSection !== "content" && editSection !== "style") {
          setActiveEditSection("content");
        }
      } else {
        setActiveEditSection("global");
      }
    },
    [itemSelector, editSection]
  );

  const selectedItem = itemSelector ? getItem(itemSelector, data) : null;

  useEffect(() => {
    if (onChange) onChange(data as G["UserData"]);
  }, [data]);

  const { onDragStartOrUpdate, placeholderStyle } = usePlaceholderStyle();

  const [draggedItem, setDraggedItem] = useState<
    DragStart & Partial<DragUpdate>
  >();

  // DEPRECATED
  const rootProps = data.root.props || data.root;

  const toggleSidebars = useCallback(
    (sidebar: "left" | "right") => {
      const widerViewport = window.matchMedia("(min-width: 638px)").matches;
      const sideBarVisible =
        sidebar === "left" ? leftSideBarVisible : rightSideBarVisible;
      const oppositeSideBar =
        sidebar === "left" ? "rightSideBarVisible" : "leftSideBarVisible";

      dispatch({
        type: "setUi",
        ui: {
          [`${sidebar}SideBarVisible`]: !sideBarVisible,
          ...(!widerViewport ? { [oppositeSideBar]: false } : {}),
        },
      });
    },
    [dispatch, leftSideBarVisible, rightSideBarVisible]
  );

  useEffect(() => {
    if (!window.matchMedia("(min-width: 638px)").matches) {
      dispatch({
        type: "setUi",
        ui: {
          leftSideBarVisible: false,
          rightSideBarVisible: false,
        },
      });
    }

    const handleResize = () => {
      if (!window.matchMedia("(min-width: 638px)").matches) {
        dispatch({
          type: "setUi",
          ui: (ui: UiState) => ({
            ...ui,
            ...(ui.rightSideBarVisible ? { leftSideBarVisible: false } : {}),
          }),
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // DEPRECATED
  const defaultHeaderRender = useMemo((): Overrides["header"] => {
    if (renderHeader) {
      console.warn(
        "`renderHeader` is deprecated. Please use `overrides.header` and the `usePuck` hook instead"
      );

      const RenderHeader = ({ actions, ...props }: any) => {
        const Comp = renderHeader!;

        return (
          <Comp {...props} dispatch={dispatch} state={appState}>
            {actions}
          </Comp>
        );
      };

      return RenderHeader;
    }

    return DefaultOverride;
  }, [renderHeader]);

  // DEPRECATED
  const defaultHeaderActionsRender = useMemo((): Overrides["headerActions"] => {
    if (renderHeaderActions) {
      console.warn(
        "`renderHeaderActions` is deprecated. Please use `overrides.headerActions` and the `usePuck` hook instead."
      );

      const RenderHeader = (props: any) => {
        const Comp = renderHeaderActions!;

        return <Comp {...props} dispatch={dispatch} state={appState}></Comp>;
      };

      return RenderHeader;
    }

    return DefaultOverride;
  }, [renderHeader]);

  // Load all plugins into the overrides
  const loadedOverrides = useLoadedOverrides({
    overrides: overrides,
    plugins: plugins,
  });

  const CustomPuck = useMemo(
    () => loadedOverrides.puck || DefaultOverride,
    [loadedOverrides]
  );

  const CustomHeader = useMemo(
    () => loadedOverrides.header || defaultHeaderRender,
    [loadedOverrides]
  );
  const CustomHeaderActions = useMemo(
    () => loadedOverrides.headerActions || defaultHeaderActionsRender,
    [loadedOverrides]
  );

  const [bgColorInternal, setBgColorInternal] = useState<string>("#fff");
  const [fontInternal, setFontInternal] = useState<string>("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`/api/site/${getSitePath()}/root`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setBgColorInternal(data.bgColor || "#fff");
        setFontInternal(data.font || "");
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async ({
    bgColor,
    font,
  }: {
    bgColor?: any;
    font?: any;
  }) => {
    try {
      const response = await fetch(`/api/site/${getSitePath()}/root`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bgColor,
          font,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setBgColorInternal(data.bgColor || "#fff");
      setFontInternal(data.font || "");
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedComponentConfig =
    selectedItem && config.components[selectedItem.type];
  const selectedComponentLabel = selectedItem
    ? selectedComponentConfig?.["label"] ??
      selectedItem.props?.name ??
      selectedItem.type.toString()
    : "";
  useEffect(() => {
    if (!selectedItem) {
      setActiveEditSection("global");
    }
  }, [selectedItem]);

  const { setUi, zoomConfig, setZoomConfig } = useAppContext
    ? useAppContext()
    : {
        setUi: (newUi: any) => dispatch({ type: "setUi", ui: newUi }),
        zoomConfig: { zoom: 1, autoZoom: 1, rootHeight: 0 },
        setZoomConfig: () => {},
      };

  const [showBrandIdentity, setShowBrandIdentity] = useState(false);
  const { getColor, getFont, currentTheme } = useBrand();

  return (
    <div className={`Puck ${getClassName()}`}>
      <AppProvider
        value={{
          state: appState,
          dispatch,
          config,
          plugins: plugins || [],
          overrides: loadedOverrides,
          history,
          viewports,
          iframe,
          globalPermissions: {
            delete: true,
            drag: true,
            duplicate: true,
            insert: true,
            edit: true,
            ...permissions,
          },
          getPermissions: () => ({}),
          refreshPermissions: () => null,
          // Add these new props:
          bgColorInternal,
          setBgColorInternal,
          fontInternal,
          setFontInternal,
          handleSubmit,
          selectedItem,
          selectedComponentLabel,
          editSection,
          setActiveEditSection,
        }}
      >
        <appContext.Consumer>
          {({ resolveData }) => (
            <DragDropContext
              autoScrollerOptions={{ disabled: false }}
              onDragUpdate={(update) => {
                setDraggedItem({ ...draggedItem, ...update });
                onDragStartOrUpdate(update);
              }}
              onBeforeDragStart={(start) => {
                onDragStartOrUpdate(start);
                setItemSelector(null);
                dispatch({ type: "setUi", ui: { isDragging: true } });
              }}
              onDragEnd={(droppedItem) => {
                if (editSection !== "content" && editSection !== "style") {
                  setActiveEditSection("content");
                }
                setDraggedItem(undefined);
                dispatch({ type: "setUi", ui: { isDragging: false } });

                // User cancel drag
                if (!droppedItem.destination) {
                  return;
                }

                // New component
                if (
                  droppedItem.source.droppableId.startsWith("component-list") &&
                  droppedItem.destination
                ) {
                  const [_, componentType] =
                    droppedItem.draggableId.split("::");

                  insertComponent(
                    componentType || droppedItem.draggableId,
                    droppedItem.destination.droppableId,
                    droppedItem.destination!.index,
                    { config, dispatch, resolveData, state: appState }
                  );

                  return;
                } else {
                  const { source, destination } = droppedItem;

                  if (source.droppableId === destination.droppableId) {
                    dispatch({
                      type: "reorder",
                      sourceIndex: source.index,
                      destinationIndex: destination.index,
                      destinationZone: destination.droppableId,
                    });
                  } else {
                    dispatch({
                      type: "move",
                      sourceZone: source.droppableId,
                      sourceIndex: source.index,
                      destinationIndex: destination.index,
                      destinationZone: destination.droppableId,
                    });
                  }

                  setItemSelector({
                    index: destination.index,
                    zone: destination.droppableId,
                  });
                }
              }
            
            }
            >
              <DropZoneProvider
                value={{
                  data,
                  itemSelector,
                  setItemSelector,
                  config,
                  dispatch,
                  draggedItem,
                  placeholderStyle,
                  mode: "edit",
                  areaId: "root",
                }}
              >
                <CustomPuck>
                  {children || (
                    <div
                      className={getLayoutClassName({
                        leftSideBarVisible,
                        menuOpen,
                        mounted,
                        rightSideBarVisible,
                      })}
                    >
                      <div className={getLayoutClassName("inner")}>
                        <CustomHeader
                          actions={
                            <>
                              <CustomHeaderActions>
                                <Button
                                  onClick={() => {
                                    onPublish &&
                                      onPublish(data as G["UserData"]);
                                  }}
                                  icon={<Globe size="14px" />}
                                >
                                  Publish
                                </Button>
                              </CustomHeaderActions>
                            </>
                          }
                        >
                          <header className={getLayoutClassName("header")}>
                            <div className={getLayoutClassName("headerInner")}>
                              <div
                                className={getLayoutClassName("headerToggle")}
                              >
                                <div
                                  className={getLayoutClassName(
                                    "leftSideBarToggle"
                                  )}
                                >
                                  <div className="relative">
                                    {/* Add Components Button */}
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          toggleSidebars("left");
                                        }}
                                        className={`
                                          flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                                          transition-all duration-200 
                                          ${leftSideBarVisible 
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                          }
                                        `}
                                      >
                                        {leftSideBarVisible ? (
                                          <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Hide Components
                                          </>
                                        ) : (
                                          <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Add Components
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                {/* <div
                                  className={getLayoutClassName(
                                    "rightSideBarToggle"
                                  )}
                                >
                                  <IconButton
                                    onClick={() => {
                                      toggleSidebars("right");
                                    }}
                                    title="Toggle right sidebar"
                                  >
                                    <PanelRight focusable="false" />
                                  </IconButton>
                                </div> */}
                              </div>
                              <div
                                className={getLayoutClassName("headerTitle")}
                              >
                                <Heading rank="2" size="xs">
                                  {headerPath && (
                                    <>
                                      {" "}
                                      <h6 className="text-lg font-semibold">
                                        {headerPath}
                                      </h6>
                                    </>
                                  )}
                                </Heading>
                              </div>
                              <div
                                className={getLayoutClassName("headerTools")}
                              >
                                <div
                                  className={getLayoutClassName("menuButton")}
                                >
                                  <IconButton
                                    onClick={() => {
                                      return setMenuOpen(!menuOpen);
                                    }}
                                    title="Toggle menu bar"
                                  >
                                    {menuOpen ? (
                                      <ChevronUp focusable="false" />
                                    ) : (
                                      <ChevronDown focusable="false" />
                                    )}
                                  </IconButton>
                                </div>
                                {ui.viewports?.controlsVisible &&
                                  iframe.enabled && (
                                    <ViewportControls
                                      autoZoom={zoomConfig.autoZoom}
                                      zoom={zoomConfig.zoom}
                                      viewports={Object.values(viewports)}
                                      currentViewportWidth={
                                        ui.viewports.current.width
                                      }
                                      onViewportChange={(viewport) => {
                                        const uiViewport = {
                                          ...viewport,
                                          height: viewport.height || "auto",
                                          zoom: zoomConfig.zoom,
                                        };

                                        const newUi = {
                                          ...ui,
                                          viewports: {
                                            ...ui.viewports,
                                            current: uiViewport,
                                          },
                                        };

                                        dispatch({
                                          type: "setUi",
                                          ui: newUi,
                                          recordHistory: true,
                                        });
                                      }}
                                      onZoom={(zoom) => {
                                        setZoomConfig({ ...zoomConfig, zoom });
                                      }}
                                    />
                                  )}
                                <MenuBar<G["UserData"]>
                                  appState={appState}
                                  dispatch={dispatch}
                                  onPublish={onPublish}
                                  menuOpen={menuOpen}
                                  renderHeaderActions={() => (
                                    <CustomHeaderActions>
                                      <Button
                                        onClick={() => {
                                          onPublish && onPublish(data);
                                        }}
                                        icon={<Globe size="14px" />}
                                      >
                                        Publish
                                      </Button>
                                    </CustomHeaderActions>
                                  )}
                                  setMenuOpen={setMenuOpen}
                                />
                              </div>
                            </div>
                          </header>
                        </CustomHeader>
                        <div className={getLayoutClassName("leftSideBar")}>
                          <DragTabs
                            activeComponent={activeComponent}
                            setActiveComponent={(value: any) =>
                              setActiveComponent(
                                value as "elements" | "components" | "sections"
                              )
                            }
                          />
                          <SidebarSection title="Components" noBorderTop>
                            <Components type={activeComponent} />
                          </SidebarSection>
                          {/* <SidebarSection title="Outline">
                            <Outline />
                          </SidebarSection> */}
                        </div>
                        <Canvas />
                        <div className={getLayoutClassName("rightSideBar")}>
                          <SidebarSection
                            noPadding
                            noBorderTop
                            showBreadcrumbs
                            title={
                              selectedItem ? selectedComponentLabel : "Page"
                            }
                          >
                            <EditTabs
                              editSection={editSection}
                              hasSelectedItem={selectedItem !== null}
                              setActiveEditSection={(value: any) =>
                                setActiveEditSection(
                                  value as "global" | "content" | "style"
                                )
                              }
                            />
                            {editSection === "global" && (
                              <BrandSidebar open={showBrandIdentity} onClose={() => setShowBrandIdentity(false)} />
                            )}

                            <Fields type={editSection} />
                            {editSection === "global" && (
                              <div className="px-4 py-2">
                                <Outline />
                              </div>
                            )}
                          </SidebarSection>
                        </div>
                      </div>
                    </div>
                  )}
                </CustomPuck>
              </DropZoneProvider>
            </DragDropContext>
          )}
        </appContext.Consumer>
      </AppProvider>
      <div id="puck-portal-root" className={getClassName("portal")} />
    </div>
  );
}

Puck.Components = Components;
Puck.Fields = Fields;
Puck.Outline = Outline;
Puck.Preview = Preview;
