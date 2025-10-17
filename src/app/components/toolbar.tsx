'use client'
import { useState } from "react";
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";
import Button from "./ui/button";
import Icon from "./ui/uiIcon";
import Image from "next/image";
import { Playback } from "./playback";
import { PopUp } from "./popup";
import { ProjectSettings } from "./projectSettings";
import { Pagination } from "./pagination";
import { HelpPageOne, HelpPageTwo } from "./helpPages";
import { downloadDataURL, renderGif } from "../helpers/renderer";
import Logo from "./logo";

export default function Toolbar() {

    const [showSettings, setShowSettings] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    return (
        <div className="flex py-2 sm:py-0 flex-row sm:flex-col justify-center items-center gap-2 sm:gap-4 relative h-full w-full sm:w-20">
            <div className="hidden sm:block absolute top-0 left-2 font-bold text-white group transition-duration-400">
                <div className="z-10 relative group-hover:opacity-0 transition-opacity ">
                    <Logo/>
                </div>
                <h2 className="opacity-0 group-hover:opacity-100 -mt-4 text-sm">Boxes in Motion</h2>
                <Image className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 top-0 z-0" 
                priority={true}  alt="Yellow animated boxes" src="/Boxes_in_Motion.gif" width="200" height="200" />
            </div>
            
            <Playback/>

            <div className="h-auto">
                <Button onClick={()=>{
                    renderGif(gridsState.gridImages, (dataURL : string)=>{
                        downloadDataURL(dataURL, "Boxes_in_Motion.gif")
                    })
                }}>
                    <Icon type="download" />
                </Button>
            </div>

            <div className="h-auto">
                <Button onClick={()=>{
                    setShowSettings(true)
                }}>
                    <Icon type="settings"/>
                </Button>
            </div>

            <div className="h-auto">
                <Button onClick={()=>{
                    setShowHelp(true)
                }}>
                    <Icon type="help"/>
                </Button>
            </div>

            {showSettings && <PopUp title="Project Settings" showCancel={true}  clickBgToClose={true}  onClose={()=>{
                    setShowSettings(false)
                }}>
                    <ProjectSettings closeCallback={()=>{
                        setShowSettings(false)
                    }}/>
                </PopUp>}

            {showHelp && <PopUp showCancel={false} clickBgToClose={true} onClose={()=>{
                    setShowHelp(false)
                }}>
                    <Pagination pages={[
                        {buttonLabel : "Next", node: <HelpPageOne/>},
                        {buttonLabel : "Done", node: <HelpPageTwo/>}
                    ]} closeHandler={()=>{
                        setShowHelp(false)
                    }}/>
                </PopUp>}
        </div>
    )
}