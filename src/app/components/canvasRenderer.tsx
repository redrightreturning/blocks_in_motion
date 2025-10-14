import { invalidate, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { downloadDataURL, renderFrame } from "../helpers/renderer";
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";


export function CanvasRenderer({gridIndex} : {gridIndex: number}) {
    
    const { gl } = useThree()
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    useEffect(() => {

        invalidate()

        requestAnimationFrame(() => {
            renderFrame(gl, (dataURL: string) => {
                gridsDispatch({ type: "setGridImage", id: gridIndex, imageString: dataURL });
            })
        })
    },
    [gl, gridIndex, gridsState.grids]);

    return null
}