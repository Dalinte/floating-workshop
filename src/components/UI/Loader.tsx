import { useTranslation } from 'react-i18next'

export default function Loader() {
  const { t } = useTranslation()
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="glass-strong rounded-full px-6 py-3 text-sm tracking-wide text-white/80">
        {t('app.loading')}
      </div>
    </div>
  )
}
