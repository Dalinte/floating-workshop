import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ufoWorldPos } from '../lib/ufoTracker.ts'

// Local Y of the grass top inside the Island group (grass cylinder is at
// local 0 with height 0.4, so the top face is at +0.2). Add a hair to
// avoid z-fighting with the grass.
const GRASS_TOP_LOCAL_Y = 0.21
// Footprint roughly matching the UFO hull radius.
const SHADOW_RADIUS = 1.1
// World-Y above which the UFO is far enough that the shadow is invisible.
const FADE_START_Y = 4.5
const FADE_END_Y = 12
const MAX_OPACITY = 0.4

/**
 * Vertical "blob shadow" drawn directly under the UFO, parented to Island.
 * Cheaper than a real cast shadow (saves a shadow-map pass for 11 UFO meshes)
 * and acts as a clear visual marker for where the UFO has arrived.
 *
 * Mount as a child of <Island>; relies on the island only translating in Y
 * (no rotation), so world-X/Z equals island-local-X/Z.
 */
export default function UfoShadow() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(() => {
    const mesh = meshRef.current
    const mat = matRef.current
    if (!mesh || !mat) return

    const yWorld = ufoWorldPos.y
    if (yWorld >= FADE_END_Y) {
      mesh.visible = false
      return
    }
    mesh.visible = true

    mesh.position.x = ufoWorldPos.x
    mesh.position.z = ufoWorldPos.z

    const t = THREE.MathUtils.clamp((yWorld - FADE_START_Y) / (FADE_END_Y - FADE_START_Y), 0, 1)
    mat.opacity = THREE.MathUtils.lerp(MAX_OPACITY, 0, t)
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, GRASS_TOP_LOCAL_Y, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false}
    >
      <circleGeometry args={[SHADOW_RADIUS, 24]} />
      <meshBasicMaterial ref={matRef} color="#000000" transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}
