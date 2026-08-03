import { Link } from 'react-router-dom'
import { ArrowRight, Database, FlaskConical, Scale, BrainCircuit } from 'lucide-react'
import FigurePlate from '../components/FigurePlate'
import ModelMetrics from '../components/ModelMetrics'
import RadarFigure from '../components/RadarFigure'
import { DEFAULT_VALUES } from '../constants/features'
import { MODEL_DETAILS, MODEL_METRICS } from '../constants/metrics'

const PIPELINE_STEPS = [
  {
    icon: Database,
    title: '22 measurements',
    body: 'Cell-nuclei measurements from a digitized FNA image, grouped by mean, standard error, and worst value.',
  },
  {
    icon: Scale,
    title: 'Scaler',
    body: 'Each feature is standardized with the scaler fitted on the training set — exactly as in the original pipeline.',
  },
  {
    icon: BrainCircuit,
    title: 'Logistic regression',
    body: 'The tuned classifier — C = 10, l2 penalty — read the scaled features and estimates both class probabilities.',
  },
]

const FAQ = [
  {
    q: 'What is this dataset?',
    a: 'The Wisconsin Breast Cancer Diagnostic Dataset: 569 samples of breast-mass measurements computed from digitized images of fine needle aspirates. Each sample has 30 raw features; after multicollinearity removal (VIF), 22 are used by this model.',
  },
  {
    q: 'Is this a medical diagnosis?',
    a: 'No. This application is for education and demonstration only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.',
  },
  {
    q: 'What model is used?',
    a: 'A tuned Logistic Regression trained on 455 samples, evaluated on a held-out test set of 114. It reaches 97.37% accuracy and a 99.04% ROC-AUC on that test set. The model and scaler are reused from the existing pipeline — nothing is retrained.',
  },
  {
    q: 'How were the 22 features chosen?',
    a: 'The original 30 features were reduced by removing highly collinear pairs via Variance Inflation Factor (VIF) analysis, keeping the 22 that retain independent signal. The full list is shown in the predictor, with tooltips explaining each measurement.',
  },
]

function SectionHeading({ numeral, title, lede }) {
  return (
    <div className="border-t border-rule-ink pt-4">
      <p className="small-notation text-faded">{numeral}</p>
      <h2 className="mt-1 font-display text-3xl leading-tight text-ink md:text-4xl">{title}</h2>
      {lede && <p className="measure mt-3 text-ink-soft">{lede}</p>}
    </div>
  )
}

export default function LandingPage() {
  return (
    <main>
      {/* Abstract — the paper's front matter */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div className="paper-in">
          <p className="small-notation text-faded tracking-[0.18em]">
            Abstract — {MODEL_DETAILS.features} features · logistic regression
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight text-ink md:text-6xl">
            A transparent predictor for{' '}
            <span className="italic text-hematoxylin">cell-nuclei</span> measurements
          </h1>
          <p className="measure mt-6 text-xl leading-relaxed text-ink-soft">
            Enter the {MODEL_DETAILS.features} measurements of a cell cluster and see the
            model&apos;s verdict — benign or malignant — with both probabilities, the
            confidence margin, and a radar figure of what was entered. Trained on the{' '}
            {MODEL_DETAILS.dataset} and evaluated on {MODEL_DETAILS.test} held-out samples
            at {MODEL_METRICS.find((m) => m.metric === 'Accuracy').value} accuracy.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 border border-hematoxylin bg-hematoxylin px-6 py-3 text-base text-paper transition-colors hover:bg-hematoxylin-deep"
            >
              Start prediction <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
            </Link>
            <a
              href="#method"
              className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-hematoxylin"
            >
              Read the method
            </a>
          </div>

          <p className="mt-8 border-l border-rule-ink pl-4 text-sm italic leading-relaxed text-faded">
            Educational use only — this tool does not provide medical advice or diagnosis.
          </p>
        </div>

        {/* Figure 1 — the mechanism, demonstrated */}
        <FigurePlate
          number="Fig. 1"
          caption="The entered measurements, scaled to [0, 1] per feature. Values shown are the dataset means — submit your own on the predictor page."
          className="lg:self-start"
        >
          <RadarFigure values={DEFAULT_VALUES} />
        </FigurePlate>
      </section>

      {/* Method */}
      <section id="method" className="border-t border-rule bg-stock">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionHeading
            numeral="01 — Method"
            title="How the verdict is reached"
            lede="No black box: the same pipeline that produced the model's published results runs behind this page."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.title} className="border border-rule bg-paper p-6">
                <div className="flex items-center justify-between">
                  <step.icon className="size-6 text-hematoxylin" strokeWidth={1.5} aria-hidden />
                  <span className="small-notation text-faded">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
          <p className="small-notation mt-8 text-faded">
            Order is fixed: scale with scaler.pkl → predict with final_model_logistic_regression.pkl
          </p>
        </div>
      </section>

      {/* Results */}
      <section id="results" className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          numeral="02 — Results"
          title="Performance on the held-out test set"
          lede={`${MODEL_DETAILS.model} on ${MODEL_DETAILS.test} samples, split from the ${MODEL_DETAILS.samples}-sample dataset at training time.`}
        />
        <div className="mt-10">
          <ModelMetrics />
        </div>
      </section>

      {/* Figure */}
      <section id="figure" className="border-t border-rule bg-stock">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionHeading
            numeral="03 — Figure"
            title="The figure, live"
            lede="The radar above is not a static image — it is the predictor's own figure, rendering the current input and filterable by measurement group."
          />
          <div className="mt-10">
            <FigurePlate
              number="Fig. 2"
              caption="Radar of the current input values, scaled per feature to [0, 1]. Use the filter to isolate Mean, Standard Error, or Worst measurements."
            >
              <RadarFigure values={DEFAULT_VALUES} />
            </FigurePlate>
          </div>
        </div>
      </section>

      {/* Discussion / FAQ */}
      <section id="discussion" className="mx-auto max-w-6xl px-5 py-16">
        <SectionHeading
          numeral="04 — Discussion"
          title="Frequently asked questions"
          lede="The dataset, the model, and what this tool is — and is not."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 items-start">
          {FAQ.map((item) => (
            <details key={item.q} className="group border border-rule bg-paper">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-display text-lg text-ink transition-colors hover:bg-stock md:text-xl">
                {item.q}
                <span className="small-notation text-faded transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="measure border-t border-rule px-5 py-4 text-sm leading-relaxed text-ink-soft">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-12 border border-rule-ink bg-stock px-6 py-5 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <p className="small-notation text-faded tracking-widest">Disclaimer</p>
            <p className="measure mt-1 text-sm leading-relaxed text-ink">
              This application is for educational and informational purposes only. It should
              not be used as a substitute for professional medical diagnosis, advice, or
              treatment.
            </p>
          </div>
          <FlaskConical className="mt-4 size-8 shrink-0 text-faded md:mt-0" strokeWidth={1.25} aria-hidden />
        </div>
      </section>
    </main>
  )
}