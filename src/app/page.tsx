'use client'
import { Playback } from "./components/playback";
import ThreeCanvas from "./components/threeCanvas";
import Timeline from "./components/timeline";
import { useGridsDispatch, useGridsState } from "./helpers/gridsContext";

export default function Home() {

  const gridsState = useGridsState()
  const gridsDispatch = useGridsDispatch()
  if (!gridsState || !gridsDispatch) {
    throw new Error("useGridsState and useGridsDispatch must be used within a GridsProvider");
  }

  return (
    <div className="font-inter w-full h-screen flex flex-col justify-center items-center">
      <div className="w-1/2 h-screen flex flex-col justify-center items-center">
        <div className="w-full h-1/2 border-4 border-black rounded-lg overflow-hidden">
          <ThreeCanvas editable={true} gridIndex={gridsState.selectedGridIndex}/>
        </div>
        <Playback/>
        <Timeline/>
      </div>
     
    </div>
  );
}
