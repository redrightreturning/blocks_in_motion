import { useState } from "react";
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";

export default function TimelineBox({index}: {index: number}) {
    
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className={`relative w-20 h-20 cursor-pointer border-2 ${(index === gridsState.selectedGridIndex)? "border-yellow-300" : "border-black" } rounded-lg flex-shrink-0 overflow-hidden`} 
        key={index} onClick={()=>{
                    gridsDispatch({type: 'setSelected', id: index})}}>
            <div className="absolute group z-30 right-1 -top-1">
                <button onClick={(e)=>{
                    e.stopPropagation()
                    setIsMenuOpen((prev) => !prev)
                }}>...</button>
                <div className={`
                    ${isMenuOpen ? "block" : "hidden"}
                    group-hover:block text-right absolute text-white text-xs p-1 rounded-b-lg right-0`}>
                    <button onClick={(e)=>{
                        e.stopPropagation()
                        gridsDispatch({type:"add", id: index})
                        setIsMenuOpen(false)
                    }}>add</button>
                    <button onClick={(e)=>{
                        e.stopPropagation()
                        gridsDispatch({type:"duplicate", id: index})
                        setIsMenuOpen(false)
                    }}>duplicate</button>
                    <button className={`${gridsState.grids.length === 1? "invisible" : "visible"}`} onClick={(e)=>{
                        e.stopPropagation()
                        gridsDispatch({type:"remove", id: index})
                        setIsMenuOpen(false)    
                    }}>delete</button>
                </div>
            </div>
            { 
                typeof gridsState.gridImages[index] === "string" &&
                gridsState.gridImages[index].length > 0 ? 
                // eslint-disable-next-line @next/next/no-img-element
                <img className="h-full w-full object-contain" src={gridsState.gridImages[index]} alt={`Grid ${index}`}/> 
                : null
            }
            
        </div>
    )
}