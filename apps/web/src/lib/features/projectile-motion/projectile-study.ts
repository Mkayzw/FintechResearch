import {
  launchVelocity,
  simulateProjectile,
  solveVacuumFlight,
  type ProjectileProblem,
  type TrajectorySample,
  type VacuumModel,
} from "@strange-loops/physics";

export interface LaunchState {
  speed: number;
  angleDegrees: number;
  launchHeight: number;
}

export interface RangeCurvePoint {
  angleDegrees: number;
  vacuumRange: number;
  dragRange: number;
}

export interface MeasurementInput {
  rangeMeters: number;
  rangeUncertaintyMeters: number;
  flightTimeSeconds: number;
  timeUncertaintySeconds: number;
  launchHeightMeters: number;
  heightUncertaintyMeters: number;
  gravityMetersPerSecondSquared: number;
}

export interface LaunchEstimate {
  horizontalVelocityMetersPerSecond: number;
  verticalVelocityMetersPerSecond: number;
  speedMetersPerSecond: number;
  angleDegrees: number;
  minimumSpeedMetersPerSecond: number;
  maximumSpeedMetersPerSecond: number;
}

function finitePositive(value: number, name: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be finite and positive`);
  }
}

function vacuumProblem(
  speed: number,
  angleDegrees: number,
  height: number,
  gravity: number,
): ProjectileProblem & { model: VacuumModel } {
  return {
    initialState: {
      positionMeters: { x: 0, y: height },
      velocityMetersPerSecond: launchVelocity(
        speed,
        (angleDegrees * Math.PI) / 180,
      ),
    },
    groundHeightMeters: 0,
    model: { kind: "vacuum", gravityMetersPerSecondSquared: gravity },
  };
}

export function buildRangeCurve(input: {
  speed: number;
  height: number;
  gravity: number;
}): RangeCurvePoint[] {
  finitePositive(input.speed, "speed");
  finitePositive(input.gravity, "gravity");
  if (!Number.isFinite(input.height) || input.height < 0) {
    throw new RangeError("height must be finite and non-negative");
  }

  return Array.from({ length: 81 }, (_, index) => index + 5).map(
    (angleDegrees) => {
      const problem = vacuumProblem(
        input.speed,
        angleDegrees,
        input.height,
        input.gravity,
      );
      const vacuum = solveVacuumFlight(problem);
      const drag = simulateProjectile(
        {
          ...problem,
          model: {
            kind: "quadratic-drag",
            gravityMetersPerSecondSquared: input.gravity,
            massKilograms: 0.145,
            airDensityKilogramsPerCubicMeter: 1.225,
            dragCoefficient: 0.47,
            referenceAreaSquareMeters: 0.0042,
            windVelocityMetersPerSecond: { x: 0, y: 0 },
          },
        },
        { timeStepSeconds: 0.04, maxTimeSeconds: 30 },
      );
      return {
        angleDegrees,
        vacuumRange: vacuum.impact.horizontalDisplacementMeters,
        dragRange:
          drag.termination === "impact"
            ? drag.impact.horizontalDisplacementMeters
            : (drag.samples.at(-1)?.state.positionMeters.x ?? 0),
      };
    },
  );
}

function measuredVelocity(
  range: number,
  time: number,
  height: number,
  gravity: number,
) {
  const horizontal = range / time;
  const vertical = 0.5 * gravity * time - height / time;
  return {
    horizontal,
    vertical,
    speed: Math.hypot(horizontal, vertical),
  };
}

export function estimateLaunchFromMeasurements(
  input: MeasurementInput,
): LaunchEstimate {
  finitePositive(input.rangeMeters, "range");
  finitePositive(input.flightTimeSeconds, "flight time");
  finitePositive(input.gravityMetersPerSecondSquared, "gravity");
  for (const [name, value] of Object.entries({
    rangeUncertainty: input.rangeUncertaintyMeters,
    timeUncertainty: input.timeUncertaintySeconds,
    launchHeight: input.launchHeightMeters,
    heightUncertainty: input.heightUncertaintyMeters,
  })) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} must be finite and non-negative`);
    }
  }
  if (input.timeUncertaintySeconds >= input.flightTimeSeconds) {
    throw new RangeError("time uncertainty must be smaller than flight time");
  }

  const estimate = measuredVelocity(
    input.rangeMeters,
    input.flightTimeSeconds,
    input.launchHeightMeters,
    input.gravityMetersPerSecondSquared,
  );
  const rangeBounds = [
    Math.max(0, input.rangeMeters - input.rangeUncertaintyMeters),
    input.rangeMeters + input.rangeUncertaintyMeters,
  ] as const;
  const timeBounds = [
    input.flightTimeSeconds - input.timeUncertaintySeconds,
    input.flightTimeSeconds + input.timeUncertaintySeconds,
  ] as const;
  const heightBounds = [
    Math.max(0, input.launchHeightMeters - input.heightUncertaintyMeters),
    input.launchHeightMeters + input.heightUncertaintyMeters,
  ] as const;
  const clampTime = (time: number) =>
    Math.min(timeBounds[1], Math.max(timeBounds[0], time));
  const clampHeight = (height: number) =>
    Math.min(heightBounds[1], Math.max(heightBounds[0], height));
  const candidateInputs: Array<[number, number, number]> = [];

  for (const range of rangeBounds) {
    for (const time of timeBounds) {
      const zeroVerticalHeight =
        0.5 * input.gravityMetersPerSecondSquared * time ** 2;
      for (const height of [...heightBounds, clampHeight(zeroVerticalHeight)]) {
        candidateInputs.push([range, time, height]);
      }
    }
    for (const height of heightBounds) {
      const stationaryTime = Math.sqrt(
        (2 * Math.hypot(range, height)) / input.gravityMetersPerSecondSquared,
      );
      candidateInputs.push([range, clampTime(stationaryTime), height]);
      if (height > 0) {
        candidateInputs.push([
          range,
          clampTime(
            Math.sqrt((2 * height) / input.gravityMetersPerSecondSquared),
          ),
          height,
        ]);
      }
    }
  }
  candidateInputs.push([
    input.rangeMeters,
    input.flightTimeSeconds,
    input.launchHeightMeters,
  ]);
  const candidates = candidateInputs.map(
    ([range, time, height]) =>
      measuredVelocity(range, time, height, input.gravityMetersPerSecondSquared)
        .speed,
  );

  return {
    horizontalVelocityMetersPerSecond: estimate.horizontal,
    verticalVelocityMetersPerSecond: estimate.vertical,
    speedMetersPerSecond: estimate.speed,
    angleDegrees:
      (Math.atan2(estimate.vertical, estimate.horizontal) * 180) / Math.PI,
    minimumSpeedMetersPerSecond: Math.min(...candidates),
    maximumSpeedMetersPerSecond: Math.max(...candidates),
  };
}

export function encodeLaunchState(state: LaunchState): string {
  return btoa(JSON.stringify({ v: 1, ...state }))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

export function decodeLaunchState(value: string): LaunchState | undefined {
  if (value.length === 0 || value.length > 512) return undefined;
  try {
    const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
    const parsed = JSON.parse(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")),
    ) as Partial<LaunchState> & { v?: unknown };
    if (
      parsed.v !== 1 ||
      !Number.isFinite(parsed.speed) ||
      !Number.isFinite(parsed.angleDegrees) ||
      !Number.isFinite(parsed.launchHeight) ||
      parsed.speed! < 5 ||
      parsed.speed! > 60 ||
      parsed.angleDegrees! < 5 ||
      parsed.angleDegrees! > 85 ||
      parsed.launchHeight! < 0 ||
      parsed.launchHeight! > 20
    ) {
      return undefined;
    }
    return {
      speed: parsed.speed!,
      angleDegrees: parsed.angleDegrees!,
      launchHeight: parsed.launchHeight!,
    };
  } catch {
    return undefined;
  }
}

export function trajectoryCsv(
  state: LaunchState,
  samples: TrajectorySample[],
): string {
  const metadata = `# ${JSON.stringify({
    version: 1,
    model: "vacuum-analytic",
    coordinates: "+x right, +y up",
    units: "SI",
    ...state,
  })}`;
  const rows = samples.map((sample) =>
    [
      sample.timeSeconds,
      sample.state.positionMeters.x,
      sample.state.positionMeters.y,
      sample.state.velocityMetersPerSecond.x,
      sample.state.velocityMetersPerSecond.y,
    ].join(","),
  );
  return [
    metadata,
    "time_seconds,x_meters,y_meters,vx_meters_per_second,vy_meters_per_second",
    ...rows,
  ].join("\n");
}
