// insert-component.ts
import { insertAction, InsertAction, PuckAction } from "../reducer";
import { AppState, Config } from "../types";
import { generateId } from "./generate-id";

export const insertComponent = (
  componentType: string,
  zone: string,
  index: number,
  {
    config,
    dispatch,
    resolveData,
    state,
  }: {
    config: Config;
    dispatch: (action: PuckAction) => void;
    resolveData: (newAppState: AppState) => void;
    state: AppState;
  },
  initialProps?: Record<string, any>
): string => {
  const id = generateId(componentType);

  const insertActionData: InsertAction = {
    type: "insert",
    componentType,
    destinationIndex: index,
    destinationZone: zone,
    id,
    props: initialProps, // pass initial props into the action
  };

  // Insert into the data
  const insertedData = insertAction(state.data, insertActionData, config);

  dispatch({ ...insertActionData, recordHistory: true });

  const itemSelector = { index, zone };
  dispatch({ type: "setUi", ui: { itemSelector } });

  resolveData({ data: insertedData, ui: { ...state.ui, itemSelector } });

  return id;
};
