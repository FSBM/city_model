import { useGLTF } from '@react-three/drei'
import { useState, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

function CityMesh({ geometries, materials, onHover, isHovered, name }) {
  const groupRef = useRef()

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

  // Create hover effect materials for each mesh
  const hoverMaterials = useMemo(() => {
    return geometries.map(data => {
      if (data.material.map) {
        return new THREE.MeshStandardMaterial({
          map: data.material.map,
          normalMap: data.material.normalMap,
          roughnessMap: data.material.roughnessMap,
          metalnessMap: data.material.metalnessMap,
          roughness: 0.7,
          metalness: 0.3,
          envMapIntensity: 0.5
        })
      }
      return data.material
    })
  }, [geometries])

  // Animate opacity on hover
  useFrame((state, delta) => {
    if (basicMaterial) {
      basicMaterial.opacity = THREE.MathUtils.lerp(
        basicMaterial.opacity,
        isHovered ? 0 : 0.2,
        delta * 4
      )
    }
  })

  return (
    <group name={name} ref={groupRef}>
      {geometries.map((data, index) => {
        // Create a matrix to combine position, rotation, and scale
        const matrix = new THREE.Matrix4()
        matrix.compose(
          new THREE.Vector3(...data.position),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(...data.rotation)),
          new THREE.Vector3(...data.scale)
        )

        return (
          <mesh
            key={`${name}-${index}`}
            geometry={data.geometry}
            material={isHovered ? hoverMaterials[index] : basicMaterial}
            matrixAutoUpdate={false}
            matrix={matrix}
            onPointerEnter={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'pointer'
              onHover(true)
            }}
            onPointerLeave={(e) => {
              e.stopPropagation()
              document.body.style.cursor = 'auto'
              onHover(false)
            }}
            onPointerDown={(e) => {
              document.body.style.cursor = 'grabbing'
            }}
            onPointerUp={(e) => {
              document.body.style.cursor = isHovered ? 'pointer' : 'auto'
            }}
            castShadow
            receiveShadow
          />
        )
      })}
    </group>
  )
}

export function NewCity(props) {
  const { nodes, materials } = useGLTF('/traffic_mesh.glb')
  const [hoveredMesh, setHoveredMesh] = useState(null)

  // Group meshes by prefix (Cube055* and Cube056*)
  const meshGroups = useMemo(() => {
    const groups = {
      group1: [],
      group2: []
    }

    Object.entries(nodes).forEach(([key, node]) => {
      if (node.type === 'Mesh') {
        // Get world position, rotation, and scale
        node.updateWorldMatrix(true, false)
        const position = new THREE.Vector3()
        const rotation = new THREE.Euler()
        const scale = new THREE.Vector3()
        node.matrixWorld.decompose(position, new THREE.Quaternion(), scale)

        const meshData = {
          geometry: node.geometry,
          material: node.material,
          position: [position.x, position.y, position.z],
          rotation: [rotation.x, rotation.y, rotation.z],
          scale: [scale.x, scale.y, scale.z]
        }

        if (key.startsWith('Cube055')) {
          groups.group1.push(meshData)
        } else if (key.startsWith('Cube056')) {
          groups.group2.push(meshData)
        }
      }
    })

    return groups
  }, [nodes])

  return (
    <group {...props} dispose={null}>
      {meshGroups.group1.length > 0 && (
        <CityMesh
          name="mesh-group-1"
          geometries={meshGroups.group1}
          onHover={(hovered) => setHoveredMesh(hovered ? 'group1' : null)}
          isHovered={hoveredMesh === 'group1'}
        />
      )}
      {meshGroups.group2.length > 0 && (
        <CityMesh
          name="mesh-group-2"
          geometries={meshGroups.group2}
          onHover={(hovered) => setHoveredMesh(hovered ? 'group2' : null)}
          isHovered={hoveredMesh === 'group2'}
        />
      )}
    </group>
  )
}

useGLTF.preload('/traffic_mesh.glb')
