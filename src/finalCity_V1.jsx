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
      <N8AO halfRes aoSamples={5} aoRadius={0.1} distanceFalloff={0.5} intensity={5} />
      <Outline visibleEdgeColor="black" hiddenEdgeColor="white" blur width={size.width * 3} edgeStrength={20} />
      <TiltShift2 samples={5} blur={0.5} />
      <ToneMapping />
    </EffectComposer>
  )
}

export function GloomyCity(props) {
    const group = useRef()
    const { scene, animations } = useGLTF('/v3_city_v0.21.glb')
    const { actions } = useAnimations(animations, group)
    const { gl, scene: r3fScene } = useThree()

    useEffect(() => {
        Object.values(actions).forEach(action => action.play())
    }, [actions])

    useEffect(() => {
        r3fScene.fog = new THREE.FogExp2(0x222233, 0.00001)
        gl.setClearColor(0x222233)
        return () => {
            r3fScene.fog = null
        }
    }, [r3fScene, gl])

    return (
        <>
            <ambientLight intensity={0.2} color="white" />
            <directionalLight position={[100, 200, 100]} intensity={0.5} color="#8888aa" castShadow />
            <Sky turbidity={10} rayleigh={2} mieCoefficient={0.1} mieDirectionalG={0.8} inclination={0.6} azimuth={0.25} />
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