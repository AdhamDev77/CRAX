import { useComponentList } from "../../../../lib/use-component-list";
import { useComponentListSearch } from "../../../../lib/use-component-list-search";
import { useAppContext } from "../../context";
import { ComponentList } from "../../../ComponentList";
import { useMemo, useEffect } from "react";
import { Search } from "lucide-react";

export const Components = ({ type }: { type: string }) => {
  const { config, state, overrides } = useAppContext();
  const { componentList, dbComponentMap } = useComponentList(config, state.ui, type);
  const { componentListSearch, searchQuery, setSearchQuery } =
    useComponentListSearch(config, state.ui, type);
  const Wrapper = useMemo(() => overrides.components || "div", [overrides]);

  // Expose dbComponentMap globally for drag-and-drop support
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__dbComponentMap = dbComponentMap;
    }
  }, [dbComponentMap]);

  // Determine what to render based on search query
  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className="component-panel">
      {/* Search Bar */}
      <div className="relative w-full max-w-md mx-auto mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <Wrapper className="component-wrapper">
        {hasSearchQuery ? (
          // Show search results
          <div className="search-results">
            {componentListSearch && componentListSearch.length > 0 ? (
              componentListSearch
            ) : (
              <div className="no-results p-4 text-center text-gray-500">
                <p>No components found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          // Show categorized components
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              {componentList && componentList.length > 0 ? (
                componentList
              ) : (
                <div className="no-components p-4 text-center text-gray-500">
                  <p>No components available for this section</p>
                </div>
              )}
            </div>

            <div className="search-results">
              {componentListSearch && componentListSearch.length > 0 ? (
                componentListSearch
              ) : (
                <div className="no-results p-4 text-center text-gray-500">
                  <p>No components found matching &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Wrapper>
    </div>
  );
};
