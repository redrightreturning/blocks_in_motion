'use client'
import React, { createContext, useContext, useReducer, ReactNode  } from 'react';
import { Array3D, Array3DType } from './array3D';
import { IndexType } from '../types/indexType.interface';
import { GridModeType } from '../types/gridTypes.interface';
import { persistReducer } from './saveState';

const GRID_SIZE = 5
const GridsContext = createContext<GridsStateType | undefined>(undefined)
const GridsDispatchContext = createContext<React.Dispatch<GridsActionType> | undefined>(undefined)
const GRID_STORAGE_KEY = "gridState"
const emptyGrid = ()=>[Array3D.newArray(GRID_SIZE, false)]

const gridStateInit = (storageKey : string)=>{
  const defaultState = {
        grids: emptyGrid(), 
        selectedGridIndex: 0,
        gridSize: GRID_SIZE,
        noiseOn: false,
        onionOn: false,
        playing: false,
        mode: "bottomUp",
    }
  try{
    const existing = localStorage.getItem(storageKey)
    const newState = existing? JSON.parse(existing) : defaultState
    return newState
  }catch (err){
    console.error("Failed to get init state: ", err);
    return defaultState
  }
}

export type GridsActionType =
//Grid actions
  | { type: "add"; id: number }
  | { type: "duplicate"; id: number }
  | { type: "update"; index: IndexType}
  | { type: "remove"; id: number }
  | { type: "reset"}
  //Grid settings actions
  | { type: "setSelected"; id: number }
  | { type: "setGridSize"; size: number }
  | { type: "setGridMode"; gridType: GridModeType }
  | { type: "setOnion"; on: boolean }
  | { type: "setNoise"; on: boolean }
  | { type: "setPlaying"; on: boolean }

  export type GridsStateType = {
    grids: Array3DType[]
    selectedGridIndex: number
    mode: GridModeType
    gridSize: number
    noiseOn: boolean
    onionOn: boolean
    playing: boolean
  }

export function useGridsState() {
  return useContext(GridsContext);
}

export function useGridsDispatch() {
  return useContext(GridsDispatchContext);
}

export function GridsProvider({ children }: { children: ReactNode }) {
  
  const [state, dispatch] = useReducer(persistReducer(gridsReducer, GRID_STORAGE_KEY), gridStateInit(GRID_STORAGE_KEY));

  return (
    <GridsContext.Provider value={state}>
      <GridsDispatchContext.Provider value={dispatch}>
        {children}
      </GridsDispatchContext.Provider>
    </GridsContext.Provider>
  );
}


function gridsReducer(state: GridsStateType, action: GridsActionType): GridsStateType {
  switch (action.type) {
    case 'add': {

      const index = action.id !== undefined? action.id + 1: state.grids.length-1

      return {
        ...state,
        grids: [...state.grids.slice(0, index),
                Array3D.newArray(state.gridSize, false),
                ...state.grids.slice(index),],
        selectedGridIndex: index,
      };
    }
    case 'duplicate': {
      return {
        ...state,
        grids: [...state.grids.slice(0, action.id ?? state.grids.length-1),
                Array3D.newFromArray(state.grids[action.id ?? state.selectedGridIndex]),
                ...state.grids.slice(action.id ?? state.grids.length-1),],
        selectedGridIndex: action.id?  action.id + 1 : state.grids.length,      
      };
    }
    case 'update': {
      return {
        ...state,
        grids: state.grids.map((grid, i) =>
          i === state.selectedGridIndex ? Array3D.updateIndex(action.index, grid) : grid
        ),
      };
    }
    case 'remove': {
      return {
        ...state,
        grids: state.grids.filter((_, i) => i !== action.id),
        selectedGridIndex:
          state.selectedGridIndex >= state.grids.length - 1
            ? state.selectedGridIndex - 1
            : state.selectedGridIndex,
      };
    }
    case 'reset': {
      return {
        ...state,
        grids: emptyGrid(), 
        selectedGridIndex: 0, 
        gridSize: GRID_SIZE,
      };
    }
    case 'setSelected': {
      return { ...state, selectedGridIndex: action.id, gridSize: state.gridSize };
    }
    case 'setGridSize': {
      //TODO: Resize grids to new size. Currently does nothing
      return { ...state, gridSize: action.size, grids: state.grids, selectedGridIndex: 0 };
    }
    case 'setGridMode': {
      return { ...state, mode: action.gridType };
    }
    case 'setNoise': {
      return { ...state, noiseOn: action.on };
    }
    case 'setOnion': {
      return { ...state, onionOn: action.on };
    }
    case 'setPlaying': {
      return { ...state, playing: action.on };
    }
    default: {
      throw Error('Unknown action! How did we get here?');
    }
  }
}