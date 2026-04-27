import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import ru from './locales/ru.json'

const SUPPORTED = ['en', 'ru'] as const
type Supported = (typeof SUPPORTED)[number]

const isSupported = (value: string): value is Supported =>
  (SUPPORTED as readonly string[]).includes(value)

// Returns the first path segment only when it is exactly `ru` or `en`.
// Named `supportedPath` (not `path`) to avoid name collision with the
// built-in `path` detector, which i18next-browser-languagedetector
// re-registers on every `init()` call and would overwrite ours.
const supportedPathDetector = {
  name: 'supportedPath',
  lookup(): string | undefined {
    if (typeof window === 'undefined') return undefined
    const segment = window.location.pathname.split('/')[1]?.toLowerCase()
    return segment && isSupported(segment) ? segment : undefined
  },
}

const detector = new LanguageDetector()
detector.addDetector(supportedPathDetector)

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    nonExplicitSupportedLngs: true,
    detection: {
      order: ['supportedPath', 'navigator'],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? i18n.language
  })
  .catch((err) => {
    console.error('i18n init failed', err)
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

export default i18n
