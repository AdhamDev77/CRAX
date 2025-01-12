import { useComponentList } from "../../../../lib/use-component-list";
import { useComponentListSearch } from "../../../../lib/use-component-list-search";
import { useAppContext } from "../../context";
import { ComponentList, ComponentGrid } from "../../../ComponentList"; // Import ComponentGrid
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import DragTabs from "../../../DragTabs";
import ComponentListSearch from "../../../ComponentListSearch";

export const Components = ({ type }: { type: string }) => {
  const { config, state, overrides } = useAppContext();
  const { componentList } = useComponentList(config, state.ui, type);
  const { componentListSearch, searchQuery, setSearchQuery } = useComponentListSearch(config, state.ui, type);
  const Wrapper = useMemo(() => overrides.components || "div", [overrides]);

  return (
    <div>
              {/* Search Bar */}
              <div className="relative w-full max-w-md mx-auto mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <Wrapper>
        <ComponentGrid>
          {componentList ? componentList : <ComponentList id="all" />}
        </ComponentGrid>

          {componentListSearch ? componentListSearch : <ComponentList id="all" />}
      </Wrapper>
    </div>
  );
};
