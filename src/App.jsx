import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, MeshReflectorMaterial, BakeShadows, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import { easing } from 'maath'
import { Suspense, useState } from 'react'
import { Instances, City } from './City'

export default function App() {
  return (
    <Canvas 
      shadows="basic"
      dpr={[1, 2]}
      camera={{ position: [0, 5, 20], fov: 75, near: 0.1, far: 1000 }}
      eventSource={document.getElementById('root')} 
      eventPrefix="client"
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        {/* Orbit Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          panSpeed={0.5}
          zoomSpeed={0.5}
          enableDamping={true}
        />

        {/* Lights */}
        <color attach="background" args={['black']} />
        <hemisphereLight intensity={0.3} groundColor="black" />
        <spotLight
          position={[50, 50, 25]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={1024}
          shadow-bias={-0.0001}
        />
        
        {/* Main scene */}
        <group position={[0, 0, 0]}>
          {/* City model */}
          <City scale={0.08} />
          
          {/* Ground plane with reflections */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[40, 40]} />
            <MeshReflectorMaterial
              blur={[300, 30]}
              resolution={1024}
              mixBlur={1}
              mixStrength={30}
              roughness={0.7}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="black"
              metalness={0.5}
            />
          </mesh>

          {/* Additional lighting for better detail visibility */}
          <pointLight distance={15} intensity={0.5} position={[0, 10, 0]} color="white" />
          <pointLight distance={15} intensity={0.3} position={[-10, 5, -10]} color="white" />
          <pointLight distance={15} intensity={0.3} position={[10, 5, -10]} color="white" />
        </group>

        {/* Postprocessing */}
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.2}
            mipmapBlur
            luminanceSmoothing={0.3}
            intensity={0.5}
          />
          <DepthOfField
            target={[0, 0, 0]}
            focalLength={0.3}
            bokehScale={15}
            height={700}
          />
        </EffectComposer>

        <BakeShadows />
      </Suspense>
    </Canvas>
  )
}
