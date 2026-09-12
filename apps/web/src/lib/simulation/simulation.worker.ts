/// <reference lib="webworker" />

import {
  energy,
  stateDistance,
  stepEuler,
  stepRk4,
} from "@strange-loops/physics";
import type { PendulumState } from "@strange-loops/contracts";
import type { ExperimentDefinition, WorkerCommand, WorkerEvent } from "./types";

const scope = self as unknown as DedicatedWorkerGlobalScope;
let runId = 0;
let experiment: ExperimentDefinition | undefined;
let primary: PendulumState;
let twin: PendulumState;
let initialEnergy = 0;
let energyScale = 1;
let time = 0;
let speed = 1;
let playing = false;
let previousTick = performance.now();
let accumulator = 0;

function emit(event: WorkerEvent): void {
  scope.postMessage(event);
}

function configure(nextRunId: number, next: ExperimentDefinition): void {
  runId = nextRunId;
  experiment = structuredClone(next);
  primary = { ...next.state };
  twin = { ...next.state, theta2: next.state.theta2 + next.perturbation };
  initialEnergy = energy(primary, next.parameters).total;
  energyScale =
    (next.parameters.mass1 + next.parameters.mass2) *
      next.parameters.gravity *
      next.parameters.length1 +
    next.parameters.mass2 * next.parameters.gravity * next.parameters.length2;
  time = 0;
  accumulator = 0;
  playing = false;
  publish();
}

function advance(): void {
  if (!experiment) return;
  const step = experiment.solver === "euler" ? stepEuler : stepRk4;
  primary = step(primary, experiment.parameters, experiment.timeStep);
  twin = step(twin, experiment.parameters, experiment.timeStep);
  time += experiment.timeStep;
}

function publish(): void {
  if (!experiment || !primary || !twin) return;
  const currentEnergy = energy(primary, experiment.parameters).total;
  emit({
    type: "frame",
    runId,
    sample: {
      time,
      primary: { ...primary },
      twin: { ...twin },
      separation: stateDistance(primary, twin, experiment.parameters),
      energyError: (currentEnergy - initialEnergy) / energyScale,
    },
  });
}

function tick(now: number): void {
  if (playing && experiment) {
    accumulator += Math.min((now - previousTick) / 1000, 0.1) * speed;
    let steps = 0;
    while (accumulator >= experiment.timeStep && steps < 240) {
      advance();
      accumulator -= experiment.timeStep;
      steps += 1;
    }
    if (steps > 0) publish();
  }
  previousTick = now;
  setTimeout(() => tick(performance.now()), 16);
}

scope.onmessage = (message: MessageEvent<WorkerCommand>) => {
  try {
    const command = message.data;
    if (command.type === "configure") {
      configure(command.runId, command.experiment);
      return;
    }
    if (command.runId !== runId) return;
    if (command.type === "play") {
      speed = command.speed;
      playing = true;
      previousTick = performance.now();
    } else if (command.type === "pause") {
      playing = false;
    } else if (command.type === "step") {
      playing = false;
      advance();
      publish();
    } else if (command.type === "reset" && experiment) {
      configure(runId, experiment);
    }
  } catch (error) {
    emit({
      type: "error",
      runId,
      message: error instanceof Error ? error.message : "Simulation failed",
    });
  }
};

tick(performance.now());
