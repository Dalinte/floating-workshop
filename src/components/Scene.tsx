import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useStore } from '../store.ts'
import Sky from './Sky.tsx'
import Lights from './Lights.tsx'
import Island from './Island.tsx'
import Character from './Character.tsx'
import Creatures from './creatures/Creatures.tsx'
import DeliverySequence from './DeliverySequence.tsx'
import CameraController from './CameraController.tsx'

function CharacterFromStore() {
  const visible = useStore((s) => s.characterVisible)
  const spawn = useStore((s) => s.characterSpawn)
  return <Character visible={visible} spawnProgress={spawn} />
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [6, 4, 8], fov: 45 }}
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: false }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#1a1530']} />
        <Sky />
        <Lights />

        <Island>
          <CharacterFromStore />
          <Creatures />
        </Island>

        <DeliverySequence />
        <CameraController />

        <EffectComposer>
          <Bloom intensity={0.8} luminanceThreshold={0.6} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
