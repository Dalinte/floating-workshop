import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import ru from './locales/ru.json'

const SUPPORTED = ['en', 'ru'] as const
type Supported = (typeof SUPPORTED)[number]

const isSupported = (value: string): value is Supported =>
  (SUPPORTED as readonly string[]).includes(value)

// Custom path detector: only returns a language when the first path segment
// is exactly `ru` or `en`. For `/fr/...`, `/about`, or `/`, it returns
// `undefined` so the detector chain falls through to `navigator`.
const pathDetector = {
  name: 'path',
  lookup(): string | undefined {
    if (typeof window === 'undefined') return undefined
    const segment = window.location.pathname.split('/')[1]?.toLowerCase()
    return segment && isSupported(segment) ? segment : undefined
  },
}

const detector = new LanguageDetector()
detector.addDetector(pathDetector)

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
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0,
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? i18n.language
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

export default i18n
