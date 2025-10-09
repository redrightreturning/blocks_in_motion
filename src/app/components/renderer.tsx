import { useThree, Size } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useGridsDispatch, useGridsState } from '../helpers/gridsContext';
import React from 'react';
import ThreeCanvas from './threeCanvas';
import GIF from 'gif.js.optimized';

export type RenderCallbackType = (gl : THREE.WebGLRenderer, scene : THREE.Scene, camera : THREE.Camera, size: Size) => void
export type ExportCallbackType = (dataURL : string)=>void

export function CanvasRenderer({onRender, rendering}:{onRender : RenderCallbackType, rendering : boolean}){
  
  const { gl, scene, camera, size } = useThree()
  useEffect(() => {
    if(rendering){
      onRender(gl, scene, camera, size)
    }
  },[rendering])

  return null
}


export function Renderer({exportCallback} : {exportCallback : ExportCallbackType}) {

  const gridsState = useGridsState()
  const gridsDispatch = useGridsDispatch()
  if (!gridsState || !gridsDispatch) {
      throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
  }
  const newGif = ()=>{
    return new GIF({
      workers: 2,
      quality: 10,
      workerScript: '/gif.worker.js',
      transparent: 0x000000
    })
  }
  const [frames, setFrames] = useState<HTMLCanvasElement[]>([])
  const [rendering, setRendering] = useState(false)
  const gifRef = useRef<typeof GIF | null>(null);
  if (!gifRef.current) {
    gifRef.current = newGif()
  }
  

  useEffect(() => {
    // Don’t render on first load
    if (gridsState.render > 0 && gridsState.grids.length > 0) {
      setRendering(true)
    }
  }, [gridsState.render])

  useEffect(() => {
    if (!rendering && frames.length !== 0) {
      if (frames.length < gridsState.grids.length) {
        setRendering(true)
      } else {
        // Don’t render on first load
        if (gridsState.render > 0){
          console.log("Rendering")
          const addFrames = async () => {
            for (const canvas of frames) {
              gifRef.current?.addFrame(canvas, { delay: 100 })
            }
            gifRef.current?.on('finished', (blob: Blob) => {
              downloadDataURL(URL.createObjectURL(blob), "test.gif")
              setFrames([]) // all done
              gifRef.current = newGif()
            })
            gifRef.current?.render()
          }
          addFrames()
        }
      }
    }
  }, [rendering, frames])

  const render = (gl : THREE.WebGLRenderer, scene : THREE.Scene, camera : THREE.Camera, size: Size)=>{
    const SCALE = 0.5
    const SAMPLES = 1
    const pixelRatio = gl.getPixelRatio()
    const width = Math.floor(size.width * pixelRatio * SCALE)
    const height = Math.floor(size.height * pixelRatio * SCALE)
    gifRef.current.width = width
    gifRef.current.height = height

    // Create an offscreen render target
    const renderTarget = new THREE.WebGLRenderTarget(width, height,{
        // These are important:
        colorSpace: THREE.SRGBColorSpace, // matches renderer output
        // or LinearEncoding if you prefer linear
    })

    renderTarget.samples = SAMPLES

    // Save old target
    const oldTarget = gl.getRenderTarget()

    // Render the scene into the offscreen target
    gl.setRenderTarget(renderTarget)
    gl.render(scene, camera)

    // Read pixels from the offscreen buffer
    const pixels = new Uint8Array(width * height * 4)
    gl.readRenderTargetPixels(renderTarget, 0, 0, width, height, pixels)

    // Flip Y (WebGL is bottom-left origin, canvas is top-left)
    const flipped = new Uint8ClampedArray(width * height * 4)
    for (let y = 0; y < height; y++) {
        const src = y * width * 4
        const dst = (height - y - 1) * width * 4
        flipped.set(pixels.subarray(src, src + width * 4), dst)
    }


    // Convert pixels to canvas to dataURL
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        console.error('2D context unavailable on export canvas')
        return
    }

    const imageData = new ImageData(flipped, width, height)
    ctx.putImageData(imageData, 0, 0)

    //const dataURL = canvas.toDataURL('image/png')
    // exportCallback(dataURL)
    //gifRef.current.addFrame(canvas)
    setFrames(prev => [...prev, canvas])
    console.log("Frame added")

    // Restore renderer target
    gl.setRenderTarget(oldTarget)
    // Dispose render target
    renderTarget.dispose()
    setRendering(false)
  }

  return (
    <div className='w-0 h-0 overflow-hidden relative'>
      <div className='invisible absolute w-screen h-screen'>
        {rendering?  
          <ThreeCanvas editable={false} gridIndex={frames.length}>
            <CanvasRenderer onRender={render} rendering={rendering} />
          </ThreeCanvas> : null
        }
      </div>
    </div>
  )
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