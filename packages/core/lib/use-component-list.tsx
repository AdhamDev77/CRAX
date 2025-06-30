import { ReactNode, useEffect, useState } from "react";
import { Config, UiState } from "../types";
import { ComponentList, ComponentGrid } from "../components/ComponentList";

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
    if (Object.keys(config.categories || {}).length > 0 && loadedComponents.size > 0) {
      const matchedComponents: string[] = [];
      let _componentList: ReactNode[] = [];

      // Filter categories based on type
      const filteredCategories = Object.entries(config.categories || {}).filter(
        ([categoryKey, category]) => {
          return category?.type === type;
        }
      );

      // Helper to render subcategories recursively
      const renderSubcategories = (categoryKey: string, subcategories: Record<string, any>) => {
        return Object.entries(subcategories).map(([subCategoryKey, subCategory]) => {
          if (!subCategory.components || subCategory.components.length === 0) return null;

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

          if (filteredComponents.length === 0) return null;

          return (
            <ComponentList
              id={`${categoryKey}-${subCategoryKey}`}
              key={`${categoryKey}-${subCategoryKey}`}
              title={subCategory.title || subCategoryKey}
              isSubcategory={true}
            >
              <ComponentGrid>
                {filteredComponents.map((componentName: string, i: number) => {
                  matchedComponents.push(componentName);
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
                      name={componentName}
                      preview={
                        LoadedComponent
                          ? (props: any) => {
                              if (LoadedComponent.render && typeof LoadedComponent.render === 'function') {
                                const Component = LoadedComponent.render;
                                return <Component {...LoadedComponent.defaultProps} {...props} />;
                              } else if (typeof LoadedComponent.render === 'function') {
                                return LoadedComponent.render({ ...LoadedComponent.defaultProps, ...props });
                              } else if (typeof LoadedComponent === 'function') {
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
            </ComponentList>
          );
        });
      };

      // Process each category
      filteredCategories.forEach(([categoryKey, category]) => {
        if (!category || category.visible === false) {
          return;
        }

        // If category has subcategories, render them nested under the parent category
        if (category.subcategories && Object.keys(category.subcategories).length > 0) {
          _componentList.push(
            <ComponentList
              id={categoryKey}
              key={categoryKey}
              title={category.title || categoryKey}
            >
              {/* Render all subcategories as nested lists */}
              {renderSubcategories(categoryKey, category.subcategories)}
            </ComponentList>
          );
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

          _componentList.push(
            <ComponentList
              id={categoryKey}
              key={categoryKey}
              title={category.title || categoryKey}
            >
              <ComponentGrid>
                {filteredComponents.map((componentName: string, i: number) => {
                  matchedComponents.push(componentName);
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
                      name={componentName}
                      preview={
                        LoadedComponent
                          ? (props: any) => {
                              if (LoadedComponent.render && typeof LoadedComponent.render === 'function') {
                                const Component = LoadedComponent.render;
                                return <Component {...LoadedComponent.defaultProps} {...props} />;
                              } else if (typeof LoadedComponent.render === 'function') {
                                return LoadedComponent.render({ ...LoadedComponent.defaultProps, ...props });
                              } else if (typeof LoadedComponent === 'function') {
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
            </ComponentList>
          );
        }
      });

      // Handle remaining components that weren't matched to any category
      const remainingComponents = Object.keys(config.components).filter(
        (component) => matchedComponents.indexOf(component) === -1
      );

      if (remainingComponents.length > 0 && type === "elements") {
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

        // if (filteredRemainingComponents.length > 0) {
        //   const otherComponentsItem = (
        //     <ComponentList
        //       id="other"
        //       key="other"
        //       title="Other Components"
        //     >
        //       <ComponentGrid>
        //         {filteredRemainingComponents.map((componentName: string, i: number) => {
        //           const componentConf = config.components[componentName] || {};
        //           const LoadedComponent = loadedComponents.get(componentName);

        //           return (
        //             <ComponentList.Item
        //               key={componentName}
        //               name={componentName}
        //               label={(componentConf["label"] ?? componentName) as string}
        //               image={componentConf["image"]}
        //               html={componentConf["html"]}
        //               primary={componentConf["primary"]}
        //               icon={componentConf["icon"]}
        //               preview={
        //                 LoadedComponent
        //                   ? (props: any) => {
        //                       if (LoadedComponent.render && typeof LoadedComponent.render === 'function') {
        //                         const Component = LoadedComponent.render;
        //                         return <Component {...LoadedComponent.defaultProps} {...props} />;
        //                       } else if (typeof LoadedComponent.render === 'function') {
        //                         return LoadedComponent.render({ ...LoadedComponent.defaultProps, ...props });
        //                       } else if (typeof LoadedComponent === 'function') {
        //                         return LoadedComponent({ ...LoadedComponent.defaultProps, ...props });
        //                       }
        //                       return null;
        //                     }
        //                   : undefined
        //               }
        //               index={i}
        //             />
        //           );
        //         })}
        //       </ComponentGrid>
        //     </ComponentList>
        //   );

        //   _componentList.push(otherComponentsItem);
        // }
      }

      setComponentList(_componentList);
    }
  }, [
    config.categories,
    config.components,
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