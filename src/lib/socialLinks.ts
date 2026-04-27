export type SocialLabelKey = 'social.github' | 'social.linkedin' | 'social.email'

export interface SocialLink {
  labelKey: SocialLabelKey
  href: string
  glyph: string
}

export const socialLinks: SocialLink[] = [
  {
    labelKey: 'social.github',
    href: import.meta.env.VITE_SOCIAL_GITHUB_URL,
    glyph: '⌘',
  },
  {
    labelKey: 'social.linkedin',
    href: import.meta.env.VITE_SOCIAL_LINKEDIN_URL,
    glyph: 'in',
  },
  {
    labelKey: 'social.email',
    href: `mailto:${import.meta.env.VITE_SOCIAL_EMAIL}`,
    glyph: '✉',
  },
]
