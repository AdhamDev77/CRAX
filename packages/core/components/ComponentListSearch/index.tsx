import React, { ReactNode, useState } from "react";
import { Drawer } from "../Drawer"; // Ensure this import points to your Drawer component
import { ChevronDown, ChevronRight } from "lucide-react";

interface ComponentListProps {
  id: string; // Unique identifier for the drawer
  title?: string; // Optional title for the drawer group
  children?: ReactNode; // Children to render inside the drawer
}

export const ComponentListSearch = ({ id, title, children }: ComponentListProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full">
      {/* Accordion toggle button */}
      {title && (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 rounded hover:bg-muted transition px-2 py-1"
        >
          <span className="text-sm">{title}</span>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      )}

      {/* Accordion content with smooth expand/collapse */}
      <div
        className={`transition-all overflow-hidden duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] mt-2" : "max-h-0"
        }`}
      >
        <div className="pl-3">
          <Drawer droppableId={id}>
            {children || <div className="p-4 text-center text-gray-500">No components available</div>}
          </Drawer>
        </div>
      </div>
    </div>
  );
};

// Assign the Drawer.Item to ComponentListSearch.Item for convenience
ComponentListSearch.Item = Drawer.Item;

export default ComponentListSearch;
