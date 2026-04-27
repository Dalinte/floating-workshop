import { useTranslation } from 'react-i18next'

interface SocialItem {
  labelKey: 'social.github' | 'social.linkedin' | 'social.email'
  href: string
  glyph: string
}

const items: SocialItem[] = [
  { labelKey: 'social.github', href: import.meta.env.VITE_SOCIAL_GITHUB_URL, glyph: '⌘' },
  { labelKey: 'social.linkedin', href: import.meta.env.VITE_SOCIAL_LINKEDIN_URL, glyph: 'in' },
  { labelKey: 'social.email', href: `mailto:${import.meta.env.VITE_SOCIAL_EMAIL}`, glyph: '✉' },
]

export default function SocialDock() {
  const { t } = useTranslation()
  return (
    <div className="fixed bottom-20 sm:bottom-8 right-3 sm:right-6 z-10">
      <div className="glass rounded-full px-1.5 py-1.5 sm:px-2 sm:py-2 flex gap-1">
        {items.map((it) => (
          <a
            key={it.labelKey}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            aria-label={t(it.labelKey)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white/85 text-xs sm:text-sm font-medium hover:bg-white/15 border border-transparent hover:border-white/20 transition"
          >
            {it.glyph}
          </a>
        ))}
      </div>
    </div>
  )
}
