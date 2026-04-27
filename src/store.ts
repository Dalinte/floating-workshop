import { create } from 'zustand'

export const PHASES = {
  IDLE: 'idle',
  INTRO_ARRIVING: 'intro_arriving',
  INTRO_DROPPING: 'intro_dropping',
  INTRO_LEAVING: 'intro_leaving',
  INTERACTIVE: 'interactive',
  DELIVERY_ARRIVING: 'delivery_arriving',
  DELIVERY_DROPPING: 'delivery_dropping',
  DELIVERY_ACTIVE: 'delivery_active',
  DELIVERY_LEAVING: 'delivery_leaving',
} as const

export type Phase = (typeof PHASES)[keyof typeof PHASES]

export type DeliveryId = 'about' | 'projects' | 'contact'

export interface StoreState {
  phase: Phase
  activeDelivery: DeliveryId | null
  introCompleted: boolean
  characterVisible: boolean
  characterSpawn: number
  beamIntensity: number

  setPhase: (phase: Phase) => void
  setCharacterVisible: (visible: boolean) => void
  setCharacterSpawn: (v: number) => void
  setBeamIntensity: (v: number) => void
  setActiveDelivery: (id: DeliveryId | null) => void

  requestDelivery: (id: DeliveryId) => void
  closeDelivery: () => void
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

  setPhase: (phase) => set({ phase }),
  setCharacterVisible: (visible) => set({ characterVisible: visible }),
  setCharacterSpawn: (v) => set({ characterSpawn: v }),
  setBeamIntensity: (v) => set({ beamIntensity: v }),
  setActiveDelivery: (id) => set({ activeDelivery: id }),

  requestDelivery: (id) => {
    const { phase, characterSpawn } = get()
    const introReady = characterSpawn >= 0.99
    if (phase !== PHASES.INTERACTIVE && !introReady) return
    // If clicked during the intro tail (post-spawn beam-out / UFO leave),
    // mark intro complete and zero the beam so the delivery beam-in starts clean.
    set({
      activeDelivery: id,
      phase: PHASES.DELIVERY_ARRIVING,
      introCompleted: true,
      beamIntensity: 0,
    })
  },

  closeDelivery: () => {
    const { phase } = get()
    if (phase !== PHASES.DELIVERY_ACTIVE) return
    set({ phase: PHASES.DELIVERY_LEAVING })
  },

  skipIntro: () => {
    set({
      phase: PHASES.INTERACTIVE,
      introCompleted: true,
      characterVisible: true,
      characterSpawn: 1,
      beamIntensity: 0,
      activeDelivery: null,
    })
  },

  finishIntro: () => set({ introCompleted: true, phase: PHASES.INTERACTIVE }),
}))
