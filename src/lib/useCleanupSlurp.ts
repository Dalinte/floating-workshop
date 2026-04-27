import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CLEANUP_TARGET_LOCAL } from './creatureTracker.ts'

/**
 * When `cleanupProgress` rises above 0, snapshots the group's current
 * position and lerps it toward CLEANUP_TARGET_LOCAL by the progress value.
 * Resets snapshot when progress goes back to 0 (next cleanup cycle).
 *
 * Designed to coexist with useWander: when wander is disabled (during
 * CLEANUP_DROPPING), wander does nothing, and this hook drives position.
 */
export function useCleanupSlurp(
  ref: React.MutableRefObject<THREE.Group | null>,
  cleanupProgress: number,
) {
  const startRef = useRef<THREE.Vector3 | null>(null)

  useFrame(() => {
    const g = ref.current
    if (!g) return

    if (cleanupProgress <= 0.001) {
      startRef.current = null
      return
    }

    if (!startRef.current) {
      startRef.current = new THREE.Vector3().copy(g.position)
    }

    const p = Math.min(1, cleanupProgress)
    g.position.x = THREE.MathUtils.lerp(startRef.current.x, CLEANUP_TARGET_LOCAL.x, p)
    g.position.y = THREE.MathUtils.lerp(startRef.current.y, CLEANUP_TARGET_LOCAL.y, p)
    g.position.z = THREE.MathUtils.lerp(startRef.current.z, CLEANUP_TARGET_LOCAL.z, p)
  })
}
