import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";

export function ProjectSettings(){

    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    return(
        <div className="flex flex-col justify-start items-start gap-2">
            <span className="flex flex-row justify-center items-center gap-1">
                <label htmlFor="noise" className="pr-1 text-white">Noise?</label>
                <input type="checkbox" id="noise"
                    checked={gridsState.noiseOn}
                    onChange={()=>gridsDispatch({type: 'setNoise', on: !gridsState.noiseOn})}
                />
            </span>
            <span className="flex flex-row justify-center items-center gap-1">
                <label htmlFor="onion" className="pr-1 text-white">Onion?</label>
                <input type="checkbox" id="onion"
                    checked={gridsState.onionOn}
                    onChange={()=>gridsDispatch({type: 'setOnion', on: !gridsState.onionOn})}
                />
            </span>
        </div>
    )
}