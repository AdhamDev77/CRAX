import { ReactNode, useEffect, useState } from "react";
import { Config, UiState } from "../types";
import { ComponentList } from "../components/ComponentList";

export const useComponentList = (config: Config, ui: UiState) => {
  const [componentList, setComponentList] = useState<ReactNode[]>();

  useEffect(() => {
    if (Object.keys(ui.componentList).length > 0) {
      const matchedComponents: string[] = [];

      let _componentList: ReactNode[];

      _componentList = Object.entries(ui.componentList).map(
        ([categoryKey, category]) => {
          if (category.visible === false || !category.components) {
            return null;
          }

          return (
            <ComponentList
              id={categoryKey}
              key={categoryKey}
              title={category.title || categoryKey}
            >
              {category.components.map((componentName, i) => {
                matchedComponents.push(componentName as string);

                const componentConf = config.components[componentName] || {};

                return (
                  <ComponentList.Item
                    key={componentName}
                    label={(componentConf["label"] ?? componentName) as string}
                    image={(componentConf["image"] || "https://static.vecteezy.com/system/resources/previews/010/434/242/non_2x/accept-and-decline-buttons-app-icons-set-ui-ux-user-interface-yes-or-no-click-approve-and-delete-hand-pushing-button-web-or-mobile-applications-isolated-illustrations-vector.jpg") as string}
                    name={componentName as string}
                    index={i}
                  />
                );
              })}
            </ComponentList>
          );
        }
      );

      const remainingComponents = Object.keys(config.components).filter(
        (component) => matchedComponents.indexOf(component) === -1
      );

      if (
        remainingComponents.length > 0 &&
        !ui.componentList.other?.components &&
        ui.componentList.other?.visible !== false
      ) {
        _componentList.push(
          <ComponentList
            id="other"
            key="other"
            title={ui.componentList.other?.title || "Other"}
          >
            {remainingComponents.map((componentName, i) => {
              const componentConf = config.components[componentName] || {};

              return (
                <ComponentList.Item
                  key={componentName}
                  name={componentName as string}
                  label={(componentConf["label"] ?? componentName) as string}
                  image={(componentConf["image"] || "https://static.vecteezy.com/system/resources/previews/010/434/242/non_2x/accept-and-decline-buttons-app-icons-set-ui-ux-user-interface-yes-or-no-click-approve-and-delete-hand-pushing-button-web-or-mobile-applications-isolated-illustrations-vector.jpg") as string}
                  index={i}
                />
              );
            })}
          </ComponentList>
        );
      }

      setComponentList(_componentList);
    }
  }, [config.categories, config.components, ui.componentList]);

  return componentList;
};
