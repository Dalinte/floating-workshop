import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ISLAND_BASE_Y, islandWobbleY } from '../lib/wobble.ts'

interface IslandProps {
  children?: ReactNode
}

export default function Island({ children }: IslandProps) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = ISLAND_BASE_Y + islandWobbleY(state.clock.elapsedTime)
  })

  return (
    <group ref={ref} position={[0, ISLAND_BASE_Y, 0]}>
      {/* Grass top */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 2.8, 0.4, 24]} />
        <meshStandardMaterial color="#5fa055" roughness={0.9} flatShading />
      </mesh>
      {/* Soil/rock base */}
      <mesh receiveShadow castShadow position={[0, -1.45, 0]}>
        <coneGeometry args={[2.8, 2.5, 16]} />
        <meshStandardMaterial color="#6b4a35" roughness={1} flatShading />
      </mesh>
      {/* Hanging rocks */}
      <mesh castShadow position={[1.6, -1.1, 1.0]} rotation={[0.3, 0.4, 0.2]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#7a5a44" flatShading roughness={1} />
      </mesh>
      <mesh castShadow position={[-1.4, -2.0, -0.6]} rotation={[0.6, 0.2, -0.3]}>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#8a6a52" flatShading roughness={1} />
      </mesh>
      <mesh castShadow position={[-0.4, -2.6, 1.2]} rotation={[0.2, 0.5, 0.1]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#705040" flatShading roughness={1} />
      </mesh>
      {/* Edge stones on grass */}
      <mesh castShadow position={[2.3, 0.3, 1.4]}>
        <icosahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial color="#9c8c80" flatShading roughness={1} />
      </mesh>
      <mesh castShadow position={[-2.4, 0.3, -1.0]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#a89c8e" flatShading roughness={1} />
      </mesh>
      {/* Tree */}
      <group position={[-1.9, 0.4, 1.4]}>
        <mesh castShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.13, 0.8, 8]} />
          <meshStandardMaterial color="#5a3a26" roughness={1} flatShading />
        </mesh>
        <mesh castShadow position={[0, 1.1, 0]}>
          <icosahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color="#3d8a4f" roughness={0.9} flatShading />
        </mesh>
        <mesh castShadow position={[0.25, 1.4, 0.1]}>
          <icosahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color="#4a9c5c" roughness={0.9} flatShading />
        </mesh>
      </group>
      {/* Small bush */}
      <group position={[2.0, 0.4, -1.5]}>
        <mesh castShadow position={[0, 0.25, 0]}>
          <icosahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial color="#3d8a4f" roughness={1} flatShading />
        </mesh>
        <mesh castShadow position={[0.3, 0.15, 0.1]}>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color="#4a9c5c" roughness={1} flatShading />
        </mesh>
      </group>
      {children}
    </group>
  )
}
