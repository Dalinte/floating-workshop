import { Suspense } from 'react'
import Scene from './components/Scene.tsx'
import Header from './components/UI/Header.tsx'
import Navigation from './components/UI/Navigation.tsx'
import DeliveryPanel from './components/UI/DeliveryPanel.tsx'
import SocialDock from './components/UI/SocialDock.tsx'
import SkipIntro from './components/UI/SkipIntro.tsx'
import CleanupButton from './components/UI/CleanupButton.tsx'
import Loader from './components/UI/Loader.tsx'

export default function App() {
  return (
    <div className="fixed inset-0">
      <Suspense fallback={<Loader />}>
        <Scene />
      </Suspense>
      <Header />
      <SkipIntro />
      <Navigation />
      <CleanupButton />
      <DeliveryPanel />
      <SocialDock />
    </div>
  )
}
