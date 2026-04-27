import { useEffect, useMemo } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils, type GLTF } from 'three-stdlib'

const MODEL_URL = '/models/character.glb'
const ANIMATION_NAME = 'Animation'

const TARGET_HEIGHT = 1.6
const POSITION: [number, number, number] = [0, 0.2, 0]
const ROTATION_Y = 0
const POSITION_OFFSET: [number, number, number] = [0, 0, 0]

interface CharacterProps {
  visible: boolean
  spawnProgress?: number
}

export default function Character({ visible, spawnProgress = 0 }: CharacterProps) {
  const gltf = useGLTF(MODEL_URL) as unknown as GLTF
  const cloned = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf.scene])
  const { actions } = useAnimations(gltf.animations, cloned)

  useEffect(() => {
    cloned.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
  }, [cloned])

  useEffect(() => {
    const action = actions[ANIMATION_NAME]
    if (!action) return
    action.reset().setLoop(THREE.LoopRepeat, Infinity).play()
    return () => {
      action.stop()
    }
  }, [actions])

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    const targetScale = size.y > 0.001 ? TARGET_HEIGHT / size.y : 1
    return {
      targetScale,
      modelOffset: [-center.x, -box.min.y, -center.z] as [number, number, number],
    }
  }, [cloned])

  if (!visible || spawnProgress <= 0.001) return null

  const s = Math.max(0, Math.min(1, spawnProgress)) * fit.targetScale
  const finalPos: [number, number, number] = [
    POSITION[0] + POSITION_OFFSET[0],
    POSITION[1] + POSITION_OFFSET[1],
    POSITION[2] + POSITION_OFFSET[2],
  ]

  return (
    <group position={finalPos} rotation={[0, ROTATION_Y, 0]} scale={s}>
      <primitive object={cloned} position={fit.modelOffset} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
