// Complete replacement for the positioning logic in ComponentPopup.tsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Settings, Copy, Save, Trash2 } from "lucide-react";
import { SidebarSection } from "../SidebarSection";
import EditTabs from "../EditTabs";
import { Fields } from "../Puck/components/Fields";
import { Outline } from "../Puck/components/Outline";
import ColorPicker from "../../../../components/ColorPicker";
import FontSelector from "../../../../components/FontSelector";
import { useLayoutEffect } from "react";

interface ComponentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  componentElement: HTMLElement | null;
  selectedItem: any;
  selectedComponentLabel: string;
  editSection: "global" | "content" | "style";
  setActiveEditSection: (section: "global" | "content" | "style") => void;
  onSave?: (e: React.SyntheticEvent) => void;
  onDuplicate?: (e: React.SyntheticEvent) => void;
  onDelete?: (e: React.SyntheticEvent) => void;
  permissions: {
    save: boolean;
    duplicate: boolean;
    delete: boolean;
  };
  bgColorInternal?: string;
  setBgColorInternal?: (color: string) => void;
  fontInternal?: string;
  setFontInternal?: (font: string) => void;
  handleSubmit?: (data: { bgColor?: string; font?: string }) => Promise<void>;
}

export const ComponentPopup: React.FC<ComponentPopupProps> = ({
  isOpen,
  onClose,
  componentElement,
  selectedItem,
  selectedComponentLabel,
  editSection,
  setActiveEditSection,
  onSave,
  onDuplicate,
  onDelete,
  permissions,
  bgColorInternal,
  setBgColorInternal,
  fontInternal,
  setFontInternal,
  handleSubmit,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation control
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // BULLETPROOF POSITIONING METHOD
  const calculatePosition = useCallback(() => {
    if (!componentElement || !popupRef.current) return;

    const popup = popupRef.current;
    const component = componentElement.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // First, make popup visible but off-screen to measure it
    popup.style.visibility = "hidden";
    popup.style.display = "block";
    popup.style.position = "fixed";
    popup.style.left = "-9999px";
    popup.style.top = "-9999px";

    // Force a reflow to get accurate measurements
    popup.offsetHeight;

    const popupRect = popup.getBoundingClientRect();
    const popupWidth = popupRect.width;
    const popupHeight = popupRect.height;

    let x = 0;
    let y = 0;

    // Strategy 1: Try right side
    const rightX = component.right + 16;
    if (rightX + popupWidth <= viewport.width - 16) {
      x = rightX;
    }
    // Strategy 2: Try left side
    else {
      const leftX = component.left - popupWidth - 16;
      if (leftX >= 16) {
        x = leftX;
      }
      // Strategy 3: Center horizontally if neither side works
      else {
        x = Math.max(16, (viewport.width - popupWidth) / 2);
      }
    }

    // Vertical positioning
    // Try to align with component top
    y = component.top;

    // Adjust if popup would go below viewport
    if (y + popupHeight > viewport.height - 16) {
      y = Math.max(16, viewport.height - popupHeight - 16);
    }

    // Adjust if popup would go above viewport
    if (y < 16) {
      y = 16;
    }

    // Apply the calculated position
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.visibility = "visible";
    popup.style.display = "flex";

    // Update state for future reference
    setPosition({ x, y });
  }, [componentElement]);

  // Position calculation with proper timing
useLayoutEffect(() => {
  if (isOpen && componentElement && mounted) {
    requestAnimationFrame(() => {
      setTimeout(calculatePosition, 200);
    });
  }
}, [isOpen, componentElement, mounted, calculatePosition]);

  // Reposition on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

const handleReposition = () => {
  if (componentElement && popupRef.current) calculatePosition();
};


    const debouncedReposition = debounce(handleReposition, 200);

    window.addEventListener("scroll", debouncedReposition, true);
    window.addEventListener("resize", debouncedReposition);

    return () => {
      window.removeEventListener("scroll", debouncedReposition, true);
      window.removeEventListener("resize", debouncedReposition);
    };
  }, [isOpen, componentElement, calculatePosition]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape, true);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape, true);
    };
  }, [isOpen, onClose]);

  // Handle action buttons
  const handleAction = useCallback(
    (action: () => void, event: React.SyntheticEvent) => {
      event.preventDefault();
      event.stopPropagation();
      action();
    },
    []
  );

  // Handle tab switching
  const handleTabChange = useCallback(
    (section: "global" | "content" | "style") => {
      setActiveEditSection(section);
    },
    [setActiveEditSection]
  );

  // Handle global style changes
  const handleBgColorChange = useCallback(
    async (bgColor: string) => {
      if (setBgColorInternal && handleSubmit) {
        setBgColorInternal(bgColor);
        try {
          await handleSubmit({ bgColor });
        } catch (error) {
          console.error("Failed to update background color:", error);
        }
      }
    },
    [setBgColorInternal, handleSubmit]
  );

  const handleFontChange = useCallback(
    async (font: string) => {
      if (setFontInternal && handleSubmit) {
        setFontInternal(font);
        try {
          await handleSubmit({ font });
        } catch (error) {
          console.error("Failed to update font:", error);
        }
      }
    },
    [setFontInternal, handleSubmit]
  );

  if (!mounted || !isOpen) return null;

  const popupContent = (
    <div
      ref={popupRef}
      className="component-popup"
      style={{
        position: "fixed",
        width: "400px",
        maxHeight: "80vh",
        backgroundColor: "white",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        zIndex: 1000,
        overflow: "hidden",
        flexDirection: "column",
        transform: isAnimating ? "scale(0.95)" : "scale(1)",
        opacity: isAnimating ? 0.8 : 1,
        transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
        // Initially hidden until positioned
        visibility: "hidden",
        display: "none",
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f8fafc",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Settings size={16} />
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
            {selectedItem
              ? selectedComponentLabel
              : `${selectedComponentLabel}`}
          </h3>
        </div>
        {/* Action Buttons */}

        <div
          style={{
            padding: "0px 16px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {onSave && (
            <button
              onClick={(e) => handleAction(() => onSave(e), e)}
              className=" hover:bg-black/10 p-2 rounded-md"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Save size={16} />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={(e) => handleAction(() => onDuplicate(e), e)}
              className=" hover:bg-black/10 p-2 rounded-md"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Copy size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => handleAction(() => onDelete(e), e)}
              className=" hover:bg-black/10 p-2 rounded-md"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e2e8f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <button
          onClick={(e) => handleAction(onClose, e)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e2e8f0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          maxHeight: "calc(80vh - 140px)",
        }}
      >
        <SidebarSection noPadding noBorderTop showBreadcrumbs={false} title="">
          <div onClick={(e) => e.stopPropagation()}>
            <EditTabs
              editSection={editSection}
              hasSelectedItem={selectedItem !== null}
              setActiveEditSection={handleTabChange}
            />

            {/* Global Settings */}
            {editSection === "global" && (
              <div
                className="px-4 py-2 flex flex-col gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {bgColorInternal !== undefined &&
                  setBgColorInternal &&
                  handleSubmit && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <ColorPicker
                        value={bgColorInternal}
                        onChange={handleBgColorChange}
                        name="Main Background Color"
                      />
                    </div>
                  )}
                {fontInternal !== undefined &&
                  setFontInternal &&
                  handleSubmit && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <FontSelector
                        selectedFont={fontInternal}
                        onChange={handleFontChange}
                      />
                    </div>
                  )}
              </div>
            )}

            {/* Fields for content and style */}
            <div onClick={(e) => e.stopPropagation()}>
              <Fields type={editSection} />
            </div>

            {/* Outline for global */}
            {editSection === "global" && (
              <div className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                <Outline />
              </div>
            )}
          </div>
        </SidebarSection>
      </div>
    </div>
  );

  // Render portal to document body
  const portalRoot =
    document.getElementById("puck-portal-root") || document.body;
  return createPortal(popupContent, portalRoot);
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
