import { ReactNode, useEffect, useState } from "react";
import { Config, UiState } from "../types";
import { ComponentGrid } from "../components/ComponentList";
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
    if (Object.keys(config.categories || {}).length > 0 && loadedComponents.size > 0) {
      const matchedComponents: string[] = [];
      let _componentList: ReactNode[] = [];

      // Get all categories regardless of type for search
      const allCategories = Object.entries(config.categories || {});

      // Process each category
      allCategories.forEach(([categoryKey, category]) => {
        if (!category || category.visible === false) {
          return;
        }

        // Check if category has subcategories
        if (category.subcategories && Object.keys(category.subcategories).length > 0) {
          // Process subcategories
          Object.entries(category.subcategories).forEach(([subCategoryKey, subCategory]) => {
            if (!subCategory || !subCategory.components || subCategory.components.length === 0) return;

            // Filter components based on search query
            const filteredComponents = (subCategory.components as string[]).filter(
              (componentName) => {
                const componentConf = config.components[componentName] || {};
                const label = (componentConf["label"] ?? componentName) as string;
                return (
                  label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  componentName.toLowerCase().includes(searchQuery.toLowerCase())
                );
              }
            );

            if (filteredComponents.length === 0) return;

            const componentListItem = (
              <ComponentListSearch
                id={`${categoryKey}-${subCategoryKey}`}
                key={`${categoryKey}-${subCategoryKey}`}
                title={`${category.title || categoryKey} - ${subCategory.title || subCategoryKey}`}
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

            _componentList.push(componentListItem);
          });
        } else {
          // Handle categories without subcategories (legacy support)
          const categoryComponents = (category.components || []) as string[];
          if (categoryComponents.length === 0) return;

          // Filter components based on search query
          const filteredComponents = categoryComponents.filter(
            (componentName) => {
              const componentConf = config.components[componentName] || {};
              const label = (componentConf["label"] ?? componentName) as string;
              return (
                label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                componentName.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }
          );

          if (filteredComponents.length === 0) return;

          const componentListItem = (
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
                      name={componentName as string}
                      label={(componentConf["label"] ?? componentName) as string}
                      image={componentConf["image"]}
                      html={componentConf["html"]}
                      icon={componentConf["icon"]}
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

          _componentList.push(componentListItem);
        }
      });

      // Handle remaining components that weren't matched to any category
      const remainingComponents = Object.keys(config.components).filter(
        (component) => matchedComponents.indexOf(component) === -1
      );

      if (remainingComponents.length > 0) {
        const filteredRemainingComponents = (remainingComponents as string[]).filter(
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
          const otherComponentsItem = (
            <ComponentListSearch
              id="other"
              key="other"
              title="Other Components"
            >
              <ComponentGrid>
                {filteredRemainingComponents.map((componentName: string, i: number) => {
                  const componentConf = config.components[componentName] || {};
                  const LoadedComponent = loadedComponents.get(componentName);

                  return (
                    <ComponentListSearch.Item
                      key={componentName}
                      name={componentName as string}
                      label={(componentConf["label"] ?? componentName) as string}
                      image={componentConf["image"]}
                      html={componentConf["html"]}
                      icon={componentConf["icon"]}
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

          _componentList.push(otherComponentsItem);
        }
      }

      setComponentListSearch(_componentList);
    }
  }, [
    config.categories,
    config.components,
    searchQuery,
    loadedComponents,
  ]);

  return {
    componentListSearch,
    searchQuery,
    setSearchQuery,
  };
};