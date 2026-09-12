import { describe, expect, test } from "bun:test";

import {
  buildRangeCurve,
  decodeLaunchState,
  encodeLaunchState,
  estimateLaunchFromMeasurements,
  evaluateRangePrediction,
  trajectoryCsv,
} from "../src/lib/features/projectile-motion/projectile-study";

describe("projectile study calculations", () => {
  test("builds a range curve whose equal-height vacuum maximum is 45 degrees", () => {
    const points = buildRangeCurve({ speed: 25, height: 0, gravity: 9.81 });
    const maximum = points.reduce((best, point) =>
      point.vacuumRange > best.vacuumRange ? point : best,
    );

    expect(points[0]?.angleDegrees).toBe(5);
    expect(points.at(-1)?.angleDegrees).toBe(85);
    expect(maximum.angleDegrees).toBe(45);
    expect(maximum.dragRange).toBeLessThan(maximum.vacuumRange);
  });

  test("estimates launch components and conservative uncertainty bounds", () => {
    const estimate = estimateLaunchFromMeasurements({
      rangeMeters: 20,
      rangeUncertaintyMeters: 0.2,
      flightTimeSeconds: 2,
      timeUncertaintySeconds: 0.05,
      launchHeightMeters: 0,
      heightUncertaintyMeters: 0.05,
      gravityMetersPerSecondSquared: 9.81,
    });

    expect(estimate.horizontalVelocityMetersPerSecond).toBeCloseTo(10, 12);
    expect(estimate.verticalVelocityMetersPerSecond).toBeCloseTo(9.81, 12);
    expect(estimate.minimumSpeedMetersPerSecond).toBeLessThan(
      estimate.speedMetersPerSecond,
    );
    expect(estimate.maximumSpeedMetersPerSecond).toBeGreaterThan(
      estimate.speedMetersPerSecond,
    );
  });

  test("keeps the nominal speed inside bounds when vertical velocity crosses zero", () => {
    const estimate = estimateLaunchFromMeasurements({
      rangeMeters: 1,
      rangeUncertaintyMeters: 0,
      flightTimeSeconds: 1,
      timeUncertaintySeconds: 0,
      launchHeightMeters: 4.905,
      heightUncertaintyMeters: 1,
      gravityMetersPerSecondSquared: 9.81,
    });

    expect(estimate.speedMetersPerSecond).toBeCloseTo(1, 12);
    expect(estimate.minimumSpeedMetersPerSecond).toBeLessThanOrEqual(1);
    expect(estimate.maximumSpeedMetersPerSecond).toBeGreaterThanOrEqual(1);
  });

  test("round-trips valid shared state and rejects invalid payloads", () => {
    const state = { speed: 31, angleDegrees: 38, launchHeight: 4 };
    expect(decodeLaunchState(encodeLaunchState(state))).toEqual(state);
    expect(decodeLaunchState("not-base64")).toBeUndefined();
  });

  test("evaluates a committed range prediction without false precision", () => {
    expect(evaluateRangePrediction(90, 93.7)).toEqual({
      absoluteErrorMeters: 3.7,
      percentageError: 3.9,
      band: "close",
    });
    expect(evaluateRangePrediction(60, 93.7).band).toBe("reconsider");
    expect(() => evaluateRangePrediction(-1, 20)).toThrow(RangeError);
  });

  test("exports model metadata and trajectory samples as CSV", () => {
    const csv = trajectoryCsv(
      { speed: 20, angleDegrees: 30, launchHeight: 1 },
      [
        {
          timeSeconds: 0,
          state: {
            positionMeters: { x: 0, y: 1 },
            velocityMetersPerSecond: { x: 17.32, y: 10 },
          },
        },
      ],
    );

    expect(csv).toContain('"version":1');
    expect(csv).toContain(
      "time_seconds,x_meters,y_meters,vx_meters_per_second,vy_meters_per_second",
    );
    expect(csv).toContain("0,0,1,17.32,10");
  });
});
