import React, { useState, ReactNode } from "react";
import { Sidebar } from "../SidebarComponents";
import { Drawer } from "../Drawer";
import { LayoutGrid, Image, Type, MousePointerClick, Box, Bell, Bookmark, Clock, Landmark, Mail, MousePointer, Navigation, ScreenShare, Star } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";

type CategoryKey = any;

interface ComponentListProps {
  id: string;
  title?: CategoryKey;
  children?: ReactNode;
  renderOutside?: boolean; // New prop to render children outside
}

interface CategoryStyle {
  icon: React.ReactNode;
  style: {
    background: string;
    hoverBackground?: string;
  };
}

const categoryStyles: Record<CategoryKey, CategoryStyle> = {
  Layout: {
    icon: <LayoutGrid className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))",
      hoverBackground: "linear-gradient(135deg, rgb(37, 99, 235), rgb(29, 78, 216))",
    },
  },
  Navigation: {
    icon: <Navigation className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(168, 85, 247), rgb(147, 51, 234))",
      hoverBackground: "linear-gradient(135deg, rgb(147, 51, 234), rgb(126, 34, 206))",
    },
  },
  Announcements: {
    icon: <Bell className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(249, 115, 22), rgb(234, 88, 12))",
      hoverBackground: "linear-gradient(135deg, rgb(234, 88, 12), rgb(194, 65, 12))",
    },
  },
  "Landing Sections": {
    icon: <Landmark className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))",
      hoverBackground: "linear-gradient(135deg, rgb(22, 163, 74), rgb(21, 128, 61))",
    },
  },
  Media: {
    icon: <Image className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(239, 68, 68), rgb(220, 38, 38))",
      hoverBackground: "linear-gradient(135deg, rgb(220, 38, 38), rgb(185, 28, 28))",
    },
  },
  Typography: {
    icon: <Type className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(99, 102, 241), rgb(79, 70, 229))",
      hoverBackground: "linear-gradient(135deg, rgb(79, 70, 229), rgb(67, 56, 202))",
    },
  },
  "Cards": {
    icon: <ScreenShare className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(245, 158, 11), rgb(217, 119, 6))",
      hoverBackground: "linear-gradient(135deg, rgb(217, 119, 6), rgb(180, 83, 9))",
    },
  },
  "Partners": {
    icon: <Bookmark className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(14, 165, 233), rgb(2, 132, 199))",
      hoverBackground: "linear-gradient(135deg, rgb(2, 132, 199), rgb(3, 105, 161))",
    },
  },
  "Social Proof": {
    icon: <Star className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(139, 92, 246), rgb(124, 58, 237))",
      hoverBackground: "linear-gradient(135deg, rgb(124, 58, 237), rgb(109, 40, 217))",
    },
  },
  Forms: {
    icon: <Mail className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(236, 72, 153), rgb(219, 39, 119))",
      hoverBackground: "linear-gradient(135deg, rgb(219, 39, 119), rgb(190, 24, 93))",
    },
  },
  Buttons: {
    icon: <MousePointer className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(59, 130, 246), rgb(37, 99, 235))",
      hoverBackground: "linear-gradient(135deg, rgb(37, 99, 235), rgb(29, 78, 216))",
    },
  },
  Timelines: {
    icon: <Clock className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))",
      hoverBackground: "linear-gradient(135deg, rgb(5, 150, 105), rgb(4, 120, 87))",
    },
  },
  Other: {
    icon: <Box className="w-4 h-4" />,
    style: {
      background: "linear-gradient(135deg, rgb(107, 114, 128), rgb(75, 85, 99))",
      hoverBackground: "linear-gradient(135deg, rgb(75, 85, 99), rgb(55, 65, 81))",
    },
  },
};

export const ComponentList = ({ id, title, children, renderOutside }: ComponentListProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenSidebar = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const currentCategoryStyles = title ? categoryStyles[title] : null;

  if (renderOutside) {
    // Render children directly outside if `renderOutside` is true
    return <>{children}</>;
  }

  return (
    <>
      <Card className="w-full transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-0 h-full">
          {title && (
            <button
              type="button"
              onClick={handleOpenSidebar}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                width: '100%',
                height: '100%',
                padding: '0.5rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                borderRadius: '12px',
                background: isHovered 
                  ? currentCategoryStyles?.style.hoverBackground 
                  : currentCategoryStyles?.style.background,
                transform: isHovered ? 'scale(1.02)' : 'scale(1)'
              }}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background flex items-center"
            >
              <div className="flex items-center gap-3">
                <div style={{padding: "6px"}} className="rounded-lg bg-white/10 backdrop-blur-sm text-white">
                  {currentCategoryStyles?.icon}
                </div>
                <span className="text-[14px] text-white">
                  {title}
                </span>
              </div>
            </button>
          )}
        </CardContent>
      </Card>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={title || "Components"}
      >
        <Drawer droppableId={id}>
          {children || <div className="p-4 text-center text-gray-500">No components available</div>}
        </Drawer>
      </Sidebar>
    </>
  );
};

// Parent container for grid layout
export const ComponentGrid = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-2 gap-2 pb-2">
      {children}
    </div>
  );
};

ComponentList.Item = Drawer.Item;

export default ComponentList;