import {
  CSSProperties,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { Draggable } from "@measured/dnd";
import styles from "./styles.module.css";
import getClassNameFactory from "../../lib/get-class-name-factory";
import { Settings } from "lucide-react";
import { useModifierHeld } from "../../lib/use-modifier-held";
import { isIos } from "../../lib/is-ios";
import { useAppContext } from "../Puck/context";
import { DefaultDraggable } from "../Draggable";
import { Loader } from "../Loader";
import { ComponentPopup } from "../ComponentPopup";

const getClassName = getClassNameFactory("DraggableComponent", styles);

export const DraggableComponent = ({
  children,
  id,
  index,
  isLoading = false,
  isSelected = false,
  onClick = () => null,
  onMount = () => null,
  onMouseDown = () => null,
  onMouseUp = () => null,
  onMouseOver = () => null,
  onMouseOut = () => null,
  onDelete = () => null,
  onDuplicate = () => null,
  onSave = () => null,
  debug,
  label,
  isLocked = false,
  isDragDisabled,
  forceHover = false,
  indicativeHover = false,
  style,
  // Enhanced popup props
  selectedItem,
  selectedComponentLabel,
  editSection,
  setActiveEditSection,
  // Global styling props
  bgColorInternal,
  setBgColorInternal,
  fontInternal,
  setFontInternal,
  handleSubmit,
}: {
  children: ReactNode;
  id: string;
  index: number;
  isSelected?: boolean;
  onClick?: (e: SyntheticEvent) => void;
  onMount?: () => void;
  onMouseDown?: (e: SyntheticEvent) => void;
  onMouseUp?: (e: SyntheticEvent) => void;
  onMouseOver?: (e: SyntheticEvent) => void;
  onMouseOut?: (e: SyntheticEvent) => void;
  onDelete?: (e: SyntheticEvent) => void;
  onDuplicate?: (e: SyntheticEvent) => void;
  onSave?: (e: SyntheticEvent) => void;
  debug?: string;
  label?: any;
  isLocked: boolean;
  isLoading: boolean;
  isDragDisabled?: boolean;
  forceHover?: boolean;
  indicativeHover?: boolean;
  style?: CSSProperties;
  // Enhanced props
  selectedItem?: any;
  selectedComponentLabel?: string;
  editSection?: "global" | "content" | "style";
  setActiveEditSection?: (section: "global" | "content" | "style") => void;
  // Global styling props
  bgColorInternal?: string;
  setBgColorInternal?: (color: string) => void;
  fontInternal?: string;
  setFontInternal?: (font: string) => void;
  handleSubmit?: (data: { bgColor?: string; font?: string }) => Promise<void>;
}) => {
  const { zoomConfig, status, overrides, getPermissions } = useAppContext();
  const isModifierHeld = useModifierHeld("Alt");
  const componentRef = useRef<HTMLDivElement>(null);
  const [showPopup, setShowPopup] = useState(false);
  
  // FIXED: Use local state for editSection if not provided from parent
  const [localEditSection, setLocalEditSection] = useState<"global" | "content" | "style">("content");
  
  // Use either the provided editSection or local state
  const currentEditSection = editSection || localEditSection;
  const currentSetActiveEditSection = setActiveEditSection || setLocalEditSection;

  const El = status !== "LOADING" ? Draggable : DefaultDraggable;

  useEffect(onMount, []);

  // Control popup visibility based on selection
  useEffect(() => {
    if (isSelected) {
      setShowPopup(true);
    } else {
      // Add a small delay before hiding to prevent flickering
      const timer = setTimeout(() => setShowPopup(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isSelected]);

  const [disableSecondaryAnimation, setDisableSecondaryAnimation] =
    useState(false);

  useEffect(() => {
    // Disable animations on iOS to prevent GPU memory crashes
    if (isIos()) {
      setDisableSecondaryAnimation(true);
    }
  }, []);

  const permissions = useMemo(() => {
    return getPermissions({
      item: selectedItem || { type: "component", id },
    });
  }, [getPermissions, selectedItem, id]);

  // Handle popup close with proper state management
  const handlePopupClose = useCallback(() => {
    setShowPopup(false);
    // Don't automatically deselect - let parent component handle this
    // The popup closing doesn't necessarily mean the component should be deselected
  }, []);

  // Handle component click with proper event handling
  const handleComponentClick = useCallback((e: SyntheticEvent) => {
    e.stopPropagation();
    onClick(e);
  }, [onClick]);

  // Handle action buttons
  const handleSave = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(e);
  }, [onSave]);

  const handleDuplicate = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDuplicate(e);
  }, [onDuplicate]);

  const handleDelete = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(e);
    // Close popup after delete
    setShowPopup(false);
  }, [onDelete]);

  // FIXED: Handle tab change properly
  const handleTabChange = useCallback((section: "global" | "content" | "style") => {
    console.log("DraggableComponent tab change:", section); // Debug log
    currentSetActiveEditSection(section);
  }, [currentSetActiveEditSection]);

  return (
    <>
      <El
        key={id}
        draggableId={id}
        index={index}
        isDragDisabled={isDragDisabled}
        disableSecondaryAnimation={disableSecondaryAnimation}
      >
        {(provided, snapshot) => (
          <div
            ref={(el) => {
              provided.innerRef(el);
              componentRef.current = el;
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={getClassName({
              isSelected,
              isModifierHeld,
              isDragging: snapshot.isDragging,
              isLocked,
              forceHover,
              indicativeHover,
            })}
            style={{
              ...style,
              ...provided.draggableProps.style,
              cursor: isModifierHeld || isDragDisabled ? "pointer" : "grab",
            }}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onClick={handleComponentClick}
          >
            {debug}
            {isLoading && (
              <div className={getClassName("loadingOverlay")}>
                <Loader />
              </div>
            )}
            
            {/* FIXED: Hide selection indicator during drag to prevent positioning issues */}
            {isSelected && !snapshot.isDragging && (
              <div
                className={getClassName("selectedIndicator")}
                style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: "24px",
                  height: "24px",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  padding: "4px",
                  borderRadius: "50%",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  zIndex: 10,
                  transform: `scale(${1 / zoomConfig.zoom})`,
                  transformOrigin: "center",
                  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                  animation: "pulse 2s infinite",
                }}
              >
                <Settings size={12} />
              </div>
            )}

            <div className={getClassName("overlay")} />
            <div className={getClassName("contents")}>{children}</div>
          </div>
        )}
      </El>

      {/* FIXED: Only show popup when not dragging */}
      {showPopup && isSelected && (
        <ComponentPopup
          isOpen={showPopup}
          onClose={handlePopupClose}
          componentElement={componentRef.current}
          selectedItem={selectedItem}
          selectedComponentLabel={selectedComponentLabel || label || "Component"}
          editSection={currentEditSection}
          setActiveEditSection={handleTabChange}
          onSave={handleSave}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          permissions={{
            save: permissions.duplicate, // Using duplicate permission for save
            duplicate: permissions.duplicate,
            delete: permissions.delete,
          }}
          // Pass global styling props
          bgColorInternal={bgColorInternal}
          setBgColorInternal={setBgColorInternal}
          fontInternal={fontInternal}
          setFontInternal={setFontInternal}
          handleSubmit={handleSubmit}
        />
      )}

      {/* CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </>
  );
};