import { Config, Content, Data } from "../types";
import { reorder } from "../lib/reorder";
import { rootDroppableId } from "../lib/root-droppable-id";
import { insert } from "../lib/insert";
import { remove } from "../lib/remove";
import { setupZone } from "../lib/setup-zone";
import { replace } from "../lib/replace";
import { getItem } from "../lib/get-item";
import {
  duplicateRelatedZones,
  removeRelatedZones,
} from "../lib/reduce-related-zones";
import { generateId } from "../lib/generate-id";
import { InsertAction, PuckAction, ReplaceAction } from "./actions";

// Restore unregistered zones when re-registering in same session
export const zoneCache: Record<string, Content> = {};

export const addToZoneCache = (key: string, data: Content) => {
  zoneCache[key] = data;
};

export const replaceAction = <UserData extends Data>(
  data: UserData,
  action: ReplaceAction
) => {
  if (action.destinationZone === rootDroppableId) {
    return {
      ...data,
      content: replace(data.content, action.destinationIndex, action.data),
    };
  }

  const newData = setupZone(data, action.destinationZone);

  return {
    ...newData,
    zones: {
      ...newData.zones,
      [action.destinationZone]: replace(
        newData.zones[action.destinationZone],
        action.destinationIndex,
        action.data
      ),
    },
  };
};

// reducer.ts (insertAction helper)
export function insertAction<UserData extends Data>(
  data: UserData,
  action: InsertAction,
  config: Config
) {
  const emptyComponentData = {
    type: action.componentType,
    props: {
      ...(config.components[action.componentType]?.defaultProps || {}),
      id: action.id || generateId(action.componentType),
      ...(action.props || {}), // merge passed props
    },
  };

  if (action.destinationZone === rootDroppableId) {
    return {
      ...data,
      content: insert(data.content, action.destinationIndex, emptyComponentData),
    };
  }

  const newData = setupZone(data, action.destinationZone);
  return {
    ...data,
    zones: {
      ...newData.zones,
      [action.destinationZone]: insert(
        newData.zones[action.destinationZone],
        action.destinationIndex,
        emptyComponentData
      ),
    },
  };
}


export function reduceData<UserData extends Data>(
  data: UserData,
  action: PuckAction,
  config: Config
): UserData {
  if (action.type === "insert") {
    return insertAction(data, action, config);
  }

  if (action.type === "loadLayout") {
    const { content, zones = {}, destination } = action.data;
  
    // If no destination or content is not an array, just replace the entire content
    if (!Array.isArray(content) || typeof destination !== "number") {
      return {
        ...data,
        content: content || [],
        zones,
      };
    }
  
    // Defensive: prevent mutating original data
    const currentContent = Array.isArray(data.content) ? [...data.content] : [];
  
    // Insert the new content at the specified index (assuming content is array of items to insert)
    const updatedContent = [
      ...currentContent.slice(0, destination),
      ...content,
      ...currentContent.slice(destination),
    ];
  
    return {
      ...data,
      content: updatedContent,
      zones,
    };
  }
  

  

  if (action.type === "duplicate") {
    const item = getItem(
      { index: action.sourceIndex, zone: action.sourceZone },
      data
    )!;

    const newItem = {
      ...item,
      props: {
        ...item.props,
        id: generateId(item.type),
      },
    };

    const dataWithRelatedDuplicated = duplicateRelatedZones<UserData>(
      item,
      data,
      newItem.props.id
    );

    if (action.sourceZone === rootDroppableId) {
      return {
        ...dataWithRelatedDuplicated,
        content: insert(data.content, action.sourceIndex + 1, newItem),
      };
    }

    return {
      ...dataWithRelatedDuplicated,
      zones: {
        ...dataWithRelatedDuplicated.zones,
        [action.sourceZone]: insert(
          dataWithRelatedDuplicated.zones![action.sourceZone],
          action.sourceIndex + 1,
          newItem
        ),
      },
    };
  }

  if (action.type === "reorder") {
    if (action.destinationZone === rootDroppableId) {
      return {
        ...data,
        content: reorder(
          data.content,
          action.sourceIndex,
          action.destinationIndex
        ),
      };
    }

    const newData = setupZone(data, action.destinationZone);

    return {
      ...data,
      zones: {
        ...newData.zones,
        [action.destinationZone]: reorder(
          newData.zones[action.destinationZone],
          action.sourceIndex,
          action.destinationIndex
        ),
      },
    };
  }

  if (action.type === "move") {
    const newData = setupZone(
      setupZone(data, action.sourceZone),
      action.destinationZone
    );

    const item = getItem(
      { zone: action.sourceZone, index: action.sourceIndex },
      newData
    );

    if (action.sourceZone === rootDroppableId) {
      return {
        ...newData,
        content: remove(newData.content, action.sourceIndex),
        zones: {
          ...newData.zones,

          [action.destinationZone]: insert(
            newData.zones[action.destinationZone],
            action.destinationIndex,
            item
          ),
        },
      };
    }

    if (action.destinationZone === rootDroppableId) {
      return {
        ...newData,
        content: insert(newData.content, action.destinationIndex, item),
        zones: {
          ...newData.zones,
          [action.sourceZone]: remove(
            newData.zones[action.sourceZone],
            action.sourceIndex
          ),
        },
      };
    }

    return {
      ...newData,
      zones: {
        ...newData.zones,
        [action.sourceZone]: remove(
          newData.zones[action.sourceZone],
          action.sourceIndex
        ),
        [action.destinationZone]: insert(
          newData.zones[action.destinationZone],
          action.destinationIndex,
          item
        ),
      },
    };
  }

  if (action.type === "replace") {
    return replaceAction(data, action);
  }

  if (action.type === "remove") {
    const item = getItem({ index: action.index, zone: action.zone }, data)!;

    // Remove any related zones
    const dataWithRelatedRemoved = setupZone(
      removeRelatedZones(item, data),
      action.zone
    );

    if (action.zone === rootDroppableId) {
      return {
        ...dataWithRelatedRemoved,
        content: remove(data.content, action.index),
      };
    }

    return {
      ...dataWithRelatedRemoved,
      zones: {
        ...dataWithRelatedRemoved.zones,
        [action.zone]: remove(
          dataWithRelatedRemoved.zones[action.zone],
          action.index
        ),
      },
    };
  }

  if (action.type === "registerZone") {
    if (zoneCache[action.zone]) {
      return {
        ...data,
        zones: {
          ...data.zones,
          [action.zone]: zoneCache[action.zone],
        },
      };
    }

    return setupZone(data, action.zone);
  }

  if (action.type === "unregisterZone") {
    const _zones = { ...(data.zones || {}) };

    if (_zones[action.zone]) {
      zoneCache[action.zone] = _zones[action.zone];

      delete _zones[action.zone];
    }

    return { ...data, zones: _zones };
  }

  if (action.type === "setData") {
    if (typeof action.data === "object") {
      return {
        ...data,
        ...action.data,
      };
    }

    return { ...data, ...action.data(data) };
  }

  return data;
}
