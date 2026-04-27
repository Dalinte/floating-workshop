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

const BASE_SCALE = 0.6
const SHELL = '#5a7a3b'
const SHELL_DARK = '#3d5a26'
const SKIN = '#7fa450'
const EYE = '#1c1a18'

export default function Turtle({ spawnProgress, wanderEnabled, cleanupProgress }: CreatureProps) {
  const root = useRef<THREE.Group | null>(null)

  const setRoot = useCallback((node: THREE.Group | null) => {
    root.current = node
    if (node) {
      node.position.set(CREATURE_DROP_X, CREATURE_BASE_Y, CREATURE_DROP_Z)
    }
  }, [])

  // Slow and chill — no hop.
  useWander(root, { enabled: wanderEnabled, speed: 0.35, radius: 1.8, hopHeight: 0 })
  useCleanupSlurp(root, cleanupProgress)

  const spawn = Math.max(0, Math.min(1, spawnProgress))
  const cleanup = Math.max(0, Math.min(1, cleanupProgress))
  const s = spawn * (1 - cleanup) * BASE_SCALE

  return (
    <group ref={setRoot} scale={s}>
      {/* Lower body — flat cylinder */}
      <mesh castShadow position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.21, 0.23, 0.08, 18]} />
        <meshStandardMaterial color={SKIN} roughness={0.9} />
      </mesh>
      {/* Shell — half sphere */}
      <mesh castShadow position={[0, 0.11, 0]}>
        <sphereGeometry args={[0.22, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={SHELL} roughness={0.8} />
      </mesh>
      {/* Shell ridge accents — six small darker bumps */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        const r = 0.13
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0.22, Math.sin(a) * r]}>
            <sphereGeometry args={[0.04, 8, 6]} />
            <meshStandardMaterial color={SHELL_DARK} roughness={1} />
          </mesh>
        )
      })}
      {/* Head + neck */}
      <mesh castShadow position={[0, 0.12, 0.24]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.12, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 0.16, 0.3]}>
        <sphereGeometry args={[0.08, 12, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.9} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.035, 0.18, 0.36]}>
        <sphereGeometry args={[0.013, 8, 6]} />
        <meshBasicMaterial color={EYE} />
      </mesh>
      <mesh position={[0.035, 0.18, 0.36]}>
        <sphereGeometry args={[0.013, 8, 6]} />
        <meshBasicMaterial color={EYE} />
      </mesh>
      {/* Tail */}
      <mesh castShadow position={[0, 0.09, -0.24]} rotation={[Math.PI / 2.3, 0, 0]}>
        <coneGeometry args={[0.04, 0.1, 8]} />
        <meshStandardMaterial color={SKIN} roughness={1} />
      </mesh>
      {/* Four flippers */}
      {[
        [0.18, 0.06, 0.13, 0.4],
        [-0.18, 0.06, 0.13, -0.4],
        [0.18, 0.06, -0.13, -0.4],
        [-0.18, 0.06, -0.13, 0.4],
      ].map(([x, y, z, rotY], i) => (
        <mesh
          key={i}
          castShadow
          position={[x, y, z]}
          rotation={[0, rotY, 0]}
        >
          <boxGeometry args={[0.12, 0.04, 0.08]} />
          <meshStandardMaterial color={SKIN} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}
