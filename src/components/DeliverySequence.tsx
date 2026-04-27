import { useEffect, useRef, useState } from 'react'
import { useStore, PHASES } from '../store.ts'
import UFO from './UFO.tsx'
import Beam from './Beam.tsx'
import { CREATURE_DROP_X, CREATURE_DROP_Z } from '../lib/creatureTracker.ts'

type Vec3 = [number, number, number]

const UFO_OFFSCREEN: Vec3 = [20, 15, -10]
const UFO_OVER_ISLAND: Vec3 = [0, 4.5, 0]
const UFO_HOVER_Y = 4.5
const UFO_OVER_DELIVERY_DROP: Vec3 = [CREATURE_DROP_X, UFO_HOVER_Y, CREATURE_DROP_Z]
const ISLAND_TOP_Y = 1.4

interface AbortRef {
  current: boolean
}

function tween(
  from: number,
  to: number,
  duration: number,
  onUpdate: (v: number) => void,
  abort?: AbortRef,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now()
    const step = (now: number) => {
      if (abort?.current) {
        resolve()
        return
      }
      const t = Math.min(1, (now - start) / duration)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      onUpdate(from + (to - from) * eased)
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

function delay(ms: number, abort?: AbortRef): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now()
    const tick = () => {
      if (abort?.current) {
        resolve()
        return
      }
      if (performance.now() - start >= ms) {
        resolve()
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

export default function DeliverySequence() {
  const phase = useStore((s) => s.phase)
  const introCompleted = useStore((s) => s.introCompleted)
  const beamIntensity = useStore((s) => s.beamIntensity)

  const setPhase = useStore((s) => s.setPhase)
  const setCharacterVisible = useStore((s) => s.setCharacterVisible)
  const setCharacterSpawn = useStore((s) => s.setCharacterSpawn)
  const setBeamIntensity = useStore((s) => s.setBeamIntensity)
  const setCreatureSpawn = useStore((s) => s.setCreatureSpawn)
  const setCleanupProgress = useStore((s) => s.setCleanupProgress)
  const commitSpawningCreature = useStore((s) => s.commitSpawningCreature)
  const clearSpawnedCreatures = useStore((s) => s.clearSpawnedCreatures)
  const setPanel = useStore((s) => s.setPanel)
  const finishIntro = useStore((s) => s.finishIntro)

  const [ufoTarget, setUfoTarget] = useState<Vec3>(UFO_OFFSCREEN)
  const arrivedHandlerRef = useRef<(() => void) | null>(null)

  // ─── Intro flow ────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === PHASES.IDLE && !introCompleted) {
      const id = setTimeout(() => {
        if (useStore.getState().phase === PHASES.IDLE) {
          setPhase(PHASES.INTRO_ARRIVING)
        }
      }, 700)
      return () => clearTimeout(id)
    }
  }, [phase, introCompleted, setPhase])

  useEffect(() => {
    if (phase !== PHASES.INTRO_ARRIVING) return
    setUfoTarget(UFO_OVER_ISLAND)
    arrivedHandlerRef.current = () => {
      if (useStore.getState().phase === PHASES.INTRO_ARRIVING) {
        setPhase(PHASES.INTRO_DROPPING)
      }
    }
    return () => {
      arrivedHandlerRef.current = null
    }
  }, [phase, setPhase])

  useEffect(() => {
    if (phase !== PHASES.INTRO_DROPPING) return
    const abort: AbortRef = { current: false }
    ;(async () => {
      await tween(0, 1, 500, setBeamIntensity, abort)
      if (abort.current) return
      setCharacterVisible(true)
      await delay(180, abort)
      await tween(0, 1, 900, setCharacterSpawn, abort)
      await delay(250, abort)
      await tween(1, 0, 500, setBeamIntensity, abort)
      if (abort.current) return
      setPhase(PHASES.INTRO_LEAVING)
    })()
    return () => {
      abort.current = true
    }
  }, [phase, setBeamIntensity, setCharacterVisible, setCharacterSpawn, setPhase])

  useEffect(() => {
    if (phase !== PHASES.INTRO_LEAVING) return
    setUfoTarget(UFO_OFFSCREEN)
    arrivedHandlerRef.current = () => {
      if (useStore.getState().phase === PHASES.INTRO_LEAVING) {
        finishIntro()
      }
    }
    return () => {
      arrivedHandlerRef.current = null
    }
  }, [phase, finishIntro])

  useEffect(() => {
    if (phase !== PHASES.INTERACTIVE) return
    setUfoTarget(UFO_OFFSCREEN)
  }, [phase])

  // ─── Delivery flow (creature stays on the island after drop) ───────────

  useEffect(() => {
    if (phase !== PHASES.DELIVERY_ARRIVING) return
    setUfoTarget(UFO_OVER_DELIVERY_DROP)
    arrivedHandlerRef.current = () => {
      if (useStore.getState().phase === PHASES.DELIVERY_ARRIVING) {
        setPhase(PHASES.DELIVERY_DROPPING)
      }
    }
    return () => {
      arrivedHandlerRef.current = null
    }
  }, [phase, setPhase])

  useEffect(() => {
    if (phase !== PHASES.DELIVERY_DROPPING) return
    const abort: AbortRef = { current: false }
    ;(async () => {
      // Beam in, creature scales up under the beam, beam out.
      await tween(0, 1, 500, setBeamIntensity, abort)
      if (abort.current) return
      await delay(120, abort)
      await tween(0, 1, 700, setCreatureSpawn, abort)
      await delay(180, abort)
      await tween(1, 0, 500, setBeamIntensity, abort)
      if (abort.current) return

      // Move the in-flight creature to the permanent list, open the panel,
      // hand control back. UFO drifts offscreen on its own.
      commitSpawningCreature()
      const id = useStore.getState().activeDelivery
      if (id) setPanel(true, id)
      setUfoTarget(UFO_OFFSCREEN)
      setPhase(PHASES.INTERACTIVE)
    })()
    return () => {
      abort.current = true
    }
  }, [phase, setBeamIntensity, setCreatureSpawn, commitSpawningCreature, setPanel, setPhase])

  // ─── Cleanup flow (UFO sucks every creature up at once) ────────────────

  useEffect(() => {
    if (phase !== PHASES.CLEANUP_ARRIVING) return
    setUfoTarget(UFO_OVER_ISLAND)
    arrivedHandlerRef.current = () => {
      if (useStore.getState().phase === PHASES.CLEANUP_ARRIVING) {
        setPhase(PHASES.CLEANUP_DROPPING)
      }
    }
    return () => {
      arrivedHandlerRef.current = null
    }
  }, [phase, setPhase])

  useEffect(() => {
    if (phase !== PHASES.CLEANUP_DROPPING) return
    const abort: AbortRef = { current: false }
    ;(async () => {
      await tween(0, 1, 500, setBeamIntensity, abort)
      if (abort.current) return
      await delay(120, abort)
      // Each creature reads cleanupProgress and slurps to UFO + scales to 0.
      await tween(0, 1, 800, setCleanupProgress, abort)
      await delay(120, abort)
      await tween(1, 0, 500, setBeamIntensity, abort)
      if (abort.current) return

      clearSpawnedCreatures()
      setCleanupProgress(0)
      setUfoTarget(UFO_OFFSCREEN)
      setPhase(PHASES.INTERACTIVE)
    })()
    return () => {
      abort.current = true
    }
  }, [
    phase,
    setBeamIntensity,
    setCleanupProgress,
    clearSpawnedCreatures,
    setPhase,
  ])

  const handleArrived = () => {
    arrivedHandlerRef.current && arrivedHandlerRef.current()
  }

  const showBeam = beamIntensity > 0.01

  return (
    <>
      <UFO targetPosition={ufoTarget} onArrived={handleArrived} />
      <Beam visible={showBeam} intensity={beamIntensity} position={ufoTarget} targetY={ISLAND_TOP_Y} />
    </>
  )
}
