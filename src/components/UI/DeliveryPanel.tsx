import { useTranslation } from 'react-i18next'
import { useStore } from '../../store.ts'
import { socialLinks } from '../../lib/socialLinks.ts'

interface TranslatedItem {
  name: string
  desc: string
}

export default function DeliveryPanel() {
  const { t } = useTranslation()
  const open = useStore((s) => s.panelOpen)
  const panelDelivery = useStore((s) => s.panelDelivery)
  const closePanel = useStore((s) => s.closePanel)

  const items =
    panelDelivery === 'projects'
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
      {panelDelivery && (
        <div className="p-6 text-white">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t(`deliveries.${panelDelivery}.title`)}
            </h2>
            <button
              onClick={closePanel}
              aria-label={t('delivery.close')}
              className="w-8 h-8 rounded-full border border-white/20 text-white/80 hover:bg-white/10 transition flex items-center justify-center text-lg leading-none"
            >
              ×
            </button>
          </div>

          <p className="text-white/80 text-sm leading-relaxed mb-4">
            {t(`deliveries.${panelDelivery}.body`)}
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

          {panelDelivery === 'contact' && (
            <ul className="mt-2 flex flex-col gap-2">
              {socialLinks.map((link) => (
                <li key={link.labelKey}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm transition"
                  >
                    <span className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 text-white/80 text-xs font-medium">
                      {link.glyph}
                    </span>
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </aside>
  )
}
