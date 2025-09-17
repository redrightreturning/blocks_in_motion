'use client'
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import Box from "./box";
import { useState } from "react";
import { IndexType } from "../types/indexType.interface";


export default function ThreeCanvas() {

    const gridSize = 5
    const [grid, setGrid] = useState(
        Array.from({ length: gridSize }, () =>
            Array.from({ length: gridSize }, () =>
            Array.from({ length: gridSize }, () => false)
            )
        )
    )

    const toggleBox = (index: IndexType) => {
        //Set grid, only updating the values that have changed
        setGrid(prevGrid =>
            prevGrid.map((xArray, x) =>
            x === index.x
                ? xArray.map((yArray: boolean[], y: number) =>
                    y === index.y
                    ? yArray.map((val, z) => z === index.z ? !val : val)
                    : yArray
                )
                : xArray
            )
        )
    }

    return (
        <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            {
                grid.map((x, xIndex) => (
                    x.map((y: boolean[], yIndex: number) => (
                        y.map((boxValue: boolean, zIndex: number) => (
                            <Box key={`${xIndex}, ${yIndex}, ${zIndex}`} 
                            position={[xIndex - (gridSize / 2), yIndex - (gridSize / 2), 0]}
                            index={{x: xIndex, y: yIndex, z: zIndex}}
                            rendered={boxValue}
                            setRendered={toggleBox}/>
                        ))
                    ))
                ))
            
            }
        </Canvas>
    )
}