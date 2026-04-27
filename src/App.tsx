import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import Scene from './components/Scene.tsx'
import Header from './components/UI/Header.tsx'
import Navigation from './components/UI/Navigation.tsx'
import DeliveryPanel from './components/UI/DeliveryPanel.tsx'
import SocialDock from './components/UI/SocialDock.tsx'
import SkipIntro from './components/UI/SkipIntro.tsx'

function Loader() {
  const { t } = useTranslation()
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="glass-strong rounded-full px-6 py-3 text-sm tracking-wide text-white/80">
        {t('app.loading')}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="fixed inset-0">
      <Suspense fallback={<Loader />}>
        <Scene />
      </Suspense>
      <Header />
      <SkipIntro />
      <Navigation />
      <DeliveryPanel />
      <SocialDock />
    </div>
  )
}
