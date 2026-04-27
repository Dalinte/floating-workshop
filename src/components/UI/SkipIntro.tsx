import { useStore, PHASES, type Phase } from '../../store.ts'

const introPhases = new Set<Phase>([
  PHASES.IDLE,
  PHASES.INTRO_ARRIVING,
  PHASES.INTRO_DROPPING,
  PHASES.INTRO_LEAVING,
])

export default function SkipIntro() {
  const phase = useStore((s) => s.phase)
  const introCompleted = useStore((s) => s.introCompleted)
  const skipIntro = useStore((s) => s.skipIntro)

  if (introCompleted || !introPhases.has(phase)) return null

  return (
    <button
      onClick={skipIntro}
      className="fixed top-6 right-6 z-10 glass rounded-full px-4 py-2 text-sm text-white/85 hover:bg-white/15 transition"
    >
      Skip intro →
    </button>
  )
}
