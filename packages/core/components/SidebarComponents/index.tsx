import { X } from "lucide-react";
import styles from "./styles.module.css";

export const Sidebar = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: any;
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span className="uppercase font-semibold">{title}</span>
        <button onClick={onClose}><X className="w-5 h-5" /></button>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
