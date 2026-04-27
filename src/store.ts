import { create } from 'zustand'

export const PHASES = {
  IDLE: 'idle',
  INTRO_ARRIVING: 'intro_arriving',
  INTRO_DROPPING: 'intro_dropping',
  INTRO_LEAVING: 'intro_leaving',
  INTERACTIVE: 'interactive',
  DELIVERY_ARRIVING: 'delivery_arriving',
  DELIVERY_DROPPING: 'delivery_dropping',
  CLEANUP_ARRIVING: 'cleanup_arriving',
  CLEANUP_DROPPING: 'cleanup_dropping',
} as const

export type Phase = (typeof PHASES)[keyof typeof PHASES]

export type DeliveryId = 'about' | 'projects' | 'contact'

export interface Creature {
  id: number
  deliveryId: DeliveryId
}

export interface StoreState {
  phase: Phase
  activeDelivery: DeliveryId | null
  introCompleted: boolean
  characterVisible: boolean
  characterSpawn: number
  beamIntensity: number
  // Tween value used while a creature is being spawned by the UFO (DELIVERY_DROPPING).
  creatureSpawn: number
  // Tween value 0..1 driving the cleanup animation (creatures lerp to UFO + scale → 0).
  cleanupProgress: number
  // The creature currently being scaled up by the beam (or null when no spawn in flight).
  spawningCreature: Creature | null
  // All creatures permanently on the island (multiple of the same type allowed).
  creatures: Creature[]
  // Monotonic id counter for creatures.
  nextCreatureId: number
  // Panel state — independent from phase. Closing it does not move the UFO.
  panelOpen: boolean
  panelDelivery: DeliveryId | null

  setPhase: (phase: Phase) => void
  setCharacterVisible: (visible: boolean) => void
  setCharacterSpawn: (v: number) => void
  setBeamIntensity: (v: number) => void
  setCreatureSpawn: (v: number) => void
  setCleanupProgress: (v: number) => void
  setActiveDelivery: (id: DeliveryId | null) => void
  setPanel: (open: boolean, id?: DeliveryId | null) => void

  // Internal flow ops
  startSpawningCreature: (deliveryId: DeliveryId) => void
  commitSpawningCreature: () => void
  clearSpawnedCreatures: () => void

  requestDelivery: (id: DeliveryId) => void
  requestCleanup: () => void
  closePanel: () => void
  skipIntro: () => void
  finishIntro: () => void
}

export const useStore = create<StoreState>((set, get) => ({
  phase: PHASES.IDLE,
  activeDelivery: null,
  introCompleted: false,
  characterVisible: false,
  characterSpawn: 0,
  beamIntensity: 0,
  creatureSpawn: 0,
  cleanupProgress: 0,
  spawningCreature: null,
  creatures: [],
  nextCreatureId: 1,
  panelOpen: false,
  panelDelivery: null,

  setPhase: (phase) => set({ phase }),
  setCharacterVisible: (visible) => set({ characterVisible: visible }),
  setCharacterSpawn: (v) => set({ characterSpawn: v }),
  setBeamIntensity: (v) => set({ beamIntensity: v }),
  setCreatureSpawn: (v) => set({ creatureSpawn: v }),
  setCleanupProgress: (v) => set({ cleanupProgress: v }),
  setActiveDelivery: (id) => set({ activeDelivery: id }),
  setPanel: (open, id) =>
    set((s) => ({ panelOpen: open, panelDelivery: id !== undefined ? id : s.panelDelivery })),

  startSpawningCreature: (deliveryId) =>
    set((s) => ({
      spawningCreature: { id: s.nextCreatureId, deliveryId },
      nextCreatureId: s.nextCreatureId + 1,
    })),

  commitSpawningCreature: () =>
    set((s) =>
      s.spawningCreature
        ? {
            creatures: [...s.creatures, s.spawningCreature],
            spawningCreature: null,
          }
        : s,
    ),

  clearSpawnedCreatures: () => set({ creatures: [], spawningCreature: null }),

  requestDelivery: (id) => {
    const { phase, characterSpawn, nextCreatureId } = get()
    const introReady = characterSpawn >= 0.99
    if (phase !== PHASES.INTERACTIVE && !introReady) return
    set({
      activeDelivery: id,
      phase: PHASES.DELIVERY_ARRIVING,
      introCompleted: true,
      beamIntensity: 0,
      creatureSpawn: 0,
      // Create the in-flight creature now so its component mounts before
      // the spawn tween starts — its position can settle before becoming visible.
      spawningCreature: { id: nextCreatureId, deliveryId: id },
      nextCreatureId: nextCreatureId + 1,
    })
  },

  requestCleanup: () => {
    const { phase } = get()
    if (phase !== PHASES.INTERACTIVE) return
    set({
      phase: PHASES.CLEANUP_ARRIVING,
      beamIntensity: 0,
      cleanupProgress: 0,
    })
  },

  closePanel: () => set({ panelOpen: false }),

  skipIntro: () => {
    set({
      phase: PHASES.INTERACTIVE,
      introCompleted: true,
      characterVisible: true,
      characterSpawn: 1,
      beamIntensity: 0,
      creatureSpawn: 0,
      cleanupProgress: 0,
      creatures: [],
      spawningCreature: null,
      panelOpen: false,
      panelDelivery: null,
      activeDelivery: null,
    })
  },

  finishIntro: () => set({ introCompleted: true, phase: PHASES.INTERACTIVE }),
}))

export const isAnyCreatureSpawned = (s: StoreState): boolean =>
  s.creatures.length > 0 || s.spawningCreature !== null
