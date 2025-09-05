import type { Batch } from "../types/batch";

type NumericKeys = keyof Pick<
  Batch,
  "ABV" | "IBU" | "OG" | "FG" | "rating" | "EBC" | "V" | "E" | "EPM"
>;

export const numericConstraints: Record<
  NumericKeys,
  { min?: number; max?: number; step?: number }
> = {
  ABV: { min: 0, max: 20, step: 0.01 },
  IBU: { min: 0, max: 150, step: 1 },
  OG: { min: 1.0, max: 1.2, step: 0.001 },
  FG: { min: 1.0, max: 1.2, step: 0.001 },
  rating: { min: 0, max: 5, step: 1 },
  EBC: { min: 0, max: 150, step: 1 },
  V: { min: 0, step: 0.1 },
  E: { min: 0, max: 100, step: 1 },
  EPM: { min: 0, max: 100, step: 0.1 },
};
