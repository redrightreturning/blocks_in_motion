'use client'
import { useState } from "react";
import { Array3D } from "./helpers/array3D";
import ThreeCanvas from "./components/threeCanvas";
import { IndexType } from "./types/indexType.interface";

export default function Home() {
  const gridSize = 5
  const [grid, setGrid] = useState(Array3D.newArray(gridSize, false))

  const toggleBox = (index : IndexType) => {
    //Set grid, only updating the values that have changed
    console.log("Toggling box at index:", index)
    setGrid(prevGrid => Array3D.updateIndex(index, prevGrid))
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-1/2 h-1/2 border-4 border-black">
        <ThreeCanvas grid={grid} boxToggle={toggleBox}/>
      </div>
    </div>
  );
}
