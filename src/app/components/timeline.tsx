import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";
import Button from "./button";
import ThreeCanvas from "./threeCanvas";
import TimelineBox from "./timelineBox";

export default function Timeline() {
    
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error("useGridsState and useGridsDispatch must be used within a GridsProvider");
    }
    
    return(
        <div className="w-full mt-4 flex flex-row overflow-x-auto gap-4">
            {
                gridsState.grids.map((_, index) => (
                    <TimelineBox index={index} key={index}/>
                ))
            }
            <div className="h-full flex flex-col justify-around items-center">
                <Button onClick={()=>{gridsDispatch({type:"add", id: gridsState.grids.length - 1})}}> + </Button>
            </div>
        </div>
    )
}