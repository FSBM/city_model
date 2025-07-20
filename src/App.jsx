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
