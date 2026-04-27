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

const tmpPos = new THREE.Vector3()
const tmpTarget = new THREE.Vector3()

export default function CameraController() {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const userInteracting = useRef(false)

  const phase = useStore((s) => s.phase)

  const isDeliveryView =
    phase === PHASES.DELIVERY_ARRIVING ||
    phase === PHASES.DELIVERY_DROPPING ||
    phase === PHASES.DELIVERY_ACTIVE ||
    phase === PHASES.DELIVERY_LEAVING

  const isCinematic =
    phase === PHASES.INTRO_ARRIVING ||
    phase === PHASES.INTRO_DROPPING ||
    phase === PHASES.INTRO_LEAVING ||
    isDeliveryView

  useEffect(() => {
    if (!controlsRef.current) return
    controlsRef.current.enabled = !isCinematic
  }, [isCinematic])

  useEffect(() => {
    const ctrl = controlsRef.current
    if (!ctrl) return
    const onStart = () => {
      userInteracting.current = true
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
      makeDefault
    />
  )
}
