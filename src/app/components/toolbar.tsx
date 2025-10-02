import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";
import { Playback } from "./playback";

export default function Toolbar() {

    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    return (
        <div className="w-full my-2 flex flex-row justify-start items-center gap-4">
            <Playback/>
            <span>
                <label htmlFor="noise" className="pr-1 text-white">Noise?</label>
                <input type="checkbox" id="noise"
                    checked={gridsState.noiseOn}
                    onChange={()=>gridsDispatch({type: 'setNoise', on: !gridsState.noiseOn})}
                />
            </span>
        </div>
    )
}