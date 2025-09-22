import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Box from "./box";
import { Array3D } from "../helpers/array3D";
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";



export default function ThreeCanvas({ editable, gridIndex, onClick} : { editable : boolean, gridIndex: number, onClick?: () => void}) {

    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error("useGridsState and useGridsDispatch must be used within a GridsProvider");
    }
    const grid = gridsState.grids[gridIndex]
    const gridSize = gridsState.gridSize
    const canEdit = editable && !gridsState.playing

    return (
        <Canvas onClick={onClick} className="bg-canvas-background cursor-pointer" camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[0, 10, 10]} angle={0.5} penumbra={1} decay={0} intensity={1} />
            <spotLight position={[0, -10, -10]} angle={0.5} penumbra={1} decay={0} intensity={0.8} />
            {
                grid.map((x, xIndex) => (
                    x.map((y: boolean[], yIndex: number) => (
                        y.map((boxValue: boolean, zIndex: number) => (
                            <Box key={`${xIndex}, ${yIndex}, ${zIndex}`} 
                            position={[xIndex - (gridSize / 2), yIndex - (gridSize / 2), zIndex - (gridSize / 2)]}
                            index={{x: xIndex, y: yIndex, z: zIndex, grid: gridIndex}}
                            rendered={boxValue}
                            isClickable={canEdit? Array3D.isClickable({x: xIndex, y: yIndex, z: zIndex, grid: gridIndex}, grid) : false}/>
                        ))
                    ))
                ))
            
            }
            {editable? <OrbitControls /> : <></>}
            {gridsState.noiseOn? 
            <EffectComposer>
                <Noise
                    premultiply // enables or disables noise premultiplication
                    blendFunction={BlendFunction.ADD} // blend mode
                />
                <Bloom mipmapBlur luminanceThreshold={1} />
                <Vignette
    offset={0.5} // vignette offset
    darkness={0.5} // vignette darkness
    eskil={false} // Eskil's vignette technique
    blendFunction={BlendFunction.NORMAL} // blend mode
  />
            </EffectComposer>
            : <></>}
        </Canvas>
    )
}