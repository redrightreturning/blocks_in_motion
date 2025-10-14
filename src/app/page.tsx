'use client'
import { CanvasRenderer } from "./components/canvasRenderer";
import ThreeCanvas from "./components/threeCanvas";
import Timeline from "./components/timeline";
import Toolbar from "./components/toolbar";
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
      <div className="mx-10 w-full px-2 sm:px-0 sm:w-3/4 md:w-1/2 h-screen flex flex-col justify-center items-center">
        <div className="w-full h-1/2 border-4 border-black rounded-lg overflow-hidden">
          <ThreeCanvas editable={true} gridIndex={gridsState.selectedGridIndex}/>
        </div>
        <Toolbar/>
        <Timeline/>
        {/* Invisible canvas for rendering frames */}
        <div className='invisible absolute w-screen h-screen'>
          <ThreeCanvas editable={false} gridIndex={gridsState.selectedGridIndex}>
            <CanvasRenderer gridIndex={gridsState.selectedGridIndex}/>
          </ThreeCanvas>
        </div>
      </div>
    </div>
  );
}
