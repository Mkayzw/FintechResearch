export interface Vector2 {
  x: number;
  y: number;
}

export interface ProjectileState {
  positionMeters: Vector2;
  velocityMetersPerSecond: Vector2;
}

export interface VacuumModel {
  kind: "vacuum";
  gravityMetersPerSecondSquared: number;
}

export interface QuadraticDragModel {
  kind: "quadratic-drag";
  gravityMetersPerSecondSquared: number;
  massKilograms: number;
  airDensityKilogramsPerCubicMeter: number;
  dragCoefficient: number;
  referenceAreaSquareMeters: number;
  windVelocityMetersPerSecond: Vector2;
}

export type ProjectileModel = VacuumModel | QuadraticDragModel;

export interface ProjectileProblem {
  initialState: ProjectileState;
  groundHeightMeters: number;
  model: ProjectileModel;
}

export interface IntegrationOptions {
  timeStepSeconds: number;
  maxTimeSeconds: number;
  eventTimeToleranceSeconds?: number;
}

export interface TrajectorySample {
  timeSeconds: number;
  state: ProjectileState;
}

export interface FlightExtrema {
  apex: TrajectorySample;
}

export interface ImpactResult {
  timeSeconds: number;
  state: ProjectileState;
  horizontalDisplacementMeters: number;
}

export type ProjectileResult =
  | {
      termination: "impact";
      samples: TrajectorySample[];
      extrema: FlightExtrema;
      impact: ImpactResult;
    }
  | {
      termination: "max-time";
      samples: TrajectorySample[];
      extrema: FlightExtrema;
    };

export interface LaunchOptimizationInput {
  launchPositionMeters: Vector2;
  launchSpeedMetersPerSecond: number;
  groundHeightMeters: number;
  gravityMetersPerSecondSquared: number;
}

export interface LaunchOptimizationResult {
  angleRadians: number;
  horizontalDisplacementMeters: number;
  impactTimeSeconds: number;
}

const finite = (value: number, name: string): void => {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
};

function validateVector(vector: Vector2, name: string): void {
  finite(vector.x, `${name}.x`);
  finite(vector.y, `${name}.y`);
}

function validateProblem(problem: ProjectileProblem): void {
  validateVector(problem.initialState.positionMeters, "initial position");
  validateVector(
    problem.initialState.velocityMetersPerSecond,
    "initial velocity",
  );
  finite(problem.groundHeightMeters, "ground height");
  const gravity = problem.model.gravityMetersPerSecondSquared;
  if (!Number.isFinite(gravity) || gravity <= 0)
    throw new RangeError("gravity must be finite and positive");
  if (problem.initialState.positionMeters.y < problem.groundHeightMeters) {
    throw new RangeError("initial position cannot be below ground");
  }
  if (problem.model.kind === "quadratic-drag") {
    const {
      massKilograms,
      airDensityKilogramsPerCubicMeter,
      dragCoefficient,
      referenceAreaSquareMeters,
    } = problem.model;
    if (!Number.isFinite(massKilograms) || massKilograms <= 0)
      throw new RangeError("mass must be finite and positive");
    for (const [name, value] of Object.entries({
      airDensityKilogramsPerCubicMeter,
      dragCoefficient,
      referenceAreaSquareMeters,
    })) {
      if (!Number.isFinite(value) || value < 0)
        throw new RangeError(`${name} must be finite and non-negative`);
    }
    validateVector(problem.model.windVelocityMetersPerSecond, "wind velocity");
  }
}

export function launchVelocity(
  speedMetersPerSecond: number,
  angleRadians: number,
): Vector2 {
  if (!Number.isFinite(speedMetersPerSecond) || speedMetersPerSecond < 0) {
    throw new RangeError("launch speed must be finite and non-negative");
  }
  finite(angleRadians, "launch angle");
  return {
    x: speedMetersPerSecond * Math.cos(angleRadians),
    y: speedMetersPerSecond * Math.sin(angleRadians),
  };
}

export function vacuumStateAt(
  initialState: ProjectileState,
  gravityMetersPerSecondSquared: number,
  timeSeconds: number,
): ProjectileState {
  validateVector(initialState.positionMeters, "initial position");
  validateVector(initialState.velocityMetersPerSecond, "initial velocity");
  if (
    !Number.isFinite(gravityMetersPerSecondSquared) ||
    gravityMetersPerSecondSquared <= 0
  )
    throw new RangeError("gravity must be finite and positive");
  if (!Number.isFinite(timeSeconds) || timeSeconds < 0)
    throw new RangeError("time must be finite and non-negative");
  return {
    positionMeters: {
      x:
        initialState.positionMeters.x +
        initialState.velocityMetersPerSecond.x * timeSeconds,
      y:
        initialState.positionMeters.y +
        initialState.velocityMetersPerSecond.y * timeSeconds -
        0.5 * gravityMetersPerSecondSquared * timeSeconds ** 2,
    },
    velocityMetersPerSecond: {
      x: initialState.velocityMetersPerSecond.x,
      y:
        initialState.velocityMetersPerSecond.y -
        gravityMetersPerSecondSquared * timeSeconds,
    },
  };
}

function impactTime(
  initialState: ProjectileState,
  groundHeightMeters: number,
  gravity: number,
): number {
  const height = initialState.positionMeters.y - groundHeightMeters;
  const verticalVelocity = initialState.velocityMetersPerSecond.y;
  if (height === 0 && verticalVelocity <= 0) return 0;
  return (
    (verticalVelocity +
      Math.sqrt(verticalVelocity ** 2 + 2 * gravity * height)) /
    gravity
  );
}

export function solveVacuumFlight(
  problem: ProjectileProblem & { model: VacuumModel },
): ProjectileResult & { termination: "impact" } {
  validateProblem(problem);
  const duration = impactTime(
    problem.initialState,
    problem.groundHeightMeters,
    problem.model.gravityMetersPerSecondSquared,
  );
  const apexTime = Math.min(
    duration,
    Math.max(
      0,
      problem.initialState.velocityMetersPerSecond.y /
        problem.model.gravityMetersPerSecondSquared,
    ),
  );
  const impactState = vacuumStateAt(
    problem.initialState,
    problem.model.gravityMetersPerSecondSquared,
    duration,
  );
  impactState.positionMeters.y = problem.groundHeightMeters;
  const apex = {
    timeSeconds: apexTime,
    state: vacuumStateAt(
      problem.initialState,
      problem.model.gravityMetersPerSecondSquared,
      apexTime,
    ),
  };
  return {
    termination: "impact",
    samples: [
      { timeSeconds: 0, state: structuredClone(problem.initialState) },
      ...(duration > 0 ? [{ timeSeconds: duration, state: impactState }] : []),
    ],
    extrema: { apex },
    impact: {
      timeSeconds: duration,
      state: impactState,
      horizontalDisplacementMeters:
        impactState.positionMeters.x - problem.initialState.positionMeters.x,
    },
  };
}

export function dragAcceleration(
  velocityMetersPerSecond: Vector2,
  model: QuadraticDragModel,
): Vector2 {
  validateVector(velocityMetersPerSecond, "velocity");
  validateVector(model.windVelocityMetersPerSecond, "wind velocity");
  const relative = {
    x: velocityMetersPerSecond.x - model.windVelocityMetersPerSecond.x,
    y: velocityMetersPerSecond.y - model.windVelocityMetersPerSecond.y,
  };
  const speed = Math.hypot(relative.x, relative.y);
  const factor =
    speed === 0
      ? 0
      : -(
          model.airDensityKilogramsPerCubicMeter *
          model.dragCoefficient *
          model.referenceAreaSquareMeters *
          speed
        ) /
        (2 * model.massKilograms);
  return { x: factor * relative.x, y: factor * relative.y };
}

interface Derivative {
  px: number;
  py: number;
  vx: number;
  vy: number;
}

function derivative(
  state: ProjectileState,
  model: ProjectileModel,
): Derivative {
  const drag =
    model.kind === "quadratic-drag"
      ? dragAcceleration(state.velocityMetersPerSecond, model)
      : { x: 0, y: 0 };
  return {
    px: state.velocityMetersPerSecond.x,
    py: state.velocityMetersPerSecond.y,
    vx: drag.x,
    vy: drag.y - model.gravityMetersPerSecondSquared,
  };
}

function add(
  state: ProjectileState,
  change: Derivative,
  scale: number,
): ProjectileState {
  return {
    positionMeters: {
      x: state.positionMeters.x + change.px * scale,
      y: state.positionMeters.y + change.py * scale,
    },
    velocityMetersPerSecond: {
      x: state.velocityMetersPerSecond.x + change.vx * scale,
      y: state.velocityMetersPerSecond.y + change.vy * scale,
    },
  };
}

function stepRk4(
  state: ProjectileState,
  model: ProjectileModel,
  dt: number,
): ProjectileState {
  const k1 = derivative(state, model);
  const k2 = derivative(add(state, k1, dt / 2), model);
  const k3 = derivative(add(state, k2, dt / 2), model);
  const k4 = derivative(add(state, k3, dt), model);
  return {
    positionMeters: {
      x:
        state.positionMeters.x +
        (dt / 6) * (k1.px + 2 * k2.px + 2 * k3.px + k4.px),
      y:
        state.positionMeters.y +
        (dt / 6) * (k1.py + 2 * k2.py + 2 * k3.py + k4.py),
    },
    velocityMetersPerSecond: {
      x:
        state.velocityMetersPerSecond.x +
        (dt / 6) * (k1.vx + 2 * k2.vx + 2 * k3.vx + k4.vx),
      y:
        state.velocityMetersPerSecond.y +
        (dt / 6) * (k1.vy + 2 * k2.vy + 2 * k3.vy + k4.vy),
    },
  };
}

function interpolateImpact(
  before: TrajectorySample,
  after: TrajectorySample,
  groundHeightMeters: number,
  toleranceSeconds: number,
): TrajectorySample {
  const interval = after.timeSeconds - before.timeSeconds;
  const component = (
    start: number,
    end: number,
    startVelocity: number,
    endVelocity: number,
    s: number,
  ): number => {
    const s2 = s * s;
    const s3 = s2 * s;
    return (
      (2 * s3 - 3 * s2 + 1) * start +
      (s3 - 2 * s2 + s) * interval * startVelocity +
      (-2 * s3 + 3 * s2) * end +
      (s3 - s2) * interval * endVelocity
    );
  };
  let lower = 0;
  let upper = 1;
  while ((upper - lower) * interval > toleranceSeconds) {
    const middle = (lower + upper) / 2;
    const y = component(
      before.state.positionMeters.y,
      after.state.positionMeters.y,
      before.state.velocityMetersPerSecond.y,
      after.state.velocityMetersPerSecond.y,
      middle,
    );
    if (y > groundHeightMeters) lower = middle;
    else upper = middle;
  }
  const s = (lower + upper) / 2;
  const position = {
    x: component(
      before.state.positionMeters.x,
      after.state.positionMeters.x,
      before.state.velocityMetersPerSecond.x,
      after.state.velocityMetersPerSecond.x,
      s,
    ),
    y: groundHeightMeters,
  };
  const velocity = {
    x:
      before.state.velocityMetersPerSecond.x +
      s *
        (after.state.velocityMetersPerSecond.x -
          before.state.velocityMetersPerSecond.x),
    y:
      before.state.velocityMetersPerSecond.y +
      s *
        (after.state.velocityMetersPerSecond.y -
          before.state.velocityMetersPerSecond.y),
  };
  return {
    timeSeconds: before.timeSeconds + s * interval,
    state: { positionMeters: position, velocityMetersPerSecond: velocity },
  };
}

export function simulateProjectile(
  problem: ProjectileProblem,
  options: IntegrationOptions,
): ProjectileResult {
  validateProblem(problem);
  const { timeStepSeconds, maxTimeSeconds } = options;
  if (!Number.isFinite(timeStepSeconds) || timeStepSeconds <= 0)
    throw new RangeError("time step must be finite and positive");
  if (!Number.isFinite(maxTimeSeconds) || maxTimeSeconds <= 0)
    throw new RangeError("maximum time must be finite and positive");
  const tolerance =
    options.eventTimeToleranceSeconds ?? Math.min(1e-7, timeStepSeconds / 1000);
  if (
    !Number.isFinite(tolerance) ||
    tolerance <= 0 ||
    tolerance > timeStepSeconds
  )
    throw new RangeError(
      "event tolerance must be positive and no larger than the time step",
    );

  const initial = {
    timeSeconds: 0,
    state: structuredClone(problem.initialState),
  };
  if (
    problem.initialState.positionMeters.y === problem.groundHeightMeters &&
    problem.initialState.velocityMetersPerSecond.y <= 0
  ) {
    return {
      termination: "impact",
      samples: [initial],
      extrema: { apex: initial },
      impact: {
        timeSeconds: 0,
        state: initial.state,
        horizontalDisplacementMeters: 0,
      },
    };
  }

  const samples: TrajectorySample[] = [initial];
  let current = initial;
  let apex = initial;
  while (current.timeSeconds < maxTimeSeconds) {
    let dt = Math.min(timeStepSeconds, maxTimeSeconds - current.timeSeconds);
    let next: TrajectorySample = {
      timeSeconds: current.timeSeconds + dt,
      state: stepRk4(current.state, problem.model, dt),
    };
    if (
      current.state.positionMeters.y === problem.groundHeightMeters &&
      current.state.velocityMetersPerSecond.y > 0 &&
      next.state.positionMeters.y <= problem.groundHeightMeters
    ) {
      while (
        next.state.positionMeters.y <= problem.groundHeightMeters &&
        dt > tolerance
      ) {
        dt /= 2;
        next = {
          timeSeconds: current.timeSeconds + dt,
          state: stepRk4(current.state, problem.model, dt),
        };
      }
    }
    if (next.state.positionMeters.y > apex.state.positionMeters.y) apex = next;
    if (
      current.state.positionMeters.y > problem.groundHeightMeters &&
      next.state.positionMeters.y <= problem.groundHeightMeters
    ) {
      const impact = interpolateImpact(
        current,
        next,
        problem.groundHeightMeters,
        tolerance,
      );
      samples.push(impact);
      return {
        termination: "impact",
        samples,
        extrema: { apex },
        impact: {
          timeSeconds: impact.timeSeconds,
          state: impact.state,
          horizontalDisplacementMeters:
            impact.state.positionMeters.x -
            problem.initialState.positionMeters.x,
        },
      };
    }
    samples.push(next);
    current = next;
  }
  return { termination: "max-time", samples, extrema: { apex } };
}

export function optimizeVacuumRange(
  input: LaunchOptimizationInput,
): LaunchOptimizationResult {
  validateVector(input.launchPositionMeters, "launch position");
  finite(input.groundHeightMeters, "ground height");
  if (
    !Number.isFinite(input.launchSpeedMetersPerSecond) ||
    input.launchSpeedMetersPerSecond <= 0
  )
    throw new RangeError("launch speed must be finite and positive");
  if (
    !Number.isFinite(input.gravityMetersPerSecondSquared) ||
    input.gravityMetersPerSecondSquared <= 0
  )
    throw new RangeError("gravity must be finite and positive");
  const height = input.launchPositionMeters.y - input.groundHeightMeters;
  if (height < 0)
    throw new RangeError("launch position cannot be below ground");
  const speed = input.launchSpeedMetersPerSecond;
  const angle = Math.atan(
    speed /
      Math.sqrt(speed ** 2 + 2 * input.gravityMetersPerSecondSquared * height),
  );
  const problem: ProjectileProblem & { model: VacuumModel } = {
    initialState: {
      positionMeters: { ...input.launchPositionMeters },
      velocityMetersPerSecond: launchVelocity(speed, angle),
    },
    groundHeightMeters: input.groundHeightMeters,
    model: {
      kind: "vacuum",
      gravityMetersPerSecondSquared: input.gravityMetersPerSecondSquared,
    },
  };
  const result = solveVacuumFlight(problem);
  return {
    angleRadians: angle,
    horizontalDisplacementMeters: result.impact.horizontalDisplacementMeters,
    impactTimeSeconds: result.impact.timeSeconds,
  };
}
