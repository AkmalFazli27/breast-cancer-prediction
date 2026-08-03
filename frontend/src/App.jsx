import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const PredictPage = lazy(() => import('./pages/PredictPage'))

function PageFallback() {
  return (
    <div className="mx-auto flex max-w-6xl items-start justify-center px-5 py-24">
      <p className="small-notation text-faded">Setting the paper…</p>
    </div>
  )
}

/**
 * React Router navigates via pushState, which does not trigger the browser's
 * native anchor scrolling. Scroll to the hash target manually, polling briefly
 * for lazy-loaded sections to mount.
 */
function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const tryScroll = () => {
      const el = document.getElementById(id)
      if (!el) return false
      el.scrollIntoView()
      return true
    }
    if (tryScroll()) return
    const timer = setInterval(() => {
      if (tryScroll()) clearInterval(timer)
    }, 60)
    return () => clearInterval(timer)
  }, [location.key, location.hash])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/predict" element={<PredictPage />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}