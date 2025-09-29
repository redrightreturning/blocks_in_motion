'use client'
import React, { useRef, useState } from 'react'
import { Mesh } from 'three'
import * as THREE from 'three'
import { IndexType } from '../types/indexType.interface'
import { useGridsDispatch, useGridsState } from '../helpers/gridsContext'
import { BoxType } from '../types/gridTypes.interface'

//Boxes are:
//rendered or not
//clickable or not and as such hovered or not
//primary, secondary, or tertiary

export default function Box({position, type, index} : 
    {   position: [number, number, number], 
        type : BoxType, 
        index: IndexType,
    }){
    const meshRef = useRef<Mesh>(null)
    const [hovered, setHover] = useState(false)

    const gridsState = useGridsState()
    const gridsDispatch = useGridsDispatch()
    if (!gridsState || !gridsDispatch) {
        throw new Error("useGridsState and useGridsDispatch must be used within a GridsProvider");
    }

    const boxColor = ()=>{
        if (hovered){
            return 'hotpink'
        }else{
            return 'orange'
        }
    }

    const material = ()=>{
        if(type.type === "primary"){
            return (<meshStandardMaterial color={boxColor()} />)
        }else{
            const isTypeSecondary = type.type === "secondary"

            return (<meshPhysicalMaterial
                // core glass properties
                transmission={1} // make material physically transmissive (glass)
                transparent={true} // allow alpha
                opacity={isTypeSecondary ? 0.5 : 0.25} // make material mostly transparent
                thickness={0.8} // how much the material absorbs / refracts
                roughness={0} // smooth, reflective surface
                metalness={0}
                ior={1.45} // index of refraction for glass
                reflectivity={0.6}
                envMapIntensity={1.2}

                // subtle tint and subsurface
                attenuationColor={"white"} // color when light passes through
                attenuationDistance={0.6} // how far light travels inside

                // clearcoat for a glossy layer on top
                clearcoat={0.2}
                clearcoatRoughness={0}
            />)
        }
    }

    
    return (
        type.rendered || type.clickable? 
        <mesh
            position={position}
            ref={meshRef}
            raycast={type.clickable? THREE.Mesh.prototype.raycast : undefined}
            onClick={(event) => {
                event.stopPropagation()
                if(type.clickable) gridsDispatch({type: "update", index: index})
            }}
            onPointerOver={type.clickable? () => setHover(true): undefined}
            onPointerOut={type.clickable? () => setHover(false): undefined}>
            <boxGeometry args={[1, 1, 1]} />
            {material()}
            
        </mesh>
        : <></>
    )
}