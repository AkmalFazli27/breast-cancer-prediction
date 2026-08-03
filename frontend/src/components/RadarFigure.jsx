import { useState } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { FEATURE_META, RADAR_BASES, radarBaseLabel } from '../constants/features'
import { buildRadarData } from '../utils/scaling'

const TRACES = [
  { suffix: 'mean', label: 'Mean value', color: '#2f3d8f' },
  { suffix: 'se', label: 'Standard error', color: '#6e6c66' },
  { suffix: 'worst', label: 'Worst value', color: '#b3232e' },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'mean', label: 'Mean' },
  { id: 'se', label: 'Standard Error' },
  { id: 'worst', label: 'Worst' },
]

function TraceTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="radar-tooltip border border-rule-ink bg-paper px-3 py-2">
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="size-2" style={{ backgroundColor: entry.color }} aria-hidden />
          <span className="text-ink">{radarBaseLabel(entry.payload?.base)}</span>
          <span className="text-ink-soft">{Number(entry.value).toFixed(3)}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * The paper's figure — a radar of the entered measurements, scaled to [0,1]
 * per feature, with a Mean / SE / Worst / All filter.
 */
export default function RadarFigure({ values }) {
  const [filter, setFilter] = useState('all')
  const data = buildRadarData(values, FEATURE_META, RADAR_BASES)
  const visible = TRACES.filter((t) => filter === 'all' || t.suffix === filter)

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-wrap items-center gap-1 border-b border-rule px-4 py-2"
        role="group"
        aria-label="Filter figure traces"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`px-2.5 py-1 text-xs transition-colors ${
              filter === f.id
                ? 'bg-hematoxylin text-paper'
                : 'text-ink-soft hover:bg-stock hover:text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="min-h-[320px] py-4">
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#e0ded8" />
            <PolarAngleAxis
              dataKey="base"
              tick={({ x, y, payload, textAnchor }) => (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill="#6e6c66"
                  fontSize={11}
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {radarBaseLabel(payload.value)}
                </text>
              )}
            />
            <PolarRadiusAxis domain={[0, 1]} tickCount={5} tick={false} axisLine={false} />
            {visible.map((trace) => (
              <Radar
                key={trace.suffix}
                name={trace.label}
                dataKey={trace.suffix}
                stroke={trace.color}
                fill={trace.color}
                fillOpacity={0.14}
                strokeWidth={1.5}
                isAnimationActive
                animationDuration={600}
              />
            ))}
            <Tooltip content={<TraceTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}