import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { GloomyCity } from './finalCity_V1'
import { City } from './City'
import { NewCity } from './NewCity'

export default function App() {
  return (
    <Canvas 
      camera={{ position: [150, 150, 150], fov: 60 }}
      style={{ background: 'white' }}
      shadows
    >
      <axesHelper args={[1000]} />
      {/* Sea plane aligned with Z axis */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshPhysicalMaterial
          color="#3a6ea5"
          roughness={0.4}
          metalness={0.3}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          reflectivity={0.5}
          transmission={0.2}
          thickness={0.5}
          ior={1.33}
        />
      </mesh>
      <Suspense fallback={null}>
        {/* Orbit Controls - Restricted to Y axis rotation */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
        />

        {/* City Model */}
        {/* <GloomyCity scale={0.00008} /> */}
        {/* <City scale={0.08} /> */}
        {/* <NewCity scale={0.08} /> */}
        <GloomyCity scale={0.8} position={[180, 0, 180]} />


      </Suspense>
    </Canvas>
  )
}
