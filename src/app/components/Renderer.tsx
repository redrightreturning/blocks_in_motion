import { Size, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useGridsDispatch, useGridsState } from '../helpers/gridsContext';
import React from 'react';
import ThreeCanvas from './threeCanvas';

export type RenderCallbackType = (gl : THREE.WebGLRenderer, scene : THREE.Scene, camera : THREE.Camera, size: Size) => void
export type ExportCallbackType = (dataURL : string)=>void

export function CanvasRenderer({onRender, gridIndex}:{onRender? : RenderCallbackType, gridIndex : number | null}){
  const { gl, scene, camera, size } = useThree()
  useEffect(() => {
      if(onRender !== undefined){
          onRender(gl, scene, camera, size)
      }
  }, [gridIndex])

  return null
}


export function Renderer({exportCallback} : {exportCallback : ExportCallbackType}) {

  const gridsState = useGridsState()
  const gridsDispatch = useGridsDispatch()
  if (!gridsState || !gridsDispatch) {
      throw new Error(`useGridsState and useGridsDispatch must be used within a GridsProvider. State: ${gridsState} Dispatch: ${gridsDispatch}`);
  }

  const [renderIndex, setRenderIndex] = useState<number | null>(null)
  const { gl, scene, camera, size } = useThree()

  useEffect(() => {
      // Don’t render on first load
      if (gridsState.render > 0) {
        setRenderIndex(0)
      }
  }, [gridsState.render])

  return(
    <ThreeCanvas editable={false} gridIndex={renderIndex} onRender={()=>{
      const SCALE = 2
      const SAMPLES = 4
      const pixelRatio = gl.getPixelRatio()
      const width = Math.floor(size.width * pixelRatio) * SCALE
      const height = Math.floor(size.height * pixelRatio) * SCALE

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

      const dataURL = canvas.toDataURL('image/png')
      exportCallback(dataURL)

      // Restore renderer target
      gl.setRenderTarget(oldTarget)
      // Dispose render target
      renderTarget.dispose()
    }}/>
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