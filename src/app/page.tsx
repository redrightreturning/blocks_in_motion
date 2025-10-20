'use client'
import { CanvasRenderer } from "./components/canvasRenderer";
import Logo from "./components/logo";
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
    <div className="font-inter w-full h-screen min-h-[100dvh] flex flex-col justify-stretch items-center p-4">
        <div className="sm:hidden flex flex-row justify-center items-center">
          <Logo/>
        </div>

        <div className="flex flex-row justify-stretch items-center w-full flex-grow gap-4 min-h-0">
          <div className="h-full hidden sm:block">
            <Toolbar/>
          </div>
          <div className="w-full h-full border-4 border-black rounded-lg overflow-hidden flex-grow">
            <ThreeCanvas editable={true} gridIndex={gridsState.selectedGridIndex}/>
          </div>
        </div>

        <div className="w-full flex-shrink block sm:hidden">
          <Toolbar />
        </div>
        
        <Timeline/>
        {/* Invisible canvas for rendering frames */}
        <div className='invisible absolute top-0 left-0 pointer-events-none w-0 h-0 overflow-hidden'>
          <div className="w-screen aspect-square">
            <ThreeCanvas editable={false} gridIndex={gridsState.selectedGridIndex}>
              <CanvasRenderer gridIndex={gridsState.selectedGridIndex}/>
            </ThreeCanvas>
          </div>
        </div>
      </div>
  );
}
