import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { useStore, PHASES } from '../store.ts'

const BASE_POS = new THREE.Vector3(6, 4, 8)
const BASE_TARGET = new THREE.Vector3(0, 1.8, 0)
const DELIVERY_POS = new THREE.Vector3(7, 5.2, 9)
const DELIVERY_TARGET = new THREE.Vector3(2, 3.8, 0)

// Ambient orbit also slowly dollies the camera toward this distance from
// the orbit target. Tweak these to taste.
const AMBIENT_TARGET_RADIUS = 8
const AMBIENT_ZOOM_SPEED = 0.012

const tmpPos = new THREE.Vector3()
const tmpTarget = new THREE.Vector3()
const tmpOffset = new THREE.Vector3()

export default function CameraController() {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const userInteracting = useRef(false)
  // Once the camera reaches the target radius (or the user grabs the
  // controls), the ambient dolly-in is considered done and never resumes.
  const ambientZoomDoneRef = useRef(false)

  const phase = useStore((s) => s.phase)
  const characterSpawn = useStore((s) => s.characterSpawn)

  const isDeliveryView =
    phase === PHASES.DELIVERY_ARRIVING || phase === PHASES.DELIVERY_DROPPING

  const isCleanupView =
    phase === PHASES.CLEANUP_ARRIVING || phase === PHASES.CLEANUP_DROPPING

  // Unlock as soon as the character is fully spawned — UFO can keep flying
  // off in the background while the user is free to orbit.
  const isIntroLocked =
    phase === PHASES.INTRO_ARRIVING ||
    (phase === PHASES.INTRO_DROPPING && characterSpawn < 0.99)

  const isCinematic = isIntroLocked || isDeliveryView || isCleanupView

  // Slow ambient orbit kicks in once the programmer has fully arrived,
  // and only when the UFO isn't actively performing a delivery or cleanup.
  const wantsAutoRotate = characterSpawn >= 0.99 && !isDeliveryView && !isCleanupView

  useEffect(() => {
    if (!controlsRef.current) return
    controlsRef.current.enabled = !isCinematic
  }, [isCinematic])

  useEffect(() => {
    const ctrl = controlsRef.current
    if (!ctrl) return
    const onStart = () => {
      userInteracting.current = true
      // Stop fighting the user — once they touch the controls,
      // we leave camera distance to them.
      ambientZoomDoneRef.current = true
    }
    const onEnd = () => {
      userInteracting.current = false
    }
    ctrl.addEventListener('start', onStart)
    ctrl.addEventListener('end', onEnd)
    return () => {
      ctrl.removeEventListener('start', onStart)
      ctrl.removeEventListener('end', onEnd)
    }
  }, [])

  useFrame((_, delta) => {
    if (!controlsRef.current) return

    // Pause ambient orbit while the user is dragging the camera.
    controlsRef.current.autoRotate = wantsAutoRotate && !userInteracting.current

    // Slow dolly-in toward AMBIENT_TARGET_RADIUS while ambient and untouched.
    if (wantsAutoRotate && !userInteracting.current && !ambientZoomDoneRef.current) {
      tmpOffset.copy(camera.position).sub(controlsRef.current.target)
      const radius = tmpOffset.length()
      if (radius <= AMBIENT_TARGET_RADIUS + 0.05) {
        ambientZoomDoneRef.current = true
      } else {
        const factor = 1 - Math.pow(1 - AMBIENT_ZOOM_SPEED, delta * 60)
        const next = THREE.MathUtils.lerp(radius, AMBIENT_TARGET_RADIUS, factor)
        tmpOffset.setLength(Math.max(next, AMBIENT_TARGET_RADIUS))
        camera.position.copy(controlsRef.current.target).add(tmpOffset)
      }
    }

    if (!isCinematic) return
    if (userInteracting.current) return

    const target = isDeliveryView ? DELIVERY_TARGET : BASE_TARGET
    const pos = isDeliveryView ? DELIVERY_POS : BASE_POS

    const factor = 1 - Math.pow(1 - 0.04, delta * 60)
    tmpPos.copy(camera.position).lerp(pos, factor)
    camera.position.copy(tmpPos)

    tmpTarget.copy(controlsRef.current.target).lerp(target, factor)
    controlsRef.current.target.copy(tmpTarget)
    controlsRef.current.update()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom
      enablePan={false}
      minDistance={6}
      maxDistance={18}
      maxPolarAngle={Math.PI / 2.2}
      target={[0, 1.8, 0]}
      autoRotateSpeed={0.6}
      makeDefault
    />
  )
}
