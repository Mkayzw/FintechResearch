import type { NumericalPart } from "../features/mechanics/numerical-answer";

export interface DepthProblem {
  id: string;
  title: string;
  context: string;
  strategy: string;
  parts: readonly NumericalPart[];
  transfer: string;
  transferSolution: string;
}

export interface DepthInvestigation {
  title: string;
  context: string;
  xLabel: string;
  yLabel: string;
  readings: readonly { x: number; y: number }[];
  bound: number;
  gradient: { unit: string; min: number; max: number; step: number; initial: number };
  intercept: { unit: string; min: number; max: number; step: number; initial: number };
  equation: string;
  interpretation: string;
  parts: readonly NumericalPart[];
  evaluation: { prompt: string; guide: readonly string[] };
  plan: readonly string[];
}

export interface DepthChapter {
  id: string;
  title: string;
  introduction: string;
  prediction: { prompt: string; options: readonly string[]; answer: number; explanation: string };
  derivations: readonly { title: string; explanation: string; formula: string; interpretation: string }[];
  problems: readonly DepthProblem[];
  investigation: DepthInvestigation;
  sources: readonly { title: string; url: string }[];
}

export function evaluateDepthLine(investigation: DepthInvestigation, gradient: number, intercept: number) {
  const residuals = investigation.readings.map(reading => reading.y - (gradient * reading.x + intercept));
  return { residuals, compatible: residuals.every(value => Math.abs(value) <= investigation.bound + 1e-10) };
}
