import React, { useContext, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { Maximize2, Shapes, X } from "lucide-react";
import { DragIcon } from "../DragIcon";
import { Draggable } from "../Draggable";
import { Droppable } from "../Droppable";
import {
  useBrand
} from "../../../core/components/Puck/components/BrandSidebar";
// import { useBrandIdentity } from "@/components/BrandIdentityPanel"; // Removed because module does not exist

const drawerContext = React.createContext<{ droppableId: string }>({
  droppableId: "",
});

const DrawerDraggable = ({
  children,
  id,
  index,
  isDragDisabled,
}: {
  children: React.ReactNode;
  id: string;
  index: number;
  isDragDisabled?: boolean;
}) => (
  <Draggable
    key={id}
    id={id}
    index={index}
    isDragDisabled={isDragDisabled}
    showShadow
    disableAnimations
    className={() =>
      `transform transition-transform duration-200 hover:scale-102 ${
        isDragDisabled ? "opacity-50 cursor-not-allowed" : "cursor-grab"
      }`
    }
  >
    {() => children}
  </Draggable>
);

const ImagePreview = ({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="relative max-w-4xl w-full mx-4 max-h-[85vh] overflow-auto">
      <Image
        src={src}
        alt="Preview"
        fill
        className="object-contain rounded-[10px] shadow-2xl"
      />
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
      >
        <X size={24} />
      </button>
    </div>
  </div>
);

const DrawerItem = ({
  name,
  children,
  id,
  label,
  image,
  icon,
  html,
  primary,
  index,
  isDragDisabled,
  preview,
}: {
  name: string;
  children?: (props: {
    children: React.ReactNode;
    name: string;
  }) => React.ReactElement;
  id?: string;
  label?: any;
  html?: any;
  primary?: boolean;
  image?: string;
  icon?: React.ReactNode;
  index: number;
  isDragDisabled?: boolean;
  preview?: React.ReactNode | ((props: any) => React.ReactNode);
}) => {
  const ctx = useContext(drawerContext);
  const [showPreview, setShowPreview] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [previewRef, setPreviewRef] = useState<HTMLDivElement | null>(null);
  const [calculatedHeight, setCalculatedHeight] = useState<number | null>(null);
  const [calculatedScale, setCalculatedScale] = useState<number | null>(null);
  const resolvedId = `${ctx.droppableId}::${id || name}`;

  // Get brand identity (colors, etc.) from context if available
  const brand = {};

  const CustomInner = useMemo(
    () =>
      children ||
      (({ children }: { children: React.ReactNode }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg transition-shadow duration-200">
          {children}
        </div>
      )),
    [children]
  );

  // Calculate scale based on container width (assuming components are designed for ~1200px width)
  const componentDesignWidth = 1200;

  // Effect to calculate and store both scale and height when refs are available
  useEffect(() => {
    if (
      previewRef &&
      containerRef &&
      previewRef.scrollHeight > 0 &&
      containerRef.offsetWidth > 0
    ) {
      const containerWidth = containerRef.offsetWidth;
      const scale = containerWidth / componentDesignWidth;
      const previewHeight = previewRef.scrollHeight;
      const scaledHeight = previewHeight * scale;

      setCalculatedScale(scale);
      setCalculatedHeight(scaledHeight);
    }
  }, [previewRef, containerRef, componentDesignWidth]);

  // Use stored values or fallback
  const finalScale = calculatedScale || 300 / componentDesignWidth; // fallback scale
  const finalHeight = calculatedHeight || "auto";
  const { getColor, getFont } = useBrand();
  const processHtml = (htmlString: string, primary: boolean) => {
    if (!htmlString) return htmlString;
    
    let processedHtml = htmlString;

  console.log(`primary: ${primary}`)
    // Replace brandColor with actual color value
    try {
      if (typeof getColor === 'function') {
        const color = primary ? getColor("primary") : getColor("secondary");
        if (color) {
          processedHtml = processedHtml.replace(/brandColor/g, color);
          console.log("After brandColor replacement:", processedHtml);
        }
      } else {
        console.log("getColor is not a function:", typeof getColor);
      }
    } catch (error) {
      console.error(`Error getting color:`, error);
    }
  
    // Replace brandFont with actual font value
    try {
      if (typeof getFont === 'function') {
        const font = primary ? getFont("heading") : getFont("body");
        if (font) {
          processedHtml = processedHtml.replace(/brandFont/g, font);
          console.log("After brandFont replacement:", processedHtml);
        }
      } else {
        console.log("getFont is not a function:", typeof getFont);
      }
    } catch (error) {
      console.error(`Error getting font:`, error);
    }
  
    console.log("Final processed HTML:", processedHtml);
    return processedHtml;
  };
  return (
    <>
      <DrawerDraggable
        id={resolvedId}
        index={index}
        isDragDisabled={isDragDisabled}
      >
        <CustomInner name={name}>
          <div
            className={`relative group bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 ${
              !image && !preview && !html
                ? "border border-gray-200 dark:border-gray-700"
                : ""
            }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div style={{ padding: image || preview ? "0px" : "8px" }}>
              {/* --- MAIN PREVIEW CONTENT --- */}
              <>
                {/* Icon displayed first */}
                {icon && (
                  <div className="flex items-center mb-2 text-black gap-2">
                    {icon}
                    <span>{label || name}</span>
                  </div>
                )}

                {preview && !icon ? (
                  <div className="w-full">
                    <div
                      ref={setContainerRef}
                      className="overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900 relative"
                      style={{ width: "100%", height: finalHeight }}
                    >
                      <div
                        ref={setPreviewRef}
                        style={{
                          transform: `scale(${finalScale})`,
                          transformOrigin: "top left",
                          width: componentDesignWidth,
                          height: "fit-content",
                        }}
                      >
                        {typeof preview === "function"
                          ? preview({ ...brand, isPreview: true })
                          : preview}
                      </div>
                    </div>
                  </div>
                ) : image ? (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={image}
                      alt={label || name}
                      fill
                      className="object-cover rounded-t-lg"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <button
                      onClick={() => setShowPreview(true)}
                      className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-gray-700/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                ) : html ? (
                  <div className="p-2 prose dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: processHtml(html, primary || true) }} />
                  </div>
                ) : (
                  <>
                    {!icon && (
                      <div className="flex items-center gap-2 p-2">
                        <div className="flex-1 truncate text-sm font-medium">
                          {label || name}
                        </div>
                        <DragIcon isDragDisabled={isDragDisabled} />
                      </div>
                    )}
                  </>
                )}
              </>
            </div>
          </div>
        </CustomInner>
      </DrawerDraggable>
      {showPreview && (
        <ImagePreview
          src={image || "https://placehold.co/600x400"}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

// Main Drawer Export
export const Drawer = ({
  children,
  droppableId: _droppableId = "default",
  direction = "vertical",
}: {
  children: React.ReactNode;
  droppableId?: string;
  direction?: "vertical" | "horizontal";
}) => {
  const droppableId = `component-list:${_droppableId}`;

  return (
    <drawerContext.Provider value={{ droppableId }}>
      <Droppable droppableId={droppableId} isDropDisabled direction={direction}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid ${
              direction === "horizontal" ? "grid-flow-col" : "grid-cols-1"
            } gap-2 p-2`}
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </drawerContext.Provider>
  );
};

Drawer.Item = DrawerItem;
