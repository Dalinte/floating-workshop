import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { islandWobbleY } from '../lib/wobble.ts'

interface BeamProps {
  visible: boolean
  intensity?: number
  position: [number, number, number]
  targetY?: number
}

export default function Beam({ visible, intensity = 0, position, targetY = 1.2 }: BeamProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Beam length is fixed at the average target — the bottom anchor follows
  // the island's wobble each frame so beam + grass stay visually attached.
  const length = position[1] - targetY
  const midY = position[1] - length / 2

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = islandWobbleY(state.clock.elapsedTime)
  })

  if (!visible || intensity <= 0.01) return null

  return (
    <group ref={groupRef}>
      <mesh position={[position[0], midY, position[2]]}>
        <coneGeometry args={[1.5, length, 28, 1, true]} />
        <meshBasicMaterial
          color="#b3e5ff"
          transparent
          opacity={Math.min(1, intensity) * 0.45}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[position[0], midY, position[2]]}>
        <coneGeometry args={[0.7, length, 20, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={Math.min(1, intensity) * 0.35}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[position[0], targetY + 0.1, position[2]]}
        intensity={intensity * 5}
        color="#b3e5ff"
        distance={4}
      />
    </group>
  )
}
