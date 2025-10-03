'use client'
import { useState } from "react";
import { useGridsDispatch, useGridsState } from "../helpers/gridsContext";
import Button from "./ui/button";
import Icon from "./ui/uiIcon";
import { Playback } from "./playback";
import { PopUp } from "./popup";
import { ProjectSettings } from "./projectSettings";

export default function Toolbar() {

    const [showSettings, setShowSettings] = useState(false)
    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
    }

    return (
        <div className="w-full my-2 flex flex-row justify-center items-center gap-4">
            <Playback/>
            <Button onClick={()=>{
                gridsDispatch({type:'render'})
            }}>
                <Icon type="download" />
            </Button>
            <Button onClick={()=>{
                setShowSettings(true)
            }}>
                <Icon type="settings"/>
            </Button>

            {showSettings && <PopUp title="Project Settings" onClose={()=>{
                    setShowSettings(false)
                }}>
                    <ProjectSettings/>
                </PopUp>}
        </div>
    )
}