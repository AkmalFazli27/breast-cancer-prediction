import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <BrowserRouter>
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