// use-component-list.ts
import { ReactNode, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Config, UiState } from "../types";
import { ComponentList } from "../components/ComponentList";
import ComponentListSearch from "../components/ComponentListSearch";

export const useComponentList = (config: Config, ui: UiState, type: string) => {
  const [componentList, setComponentList] = useState<ReactNode[]>();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (Object.keys(ui.componentList).length > 0) {
      const matchedComponents: string[] = [];
      let _componentList: ReactNode[];

      // Filter categories based on type
      const filteredCategories = Object.entries(ui.componentList).filter(
        ([categoryKey, category]) => {
          const configCategory = config.categories?.[categoryKey];
          return configCategory?.type === type;
        }
      );

      _componentList = filteredCategories
        .map(([categoryKey, category]) => {
          if (category.visible === false || !category.components) {
            return null;
          }

          // Filter components based on search query
          const filteredComponents = category.components.filter(
            (componentName) => {
              const componentConf = config.components[componentName] || {};
              const label = (componentConf["label"] ?? componentName) as string;
              return (
                label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                componentName.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }
          );

          if (filteredComponents.length === 0) {
            return null;
          }

          return (
            <ComponentList
              id={categoryKey}
              key={categoryKey}
              title={category.title || categoryKey}
            >
              {filteredComponents.map((componentName, i) => {
                matchedComponents.push(componentName as string);
                const componentConf = config.components[componentName] || {};

                return (
                  <ComponentList.Item
                    key={componentName}
                    label={(componentConf["label"] ?? componentName) as string}
                    html={componentConf["html"]}
                    image={componentConf["image"]}
                    icon={componentConf["icon"]}
                    name={componentName as string}
                    index={i}
                  />
                );
              })}
            </ComponentList>
          );
        })
        .filter(Boolean);

      // Handle remaining components only if type is "elements"
      const remainingComponents = Object.keys(config.components).filter(
        (component) => matchedComponents.indexOf(component) === -1
      );

      if (
        remainingComponents.length > 0 &&
        !ui.componentList.other?.components &&
        ui.componentList.other?.visible !== false
      ) {
        <></>;
      }

      setComponentList(_componentList);
    }
  }, [
    config.categories,
    config.components,
    ui.componentList,
    type,
    searchQuery,
  ]);

  return {
    componentList,
    searchQuery,
    setSearchQuery,
  };
};
