import { describe, expect, test } from "bun:test";

import {
  dragAcceleration,
  launchVelocity,
  optimizeVacuumRange,
  simulateProjectile,
  solveVacuumFlight,
  vacuumStateAt,
  type ProjectileProblem,
} from "../src/projectile";

const gravity = 9.81;

function vacuumProblem(
  speed: number,
  angleDegrees: number,
  height = 0,
): ProjectileProblem {
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

describe("analytic projectile motion", () => {
  test("resolves a launch vector and evaluates the vacuum state", () => {
    const velocity = launchVelocity(20, Math.PI / 6);
    expect(velocity.x).toBeCloseTo(10 * Math.sqrt(3), 12);
    expect(velocity.y).toBeCloseTo(10, 12);

    const state = vacuumStateAt(
      { positionMeters: { x: 2, y: 3 }, velocityMetersPerSecond: velocity },
      gravity,
      1.5,
    );
    expect(state.positionMeters.x).toBeCloseTo(2 + velocity.x * 1.5, 12);
    expect(state.positionMeters.y).toBeCloseTo(
      3 + 15 - 0.5 * gravity * 1.5 ** 2,
      12,
    );
    expect(state.velocityMetersPerSecond.y).toBeCloseTo(10 - gravity * 1.5, 12);
  });

  test("matches equal-height time, range, and apex formulae", () => {
    const speed = 30;
    const angle = Math.PI / 4;
    const result = solveVacuumFlight(
      vacuumProblem(speed, 45) as ProjectileProblem & {
        model: { kind: "vacuum"; gravityMetersPerSecondSquared: number };
      },
    );

    expect(result.impact.timeSeconds).toBeCloseTo(
      (2 * speed * Math.sin(angle)) / gravity,
      10,
    );
    expect(result.impact.horizontalDisplacementMeters).toBeCloseTo(
      speed ** 2 / gravity,
      10,
    );
    expect(result.extrema.apex.state.velocityMetersPerSecond.y).toBeCloseTo(
      0,
      12,
    );
    expect(result.extrema.apex.state.positionMeters.y).toBeCloseTo(
      (speed * Math.sin(angle)) ** 2 / (2 * gravity),
      10,
    );
  });

  test("solves elevated horizontal launch and immediate ground impact", () => {
    const elevated = solveVacuumFlight(
      vacuumProblem(15, 0, 20) as ProjectileProblem & {
        model: { kind: "vacuum"; gravityMetersPerSecondSquared: number };
      },
    );
    expect(elevated.impact.timeSeconds).toBeCloseTo(
      Math.sqrt(40 / gravity),
      10,
    );
    expect(elevated.impact.state.positionMeters.y).toBe(0);

    const immediate = solveVacuumFlight(
      vacuumProblem(15, 0, 0) as ProjectileProblem & {
        model: { kind: "vacuum"; gravityMetersPerSecondSquared: number };
      },
    );
    expect(immediate.impact.timeSeconds).toBe(0);
    expect(immediate.impact.horizontalDisplacementMeters).toBe(0);
  });

  test("finds the vacuum optimum and shows elevated launch is below 45 degrees", () => {
    const sameHeight = optimizeVacuumRange({
      launchPositionMeters: { x: 0, y: 0 },
      launchSpeedMetersPerSecond: 25,
      groundHeightMeters: 0,
      gravityMetersPerSecondSquared: gravity,
    });
    const elevated = optimizeVacuumRange({
      launchPositionMeters: { x: 0, y: 10 },
      launchSpeedMetersPerSecond: 25,
      groundHeightMeters: 0,
      gravityMetersPerSecondSquared: gravity,
    });
    expect(sameHeight.angleRadians).toBeCloseTo(Math.PI / 4, 12);
    expect(elevated.angleRadians).toBeLessThan(Math.PI / 4);
  });
});

describe("quadratic drag simulation", () => {
  const dragProblem: ProjectileProblem = {
    initialState: {
      positionMeters: { x: 0, y: 2 },
      velocityMetersPerSecond: launchVelocity(35, Math.PI / 4),
    },
    groundHeightMeters: 0,
    model: {
      kind: "quadratic-drag",
      gravityMetersPerSecondSquared: gravity,
      massKilograms: 0.145,
      airDensityKilogramsPerCubicMeter: 1.225,
      dragCoefficient: 0.47,
      referenceAreaSquareMeters: 0.0042,
      windVelocityMetersPerSecond: { x: 0, y: 0 },
    },
  };

  test("drag opposes air-relative velocity and scales quadratically", () => {
    const model = dragProblem.model;
    if (model.kind !== "quadratic-drag") throw new Error("wrong fixture");
    const once = dragAcceleration({ x: 3, y: 4 }, model);
    const twice = dragAcceleration({ x: 6, y: 8 }, model);
    expect(once.x * 3 + once.y * 4).toBeLessThan(0);
    expect(Math.hypot(twice.x, twice.y)).toBeCloseTo(
      4 * Math.hypot(once.x, once.y),
      12,
    );
  });

  test("interpolates one exact impact without below-ground samples", () => {
    const result = simulateProjectile(dragProblem, {
      timeStepSeconds: 0.02,
      maxTimeSeconds: 20,
    });
    expect(result.termination).toBe("impact");
    if (result.termination !== "impact") return;
    expect(result.samples.at(-1)?.state.positionMeters.y).toBe(0);
    expect(
      result.samples.every((sample) => sample.state.positionMeters.y >= 0),
    ).toBe(true);
    expect(
      result.samples.filter((sample) => sample.state.positionMeters.y === 0)
        .length,
    ).toBe(1);
  });

  test("detects impact from ground even when one coarse step spans the flight", () => {
    const result = simulateProjectile(
      {
        initialState: {
          positionMeters: { x: 0, y: 0 },
          velocityMetersPerSecond: launchVelocity(10, Math.PI / 4),
        },
        groundHeightMeters: 0,
        model: { kind: "vacuum", gravityMetersPerSecondSquared: gravity },
      },
      { timeStepSeconds: 10, maxTimeSeconds: 20 },
    );

    expect(result.termination).toBe("impact");
    expect(
      result.samples.every((sample) => sample.state.positionMeters.y >= 0),
    ).toBe(true);
    if (result.termination === "impact") {
      expect(result.impact.timeSeconds).toBeCloseTo(
        (2 * 10 * Math.sin(Math.PI / 4)) / gravity,
        5,
      );
    }
  });

  test("zero-drag numerical flight converges to the analytic impact", () => {
    const analyticProblem = vacuumProblem(30, 38, 4);
    const analytic = solveVacuumFlight(
      analyticProblem as ProjectileProblem & {
        model: { kind: "vacuum"; gravityMetersPerSecondSquared: number };
      },
    );
    const numerical = simulateProjectile(
      {
        ...analyticProblem,
        model: {
          kind: "quadratic-drag",
          gravityMetersPerSecondSquared: gravity,
          massKilograms: 1,
          airDensityKilogramsPerCubicMeter: 0,
          dragCoefficient: 0,
          referenceAreaSquareMeters: 0,
          windVelocityMetersPerSecond: { x: 0, y: 0 },
        },
      },
      { timeStepSeconds: 0.05, maxTimeSeconds: 20 },
    );
    expect(numerical.termination).toBe("impact");
    if (numerical.termination !== "impact") return;
    expect(numerical.impact.timeSeconds).toBeCloseTo(
      analytic.impact.timeSeconds,
      5,
    );
    expect(numerical.impact.horizontalDisplacementMeters).toBeCloseTo(
      analytic.impact.horizontalDisplacementMeters,
      4,
    );
  });

  test("rejects nonphysical and below-ground problems", () => {
    expect(() =>
      simulateProjectile(
        { ...dragProblem, groundHeightMeters: 3 },
        { timeStepSeconds: 0.02, maxTimeSeconds: 5 },
      ),
    ).toThrow(RangeError);
    expect(() =>
      simulateProjectile(dragProblem, {
        timeStepSeconds: 0,
        maxTimeSeconds: 5,
      }),
    ).toThrow(RangeError);
  });
});
