import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { creatureWorldPos } from './creatureTracker.ts'

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
 *
 * Always writes the current X/Z to `creatureWorldPos` so the UFO can
 * fly back to whoever is wandering, regardless of which creature it is.
 */
export function useWander(
  ref: React.MutableRefObject<THREE.Group | null>,
  {
    enabled,
    speed = 0.7,
    radius = 2,
    baseY = 0.4,
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

    const t = state.clock.elapsedTime

    // Always publish position so DeliverySequence has a fresh value
    // even if the creature stops moving.
    creatureWorldPos.x = group.position.x
    creatureWorldPos.z = group.position.z

    if (!enabled) return

    if (!pickedTargetRef.current) {
      pickRandomTarget(targetRef.current, radius, baseY)
      pickedTargetRef.current = true
    }

    // Pause window
    if (t < pauseUntilRef.current) return

    const dx = targetRef.current.x - group.position.x
    const dz = targetRef.current.z - group.position.z
    const dist2 = dx * dx + dz * dz

    if (dist2 < 0.01) {
      // Arrived — pause and pick a new target
      pauseUntilRef.current = t + 0.5 + Math.random() * 1.5
      pickRandomTarget(targetRef.current, radius, baseY)
      // Sit at base Y while paused (no hop animation while idle)
      group.position.y = baseY
      return
    }

    tmpDir.set(dx, 0, dz).normalize()
    group.position.x += tmpDir.x * speed * delta
    group.position.z += tmpDir.z * speed * delta

    // Smooth facing toward direction of travel
    const desiredFacing = Math.atan2(tmpDir.x, tmpDir.z)
    facingRef.current = lerpAngle(facingRef.current, desiredFacing, 1 - Math.pow(0.001, delta))
    group.rotation.y = facingRef.current

    // Hop on Y while moving
    if (hopHeight > 0) {
      group.position.y = baseY + Math.abs(Math.sin(t * hopFrequency)) * hopHeight
    } else {
      group.position.y = baseY
    }
  })
}

function pickRandomTarget(out: THREE.Vector3, radius: number, baseY: number) {
  const angle = Math.random() * Math.PI * 2
  // sqrt for uniform distribution within disk
  const r = Math.sqrt(Math.random()) * radius
  out.set(Math.cos(angle) * r, baseY, Math.sin(angle) * r)
}

function lerpAngle(from: number, to: number, t: number) {
  let d = to - from
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return from + d * t
}
