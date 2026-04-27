import { useRef } from 'react'
import * as THREE from 'three'
import { useWander } from '../../lib/useWander.ts'

interface CreatureProps {
  spawnProgress: number
  wanderEnabled: boolean
}

const BASE_SCALE = 0.55
const COAT = '#d97734'
const BELLY = '#fde9c8'
const TIP = '#1f1715'

export default function Fox({ spawnProgress, wanderEnabled }: CreatureProps) {
  const root = useRef<THREE.Group>(null)
  useWander(root, { enabled: wanderEnabled, speed: 1.0, radius: 2.2, hopHeight: 0.02, hopFrequency: 9 })

  const s = Math.max(0, Math.min(1, spawnProgress)) * BASE_SCALE
  if (s <= 0.001) return null

  return (
    <group ref={root} scale={s}>
      {/* Body — elongated capsule along Z */}
      <mesh castShadow position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.13, 0.28, 6, 12]} />
        <meshStandardMaterial color={COAT} roughness={0.85} />
      </mesh>
      {/* Belly highlight */}
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.1, 0.22, 4, 10]} />
        <meshStandardMaterial color={BELLY} roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 0.26, 0.24]}>
        <sphereGeometry args={[0.12, 14, 12]} />
        <meshStandardMaterial color={COAT} roughness={0.85} />
      </mesh>
      {/* Snout */}
      <mesh castShadow position={[0, 0.22, 0.36]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.13, 12]} />
        <meshStandardMaterial color={COAT} roughness={0.9} />
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, 0.22, 0.43]}>
        <sphereGeometry args={[0.022, 8, 6]} />
        <meshBasicMaterial color={TIP} />
      </mesh>
      {/* Ears */}
      <mesh castShadow position={[-0.07, 0.4, 0.22]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.05, 0.13, 6]} />
        <meshStandardMaterial color={COAT} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.07, 0.4, 0.22]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.05, 0.13, 6]} />
        <meshStandardMaterial color={COAT} roughness={0.9} />
      </mesh>
      {/* Tail — fluffy puff */}
      <mesh castShadow position={[0, 0.22, -0.24]}>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshStandardMaterial color={COAT} roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 0.18, -0.32]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color={BELLY} roughness={1} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.05, 0.29, 0.32]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshBasicMaterial color={TIP} />
      </mesh>
      <mesh position={[0.05, 0.29, 0.32]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshBasicMaterial color={TIP} />
      </mesh>
      {/* Legs — small cylinders */}
      {[
        [0.07, 0.06, 0.12],
        [-0.07, 0.06, 0.12],
        [0.07, 0.06, -0.12],
        [-0.07, 0.06, -0.12],
      ].map((p, i) => (
        <mesh
          key={i}
          castShadow
          position={p as [number, number, number]}
          rotation={[0, 0, 0]}
        >
          <cylinderGeometry args={[0.025, 0.025, 0.12, 6]} />
          <meshStandardMaterial color={COAT} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}
