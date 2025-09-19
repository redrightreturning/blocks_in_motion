import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";
import Button from "./button";
import ThreeCanvas from "./threeCanvas";

export default function Timeline() {
    
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error("useGridsState and useGridsDispatch must be used within a GridsProvider");
    }
    
    return(
        <div className="w-full h-30 mt-4">
            <div className="flex flex-row overflow-x-auto gap-4">
                {
                    gridsState.grids.map((_, index) => (
                        <div className="w-20 h-20 cursor-pointer border-2 border-black rounded-lg flex-shrink-0 overflow-hidden" key={index}>
                            <ThreeCanvas editable={false} gridIndex={index} onClick={()=>{gridsDispatch({type: 'setSelected', id: index})}}/>
                        </div>
                    ))
                }
            </div>
            <Button onClick={()=>{gridsDispatch({type:"add"})}}> + </Button>
        </div>
    )
}