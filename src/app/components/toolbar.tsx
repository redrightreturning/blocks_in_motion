'use client'
import { useState } from "react";
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";
import Button from "./ui/button";
import Icon from "./ui/uiIcon";
import { Playback } from "./playback";
import { PopUp } from "./popup";
import { ProjectSettings } from "./projectSettings";
import { Pagination } from "./pagination";
import { HelpPageOne, HelpPageTwo } from "./helpPages";
import { downloadDataURL, renderGif } from "../helpers/renderer";

export default function Toolbar() {

    const [showSettings, setShowSettings] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    return (
        <div className="w-full my-2 flex flex-wrap sm:flex-row justify-center items-center gap-4">
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
                    <ProjectSettings/>
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