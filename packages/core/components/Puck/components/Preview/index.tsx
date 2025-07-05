import { DropZone } from "../../../DropZone";
import { rootDroppableId } from "../../../../lib/root-droppable-id";
import { useCallback, useMemo, useState } from "react";
import { useAppContext } from "../../context";
import AutoFrame, { autoFrameContext } from "../../../AutoFrame";
import styles from "./styles.module.css";
import { getClassNameFactory } from "../../../../lib";
import axios from "axios";
import { useBrand } from '../BrandSidebar';
import { ComponentPreview, applyThemeToData } from '../ComponentPreview';
import { SectionsPreviewModal } from '../SectionsSidebar'; // Import the new modal

const getClassName = getClassNameFactory("PuckPreview", styles);

interface Section {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  content: any;
  zones?: any;
  thumbnail?: string;
}

export const Preview = ({ id = "puck-preview" }: { id?: string }) => {
  const { config, dispatch, state, setStatus, iframe, overrides } = useAppContext();
  const { getColor, getFont } = useBrand();

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddSectionClick = async () => {
    setIsModalOpen(true);
    setLoading(true);
    try {
      const { data } = await axios.get("/api/component");
      // Transform the data to match our Section interface
      const transformedSections: Section[] = data.map((comp: any, index: number) => ({
        id: comp.id || `section-${index}`,
        name: comp.name || 'Untitled Section',
        description: comp.description || 'No description available',
        category: comp.category || 'Other',
        subCategory: comp.subCategory,
        content: comp.content,
        zones: comp.zones,
        thumbnail: comp.thumbnail
      }));
      setSections(transformedSections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionSelect = (section: Section) => {
    // Apply theme to the section before dispatching
    const themedSection = {
      ...section,
      content: applyThemeToData(section.content, getColor, getFont),
      zones: section.zones ? applyThemeToData(section.zones, getColor, getFont) : section.zones
    };

    dispatch({
      type: "loadLayout",
      data: {
        content: [
          ...(state.data.content || []),
          themedSection.content,
        ],
        zones: {
          ...state.data.zones,
          ...themedSection.zones,
        },
      },
    });

    setIsModalOpen(false);
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

            {/* Enhanced Add Section Button */}
            <div className="w-full group/add-section">
              <div className="border-t border-b border-gray-300/60 py-8 px-4 hover:bg-gray-50/30 transition-colors duration-200">
                <button
                  onClick={handleAddSectionClick}
                  className="w-full max-w-[300px] mx-auto px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl flex flex-col items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
                >
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
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
                  <span className="text-lg font-semibold">Add Section</span>
                  <span className="text-sm text-white/80">
                    Browse our section library
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

      {/* New Sections Preview Modal */}
      <SectionsPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sections={sections}
        onSectionSelect={handleSectionSelect}
        loading={loading}
      />
    </div>
  );
};