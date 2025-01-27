import { Loader } from "../../../Loader";
import { rootDroppableId } from "../../../../lib/root-droppable-id";
import {
  ReplaceAction,
  SetAction,
  replaceAction,
  setAction,
} from "../../../../reducer";
import { ComponentData, RootData, UiState } from "../../../../types";
import type { Field, Fields as FieldsType } from "../../../../types";
import { AutoFieldPrivate } from "../../../AutoField";
import { useAppContext } from "../../context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../../components/ui/accordion";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../../lib";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ItemSelector } from "../../../../lib/get-item";
import { getChanged } from "../../../../lib/get-changed";
import { Collapse } from "antd";
import {
  LayoutGrid,
  Move,
  Type,
  PaintBucket,
  Box,
  MousePointerClick,
  Settings,
} from "lucide-react";

const { Panel } = Collapse;

const getClassName = getClassNameFactory("PuckFields", styles);

const defaultPageFields: Record<string, Field> = {
  title: { type: "text", section: "global" },
};

const DefaultFields = ({
  children,
}: {
  children: ReactNode;
  isLoading: boolean;
  itemSelector?: ItemSelector | null;
}) => {
  return <>{children}</>;
};

type ComponentOrRootData = Omit<ComponentData<any>, "type">;

const useResolvedFields = (): [FieldsType, boolean] => {
  const { selectedItem, state, config } = useAppContext();

  const { data } = state;

  const rootFields = config.root?.fields || defaultPageFields;

  const componentConfig = selectedItem
    ? config.components[selectedItem.type]
    : null;

  const defaultFields = selectedItem
    ? (componentConfig?.fields as Record<string, Field<any>>)
    : rootFields;

  // DEPRECATED
  const rootProps = data.root.props || data.root;

  const [lastSelectedData, setLastSelectedData] = useState<
    Partial<ComponentOrRootData>
  >({});
  const [resolvedFields, setResolvedFields] = useState(defaultFields || {});
  const [fieldsLoading, setFieldsLoading] = useState(false);

  const defaultResolveFields = (
    _componentData: ComponentOrRootData,
    _params: {
      fields: FieldsType;
      lastData: Partial<ComponentOrRootData> | null;
      lastFields: FieldsType;
      changed: Record<string, boolean>;
    }
  ) => defaultFields;

  const componentData: ComponentOrRootData = selectedItem
    ? selectedItem
    : { props: rootProps, readOnly: data.root.readOnly };

  const hasComponentResolver = selectedItem && componentConfig?.resolveFields;
  const hasRootResolver = !selectedItem && config.root?.resolveFields;
  const hasResolver = hasComponentResolver || hasRootResolver;

  const resolveFields = useCallback(
    async (fields: FieldsType = {}) => {
      const lastData =
        lastSelectedData.props?.id === componentData.props.id
          ? lastSelectedData
          : null;

      const changed = getChanged(componentData, lastData);

      setLastSelectedData(componentData);

      if (hasComponentResolver) {
        return await componentConfig!.resolveFields!(
          componentData as ComponentData,
          {
            changed,
            fields,
            lastFields: resolvedFields,
            lastData: lastData as ComponentData,
            appState: state,
          }
        );
      }

      if (hasRootResolver) {
        return await config.root!.resolveFields!(componentData, {
          changed,
          fields,
          lastFields: resolvedFields,
          lastData: lastData as RootData,
          appState: state,
        });
      }

      return defaultResolveFields(componentData, {
        changed,
        fields,
        lastFields: resolvedFields,
        lastData,
      });
    },
    [data, config, componentData, selectedItem, resolvedFields, state]
  );

  useEffect(() => {
    if (hasResolver) {
      setFieldsLoading(true);

      resolveFields(defaultFields).then((fields) => {
        setResolvedFields(fields || {});

        setFieldsLoading(false);
      });
    } else {
      setResolvedFields(defaultFields);
    }
  }, [data, defaultFields, state.ui.itemSelector, hasResolver]);

  return [resolvedFields, fieldsLoading];
};

export const Fields = ({ type }: { type: string }) => {
  const {
    selectedItem,
    state,
    dispatch,
    config,
    resolveData,
    componentState,
    overrides,
  } = useAppContext();
  const { data, ui } = state;
  const { itemSelector } = ui;

  const [fields, fieldsResolving] = useResolvedFields();

  const { getPermissions } = useAppContext();

  const componentResolving = selectedItem
    ? componentState[selectedItem?.props.id]?.loadingCount > 0
    : componentState["puck-root"]?.loadingCount > 0;

  const isLoading = fieldsResolving || componentResolving;

  const rootProps = data.root.props || data.root;

  const Wrapper = useMemo(() => overrides.fields || DefaultFields, [overrides]);

  const filteredFields = useMemo(() => {
    const contentFields: Record<string, Field> = {};
    const styleFields: Record<string, Field> = {};
    const globalFields: Record<string, Field> = {};

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];

      if (!field?.type) return;

      if (field.section === "global") {
        globalFields[fieldName] = field;
      } else if (field.section === "content") {
        contentFields[fieldName] = field;
      } else {
        styleFields[fieldName] = field;
      }
    });

    return { contentFields, styleFields, globalFields };
  }, [fields]);

  const getFieldsToRender = () => {
    switch (type) {
      case "content":
        return filteredFields.contentFields;
      case "style":
        return filteredFields.styleFields;
      case "global":
        return { ...defaultPageFields, ...filteredFields.globalFields };
      default:
        return {};
    }
  };

  const fieldsToRender = getFieldsToRender();

  const renderField = (field: Field, fieldName: string) => {
    const onChange = (value: any, updatedUi?: Partial<UiState>) => {
      // For global fields, always update rootProps
      if (type === "global") {
        if (data.root.props) {
          if (config.root?.resolveData) {
            resolveData({
              ui: { ...ui, ...updatedUi },
              data: {
                ...data,
                root: {
                  ...data.root,
                  props: {
                    ...data.root.props,
                    [fieldName]: value,
                  },
                },
              },
            });
          } else {
            dispatch({
              type: "set",
              state: {
                ui: { ...ui, ...updatedUi },
                data: {
                  ...data,
                  root: {
                    ...data.root,
                    props: {
                      ...data.root.props,
                      [fieldName]: value,
                    },
                  },
                },
              },
              recordHistory: true,
            });
          }
        } else {
          // DEPRECATED
          dispatch({
            type: "setData",
            data: {
              root: {
                ...rootProps,
                [fieldName]: value,
              },
            },
          });
        }
        return;
      }

      // For non-global fields, keep existing logic
      let currentProps;
      if (selectedItem) {
        currentProps = selectedItem.props;
      } else {
        currentProps = rootProps;
      }

      const newProps = {
        ...currentProps,
        [fieldName]: value,
      };

      if (itemSelector) {
        const replaceActionData: ReplaceAction = {
          type: "replace",
          destinationIndex: itemSelector.index,
          destinationZone: itemSelector.zone || rootDroppableId,
          data: { ...selectedItem, props: newProps },
        };

        const replacedData = replaceAction(data, replaceActionData);

        const setActionData: SetAction = {
          type: "set",
          state: {
            data: { ...data, ...replacedData },
            ui: { ...ui, ...updatedUi },
          },
        };

        if (config.components[selectedItem!.type]?.resolveData) {
          resolveData(setAction(state, setActionData));
        } else {
          dispatch({
            ...setActionData,
            recordHistory: true,
          });
        }
      } else {
        if (data.root.props) {
          if (config.root?.resolveData) {
            resolveData({
              ui: { ...ui, ...updatedUi },
              data: {
                ...data,
                root: { props: newProps },
              },
            });
          } else {
            dispatch({
              type: "set",
              state: {
                ui: { ...ui, ...updatedUi },
                data: {
                  ...data,
                  root: { props: newProps },
                },
              },
              recordHistory: true,
            });
          }
        } else {
          // DEPRECATED
          dispatch({
            type: "setData",
            data: { root: newProps },
          });
        }
      }
    };

    const getFieldComponent = () => {
      if (type === "global") {
        const readOnly = (data.root.readOnly || {}) as Record<string, boolean>;
        const { edit } = getPermissions({
          root: true,
        });

        return (
          <AutoFieldPrivate
            key={`global_${fieldName}`}
            field={field}
            name={fieldName}
            id={`global_${fieldName}`}
            readOnly={!edit || readOnly[fieldName]}
            value={(rootProps as Record<string, any>)[fieldName]}
            onChange={onChange}
          />
        );
      }

      if (selectedItem && itemSelector) {
        const { readOnly = {} } = selectedItem;
        const { edit } = getPermissions({
          item: selectedItem,
        });

        return (
          <AutoFieldPrivate
            key={`${selectedItem.props.id}_${fieldName}`}
            field={field}
            name={fieldName}
            id={`${selectedItem.props.id}_${fieldName}`}
            readOnly={!edit || readOnly[fieldName]}
            value={selectedItem.props[fieldName]}
            onChange={onChange}
          />
        );
      } else {
        const readOnly = (data.root.readOnly || {}) as Record<string, boolean>;
        const { edit } = getPermissions({
          root: true,
        });

        return (
          <AutoFieldPrivate
            key={`page_${fieldName}`}
            field={field}
            name={fieldName}
            id={`root_${fieldName}`}
            readOnly={!edit || readOnly[fieldName]}
            value={(rootProps as Record<string, any>)[fieldName]}
            onChange={onChange}
          />
        );
      }
    };

    return getFieldComponent();
  };

  // Group fields by styleType
  const groupedFields = useMemo(() => {
    const groups: Record<
      string,
      { fields: Record<string, Field>; defaultOpen: boolean }
    > = {};

    Object.keys(fieldsToRender).forEach((fieldName) => {
      const field = fieldsToRender[fieldName];
      const styleType = field.styleType || "other";

      if (!groups[styleType]) {
        groups[styleType] = {
          fields: {},
          defaultOpen: field.styleTypeToggle === true,
        };
      }

      groups[styleType].fields[fieldName] = field;
    });

    return groups;
  }, [fieldsToRender]);

  // Determine initial open keys based on styleTypeToggle
  const initialOpenKeys = useMemo(
    () =>
      Object.keys(groupedFields).filter(
        (styleType) => groupedFields[styleType].defaultOpen
      ),
    [groupedFields]
  );

  // Map styleType to icons
  const styleTypeIcons = {
    "Layout & Positioning": <Move className="w-4 h-4 text-blue-950" />,
    "Sizing & Spacing": <LayoutGrid className="w-4 h-4 text-blue-950" />,
    "Typography": <Type className="w-4 h-4 text-blue-950" />,
    "Background & Borders": <PaintBucket className="w-4 h-4 text-blue-950" />,
    "Effects & Shadows": <Box className="w-4 h-4 text-blue-950" />,
    "Interactions": <MousePointerClick className="w-4 h-4 text-blue-950" />,
    "Advanced Styling": <Settings className="w-4 h-4 text-blue-950" />,
  };

  return (
    <form
      className={getClassName()}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Wrapper isLoading={isLoading} itemSelector={itemSelector}>
        {type === "style" ? (
          <Accordion
            type="multiple"
            defaultValue={initialOpenKeys}
            className="w-full"
          >
            {Object.keys(groupedFields).map((styleType) => (
              <AccordionItem key={styleType} value={styleType} className="">
                <AccordionTrigger className="hover:no-underline bg-stone-100 hover:bg-accent/50 px-4 py-2 transition-colors flex items-center">
                  <div className="flex gap-2">
                    {styleTypeIcons[styleType]}
                    <span className="text-blue-950">{styleType}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 space-y-2">
                  {Object.keys(groupedFields[styleType].fields).map(
                    (fieldName) =>
                      renderField(
                        groupedFields[styleType].fields[fieldName],
                        fieldName
                      )
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          // For content and global, render fields directly without collapse
          Object.keys(fieldsToRender).map((fieldName) =>
            renderField(fieldsToRender[fieldName], fieldName)
          )
        )}
      </Wrapper>
      {isLoading && (
        <div className={getClassName("loadingOverlay")}>
          <div className={getClassName("loadingOverlayInner")}>
            <Loader size={16} />
          </div>
        </div>
      )}
    </form>
  );
};
