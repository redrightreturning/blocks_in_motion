import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";
import ThreeCanvas from "./threeCanvas"

export default function TimelineBox({index}: {index: number}) {
    
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    return (
        <div className={`relative w-20 h-20 cursor-pointer border-2 ${(index === gridsState.selectedGridIndex)? "border-yellow-300" : "border-black" } rounded-lg flex-shrink-0 overflow-hidden`} key={index}>
            <div className="absolute group z-30 right-1 -top-1">
                <button>...</button>
                <div className="hidden group-hover:block text-right absolute text-white text-xs p-1 rounded-b-lg right-0">
                    <button onClick={()=>{gridsDispatch({type:"add", id: index})}}>add</button>
                    <button onClick={()=>{gridsDispatch({type:"duplicate", id: index})}}>duplicate</button>
                    <button onClick={()=>{gridsDispatch({type:"remove", id: index})}}>delete</button>
                </div>
            </div>
            
            <ThreeCanvas editable={false} gridIndex={index} onClick={()=>{gridsDispatch({type: 'setSelected', id: index})}}/>
        </div>
    )
}