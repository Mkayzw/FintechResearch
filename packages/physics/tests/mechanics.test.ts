import { describe, expect, test } from "bun:test";

import {
  collision1D,
  constantAccelerationState,
  gravitationalOrbit,
  momentOfForce,
  radialForce,
  springEnergy,
  workEnergy,
} from "../src";

describe("A-Level mechanics models", () => {
  test("evaluates constant-acceleration motion and graph quantities", () => {
    expect(
      constantAccelerationState({
        initialPositionMeters: 2,
        initialVelocityMetersPerSecond: 3,
        accelerationMetersPerSecondSquared: 4,
        timeSeconds: 5,
      }),
    ).toEqual({
      positionMeters: 67,
      displacementMeters: 65,
      velocityMetersPerSecond: 23,
    });
  });

  test("solves one-dimensional collisions from momentum and restitution", () => {
    const elastic = collision1D({
      mass1Kilograms: 2,
      velocity1MetersPerSecond: 3,
      mass2Kilograms: 1,
      velocity2MetersPerSecond: 0,
      coefficientOfRestitution: 1,
    });
    expect(elastic.velocity1MetersPerSecond).toBeCloseTo(1, 12);
    expect(elastic.velocity2MetersPerSecond).toBeCloseTo(4, 12);
    expect(elastic.momentumBeforeKilogramMetersPerSecond).toBeCloseTo(
      elastic.momentumAfterKilogramMetersPerSecond,
      12,
    );
    expect(elastic.kineticEnergyChangeJoules).toBeCloseTo(0, 12);

    const inelastic = collision1D({
      mass1Kilograms: 2,
      velocity1MetersPerSecond: 3,
      mass2Kilograms: 1,
      velocity2MetersPerSecond: 0,
      coefficientOfRestitution: 0,
    });
    expect(inelastic.velocity1MetersPerSecond).toBeCloseTo(2, 12);
    expect(inelastic.velocity2MetersPerSecond).toBeCloseTo(2, 12);
    expect(inelastic.kineticEnergyChangeJoules).toBeLessThan(0);
  });

  test("calculates signed moments, spring energy and work-energy", () => {
    expect(
      momentOfForce({
        forceNewtons: 20,
        perpendicularDistanceMeters: 0.5,
        direction: "clockwise",
      }),
    ).toBe(-10);
    expect(springEnergy(40, 0.25)).toBeCloseTo(1.25, 12);
    expect(
      workEnergy({
        massKilograms: 4,
        initialSpeedMetersPerSecond: 2,
        netWorkJoules: 24,
      }).finalSpeedMetersPerSecond,
    ).toBeCloseTo(4, 12);
  });

  test("resolves circular motion and gravitational orbit values", () => {
    expect(
      radialForce({
        massKilograms: 2,
        radiusMeters: 4,
        speedMetersPerSecond: 6,
      }),
    ).toEqual({
      accelerationMetersPerSecondSquared: 9,
      forceNewtons: 18,
      angularSpeedRadiansPerSecond: 1.5,
      periodSeconds: (4 * Math.PI) / 3,
    });

    const earthOrbit = gravitationalOrbit({
      centralMassKilograms: 5.972e24,
      radiusMeters: 6.371e6 + 4e5,
    });
    expect(earthOrbit.fieldStrengthNewtonsPerKilogram).toBeCloseTo(8.694, 2);
    expect(earthOrbit.orbitalSpeedMetersPerSecond).toBeCloseTo(7673, -1);
    expect(earthOrbit.periodSeconds).toBeCloseTo(5545, -1);
  });

  test("rejects nonphysical mechanics inputs", () => {
    expect(() =>
      constantAccelerationState({
        initialPositionMeters: 0,
        initialVelocityMetersPerSecond: 0,
        accelerationMetersPerSecondSquared: 1,
        timeSeconds: -1,
      }),
    ).toThrow(RangeError);
    expect(() => springEnergy(-1, 2)).toThrow(RangeError);
    expect(() =>
      collision1D({
        mass1Kilograms: 1,
        velocity1MetersPerSecond: 0,
        mass2Kilograms: 1,
        velocity2MetersPerSecond: 0,
        coefficientOfRestitution: 1.1,
      }),
    ).toThrow(RangeError);
    expect(() =>
      gravitationalOrbit({ centralMassKilograms: 0, radiusMeters: 1 }),
    ).toThrow(RangeError);
  });
});
