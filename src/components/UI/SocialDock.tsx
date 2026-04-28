import { useTranslation } from 'react-i18next'
import { socialLinks } from '../../lib/socialLinks.ts'
import { useStore } from '../../store.ts'

export default function SocialDock() {
  const { t } = useTranslation()
  const characterSpawn = useStore((s) => s.characterSpawn)
  // Slide up from below in sync with the bottom navigation, once the UFO
  // starts spawning the character on its first arrival.
  const revealed = characterSpawn > 0

  return (
    <div
      className={[
        'hidden sm:block fixed bottom-8 right-6 z-10',
        'transition-all duration-700 ease-out',
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0 pointer-events-none',
      ].join(' ')}
    >
      <div className="glass rounded-full px-2 py-2 flex gap-1">
        {socialLinks.map((it) => (
          <a
            key={it.labelKey}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            aria-label={t(it.labelKey)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/85 text-sm font-medium hover:bg-white/15 border border-transparent hover:border-white/20 transition"
          >
            {it.glyph}
          </a>
        ))}
      </div>
    </div>
  )
}
