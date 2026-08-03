import { Link, NavLink } from 'react-router-dom'
import { Activity } from 'lucide-react'

const NAV = [
  { to: '/#method', label: 'Method' },
  { to: '/#results', label: 'Results' },
  { to: '/#figure', label: 'Figure' },
  { to: '/#discussion', label: 'Discussion' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex size-8 items-center justify-center border border-rule-ink bg-stock">
            <Activity className="size-4 text-hematoxylin" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="font-display text-lg leading-none tracking-tight group-hover:underline underline-offset-4">
            Breast Cancer Prediction
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className="text-sm text-ink-soft transition-colors hover:text-hematoxylin hover:underline underline-offset-4"
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/predict"
            className="ml-2 border border-hematoxylin bg-hematoxylin px-4 py-1.5 text-sm text-paper transition-colors hover:bg-hematoxylin-deep"
          >
            Open the predictor
          </Link>
        </nav>

        <Link
          to="/predict"
          className="border border-hematoxylin bg-hematoxylin px-3.5 py-1.5 text-sm text-paper transition-colors hover:bg-hematoxylin-deep md:hidden"
        >
          Predict
        </Link>
      </div>
    </header>
  )
}