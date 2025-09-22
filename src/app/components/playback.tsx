import React, { useEffect } from "react"
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";

export function Playback(){

    const FPS = 12
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error("useGridsState and useGridsDispatch must be used within a GridsProvider");
    }

    useEffect(() => {
        if (gridsState.playing) {
            const interval = setInterval(() => {
                gridsDispatch({type: 'setSelected', id: (gridsState.selectedGridIndex + 1) % gridsState.grids.length})
            }, 1000/FPS);
            return () => clearInterval(interval);
        }
    })

    return (
        <div className="flex flex-row font-bold">
            <button onClick={()=>{
                gridsDispatch({type: 'setPlaying', on: !gridsState.playing})
            }
                }>{gridsState.playing? '[]' : '>'}</button>
        </div>
    )
}