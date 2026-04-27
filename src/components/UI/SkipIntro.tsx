import { useTranslation } from 'react-i18next'
import { useStore, PHASES, type Phase } from '../../store.ts'

const introPhases = new Set<Phase>([
  PHASES.IDLE,
  PHASES.INTRO_ARRIVING,
  PHASES.INTRO_DROPPING,
  PHASES.INTRO_LEAVING,
])

export default function SkipIntro() {
  const { t } = useTranslation()
  const phase = useStore((s) => s.phase)
  const introCompleted = useStore((s) => s.introCompleted)
  const characterSpawn = useStore((s) => s.characterSpawn)
  const skipIntro = useStore((s) => s.skipIntro)

  // Hide as soon as the programmer has fully spawned — the user shouldn't
  // need to wait for the beam-out / UFO leave to be considered "done".
  if (introCompleted || characterSpawn >= 0.99 || !introPhases.has(phase)) return null

  return (
    <button
      onClick={skipIntro}
      className="hidden sm:block fixed top-6 right-6 z-10 glass rounded-full px-4 py-2 text-sm text-white/85 hover:bg-white/15 transition"
    >
      {t('intro.skip')}
    </button>
  )
}
