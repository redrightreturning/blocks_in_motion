import { ArrowDownOnSquareIcon } from "@heroicons/react/24/solid";
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";
import Button from "./button";
import { Playback } from "./playback";

export default function Toolbar() {

    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    return (
        <div className="w-full my-2 flex flex-row justify-center items-center gap-4">
            <Playback/>
            <Button onClick={()=>{
                gridsDispatch({type:'render'})
            }}>
                <ArrowDownOnSquareIcon className="w-5 h-5"/>
            </Button>
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