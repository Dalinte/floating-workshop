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
    <div className="fixed bottom-8 right-6 z-10">
      <div className="glass rounded-full px-2 py-2 flex gap-1">
        {items.map((it) => (
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
