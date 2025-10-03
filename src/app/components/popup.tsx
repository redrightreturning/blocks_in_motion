import { ReactNode } from "react";
import Icon from "./ui/icon";

export function PopUp({title, onClose, children} : {title? : string, onClose : ()=>void, children : ReactNode}){

    return(
        <div className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-background p-3 rounded-xl shadow-xl max-w-md w-full">
                <div className="flex flex-row justify-between items-center mb-2">
                    <h2 className="font-bold text-white">{title? title : ""}</h2>
                    <button onClick={onClose}>
                        <Icon type="x"/>
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}