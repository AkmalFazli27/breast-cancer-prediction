import { z } from 'zod'
import { FEATURE_META } from './features'

// Zod schema for the 22 features, derived from FEATURE_META.
export const predictionSchema = z.object(
  Object.fromEntries(
    FEATURE_META.map((f) => [
      f.key,
      z
        .union([z.string(), z.number()], {
          errorMap: () => ({ message: 'Required' }),
        })
        .transform((v) => (typeof v === 'string' ? v.trim() : String(v)))
        .refine((v) => v.length > 0, { message: 'Required' })
        .refine((v) => Number.isFinite(Number(v)) && v !== '' && !Number.isNaN(Number(v)), {
          message: 'Enter a number',
        })
        .transform(Number)
        .refine((n) => n >= f.min && n <= f.max, {
          message: `Between ${f.min} and ${f.max}`,
        }),
    ]),
  ),
)