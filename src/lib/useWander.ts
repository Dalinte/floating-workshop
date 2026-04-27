import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CREATURE_BASE_Y } from './creatureTracker.ts'

interface UseWanderOptions {
  enabled: boolean
  speed?: number
  radius?: number
  baseY?: number
  hopHeight?: number
  hopFrequency?: number
}

const tmpDir = new THREE.Vector3()

/**
 * Drives a Group ref around a circular grass area:
 *   - picks a random target inside `radius`,
 *   - walks toward it at `speed`,
 *   - on arrival pauses 0.5–2.0 s, then picks a new target,
 *   - faces the direction of travel,
 *   - optionally hops on Y (set hopHeight = 0 for non-hopping animals).
 */
export function useWander(
  ref: React.MutableRefObject<THREE.Group | null>,
  {
    enabled,
    speed = 0.7,
    radius = 2,
    baseY = CREATURE_BASE_Y,
    hopHeight = 0.05,
    hopFrequency = 6,
  }: UseWanderOptions,
) {
  const targetRef = useRef(new THREE.Vector3(0, baseY, 0))
  const pauseUntilRef = useRef(0)
  const pickedTargetRef = useRef(false)
  const facingRef = useRef(0)

  useFrame((state, delta) => {
    const group = ref.current
    if (!group) return

    if (!enabled) return

    const t = state.clock.elapsedTime

    if (!pickedTargetRef.current) {
      pickRandomTarget(targetRef.current, radius, baseY)
      pickedTargetRef.current = true
    }

    if (t < pauseUntilRef.current) return

    const dx = targetRef.current.x - group.position.x
    const dz = targetRef.current.z - group.position.z
    const dist2 = dx * dx + dz * dz

    if (dist2 < 0.01) {
      pauseUntilRef.current = t + 0.5 + Math.random() * 1.5
      pickRandomTarget(targetRef.current, radius, baseY)
      group.position.y = baseY
      return
    }

    tmpDir.set(dx, 0, dz).normalize()
    group.position.x += tmpDir.x * speed * delta
    group.position.z += tmpDir.z * speed * delta

    const desiredFacing = Math.atan2(tmpDir.x, tmpDir.z)
    facingRef.current = lerpAngle(facingRef.current, desiredFacing, 1 - Math.pow(0.001, delta))
    group.rotation.y = facingRef.current

    if (hopHeight > 0) {
      group.position.y = baseY + Math.abs(Math.sin(t * hopFrequency)) * hopHeight
    } else {
      group.position.y = baseY
    }
  })
}

function pickRandomTarget(out: THREE.Vector3, radius: number, baseY: number) {
  const angle = Math.random() * Math.PI * 2
  const r = Math.sqrt(Math.random()) * radius
  out.set(Math.cos(angle) * r, baseY, Math.sin(angle) * r)
}

function lerpAngle(from: number, to: number, t: number) {
  let d = to - from
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return from + d * t
}
