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

// Helper function to create a database component render function
const createDatabaseComponentRender = (content: string) => {
  return () => {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
        className="w-full h-full"
      />
    );
  };
};

export const useComponentList = (config: Config, ui: UiState, type: string) => {
  const [componentList, setComponentList] = useState<ReactNode[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [loadedComponents, setLoadedComponents] = useState<Map<string, any>>(new Map());
  const [dbComponents, setDbComponents] = useState<any[]>([]);
  const [mergedConfig, setMergedConfig] = useState<Config>(config);

  // Fetch database components
  useEffect(() => {
    const fetchDbComponents = async () => {
      try {
        const response = await fetch('/api/component');
        if (response.ok) {
          const components = await response.json();
          setDbComponents(components);
        } else {
          console.warn('Failed to fetch database components');
        }
      } catch (error) {
        console.error('Error fetching database components:', error);
      }
    };

    fetchDbComponents();
  }, []);

  // Merge database components with config - ENHANCED VERSION
  useEffect(() => {
    if (dbComponents.length === 0) {
      setMergedConfig(config);
      return;
    }

    const newConfig = { ...config };
    const newComponents = { ...config.components };
    const newCategories = { ...config.categories };

    // Process each database component
    dbComponents.forEach((dbComponent) => {
      const componentName = `db_${dbComponent.name}`;
      
      // Add component to components object
      newComponents[componentName] = {
        label: dbComponent.name,
        html: dbComponent.content,
        image: dbComponent.Image || "",
        primary: false,
        icon: null,
        zones: dbComponent.zones || [],
        isDbComponent: true,
        dbId: dbComponent.id
      };

      // ENHANCED: Force all database components to be "sections" type only
      const categoryName = dbComponent.category || 'Database Components';
      const subCategoryName = dbComponent.subCategory || 'Custom Sections';
      const targetType = 'sections'; // Force all DB components to sections

      // Only add to categories if the current type matches 'sections'
      if (type === targetType) {
        if (!newCategories[categoryName]) {
          newCategories[categoryName] = {
            title: categoryName,
            type: targetType, // Always sections for DB components
            visible: true,
            subcategories: {},
            components: []
          };
        }

        // Ensure the category is always type 'sections' for DB components
        newCategories[categoryName].type = targetType;

        // Handle subcategories
        if (subCategoryName) {
          if (!newCategories[categoryName].subcategories) {
            newCategories[categoryName].subcategories = {};
          }

          if (!newCategories[categoryName].subcategories[subCategoryName]) {
            newCategories[categoryName].subcategories[subCategoryName] = {
              title: subCategoryName,
              components: []
            };
          }

          // Add component to subcategory
          if (!newCategories[categoryName].subcategories[subCategoryName].components.includes(componentName)) {
            newCategories[categoryName].subcategories[subCategoryName].components.push(componentName);
          }
        } else {
          // Add directly to category components if no subcategory
          if (!newCategories[categoryName].components) {
            newCategories[categoryName].components = [];
          }
          if (!newCategories[categoryName].components.includes(componentName)) {
            newCategories[categoryName].components.push(componentName);
          }
        }
      }
    });

    setMergedConfig({
      ...newConfig,
      components: newComponents,
      categories: newCategories
    });
  }, [dbComponents, config, type]); // Added 'type' to dependencies

  // Effect to preload components when merged config changes
  useEffect(() => {
    const preloadComponents = async () => {
      const componentNames = Object.keys(mergedConfig.components);
      const loadPromises = componentNames.map(async (componentName) => {
        const componentConfig = mergedConfig.components[componentName];
        
        // Handle database components
        if (componentConfig.isDbComponent) {
          const dbComponent = dbComponents.find(db => db.id === componentConfig.dbId);
          if (dbComponent) {
            return [componentName, {
              render: createDatabaseComponentRender(dbComponent.content),
              defaultProps: {}
            }] as const;
          }
          return [componentName, null] as const;
        }
        
        // Handle normal components
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

    if (Object.keys(mergedConfig.components).length > 0) {
      preloadComponents();
    }
  }, [mergedConfig.components, dbComponents]);

  useEffect(() => {
    if (Object.keys(mergedConfig.categories || {}).length > 0 && loadedComponents.size > 0) {
      const matchedComponents: string[] = [];
      let _componentList: ReactNode[] = [];

      // Filter categories based on type
      const filteredCategories = Object.entries(mergedConfig.categories || {}).filter(
        ([categoryKey, category]) => {
          return category?.type === type;
        }
      );

      // Group categories by title to merge duplicates
      const categoryGroups = new Map<string, {
        categoryKey: string;
        category: any;
        allComponents: string[];
        allSubcategories: Record<string, any>;
      }>();

      // First pass: group categories by title
      filteredCategories.forEach(([categoryKey, category]) => {
        if (!category || category.visible === false) {
          return;
        }

        const categoryTitle = category.title || categoryKey;
        
        if (categoryGroups.has(categoryTitle)) {
          // Merge with existing category
          const existing = categoryGroups.get(categoryTitle)!;
          
          // Merge components
          const categoryComponents = (category.components || []) as string[];
          existing.allComponents = [...existing.allComponents, ...categoryComponents];
          
          // Merge subcategories
          if (category.subcategories) {
            Object.entries(category.subcategories).forEach(([subKey, subCategory]) => {
              if (existing.allSubcategories[subKey]) {
                // Merge subcategory components
                const existingSubComponents = existing.allSubcategories[subKey].components || [];
                const newSubComponents = subCategory.components || [];
                existing.allSubcategories[subKey].components = [
                  ...existingSubComponents,
                  ...newSubComponents
                ];
              } else {
                existing.allSubcategories[subKey] = subCategory;
              }
            });
          }
        } else {
          // Create new category group
          categoryGroups.set(categoryTitle, {
            categoryKey,
            category,
            allComponents: [...(category.components || [])],
            allSubcategories: { ...(category.subcategories || {}) }
          });
        }
      });

      // Helper to render subcategories recursively
      const renderSubcategories = (categoryKey: string, subcategories: Record<string, any>) => {
        return Object.entries(subcategories).map(([subCategoryKey, subCategory]) => {
          if (!subCategory.components || subCategory.components.length === 0) return null;

          // Filter components based on search query
          const filteredComponents = (subCategory.components as string[]).filter(
            (componentName) => {
              const componentConf = mergedConfig.components[componentName] || {};
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
                  const componentConf = mergedConfig.components[componentName] || {};
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
  isDbComponent={componentConf.isDbComponent}
  dbComponentData={componentConf.isDbComponent ? {
    content: dbComponents.find(db => db.id === componentConf.dbId)?.content || [],
    zones: dbComponents.find(db => db.id === componentConf.dbId)?.zones || {}
  } : undefined}
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

      // Second pass: process merged category groups
      categoryGroups.forEach(({ categoryKey, category, allComponents, allSubcategories }) => {
        const categoryTitle = category.title || categoryKey;

        // If category has subcategories, render them nested under the parent category
        if (Object.keys(allSubcategories).length > 0) {
          _componentList.push(
            <ComponentList
              id={categoryKey}
              key={categoryTitle} // Use title as key to prevent duplicates
              title={categoryTitle}
            >
              {/* Render all subcategories as nested lists */}
              {renderSubcategories(categoryKey, allSubcategories)}
            </ComponentList>
          );
        } else {
          // Handle categories without subcategories (legacy support)
          if (allComponents.length === 0) return;

          // Remove duplicates from merged components
          const uniqueComponents = [...new Set(allComponents)];

          // Filter components based on search query
          const filteredComponents = uniqueComponents.filter(
            (componentName) => {
              const componentConf = mergedConfig.components[componentName] || {};
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
              key={categoryTitle} // Use title as key to prevent duplicates
              title={categoryTitle}
            >
              <ComponentGrid>
                {filteredComponents.map((componentName: string, i: number) => {
                  matchedComponents.push(componentName);
                  const componentConf = mergedConfig.components[componentName] || {};
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
  isDbComponent={componentConf.isDbComponent}
  dbComponentData={componentConf.isDbComponent ? {
    content: dbComponents.find(db => db.id === componentConf.dbId)?.content || [],
    zones: dbComponents.find(db => db.id === componentConf.dbId)?.zones || {}
  } : undefined}
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
      const remainingComponents = Object.keys(mergedConfig.components).filter(
        (component) => matchedComponents.indexOf(component) === -1
      );

      if (remainingComponents.length > 0 && type === "elements") {
        const filteredRemainingComponents = (remainingComponents as string[]).filter(
          (componentName) => {
            const componentConf = mergedConfig.components[componentName] || {};
            const label = (componentConf["label"] ?? componentName) as string;
            return (
              label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              componentName.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
        );

        // Uncomment this section if you want to show uncategorized components
        // if (filteredRemainingComponents.length > 0) {
        //   const otherComponentsItem = (
        //     <ComponentList
        //       id="other"
        //       key="Other Components"
        //       title="Other Components"
        //     >
        //       <ComponentGrid>
        //         {filteredRemainingComponents.map((componentName: string, i: number) => {
        //           const componentConf = mergedConfig.components[componentName] || {};
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
    mergedConfig.categories,
    mergedConfig.components,
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