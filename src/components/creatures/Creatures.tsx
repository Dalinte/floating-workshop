import { useStore, PHASES, type Phase } from '../../store.ts'
import { deliveries } from '../../data/deliveries.ts'
import Rabbit from './Rabbit.tsx'
import Fox from './Fox.tsx'
import Turtle from './Turtle.tsx'

const VISIBLE_PHASES = new Set<Phase>([
  PHASES.DELIVERY_DROPPING,
  PHASES.DELIVERY_ACTIVE,
  PHASES.DELIVERY_LEAVING,
])

// To add a new creature:
//   1. Add 'beaver' (etc.) to CreatureType in data/deliveries.ts
//   2. Create components/creatures/Beaver.tsx with the same {spawnProgress, wanderEnabled} contract
//   3. Add a case below
export default function Creatures() {
  const phase = useStore((s) => s.phase)
  const activeDelivery = useStore((s) => s.activeDelivery)
  const creatureSpawn = useStore((s) => s.creatureSpawn)

  if (!activeDelivery) return null
  if (creatureSpawn <= 0.001) return null
  if (!VISIBLE_PHASES.has(phase)) return null

  const wanderEnabled = phase === PHASES.DELIVERY_ACTIVE
  const creature = deliveries[activeDelivery].creature

  switch (creature) {
    case 'rabbit':
      return <Rabbit spawnProgress={creatureSpawn} wanderEnabled={wanderEnabled} />
    case 'fox':
      return <Fox spawnProgress={creatureSpawn} wanderEnabled={wanderEnabled} />
    case 'turtle':
      return <Turtle spawnProgress={creatureSpawn} wanderEnabled={wanderEnabled} />
    default:
      return null
  }
}
