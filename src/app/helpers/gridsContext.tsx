'use client'
import React, { createContext, useContext, useReducer, ReactNode  } from 'react';
import { Array3D, Array3DType } from './array3D';
import { IndexType } from '../types/indexType.interface';

const GRID_SIZE = 5
const GridsContext = createContext<GridsState | undefined>(undefined)
const GridsDispatchContext = createContext<React.Dispatch<any> | undefined>(undefined)
const firstGrid = [Array3D.newArray(GRID_SIZE, false)]

type GridsActionType =
//Grid actions
  | { type: "add" }
  | { type: "update"; index: IndexType}
  | { type: "remove"; id: number }
  | { type: "reset"}
  //Grid settings actions
  | { type: "setSelected"; id: number }
  | { type: "setGridSize"; id: number }

  type GridsState = {
    grids: Array3DType[]
    selectedGridIndex: number
    gridSize: number
  }

export function GridsProvider({ children }: { children: ReactNode }) {
  
  const [state, dispatch] = useReducer(gridsReducer, {
    grids: firstGrid, 
    selectedGridIndex: 0,
    gridSize: GRID_SIZE
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
      return {
        ...state,
        grids: [...state.grids, Array3D.newArray(state.gridSize, false)],
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
      return { grids: firstGrid, selectedGridIndex: 0, gridSize: GRID_SIZE};
    }
    case 'setSelected': {
      return { ...state, selectedGridIndex: action.id, gridSize: state.gridSize };
    }
    default: {
      throw Error('Unknown action! How did we get here?');
    }
  }
}