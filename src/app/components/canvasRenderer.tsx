import { invalidate, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { renderFrame } from "../helpers/renderer";
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";


export function CanvasRenderer({gridIndex} : {gridIndex: number}) {
    
    const { gl, scene, camera } = useThree()
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    useEffect(() => {
        //Don't run while playing
        if(gridsState.playing === true) return

        invalidate()

        requestAnimationFrame(() => {
            //Clear and rerender scene
            gl.autoClear = true;
            gl.clear(true, true, true)

            gl.render(scene, camera);

            renderFrame(gl, (dataURL: string) => {
                gridsDispatch({ type: "setGridImage", id: gridIndex, imageString: dataURL });
            })
        })
    },
    [gl, camera, scene, gridIndex, gridsState.grids, gridsDispatch, gridsState.playing]);

    return null
}