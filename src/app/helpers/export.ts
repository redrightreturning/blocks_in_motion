import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import { useGridsDispatch } from './gridsContext';

type RenderCallbackType = (imageDataURL : string) => void

export function Renderer({callbackFn} : {callbackFn : RenderCallbackType}) {
    
    const gridsDispatch = useGridsDispatch()
    if (!gridsDispatch) {
    throw new Error(`useGridsDispatch must be used within a GridsProvider. Dispatch: ${gridsDispatch}`);
    }

    const { gl, scene, camera } = useThree(); // gl is the THREE.WebGLRenderer

    const renderFn = ()=>{
        
        const newRenderer = new THREE.WebGLRenderer()
        // Render a frame manually

        const size = new THREE.Vector2()
        gl.getSize(size)
        newRenderer.setSize(size.x, size.y, false)
        newRenderer.render(scene, camera)

        // Capture as image
        const dataURL = newRenderer.domElement.toDataURL('image/png')
        //TEMP: For debuging
        console.log(dataURL)

        callbackFn(dataURL)
    }

    useEffect(()=>{
        gridsDispatch({type:'addToRenderRegistry', fn: renderFn})
    }, [])

    return null
}


//Utility functions
export function downloadDataURL(dataURL: string, filename: string) {
  const a = document.createElement("a")
  a.href = dataURL
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function cloneCamera<T extends THREE.Camera>(camera: T): T {
  return camera.clone() as T
}