'use client'
import React, { createContext, useContext, useReducer, ReactNode  } from 'react';
import { Array3D, Array3DType } from './array3D';
import { IndexType } from '../types/indexType.interface';

const GRID_SIZE = 5
const GridsContext = createContext<GridsState | undefined>(undefined)
const GridsDispatchContext = createContext<React.Dispatch<GridsActionType> | undefined>(undefined)
const firstGrid = [Array3D.newArray(GRID_SIZE, false)]

type GridsActionType =
//Grid actions
  | { type: "add"; id: number }
  | { type: "duplicate"; id: number }
  | { type: "update"; index: IndexType}
  | { type: "remove"; id: number }
  | { type: "reset"}
  //Grid settings actions
  | { type: "setSelected"; id: number }
  | { type: "setGridSize"; id: number }
  | { type: "setNoise"; on: boolean }

  type GridsState = {
    grids: Array3DType[]
    selectedGridIndex: number
    gridSize: number
    noiseOn: boolean
  }

export function GridsProvider({ children }: { children: ReactNode }) {
  
  const [state, dispatch] = useReducer(gridsReducer, {
    grids: firstGrid, 
    selectedGridIndex: 0,
    gridSize: GRID_SIZE,
    noiseOn: false
  });

  return (
    <GridsContext.Provider value={state}>
      <GridsDispatchContext.Provider value={dispatch}>
        {children}
      </GridsDispatchContext.Provider>
    </GridsContext.Provider>
  );
}

export function useGridsState() {
  return useContext(GridsContext);
}

export function useGridsDispatch() {
  return useContext(GridsDispatchContext);
}

function gridsReducer(state: GridsState, action: GridsActionType): GridsState {
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
        grids: firstGrid, 
        selectedGridIndex: 0, 
        gridSize: GRID_SIZE,
        noiseOn: false
      };
    }
    case 'setSelected': {
      return { ...state, selectedGridIndex: action.id, gridSize: state.gridSize };
    }
    case 'setGridSize': {
      return { ...state, gridSize: action.id, grids: state.grids.map(() => Array3D.newArray(action.id, false)), selectedGridIndex: 0 };
    }
    case 'setNoise': {
      return { ...state, noiseOn: action.on };
    }
    default: {
      throw Error('Unknown action! How did we get here?');
    }
  }
}