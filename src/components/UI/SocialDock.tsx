interface SocialItem {
  label: string
  href: string
  glyph: string
}

const items: SocialItem[] = [
  { label: 'GitHub', href: import.meta.env.VITE_SOCIAL_GITHUB_URL, glyph: '⌘' },
  { label: 'LinkedIn', href: import.meta.env.VITE_SOCIAL_LINKEDIN_URL, glyph: 'in' },
  { label: 'Email', href: `mailto:${import.meta.env.VITE_SOCIAL_EMAIL}`, glyph: '✉' },
]

export default function SocialDock() {
  return (
    <div className="fixed bottom-8 right-6 z-10">
      <div className="glass rounded-full px-2 py-2 flex gap-1">
        {items.map((it) => (
          <a
            key={it.label}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            aria-label={it.label}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/85 text-sm font-medium hover:bg-white/15 border border-transparent hover:border-white/20 transition"
          >
            {it.glyph}
          </a>
        ))}
      </div>
    </div>
  )
}
