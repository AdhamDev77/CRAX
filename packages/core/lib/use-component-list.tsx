import { ReactNode, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Config, UiState } from "../types";
import { ComponentList } from "../components/ComponentList";
import ComponentListSearch from "../components/ComponentListSearch";

// Cache for loaded components to avoid re-importing
const componentCache = new Map<string, any>();

// Helper function to dynamically import components
const loadComponent = async (componentName: string) => {
  if (componentCache.has(componentName)) {
    return componentCache.get(componentName);
  }

  try {
    // Dynamic import from the blocks directory
    const componentModule = await import(`../../../config/blocks/${componentName}`);
    
    // Handle different export patterns
    const component = componentModule[componentName] || componentModule.default || componentModule;
    
    componentCache.set(componentName, component);
    return component;
  } catch (error) {
    console.warn(`Failed to load component: ${componentName}`, error);
    return null;
  }
};

export const useComponentList = (config: Config, ui: UiState, type: string) => {
  const [componentList, setComponentList] = useState<ReactNode[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [loadedComponents, setLoadedComponents] = useState<Map<string, any>>(new Map());

  // Effect to preload components when config changes
  useEffect(() => {
    const preloadComponents = async () => {
      const componentNames = Object.keys(config.components);
      const loadPromises = componentNames.map(async (componentName) => {
        const component = await loadComponent(componentName);
        return [componentName, component] as const;
      });

      const results = await Promise.all(loadPromises);
      const newLoadedComponents = new Map();
      
      results.forEach(([name, component]) => {
        if (component) {
          newLoadedComponents.set(name, component);
        }
      });

      setLoadedComponents(newLoadedComponents);
    };

    if (Object.keys(config.components).length > 0) {
      preloadComponents();
    }
  }, [config.components]);

  useEffect(() => {
    if (Object.keys(ui.componentList).length > 0 && loadedComponents.size > 0) {
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
                const LoadedComponent = loadedComponents.get(componentName);

                return (
                  <ComponentList.Item
                    key={componentName}
                    label={(componentConf["label"] ?? componentName) as string}
                    html={componentConf["html"]}
                    primary={componentConf["primary"]}
                    image={componentConf["image"]}
                    icon={componentConf["icon"]}
                    name={componentName as string}
                    preview={
                      LoadedComponent
                        ? (props: any) => {
                            // Handle ComponentConfig objects
                            if (LoadedComponent.render && typeof LoadedComponent.render === 'function') {
                              const Component = LoadedComponent.render;
                              return <Component {...LoadedComponent.defaultProps} {...props} />;
                            }
                            // Handle direct render methods
                            else if (typeof LoadedComponent.render === 'function') {
                              return LoadedComponent.render({ ...LoadedComponent.defaultProps, ...props });
                            }
                            // Handle direct React components
                            else if (typeof LoadedComponent === 'function') {
                              return LoadedComponent({ ...LoadedComponent.defaultProps, ...props });
                            }
                            return null;
                          }
                        : undefined
                    }
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
        // Add logic for remaining components if needed
      }

      setComponentList(_componentList);
    }
  }, [
    config.categories,
    config.components,
    ui.componentList,
    type,
    searchQuery,
    loadedComponents,
  ]);

  return {
    componentList,
    searchQuery,
    setSearchQuery,
  };
};