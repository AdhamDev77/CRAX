import React, { ReactNode } from "react";
import { Drawer } from "../Drawer"; // Ensure this import points to your Drawer component

interface ComponentListProps {
  id: string; // Unique identifier for the drawer
  title?: string; // Optional title for the drawer group
  children?: ReactNode; // Children to render inside the drawer
}

export const ComponentListSearch = ({ id, title, children }: ComponentListProps) => {
  return (
    <div className="flex flex-col py-3">
      {/* Render the title tag if a title is provided */}
      {title && <div className="text-sm font-medium mb-2">{title}</div>}
      {/* Render the Drawer with children */}
      <Drawer droppableId={id}>
        {children || <div className="p-4 text-center text-gray-500">No components available</div>}
      </Drawer>
    </div>
  );
};

// Assign the Drawer.Item to ComponentList.Item for convenience
ComponentListSearch.Item = Drawer.Item;

export default ComponentListSearch;