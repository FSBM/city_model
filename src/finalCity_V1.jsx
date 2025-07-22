import * as THREE from 'three'
import { useGLTF, useAnimations, Sky, Bvh } from '@react-three/drei'
import { useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Selection, Autofocus, Noise, Sepia, BrightnessContrast, Bloom, Vignette } from "@react-three/postprocessing"
import { easing } from "maath"
import React, { useRef, useEffect } from 'react'
import { useControls } from 'leva'
import { BlendFunction } from 'postprocessing' // <-- Use capital B, this is the correct import

export const Effects = () => {
  // Blend function controls for each effect
  const blendOptions = [
    "NORMAL",
    "ADD",
    "ALPHA",
    "AVERAGE",
    "COLOR_BURN",
    "COLOR_DODGE",
    "DARKEN",
    "DIFFERENCE",
    "EXCLUSION",
    "LIGHTEN",
    "MULTIPLY",
    "DIVIDE",
    "NEGATION",
    "NORMAL",
    "OVERLAY",
    "REFLECT",
    "SCREEN",
    "SOFT_LIGHT",
    "SUBTRACT"
  ];

  // Example: Add blend function control for Bloom and Sepia
  const bloomBlend = useControls("bloom", {
    blendFunction: { value: "SCREEN", options: blendOptions }
  }).blendFunction;

  const sepiaBlend = useControls("sepia", {
    blendFunction: { value: "COLOR_DODGE", options: blendOptions }
  }).blendFunction;

  const vignetteBlend = useControls("vignette", {
    blendFunction: { value: "MULTIPLY", options: blendOptions }
  }).blendFunction;

  const autofocusConfig = useControls("autofocus", {
    enabled: true,
    mouse: true,
    focusRange: { value: 0.001, min: 0, max: 0.01 },
    bokehScale: { value: 8, min: 0, max: 40 },
    focalLength: { value: 0.8, min: 0, max: 1 },
    smoothTime: { value: 0.5, min: 0, max: 1 },
  });

  const noiseConfig = useControls("noise", {
    enabled: true,
    opacity: { value: 0.5, min: 0, max: 1 },
  });

  const brightnessContrastConfig = useControls("brightnessContrast", {
    enabled: true,
    brightness: { value: 0.5, min: 0, max: 1 },     
    contrast: { value: 0.5, min: 0, max: 1 },
  });

  const bloomConfig = useControls("bloom", {
    enabled: true,
    intensity: { value: 0.5, min: 0, max: 1 },  
    radius: { value: 0.5, min: 0, max: 1 },
    threshold: { value: 0.5, min: 0, max: 1 },
    luminanceSmoothing: { value: 0.5, min: 0, max: 1 },
  });

  const sepiaConfig = useControls("sepia", {
    enabled: true,
    intensity: { value: 0.5, min: 0, max: 1 },
  });

  const vignetteConfig = useControls("vignette", {
    enabled: true,
    intensity: { value: 0.5, min: 0, max: 1 },
    blur: { value: 0.5, min: 0, max: 1 },
  });

  return (
    <EffectComposer disableNormalPass>
      {/* ... */}
      {autofocusConfig.enabled && <Autofocus {...autofocusConfig} />}
      {noiseConfig.enabled && <Noise {...noiseConfig} />}
      {brightnessContrastConfig.enabled && <BrightnessContrast {...brightnessContrastConfig} />}
      {bloomConfig.enabled && (
        <Bloom
          {...bloomConfig}
          blendFunction={BlendFunction[bloomBlend]}
        />
      )}
      {sepiaConfig.enabled && (
        <Sepia
          {...sepiaConfig}
          blendFunction={BlendFunction[sepiaBlend]}
        />
      )}
      {vignetteConfig.enabled && (
        <Vignette
          {...vignetteConfig}
          blendFunction={BlendFunction[vignetteBlend]}
        />
      )}
    </EffectComposer>
  );
};

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