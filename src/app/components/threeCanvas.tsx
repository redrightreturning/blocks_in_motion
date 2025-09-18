'use client'
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Box from "./box";
import { useState } from "react";
import { IndexType } from "../types/indexType.interface";
import { Array3D, Array3DType } from "../helpers/array3D";


export default function ThreeCanvas({grid, boxToggle} : {grid : Array3DType, boxToggle: (index: IndexType) => void}) {

    const gridSize = grid.length

    return (
        <Canvas className="bg-canvas-background" camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            {
                grid.map((x, xIndex) => (
                    x.map((y: boolean[], yIndex: number) => (
                        y.map((boxValue: boolean, zIndex: number) => (
                            <Box key={`${xIndex}, ${yIndex}, ${zIndex}`} 
                            position={[xIndex - (gridSize / 2), yIndex - (gridSize / 2), zIndex - (gridSize / 2)]}
                            index={{x: xIndex, y: yIndex, z: zIndex}}
                            rendered={boxValue}
                            setRendered={boxToggle}/>
                        ))
                    ))
                ))
            
            }
            <OrbitControls/>
        </Canvas>
    )
}