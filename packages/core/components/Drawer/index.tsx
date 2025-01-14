import React, { useContext, useMemo, useState } from "react";
import Image from "next/image";
import { Maximize2, Shapes, X } from "lucide-react";
import { DragIcon } from "../DragIcon";
import { Draggable } from "../Draggable";
import { Droppable } from "../Droppable";

// Context for managing drawer state
const drawerContext = React.createContext<{ droppableId: string }>({
  droppableId: "",
});

// Draggable component for drawer items
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
}) => {
  return (
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
};

// Image preview component
const ImagePreview = ({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="relative max-w-4xl w-full mx-4 max-h-[85vh] overflow-auto">
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt="Preview"
          width={1200}
          height={800}
          className="w-full h-auto rounded-[10px] shadow-2xl max-h-[85vh] object-contain"
          placeholder="blur"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:text-gray-300 transition-colors duration-200 z-50"
          aria-label="Close preview"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  </div>
);

// Drawer item component
const DrawerItem = ({
  name,
  children,
  id,
  label,
  image,
  icon,
  index,
  isDragDisabled,
}: {
  name: string;
  children?: (props: { children: React.ReactNode; name: string }) => React.ReactElement;
  id?: string;
  label?: any;
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
      (({ children }: { children: React.ReactNode; name: string }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )),
    [children]
  );

  return (
    <>
      <DrawerDraggable
        id={resolvedId}
        index={index}
        isDragDisabled={isDragDisabled}
      >
        <CustomInner name={name}>
          <div className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1">
            <div style={{ padding: image ? "6px" : "8px" }}>
              {image && (
                <div className="relative aspect-video w-full">
                  <Image
                    src={image}
                    alt={label || name}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3}
                    placeholder="blur"
                  />
                  <button
                    onClick={() => setShowPreview(true)}
                    className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    aria-label="Preview image"
                  >
                    <Maximize2 size={16} className="text-gray-800 dark:text-gray-200" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2" style={{ marginTop: image ? "4px" : "" }}>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {icon && (
                      <div className="text-blue-600 dark:text-blue-700">
                        {icon || <Shapes className="w-4 h-4" />}
                      </div>
                    )}
                    <div className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate flex-1 min-w-0">
                      {label ?? name}
                    </div>
                  </div>
                  <div className="cursor-grab active:cursor-grabbing">
                    <DragIcon isDragDisabled={isDragDisabled} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CustomInner>
      </DrawerDraggable>
      {showPreview && (
        <ImagePreview
          src={
            image ||
            "https://static.vecteezy.com/system/resources/previews/010/434/242/non_2x/accept-and-decline-buttons-app-icons-set-ui-ux-user-interface-yes-or-no-click-approve-and-delete-hand-pushing-button-web-or-mobile-applications-isolated-illustrations-vector.jpg"
          }
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

// Main Drawer component
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
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`grid ${
              direction === "horizontal"
                ? "grid-flow-col auto-cols-max"
                : "grid-cols-1"
            } gap-2 ${
              snapshot.draggingFromThisWith ? "bg-gray-50 dark:bg-gray-900" : ""
            }`}
          >
            {children}
            <span style={{ display: "none" }}>{provided.placeholder}</span>
          </div>
        )}
      </Droppable>
    </drawerContext.Provider>
  );
};

Drawer.Item = DrawerItem;

export default Drawer;