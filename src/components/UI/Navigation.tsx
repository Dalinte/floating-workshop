import { useTranslation } from 'react-i18next'
import { useStore, PHASES } from '../../store.ts'
import { deliveryList } from '../../data/deliveries.ts'

export default function Navigation() {
  const { t } = useTranslation()
  const phase = useStore((s) => s.phase)
  const activeDelivery = useStore((s) => s.activeDelivery)
  const characterSpawn = useStore((s) => s.characterSpawn)
  const requestDelivery = useStore((s) => s.requestDelivery)

  const inDelivery =
    phase === PHASES.DELIVERY_ARRIVING ||
    phase === PHASES.DELIVERY_DROPPING ||
    phase === PHASES.DELIVERY_ACTIVE ||
    phase === PHASES.DELIVERY_LEAVING

  const enabled = !inDelivery && characterSpawn >= 0.99

  return (
    <nav className="fixed bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="glass rounded-full px-1.5 py-1.5 sm:px-2 sm:py-2 flex gap-1 sm:gap-2 shadow-lg">
        {deliveryList.map((d) => {
          const isActive = activeDelivery === d.id
          const classes = [
            'whitespace-nowrap px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-base font-medium transition-all border',
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
