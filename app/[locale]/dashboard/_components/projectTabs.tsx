import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  Link as LinkIcon,
  BarChart2,
  Image,
  Settings,
  Download,
  Eye,
  Edit3,
  LucideIcon,
  Users,
  Map,
} from "lucide-react"; // Import icons
import { Site } from "@/app/[locale]/types";

const tabs = [
  "Analytics",
  "Media library",
  "Site map",
  "Leads",
  "Settings",
  "View",
  "Edit",
] as const;

type TabName = (typeof tabs)[number];

// Icon mapping for each tab with a fallback to LucideIcon type to satisfy TypeScript
const tabIcons: Record<TabName, LucideIcon> = {
  Analytics: BarChart2,
  "Media library": Image,
  "Site map": Map,
  Leads: Users,
  Settings: Settings,
  View: Eye,
  Edit: Edit3,
};

interface TabProps {
  text: TabName;
  selected: boolean;
  setSelected: (text: TabName) => void;
  selectedSite?: Site;
}

const Tab = ({ text, selected, setSelected, selectedSite }: TabProps) => {
  const IconComponent = tabIcons[text]; // Get the icon component for each tab
  const isExternalTab = text === "View" || text === "Edit"; // Check if tab is "View" or "Edit"

  // Define URLs for "View" and "Edit" tabs with `selectedSite.path`
  const externalTabUrls: Record<TabName, string> = {
    Analytics: "",
    "Media library": "",
    "Site map": "",
    Leads: "",
    Settings: "",
    View: `/site/${selectedSite?.path ?? ""}`, // Add selectedSite.path
    Edit: `/site/${selectedSite?.path ?? ""}/edit`, // Add selectedSite.path
  };

  const tabContent = (
    <button
      onClick={() => !isExternalTab && setSelected(text)}
      className={`${
        selected
          ? "text-white"
          : "dark:text-stone-100 text-gray-800 hover:text-black dark:hover:text-gray-100"
      } relative rounded-md px-2 py-1 text-sm font-medium transition-colors flex items-center gap-1`}
    >
      <IconComponent className="relative z-10 w-4 h-4" />
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: "spring", duration: 0.4 }}
          className="absolute inset-0 z-0 rounded-md bg-gradient-to-b from-blue-500 to-purple-800"
        ></motion.span>
      )}
    </button>
  );

  return isExternalTab ? (
    <Link href={externalTabUrls[text]}>{tabContent}</Link>
  ) : (
    tabContent
  );
};

interface ProjectTabsProps {
  onTabChange: (selectedTab: TabName) => void;
  selectedSite?: Site;
}

const ProjectTabs = ({ onTabChange, selectedSite }: ProjectTabsProps) => {
  const [selected, setSelected] = useState<TabName>(tabs[0]);

  const handleTabChange = (tab: TabName) => {
    setSelected(tab);
    onTabChange(tab);
  };

  return (
    <div className="mb-6 mt-4 flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <Tab
          text={tab}
          selected={selected === tab}
          setSelected={handleTabChange}
          key={tab}
          selectedSite={selectedSite}
        />
      ))}
    </div>
  );
};

export default ProjectTabs;
