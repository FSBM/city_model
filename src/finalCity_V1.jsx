import { useGLTF, useAnimations } from '@react-three/drei'
import React, { useRef, useEffect } from 'react'


export function GloomyCity(props) {
    const group = useRef()
    const { scene, animations } = useGLTF('/v3_city_v0.01.glb')
    const { actions } = useAnimations(animations, group)

    useEffect(() => {
        Object.values(actions).forEach(action => action.play())
    }, [actions])

    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={scene} />
        </group>
    )
}