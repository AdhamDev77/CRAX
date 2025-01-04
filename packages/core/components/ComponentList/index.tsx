import { useState } from "react";
import { Sidebar } from "../SidebarComponents";
import { Drawer } from "../Drawer";
import getClassNameFactory from "../../lib/get-class-name-factory";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("ComponentList", styles);

export const ComponentList = ({
  children,
  title,
  id,
}: {
  id: string;
  children?: any;
  title?: string;
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className={getClassName()}>
        {title && (
          <button
            type="button"
            className={getClassName("title")}
            onClick={() => setSidebarOpen(true)}
          >
            <div>{title}</div>
          </button>
        )}
      </div>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={title || "Details"}
      >
        <Drawer droppableId={title}>{children}</Drawer>
      </Sidebar>
    </>
  );
};

ComponentList.Item = Drawer.Item;
