import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Box from "./box";
import { Array3D } from "../helpers/array3D";
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";
import NoisyBloomPass from "../helpers/noisyBloomPass";


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
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
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
            {gridsState.noiseOn? <NoisyBloomPass /> : <></>}
        </Canvas>
    )
}