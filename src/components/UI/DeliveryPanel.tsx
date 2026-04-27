import { useTranslation } from 'react-i18next'
import { useStore, PHASES } from '../../store.ts'
import { deliveries } from '../../data/deliveries.ts'

interface TranslatedItem {
  name: string
  desc: string
}

export default function DeliveryPanel() {
  const { t } = useTranslation()
  const phase = useStore((s) => s.phase)
  const activeDelivery = useStore((s) => s.activeDelivery)
  const closeDelivery = useStore((s) => s.closeDelivery)

  const open = phase === PHASES.DELIVERY_ACTIVE
  const meta = activeDelivery ? deliveries[activeDelivery] : null

  const items =
    activeDelivery === 'projects'
      ? (t('deliveries.projects.items', { returnObjects: true }) as TranslatedItem[])
      : null

  return (
    <aside
      aria-hidden={!open}
      className={[
        'fixed top-6 right-6 z-20 w-[360px] max-w-[calc(100vw-3rem)]',
        'glass-strong rounded-2xl shadow-2xl',
        'transition-all duration-500 ease-out',
        open ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0',
      ].join(' ')}
    >
      {meta && activeDelivery && (
        <div className="p-6 text-white">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t(`deliveries.${activeDelivery}.title`)}
            </h2>
            <button
              onClick={closeDelivery}
              aria-label={t('delivery.close')}
              className="w-8 h-8 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition flex items-center justify-center text-lg leading-none"
            >
              ×
            </button>
          </div>

          <p className="text-white/80 text-sm leading-relaxed mb-4">
            {t(`deliveries.${activeDelivery}.body`)}
          </p>

          {items && (
            <ul className="space-y-3 mt-4">
              {items.map((item) => (
                // Project links intentionally not wired up yet — restore the
                // <a href={meta.itemLinks![i]}> wrapper around this <div> when
                // real URLs land in deliveries.projects.itemLinks.
                <li
                  key={item.name}
                  className="rounded-xl border border-white/15 bg-white/5 p-4"
                >
                  <div className="text-white font-medium mb-1">{item.name}</div>
                  <div className="text-white/70 text-xs">{item.desc}</div>
                </li>
              ))}
            </ul>
          )}

          {meta.email && (
            <a
              href={`mailto:${meta.email}`}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-900 font-medium text-sm hover:bg-white/90 transition"
            >
              {meta.email}
            </a>
          )}
        </div>
      )}
    </aside>
  )
}
