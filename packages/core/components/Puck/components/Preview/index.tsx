import { DropZone } from "../../../DropZone";
import { rootDroppableId } from "../../../../lib/root-droppable-id";
import { useCallback, useMemo, useState } from "react";
import { useAppContext } from "../../context";
import AutoFrame, { autoFrameContext } from "../../../AutoFrame";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../../lib";
import { insertComponent } from "../../../../lib/insert-component";
import axios from "axios";

const getClassName = getClassNameFactory("PuckPreview", styles);

export const Preview = ({ id = "puck-preview" }: { id?: string }) => {
  const { config, dispatch, state, setStatus, iframe, overrides, resolveData } =
    useAppContext();

  const Page = useCallback<React.FC<any>>(
    (pageProps) =>
      config.root?.render ? (
        config.root?.render({ id: "puck-root", ...pageProps })
      ) : (
        <>{pageProps.children}</>
      ),
    [config.root]
  );

  const Frame = useMemo(() => overrides.iframe, [overrides]);
  const rootProps = state.data.root.props || state.data.root;

  // Modal & Data states
  const [open, setOpen] = useState(false);
  const [components, setComponents] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const handleAddSectionClick = async () => {
    setOpen(true); // show popup
    setLoading(true); // show loader
    try {
      const { data } = await axios.get("/api/component"); // Fetch available components
      setComponents(data); // Save to state
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={getClassName()}
      id={id}
      onClick={() =>
        dispatch({ type: "setUi", ui: { ...state.ui, itemSelector: null } })
      }
    >
      {iframe.enabled ? (
        <>
          <AutoFrame
            id="preview-frame"
            className={getClassName("frame")}
            data-rfd-iframe
            onStylesLoaded={() => setStatus("READY")}
          >
            <autoFrameContext.Consumer>
              {({ document }) => {
                const inner = (
                  <Page
                    {...rootProps}
                    puck={{ renderDropZone: DropZone, isEditing: true }}
                    editMode={true}
                  >
                    <DropZone zone={rootDroppableId} />
                  </Page>
                );

                return Frame ? (
                  <Frame document={document}>{inner}</Frame>
                ) : (
                  inner
                );
              }}
            </autoFrameContext.Consumer>

            {/* Add Section Button */}
            <div className="w-full group/add-section">
              <div className="border-t border-b border-gray-300/60 py-8 px-4 hover:bg-gray-50/30 transition-colors duration-200">
                <button
                  onClick={handleAddSectionClick}
                  className="w-full max-w-[300px] mx-auto px-4 py-3 bg-white text-gray-800 font-medium rounded-lg flex flex-col items-center justify-center gap-1 border border-gray-300/80 hover:border-indigo-400 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <div className="p-2 text-indigo-600 group-hover/add-section:text-indigo-700 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-lg font-normal">Add Section</span>
                  <span className="text-xs text-gray-500 font-normal mt-1">
                    Click to insert
                  </span>
                </button>
              </div>
            </div>
          </AutoFrame>
        </>
      ) : (
        <div id="preview-frame" className={getClassName("frame")}>
          <Page
            {...rootProps}
            puck={{ renderDropZone: DropZone, isEditing: true }}
            editMode={true}
          >
            <DropZone zone={rootDroppableId} />
          </Page>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full h-full overflow-auto relative shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl mb-4 font-semibold">Choose a Section</h2>

            {loading ? (
              <div>Loading components…</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {components.map((comp, i) => (
                  <div
                    key={i}
                    className="border p-2 rounded-lg hover:shadow cursor-pointer"
                    onClick={() => {
                      dispatch({
                        type: "loadLayout",
                        data: {
                          content: [
                            ...(state.data.content || []),
                            comp.content,
                          ],
                          zones: {
                            ...state.data.zones,
                            ...comp.zones,
                          },
                        },
                      });

                      setOpen(false);
                    }}
                  >
                    <img
                      src={comp.Image}
                      alt={comp.name}
                      className="w-full object-cover mb-2 rounded"
                    />
                    <h3 className="font-medium text-gray-800">{comp.name}</h3>
                    <p className="text-sm text-gray-500">{comp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
