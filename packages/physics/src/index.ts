import type {
  PendulumParameters,
  PendulumState,
} from "@strange-loops/contracts";

export const PHYSICS_PACKAGE_VERSION = "0.1.0";

export type {
  PendulumParameters,
  PendulumState,
  SolverId,
} from "@strange-loops/contracts";

export interface MassMatrix {
  m11: number;
  m12: number;
  m21: number;
  m22: number;
}

export interface EnergySnapshot {
  kinetic: number;
  potential: number;
  total: number;
}

export interface SimulationSample {
  time: number;
  state: PendulumState;
}

export type StepFunction = (
  state: PendulumState,
  parameters: PendulumParameters,
  dtSeconds: number,
) => PendulumState;

export function validateParameters(parameters: PendulumParameters): void {
  for (const [name, value] of Object.entries(parameters)) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new RangeError(`${name} must be a finite positive number`);
    }
  }
}

export function massMatrix(
  state: PendulumState,
  parameters: PendulumParameters,
): MassMatrix {
  validateParameters(parameters);
  const { mass1, mass2, length1, length2 } = parameters;
  const coupling =
    mass2 * length1 * length2 * Math.cos(state.theta1 - state.theta2);

  return {
    m11: (mass1 + mass2) * length1 ** 2,
    m12: coupling,
    m21: coupling,
    m22: mass2 * length2 ** 2,
  };
}

export function accelerations(
  state: PendulumState,
  parameters: PendulumParameters,
): { alpha1: number; alpha2: number } {
  const matrix = massMatrix(state, parameters);
  const { mass1, mass2, length1, length2, gravity } = parameters;
  const delta = state.theta1 - state.theta2;

  const h1 =
    mass2 * length1 * length2 * Math.sin(delta) * state.omega2 ** 2 +
    (mass1 + mass2) * gravity * length1 * Math.sin(state.theta1);
  const h2 =
    -mass2 * length1 * length2 * Math.sin(delta) * state.omega1 ** 2 +
    mass2 * gravity * length2 * Math.sin(state.theta2);
  const determinant = matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21;

  if (!Number.isFinite(determinant) || determinant <= 0) {
    throw new RangeError("mass matrix must remain positive definite");
  }

  return {
    alpha1: (-matrix.m22 * h1 + matrix.m12 * h2) / determinant,
    alpha2: (matrix.m21 * h1 - matrix.m11 * h2) / determinant,
  };
}

export function derivative(
  state: PendulumState,
  parameters: PendulumParameters,
): PendulumState {
  const { alpha1, alpha2 } = accelerations(state, parameters);
  return {
    theta1: state.omega1,
    theta2: state.omega2,
    omega1: alpha1,
    omega2: alpha2,
  };
}

function addScaled(
  state: PendulumState,
  change: PendulumState,
  scale: number,
): PendulumState {
  return {
    theta1: state.theta1 + change.theta1 * scale,
    theta2: state.theta2 + change.theta2 * scale,
    omega1: state.omega1 + change.omega1 * scale,
    omega2: state.omega2 + change.omega2 * scale,
  };
}

export function stepEuler(
  state: PendulumState,
  parameters: PendulumParameters,
  dtSeconds: number,
): PendulumState {
  return addScaled(state, derivative(state, parameters), dtSeconds);
}

export function stepRk4(
  state: PendulumState,
  parameters: PendulumParameters,
  dtSeconds: number,
): PendulumState {
  const k1 = derivative(state, parameters);
  const k2 = derivative(addScaled(state, k1, dtSeconds / 2), parameters);
  const k3 = derivative(addScaled(state, k2, dtSeconds / 2), parameters);
  const k4 = derivative(addScaled(state, k3, dtSeconds), parameters);

  return {
    theta1:
      state.theta1 +
      (dtSeconds / 6) * (k1.theta1 + 2 * k2.theta1 + 2 * k3.theta1 + k4.theta1),
    theta2:
      state.theta2 +
      (dtSeconds / 6) * (k1.theta2 + 2 * k2.theta2 + 2 * k3.theta2 + k4.theta2),
    omega1:
      state.omega1 +
      (dtSeconds / 6) * (k1.omega1 + 2 * k2.omega1 + 2 * k3.omega1 + k4.omega1),
    omega2:
      state.omega2 +
      (dtSeconds / 6) * (k1.omega2 + 2 * k2.omega2 + 2 * k3.omega2 + k4.omega2),
  };
}

export function integrate(
  initialState: PendulumState,
  parameters: PendulumParameters,
  durationSeconds: number,
  dtSeconds: number,
  step: StepFunction = stepRk4,
): SimulationSample[] {
  if (!Number.isFinite(durationSeconds) || durationSeconds < 0) {
    throw new RangeError("durationSeconds must be finite and non-negative");
  }
  if (!Number.isFinite(dtSeconds) || dtSeconds <= 0) {
    throw new RangeError("dtSeconds must be finite and positive");
  }

  const steps = Math.round(durationSeconds / dtSeconds);
  const samples: SimulationSample[] = [{ time: 0, state: { ...initialState } }];
  let state = { ...initialState };

  for (let index = 1; index <= steps; index += 1) {
    state = step(state, parameters, dtSeconds);
    samples.push({ time: index * dtSeconds, state });
  }

  return samples;
}

export function energy(
  state: PendulumState,
  parameters: PendulumParameters,
): EnergySnapshot {
  validateParameters(parameters);
  const { mass1, mass2, length1, length2, gravity } = parameters;
  const delta = state.theta1 - state.theta2;
  const kinetic =
    0.5 * (mass1 + mass2) * length1 ** 2 * state.omega1 ** 2 +
    0.5 * mass2 * length2 ** 2 * state.omega2 ** 2 +
    mass2 * length1 * length2 * state.omega1 * state.omega2 * Math.cos(delta);
  const potential =
    -(mass1 + mass2) * gravity * length1 * Math.cos(state.theta1) -
    mass2 * gravity * length2 * Math.cos(state.theta2);

  return { kinetic, potential, total: kinetic + potential };
}

export function wrapAngle(angle: number): number {
  const wrapped =
    ((((angle + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) -
    Math.PI;
  return wrapped === Math.PI ? -Math.PI : wrapped;
}

export function stateDistance(
  left: PendulumState,
  right: PendulumState,
  parameters: PendulumParameters,
): number {
  validateParameters(parameters);
  const referenceLength = (parameters.length1 + parameters.length2) / 2;
  const naturalTime = Math.sqrt(referenceLength / parameters.gravity);
  const deltaTheta1 = wrapAngle(left.theta1 - right.theta1);
  const deltaTheta2 = wrapAngle(left.theta2 - right.theta2);
  const deltaOmega1 = naturalTime * (left.omega1 - right.omega1);
  const deltaOmega2 = naturalTime * (left.omega2 - right.omega2);

  return Math.hypot(deltaTheta1, deltaTheta2, deltaOmega1, deltaOmega2);
}
