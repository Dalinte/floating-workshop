import { useMemo } from 'react'
import { useStore, PHASES, type Creature } from '../../store.ts'
import { deliveries } from '../../data/deliveries.ts'
import Rabbit from './Rabbit.tsx'
import Fox from './Fox.tsx'
import Turtle from './Turtle.tsx'

interface CreatureProps {
  spawnProgress: number
  wanderEnabled: boolean
  cleanupProgress: number
}

function renderCreature(c: Creature, props: CreatureProps) {
  switch (deliveries[c.deliveryId].creature) {
    case 'rabbit':
      return <Rabbit key={c.id} {...props} />
    case 'fox':
      return <Fox key={c.id} {...props} />
    case 'turtle':
      return <Turtle key={c.id} {...props} />
    default:
      return null
  }
}

export default function Creatures() {
  const phase = useStore((s) => s.phase)
  const creatures = useStore((s) => s.creatures)
  const spawningCreature = useStore((s) => s.spawningCreature)
  const creatureSpawn = useStore((s) => s.creatureSpawn)
  const cleanupProgress = useStore((s) => s.cleanupProgress)

  const isCleanup =
    phase === PHASES.CLEANUP_ARRIVING || phase === PHASES.CLEANUP_DROPPING
  // Already-committed creatures keep wandering even while a new one is being
  // delivered — only the cleanup phases freeze them so the slurp animation
  // can pick a clean trajectory.
  const wanderEnabled = !isCleanup

  const all = useMemo(() => {
    const list: Array<{ creature: Creature; spawning: boolean }> = creatures.map((c) => ({
      creature: c,
      spawning: false,
    }))
    if (spawningCreature) list.push({ creature: spawningCreature, spawning: true })
    return list
  }, [creatures, spawningCreature])

  return (
    <>
      {all.map(({ creature, spawning }) =>
        renderCreature(creature, {
          spawnProgress: spawning ? creatureSpawn : 1,
          wanderEnabled: !spawning && wanderEnabled,
          // The in-flight creature isn't part of cleanup (cleanup only runs
          // from INTERACTIVE, where there's no spawning creature anyway).
          cleanupProgress: spawning ? 0 : isCleanup ? cleanupProgress : 0,
        }),
      )}
    </>
  )
}
