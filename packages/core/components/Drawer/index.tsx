import React, { useContext, useMemo, useState } from "react";
import Image from "next/image";
import { Maximize2, Shapes, X } from "lucide-react";
import { DragIcon } from "../DragIcon";
import { Draggable } from "../Draggable";
import { Droppable } from "../Droppable";

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

const ImagePreview = ({ src, onClose }: { src: string; onClose: () => void }) => (
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
  index,
  isDragDisabled,
}: {
  name: string;
  children?: (props: { children: React.ReactNode; name: string }) => React.ReactElement;
  id?: string;
  label?: any;
  html?: any;
  image?: string;
  icon?: React.ReactNode;
  index: number;
  isDragDisabled?: boolean;
}) => {
  const ctx = useContext(drawerContext);
  const [showPreview, setShowPreview] = useState(false);
  const resolvedId = `${ctx.droppableId}::${id || name}`;

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

  return (
    <>
      <DrawerDraggable id={resolvedId} index={index} isDragDisabled={isDragDisabled}>
        <CustomInner name={name}>
          <div
            className={`relative group bg-white dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 ${
              !image ? "border border-gray-200 dark:border-gray-700" : ""
            }`}
          >
            <div style={{ padding: image ? "0px" : "8px" }}>
              {image ? (
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
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2">
                  {icon && <div className="text-blue-600">{icon}</div>}
                  <div className="flex-1 truncate text-sm font-medium">
                    {label || name}
                  </div>
                  <DragIcon isDragDisabled={isDragDisabled} />
                </div>
              )}
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