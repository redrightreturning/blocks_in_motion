'use client'
import React, { useRef, useState } from 'react'
import { Mesh } from 'three'
import * as THREE from 'three'
import { IndexType } from '../types/indexType.interface'

//Boxes are:
//rendered or not
//clickable or not
//highlighted or not (depending on slider or 'drill')
//hovered or not
//


export default function Box({position, rendered, index, setRendered, isClickable} : 
    {   position: [number, number, number], 
        rendered : boolean, 
        index: IndexType,
        setRendered: (index: IndexType) => void,
        isClickable: boolean}){
    const meshRef = useRef<Mesh>(null)
    const [hovered, setHover] = useState(false)

    
    // useFrame((state, delta) => {
    //     if (meshRef.current) {
    //         meshRef.current.rotation.x += delta
    //     }
    // })
    
    return (
        isClickable || rendered? 
        <mesh
            position={position}
            ref={meshRef}
            raycast={isClickable? THREE.Mesh.prototype.raycast : undefined}
            onClick={(event) => {
                event.stopPropagation()
                if(isClickable) setRendered(index)
            }}
            onPointerOver={isClickable? (_) => setHover(true): undefined}
            onPointerOut={isClickable? (_) => setHover(false): undefined}>
            <boxGeometry args={[1, 1, 1]} />
            
            {rendered? 
            <meshStandardMaterial color={(hovered ? 'hotpink' : 'orange')} />
            :
            <meshPhysicalMaterial
                // core glass properties
                transmission={1} // make material physically transmissive (glass)
                transparent={true} // allow alpha
                opacity={isClickable ? 0.25 : 0} // make material mostly transparent
                thickness={0.8} // how much the material absorbs / refracts
                roughness={0} // smooth, reflective surface
                metalness={0}
                ior={1.45} // index of refraction for glass
                reflectivity={0.6}
                envMapIntensity={1.2}

                // subtle tint and subsurface
                attenuationColor={(hovered ? 'yellow' : 'lightblue')} // color when light passes through
                attenuationDistance={0.6} // how far light travels inside

                // clearcoat for a glossy layer on top
                clearcoat={0.2}
                clearcoatRoughness={0}
            />}
        </mesh>
        : <></>
    )
}