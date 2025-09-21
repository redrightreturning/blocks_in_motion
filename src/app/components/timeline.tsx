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
        <div className="w-full mt-4 flex flex-row overflow-x-auto gap-4">
            {
                gridsState.grids.map((_, index) => (
                    <div className={`w-20 h-20 cursor-pointer border-2 ${(index === gridsState.selectedGridIndex)? "border-yellow-300" : "border-black" } rounded-lg flex-shrink-0 overflow-hidden`} key={index}>
                        <ThreeCanvas editable={false} gridIndex={index} onClick={()=>{gridsDispatch({type: 'setSelected', id: index})}}/>
                    </div>
                ))
            }
            <div className="h-full flex flex-col justify-around items-center">
                <Button onClick={()=>{gridsDispatch({type:"add"})}}> + </Button>
                <Button onClick={()=>{gridsDispatch({type:"duplicate"})}}> [+] </Button>
            </div>
        </div>
    )
}