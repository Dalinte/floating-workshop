import { useRef } from 'react'
import * as THREE from 'three'
import { useWander } from '../../lib/useWander.ts'

interface CreatureProps {
  spawnProgress: number
  wanderEnabled: boolean
}

const BASE_SCALE = 0.55
const BODY = '#f3eee5'
const ACCENT = '#d8cfc0'
const EYE = '#1c1a18'

export default function Rabbit({ spawnProgress, wanderEnabled }: CreatureProps) {
  const root = useRef<THREE.Group>(null)
  useWander(root, { enabled: wanderEnabled, speed: 0.9, radius: 2, hopHeight: 0.07, hopFrequency: 7 })

  const s = Math.max(0, Math.min(1, spawnProgress)) * BASE_SCALE
  if (s <= 0.001) return null

  return (
    <group ref={root} scale={s}>
      {/* Body */}
      <mesh castShadow position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshStandardMaterial color={BODY} roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 0.3, 0.16]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color={BODY} roughness={0.8} />
      </mesh>
      {/* Ears */}
      <mesh castShadow position={[-0.05, 0.46, 0.16]} rotation={[0.05, 0, -0.1]}>
        <cylinderGeometry args={[0.025, 0.02, 0.18, 8]} />
        <meshStandardMaterial color={BODY} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.05, 0.46, 0.16]} rotation={[0.05, 0, 0.1]}>
        <cylinderGeometry args={[0.025, 0.02, 0.18, 8]} />
        <meshStandardMaterial color={BODY} roughness={0.8} />
      </mesh>
      {/* Tail */}
      <mesh castShadow position={[0, 0.2, -0.18]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshStandardMaterial color={ACCENT} roughness={1} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.05, 0.32, 0.27]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshBasicMaterial color={EYE} />
      </mesh>
      <mesh position={[0.05, 0.32, 0.27]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshBasicMaterial color={EYE} />
      </mesh>
    </group>
  )
}
