import React, { useEffect } from "react"
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";

export function Playback(){

    const FPS = 12
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    useEffect(() => {
        let animationFrameId : number
        let lastTime = performance.now()
        const frameDuration = 1000 / FPS

        const animate = (time : number) => {
            if (gridsState.playing) {
                const delta = time - lastTime
                if (delta >= frameDuration) {
                    gridsDispatch({
                        type: "setSelected",
                        id: (gridsState.selectedGridIndex + 1) % gridsState.grids.length,
                    })
                    lastTime = time
                }
                animationFrameId = requestAnimationFrame(animate)
            }
        }

        if (gridsState.playing) {
            animationFrameId = requestAnimationFrame(animate);
        }

        return () => cancelAnimationFrame(animationFrameId);
    })

    return (
            <button className="font-bold" onClick={()=>{
                gridsDispatch({type: 'setPlaying', on: !gridsState.playing})
            }
                }>{gridsState.playing? '[]' : '>'}</button>
    )
}