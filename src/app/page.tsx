'use client'
import { PopUp } from "./components/popup";
import ThreeCanvas from "./components/threeCanvas";
import Timeline from "./components/timeline";
import Toolbar from "./components/toolbar";
import { downloadDataURL, Renderer } from "./helpers/export";
import { useGridsDispatch, useGridsState } from "./helpers/gridsContext";

export default function Home() {

  const gridsState = useGridsState()
  const gridsDispatch = useGridsDispatch()
  if (!gridsState || !gridsDispatch) {
    throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
  }

  return (
    <div className="font-inter w-full h-screen flex flex-col justify-center items-center">
      <header className="flex flex-row justify-start items-center w-full pl-5 pt-5">
        <h1>Boxes in Motion</h1>
      </header>
      <div className="mx-10 w-full sm:w-1/2 h-screen flex flex-col justify-center items-center">
        <div className="w-full h-1/2 border-4 border-black rounded-lg overflow-hidden">
          <ThreeCanvas editable={true} gridIndex={gridsState.selectedGridIndex}>
            <Renderer callbackFn={(dataURL)=>{
              downloadDataURL(dataURL, "BoxesInMotion.png")
              
            }}/>
          </ThreeCanvas>
        </div>
        <Toolbar/>
        <Timeline/>
      </div>
    </div>
  );
}
