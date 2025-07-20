import * as THREE from 'three'
import { useGLTF, useAnimations, Sky, Bvh } from '@react-three/drei'
import { useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Selection, N8AO, TiltShift2, ToneMapping, Outline } from "@react-three/postprocessing"
import { easing } from "maath"
import React, { useRef, useEffect } from 'react'

function Effects() {
  const { size } = useThree()
  return (
    <EffectComposer stencilBuffer disableNormalPass autoClear={false} multisampling={4}>
      <N8AO halfRes aoSamples={5} aoRadius={0.4} distanceFalloff={0.75} intensity={1} />
      <Outline visibleEdgeColor="white" hiddenEdgeColor="white" blur width={size.width * 1.25} edgeStrength={10} />
      <TiltShift2 samples={5} blur={0.1} />
      <ToneMapping />
    </EffectComposer>
  )
}

export function GloomyCity(props) {
    const group = useRef()
    const { scene, animations } = useGLTF('/v3_city_v0.21.glb')
    const { actions } = useAnimations(animations, group)

    useEffect(() => {
        Object.values(actions).forEach(action => action.play())
    }, [actions])

    return (
        <>
            <ambientLight intensity={1.5 * Math.PI} />
            <Sky />
            <Bvh firstHitOnly>
                <Selection>
                    <Effects />
                    <group ref={group} {...props} dispose={null}>
                        <primitive object={scene} />
                    </group>
                </Selection>
            </Bvh>
        </>
    )
}