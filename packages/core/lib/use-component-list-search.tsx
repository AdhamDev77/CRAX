// use-component-list.ts
import { ReactNode, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Config, UiState } from "../types";
import { ComponentGrid, ComponentList } from "../components/ComponentList";
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

export const useComponentListSearch = (
  config: Config,
  ui: UiState,
  type: string
) => {
  const [componentListSearch, setComponentListSearch] = useState<ReactNode[]>();
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
          return configCategory;
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
            <ComponentListSearch
              id={categoryKey}
              key={categoryKey}
              title={category.title || categoryKey}
            >
              <ComponentGrid>
                {filteredComponents.map((componentName, i) => {
                  matchedComponents.push(componentName as string);
                  const componentConf = config.components[componentName] || {};
                  const LoadedComponent = loadedComponents.get(componentName);

                  return (
                    <ComponentListSearch.Item
                      key={componentName}
                      label={(componentConf["label"] ?? componentName) as string}
                      image={componentConf["image"]}
                      html={componentConf["html"]}
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
              </ComponentGrid>
            </ComponentListSearch>
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
        const filteredRemainingComponents = remainingComponents.filter(
          (componentName) => {
            const componentConf = config.components[componentName] || {};
            const label = (componentConf["label"] ?? componentName) as string;
            return (
              label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              componentName.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
        );

        if (filteredRemainingComponents.length > 0) {
          _componentList.push(
            <ComponentListSearch
              id="other"
              key="other"
              title={ui.componentList.other?.title || "Other"}
            >
              {filteredRemainingComponents.map((componentName, i) => {
                const componentConf = config.components[componentName] || {};
                const LoadedComponent = loadedComponents.get(componentName);

                return (
                  <ComponentListSearch.Item
                    key={componentName}
                    name={componentName as string}
                    label={(componentConf["label"] ?? componentName) as string}
                    image={
                      (componentConf["image"] ||
                        "https://static.vecteezy.com/system/resources/previews/010/434/242/non_2x/accept-and-decline-buttons-app-icons-set-ui-ux-user-interface-yes-or-no-click-approve-and-delete-hand-pushing-button-web-or-mobile-applications-isolated-illustrations-vector.jpg") as string
                    }
                    html={(componentConf["html"] ?? componentName) as string}
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
            </ComponentListSearch>
          );
        }
      }

      setComponentListSearch(_componentList);
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
    componentListSearch,
    searchQuery,
    setSearchQuery,
  };
};