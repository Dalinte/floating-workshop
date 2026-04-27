import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const LIGHT_COUNT = 8

interface UFOProps {
  targetPosition: [number, number, number]
  onArrived?: () => void
  speed?: number
}

export default function UFO({ targetPosition, onArrived, speed = 0.04 }: UFOProps) {
  const root = useRef<THREE.Group>(null)
  const corpus = useRef<THREE.Group>(null)
  const lightsRef = useRef<Array<THREE.MeshStandardMaterial | null>>([])
  const arrivedRef = useRef(false)
  const initializedRef = useRef(false)
  const targetVec = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    if (!root.current) return
    const t = state.clock.elapsedTime
    targetVec.set(targetPosition[0], targetPosition[1], targetPosition[2])

    // Snap to the first target on mount so we don't lerp from world origin.
    if (!initializedRef.current) {
      root.current.position.copy(targetVec)
      initializedRef.current = true
      arrivedRef.current = false
    } else {
      const factor = 1 - Math.pow(1 - speed, delta * 60)
      root.current.position.lerp(targetVec, factor)
    }

    if (corpus.current) {
      corpus.current.position.y = Math.sin(t * 2) * 0.08
      corpus.current.rotation.y += delta * 0.6
    }

    const dist = root.current.position.distanceTo(targetVec)
    if (dist > 0.5) arrivedRef.current = false
    if (!arrivedRef.current && dist < 0.08) {
      arrivedRef.current = true
      onArrived && onArrived()
    }

    lightsRef.current.forEach((mat, i) => {
      if (!mat) return
      const hue = (t * 0.3 + i / LIGHT_COUNT) % 1
      mat.color.setHSL(hue, 1, 0.6)
      mat.emissive.setHSL(hue, 1, 0.5)
    })
  })

  return (
    <group ref={root}>
      <group ref={corpus}>
        <mesh castShadow>
          <cylinderGeometry args={[1.4, 1.0, 0.3, 32]} />
          <meshStandardMaterial color="#c0c5d0" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <cylinderGeometry args={[1.0, 0.7, 0.1, 32]} />
          <meshStandardMaterial color="#7a808c" metalness={0.8} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.7, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#a8d8ff"
            metalness={0.1}
            roughness={0.05}
            transmission={0.85}
            thickness={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
        <pointLight position={[0, 0.3, 0]} intensity={0.4} color="#a8d8ff" distance={2} />
        {Array.from({ length: LIGHT_COUNT }).map((_, i) => {
          const angle = (i / LIGHT_COUNT) * Math.PI * 2
          const x = Math.cos(angle) * 1.15
          const z = Math.sin(angle) * 1.15
          return (
            <mesh key={i} position={[x, -0.12, z]}>
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshStandardMaterial
                ref={(r) => {
                  lightsRef.current[i] = r
                }}
                color="#ff66cc"
                emissive="#ff66cc"
                emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}
