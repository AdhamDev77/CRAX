import React, { useEffect, useRef } from "react";
import { DropZone } from "@measured/puck";
import { usePuck } from "@/packages/core";
import type { ComponentConfig } from "@measured/puck";

export const NestedContainer: ComponentConfig<{
  name: string;
  zones: Record<string, any[]>;
}> = {
  label: "Container",
  defaultProps: { name: "Container", zones: {} },
  fields: {
    name: { type: "text", section: "content" },
  },
  render: ({ name, zones, puck }) => {
    const { appState, dispatch } = usePuck((s) => ({
      appState: s.appState,
      dispatch: s.dispatch,
    }));

    return (
      <div className="container-wrapper">
        <h2>{name}</h2>

        {Object.entries(zones).map(([zoneName, items]) => {
          const zoneIdRef = useRef(`${puck.id}:${zoneName}`);
          const zone = zoneIdRef.current;

          useEffect(() => {
            if (!appState.data.zones?.[zone]) {
              items.forEach((item, idx) => {
                dispatch({
                  type: "insert",
                  componentType: item.type,
                  destinationZone: zone,
                  destinationIndex: idx,
                  id: item.props.id,
                  props: item.props,
                });
              });
            }
          }, [appState.data.zones, zone, items, dispatch]);

          return <DropZone key={zoneName} zone={zone} />;
        })}
      </div>
    );
  },
};
