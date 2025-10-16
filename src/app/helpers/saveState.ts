import { GridsActionType, GridsStateType } from "./gridsContext";

export function persistReducer(
  reducer: (state: GridsStateType, action: GridsActionType) => GridsStateType,
  storageKey: string
) {
  return (state: GridsStateType, action: GridsActionType): GridsStateType => {
    const newState = reducer(state, action)
    //Only update if not the indexing (temp) actions
    if(action.type !== "setSelected" 
      && action.type !== "setForward" 
      && action.type !== "setBackward"
      && action.type !== "setPlaying"){
      try {
        localStorage.setItem(storageKey, JSON.stringify(newState ?? {}))
      } catch (err) {
        console.error("Failed to persist state", err)
      }
    }

    return newState;
  }
}

