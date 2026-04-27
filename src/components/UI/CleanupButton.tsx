import { useTranslation } from 'react-i18next'
import { useStore, PHASES, isAnyCreatureSpawned } from '../../store.ts'

export default function CleanupButton() {
  const { t } = useTranslation()
  const phase = useStore((s) => s.phase)
  const anySpawned = useStore(isAnyCreatureSpawned)
  const requestCleanup = useStore((s) => s.requestCleanup)

  const enabled = phase === PHASES.INTERACTIVE
  // Visible whenever at least one creature is on the island. The button
  // remains rendered but invisible/non-interactive otherwise so it can
  // smoothly fade in/out via CSS transitions.
  const visible = anySpawned

  return (
    <button
      onClick={requestCleanup}
      disabled={!enabled || !visible}
      aria-hidden={!visible}
      className={[
        'fixed right-4 sm:right-6 bottom-20 sm:bottom-24 z-10',
        'glass-strong rounded-full px-4 py-2 text-sm text-white/90 shadow-lg',
        'hover:bg-white/15 border border-white/15 transition-all duration-300',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none',
        !enabled && visible ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}
    >
      {t('cleanup.button')}
    </button>
  )
}
