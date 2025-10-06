import { ReactNode, useState } from "react";
import Icon from "./ui/uiIcon";
import Button from "./ui/button";

export function Pagination({pages, closeHandler} : {pages: {buttonLabel: string, node : ReactNode}[], closeHandler : ()=>void}){

    const [pageIndex, setPageIndex] = useState(0)

    const changePage = (direction : "left" | "right")=>{
        if(direction === "left"){
            setPageIndex(prev=>{
                return Math.max(0, prev-1)
            })
        }else{
            setPageIndex(prev=>{
                return Math.min(pages.length -1, prev+1)
            })
        }
    }

    return(
        <div className="flex flex-col justify-center items-stretch gap-4 relative">
            <div className="flex flex-row justify-between items-center">
                <button className={`${(pageIndex !==0)? "visible" : "invisible"}`} onClick={()=>{
                    changePage("left")
                }}><Icon type="left" /></button>
                {pages[pageIndex].node}
            
                <button className={`${(pageIndex !== pages.length - 1)? "visible" : "invisible"}`} onClick={()=>{
                    changePage("right")
                }}><Icon type="right" /></button>
            </div>
            <div className="flex flex-row gap-2 bottom-2 absolute left-1/2 -translate-x-1/2">
                {pages.map((_, i)=> //Dots
                    <div key={i} className={`w-1 h-1 rounded-lg ${i === pageIndex ? "bg-white" : "bg-canvas-background"}`}/>
                )}
            </div>
            <div className="flex flex-row justify-end items-center">
                <Button onClick={()=>{
                    if(pageIndex !== pages.length - 1){
                        changePage("right")
                    }else{
                        closeHandler()
                    }
                }}>
                    {pages[pageIndex].buttonLabel}
                </Button>
            </div>
        </div>
    )
}