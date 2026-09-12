import type {
  PendulumParameters,
  PendulumState,
  SolverId,
} from "@strange-loops/contracts";

export interface ExperimentDefinition {
  state: PendulumState;
  parameters: PendulumParameters;
  perturbation: number;
  solver: SolverId;
  timeStep: number;
}

export interface FrameSample {
  time: number;
  primary: PendulumState;
  twin: PendulumState;
  separation: number;
  energyError: number;
}

export type WorkerCommand =
  | { type: "configure"; runId: number; experiment: ExperimentDefinition }
  | { type: "play"; runId: number; speed: number }
  | { type: "pause"; runId: number }
  | { type: "step"; runId: number }
  | { type: "reset"; runId: number };

export type WorkerEvent =
  | { type: "frame"; runId: number; sample: FrameSample }
  | { type: "error"; runId: number; message: string };
