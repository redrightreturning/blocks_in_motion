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
import { downloadDataURL, renderGif } from "../helpers/renderer";
import Logo from "./logo";
import { WalkthroughPageOne, WalkthroughPageThree, WalkthroughPageTwo } from "./walkthrough";

export default function Toolbar() {

    const [showSettings, setShowSettings] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    return (
        <div className="w-full h-full flex flex-col justify-start items-center min-h-0">
            <div className="hidden sm:block -mb-6 font-bold text-white group transition-duration-400 relative">
                <div className="z-10 relative group-hover:opacity-0 transition-opacity ">
                    <Logo/>
                </div>
                <h2 className="opacity-0 group-hover:opacity-100 -mt-4 text-sm">Boxes in Motion</h2>
                <Image className="opacity-0 group-hover:opacity-100 transition-opacity absolute left-0 top-0 z-0" 
                priority={true}  alt="Yellow animated boxes" src="/Boxes_in_Motion.gif" width="200" height="200" />
            </div>
            <div className="flex flex-grow py-2 sm:py-0 flex-row sm:flex-col flex-wrap justify-center items-center 
                gap-2 sm:gap-4 w-full overflow-auto">
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
                            {buttonLabel : "Next", node: <WalkthroughPageOne/>},
                            {buttonLabel : "Next", node: <WalkthroughPageTwo/>},
                            {buttonLabel : "Done", node: <WalkthroughPageThree/>}
                        ]} closeHandler={()=>{
                            setShowHelp(false)
                        }}/>
                    </PopUp>}
            </div>
        </div>
    )
}