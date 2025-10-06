import { ReactNode } from "react";
import Icon from "./ui/uiIcon";

export function PopUp({title, showCancel, clickBgToClose, onClose, children} : {title? : string, showCancel : boolean, clickBgToClose : boolean, onClose : ()=>void, children : ReactNode}){

    return(
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50" onClick={()=>{
            if(clickBgToClose){onClose()}
        }}>
            <div className="bg-background p-3 rounded-xl shadow-xl max-w-md w-full" onClick={(event)=>{event.stopPropagation()}}>
                {showCancel && <div className="flex flex-row justify-between items-center mb-2">
                    <h2 className="font-bold text-white">{title? title : ""}</h2>
                    <button onClick={onClose}>
                        <Icon type="x"/>
                    </button>
                </div>}
                {children}
            </div>
        </div>
    )
}