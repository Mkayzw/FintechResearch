export type SolverId = "rk4" | "euler";

export interface PendulumState {
  theta1: number;
  theta2: number;
  omega1: number;
  omega2: number;
}

export interface PendulumParameters {
  mass1: number;
  mass2: number;
  length1: number;
  length2: number;
  gravity: number;
}

export interface ExperimentPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  state: PendulumState;
  parameters: PendulumParameters;
  perturbation: number;
  solver: SolverId;
  timeStep: number;
}

export interface StudyConfig {
  contentVersion: string;
  angleConvention: string;
  defaultPresetId: string;
  limits: {
    mass: [number, number];
    length: [number, number];
    gravity: [number, number];
    timeStep: [number, number];
  };
}
