import * as THREE from 'three'
import { useMemo, useRef, createContext, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Merged, Environment, BakeShadows } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'

THREE.ColorManagement.legacyMode = false

const context = createContext()
export function Instances({ children, ...props }) {
  const { nodes } = useGLTF('/final_with_low_size_city.glb')
  
  const instances = useMemo(
    () => ({
      ...Object.fromEntries(
        Object.entries(nodes).filter(([key]) => key.startsWith('Object')).map(([key, value]) => [key, value])
      )
    }),
    [nodes]
  )
  return (
    <Merged castShadow receiveShadow meshes={instances} {...props}>
      {(instances) => <context.Provider value={instances} children={children} />}
    </Merged>
  )
}

function CityMesh({ geometry, material, position, rotation, scale, onHover, isHovered }) {
  // Create a whitish basic material for non-hovered state
  const basicMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.9,
      metalness: 0.1,
      transparent: true,
      opacity: 0.2
    })
  }, [])

  // Animate opacity on hover
  useFrame((state, delta) => {
    basicMaterial.opacity = THREE.MathUtils.lerp(
      basicMaterial.opacity,
      isHovered ? 0 : 0.8,
      delta * 4
    )
  })

  return (
    <mesh
      geometry={geometry}
      material={isHovered ? material : basicMaterial}
      position={position}
      rotation={rotation}
      scale={scale || 1}
      castShadow
      receiveShadow
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(true)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onHover(false)
      }}
    />
  )
}

export function City(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/traffic_mesh.glb')
  const [hoveredMesh, setHoveredMesh] = useState(null)
  
  // Optimize materials
  const optimizedMaterials = useMemo(() => {
    const optimized = {}
    Object.entries(materials).forEach(([key, material]) => {
      optimized[key] = new THREE.MeshStandardMaterial({
        map: material.map,
        normalMap: material.normalMap,
        roughnessMap: material.roughnessMap,
        metalnessMap: material.metalnessMap,
        roughness: 0.7,
        metalness: 0.3,
        envMapIntensity: 0.5
      })
    })
    return optimized
  }, [materials])

  // Create meshes only once
  const cityMeshes = useMemo(() => {
    return Object.entries(nodes).map(([key, node]) => {
      if (node.type === 'Mesh') {
        return (
          <CityMesh
            key={key}
            geometry={node.geometry}
            material={optimizedMaterials[node.material?.name] || node.material}
            position={node.position}
            rotation={node.rotation}
            scale={node.scale || 1}
            onHover={(hovered) => setHoveredMesh(hovered ? key : null)}
            isHovered={hoveredMesh === key}
          />
        )
      }
      return null
    }).filter(Boolean)
  }, [nodes, optimizedMaterials, hoveredMesh])

  return (
    <>
      {/* Environment and Lighting */}
      <Environment preset="warehouse" intensity={0.5} />
      <ambientLight intensity={0.2} />
      <spotLight
        position={[10, 20, 10]}
        angle={0.15}
        penumbra={1}
        intensity={0.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* City Model */}
      <group ref={group} {...props} dispose={null}>
        {cityMeshes}
      </group>

      {/* Performance Optimization */}
      <BakeShadows />
    </>
  )
}

// Preload the model
useGLTF.preload('/traffic_mesh.glb')
