import React, { useEffect } from 'react';
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles.module.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Sidebar = ({ isOpen, onClose, title, children }: SidebarProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className={styles.sidebar}
        >
          <header className={styles.header}>
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>{title}</h2>
            </div>
            <button 
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div className={styles.contentWrapper}>
            <div className={styles.content}>
              {children}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};