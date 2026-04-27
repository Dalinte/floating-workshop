import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const skyVertex = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const skyFragment = /* glsl */ `
  varying vec3 vWorldPos;
  uniform vec3 topColor;
  uniform vec3 midColor;
  uniform vec3 bottomColor;
  void main() {
    vec3 dir = normalize(vWorldPos);
    float t = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 col;
    if (t < 0.5) {
      col = mix(bottomColor, midColor, smoothstep(0.0, 0.5, t));
    } else {
      col = mix(midColor, topColor, smoothstep(0.5, 1.0, t));
    }
    gl_FragColor = vec4(col, 1.0);
  }
`

interface CloudProps {
  position: [number, number, number]
  scale?: number
  speed?: number
}

function Cloud({ position, scale = 1, speed = 0.02 }: CloudProps) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.position.x += speed * delta * 10
    if (ref.current.position.x > 40) ref.current.position.x = -40
  })
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#fff5e6" transparent opacity={0.55} flatShading roughness={1} />
      </mesh>
      <mesh position={[1.2, -0.2, 0.3]}>
        <icosahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial color="#ffe2c2" transparent opacity={0.5} flatShading roughness={1} />
      </mesh>
      <mesh position={[-1.1, -0.1, -0.2]}>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color="#ffd1a3" transparent opacity={0.5} flatShading roughness={1} />
      </mesh>
    </group>
  )
}

export default function Sky() {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color('#2b1d5c') },
      midColor: { value: new THREE.Color('#a35a8a') },
      bottomColor: { value: new THREE.Color('#ffb070') },
    }),
    [],
  )

  return (
    <group>
      <mesh>
        <sphereGeometry args={[80, 32, 16]} />
        <shaderMaterial
          side={THREE.BackSide}
          uniforms={uniforms}
          vertexShader={skyVertex}
          fragmentShader={skyFragment}
          depthWrite={false}
        />
      </mesh>
      <fog attach="fog" args={['#a35a8a', 25, 90]} />
      <Cloud position={[-12, 7, -10]} scale={1.6} speed={0.05} />
      <Cloud position={[14, 4, -14]} scale={2.0} speed={0.04} />
      <Cloud position={[-6, 10, -22]} scale={2.4} speed={0.03} />
      <Cloud position={[10, 9, 10]} scale={1.4} speed={0.06} />
      <Cloud position={[-18, 8, 6]} scale={1.8} speed={0.045} />
    </group>
  )
}
