import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { GloomyCity } from './finalCity_V1'

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
          minDistance={5}
          maxDistance={50}
          minPolarAngle={Math.PI / 4} // Restrict vertical rotation
          maxPolarAngle={Math.PI / 3} // Restrict vertical rotation
          minAzimuthAngle={-Math.PI / 2} // Restrict horizontal rotation
          maxAzimuthAngle={Math.PI / 2} // Restrict horizontal rotation
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          enableDamping={true}
        />

        {/* City Model */}
        <GloomyCity scale={0.00008} />
      </Suspense>
    </Canvas>
  )
}
