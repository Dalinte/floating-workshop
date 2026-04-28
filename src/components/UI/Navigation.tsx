import { useTranslation } from 'react-i18next'
import { useStore } from '../../store.ts'
import { deliveryList } from '../../data/deliveries.ts'

export default function Navigation() {
  const { t } = useTranslation()
  const panelOpen = useStore((s) => s.panelOpen)
  const panelDelivery = useStore((s) => s.panelDelivery)
  const characterSpawn = useStore((s) => s.characterSpawn)
  const requestDelivery = useStore((s) => s.requestDelivery)

  // Menu state is independent of the UFO. Buttons are clickable as soon as
  // the character has spawned — clicks always switch the panel/active button
  // instantly; whether the UFO also flies in to deliver is decided in the
  // store (only when the UFO is idle).
  const enabled = characterSpawn >= 0.99
  // Slide the dock up from below the viewport once the UFO starts spawning
  // the character on its first arrival.
  const revealed = characterSpawn > 0

  return (
    <nav className="fixed bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div
        className={[
          'glass rounded-full px-1.5 py-1.5 sm:px-2 sm:py-2 flex gap-1 sm:gap-2 shadow-lg',
          'transition-all duration-700 ease-out',
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0 pointer-events-none',
        ].join(' ')}
      >
        {deliveryList.map((d) => {
          const isActive = panelOpen && panelDelivery === d.id
          const classes = [
            'whitespace-nowrap px-3 py-1.5 sm:px-5 sm:py-2 rounded-full font-medium transition-all border',
            isActive
              ? 'bg-white text-slate-900 border-white shadow'
              : 'border-white/20 text-white/90 hover:bg-white/10',
            !enabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : '',
          ]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={d.id}
              onClick={() => requestDelivery(d.id)}
              disabled={!enabled}
              className={classes}
            >
              {t(`deliveries.${d.id}.title`)}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
