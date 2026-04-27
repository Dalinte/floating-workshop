import { useCallback, useRef } from 'react'
import * as THREE from 'three'
import { useWander } from '../../lib/useWander.ts'
import { useCleanupSlurp } from '../../lib/useCleanupSlurp.ts'
import { CREATURE_BASE_Y, CREATURE_DROP_X, CREATURE_DROP_Z } from '../../lib/creatureTracker.ts'

interface CreatureProps {
  spawnProgress: number
  wanderEnabled: boolean
  cleanupProgress: number
}

const BASE_SCALE = 0.55
const BODY = '#f3eee5'
const ACCENT = '#d8cfc0'
const EYE = '#1c1a18'

export default function Rabbit({ spawnProgress, wanderEnabled, cleanupProgress }: CreatureProps) {
  const root = useRef<THREE.Group | null>(null)

  // Callback ref: runs synchronously the moment React attaches the group.
  // Sets the drop position before R3F's first scene render — guaranteed.
  const setRoot = useCallback((node: THREE.Group | null) => {
    root.current = node
    if (node) {
      node.position.set(CREATURE_DROP_X, CREATURE_BASE_Y, CREATURE_DROP_Z)
    }
  }, [])

  useWander(root, { enabled: wanderEnabled, speed: 0.9, radius: 2, hopHeight: 0.07, hopFrequency: 7 })
  useCleanupSlurp(root, cleanupProgress)

  const spawn = Math.max(0, Math.min(1, spawnProgress))
  const cleanup = Math.max(0, Math.min(1, cleanupProgress))
  const s = spawn * (1 - cleanup) * BASE_SCALE

  return (
    <group ref={setRoot} scale={s}>
      <mesh castShadow position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshStandardMaterial color={BODY} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.3, 0.16]}>
        <sphereGeometry args={[0.13, 16, 12]} />
        <meshStandardMaterial color={BODY} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[-0.05, 0.46, 0.16]} rotation={[0.05, 0, -0.1]}>
        <cylinderGeometry args={[0.025, 0.02, 0.18, 8]} />
        <meshStandardMaterial color={BODY} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.05, 0.46, 0.16]} rotation={[0.05, 0, 0.1]}>
        <cylinderGeometry args={[0.025, 0.02, 0.18, 8]} />
        <meshStandardMaterial color={BODY} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 0.2, -0.18]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshStandardMaterial color={ACCENT} roughness={1} />
      </mesh>
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
