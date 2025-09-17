'use client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

import { Mesh } from 'three'
import { IndexType } from '../types/indexType.interface'

export default function Box({position, rendered, index, setRendered} : 
    {   position: [number, number, number], 
        rendered : boolean, 
        index: IndexType,
        setRendered: (index: IndexType) => void}){
    const meshRef = useRef<Mesh>(null)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    
    // useFrame((state, delta) => {
    //     if (meshRef.current) {
    //         meshRef.current.rotation.x += delta
    //     }
    // })
    
    return (
        <mesh
            position={position}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => {
                //setActive(!active)
                setRendered(index)
                console.log(index)
            }}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            
            {rendered? 
            <meshStandardMaterial color={(hovered ? 'hotpink' : 'orange')} />
            :
            <meshPhysicalMaterial
                // core glass properties
                transmission={1} // make material physically transmissive (glass)
                transparent={true} // allow alpha
                opacity={1}
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
    )
}