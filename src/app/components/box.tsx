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
            <meshStandardMaterial color={
                rendered? (hovered ? 'hotpink' : 'orange') : (hovered ? 'yellow' : 'lightblue')} />
        </mesh>
    )
}