import { Link } from 'react-router-dom'

const REFERENCES = [
  {
    id: 1,
    text: 'W. N. Street, W. H. Wolberg, and O. L. Mangasarian. Nuclear feature extraction for breast tumor diagnosis. Wisconsin Breast Cancer Diagnostic Dataset, UCI Machine Learning Repository.',
  },
  {
    id: 2,
    text: 'Fazli, A. Breast Cancer Prediction — machine learning pipeline and model artifacts. Repository: data/processed, models/, results/.',
  },
  {
    id: 3,
    text: 'This application — React + FastAPI frontend served over the trained logistic regression pipeline. Educational use only.',
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-rule bg-stock">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1fr_280px]">
        <div>
          <h2 className="font-display text-lg">References</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-soft">
            {REFERENCES.map((ref) => (
              <li key={ref.id} className="flex gap-3">
                <span className="small-notation text-faded">{ref.id}.</span>
                <span className="measure">{ref.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="md:border-l md:border-rule md:pl-8">
          <h2 className="font-display text-lg">Colophon</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li>
              <Link to="/predict" className="underline underline-offset-4 hover:text-hematoxylin">
                Open the predictor
              </Link>
            </li>
            <li>
              <a
                href="https://www.streamlit.app/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-hematoxylin"
              >
                Legacy Streamlit demo
              </a>
            </li>
            <li className="small-notation pt-3 text-faded">
              {new Date().getFullYear()} — Akmal Fazli
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}