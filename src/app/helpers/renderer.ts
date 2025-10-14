import * as THREE from 'three';
import GIF from 'gif.js.optimized';

export type ExportCallbackType = (dataURL : string)=>void

export function renderFrame(gl : THREE.WebGLRenderer, exportCallback : ExportCallbackType){
  const imageData = gl.domElement.toDataURL("image/png")
  exportCallback(imageData)
}


export function renderGif(frames : string[], exportCallback : ExportCallbackType) {

  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: '/gif.worker.js',
    transparent: 0x000000
  })

  frames.forEach((frame, i)=>{
    const img = new Image()
    img.src = frame
    img.onload = () => {
      gif.addFrame(img, { delay: 100 })
      if(i === frames.length - 1){
        gif.render()
      }
    }
  })
  gif.on('finished', (blob: Blob) => {
    exportCallback(URL.createObjectURL(blob))
  })
  
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