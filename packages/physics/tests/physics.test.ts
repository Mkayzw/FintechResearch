import { describe, expect, test } from "bun:test";

import type {
  PendulumParameters,
  PendulumState,
} from "@strange-loops/contracts";
import {
  accelerations,
  energy,
  integrate,
  massMatrix,
  stateDistance,
  stepEuler,
  stepRk4,
  validateParameters,
  wrapAngle,
} from "../src/index";

const parameters: PendulumParameters = {
  mass1: 1,
  mass2: 1,
  length1: 1,
  length2: 1,
  gravity: 9.81,
};

const resting: PendulumState = {
  theta1: 0,
  theta2: 0,
  omega1: 0,
  omega2: 0,
};

describe("double-pendulum dynamics", () => {
  test("downward and upright static equilibria have zero acceleration", () => {
    expect(accelerations(resting, parameters)).toEqual({
      alpha1: 0,
      alpha2: 0,
    });
    const upright = { ...resting, theta1: Math.PI, theta2: Math.PI };
    const result = accelerations(upright, parameters);
    expect(Math.abs(result.alpha1)).toBeLessThan(1e-12);
    expect(Math.abs(result.alpha2)).toBeLessThan(1e-12);
  });

  test("mass matrix is symmetric and positive definite", () => {
    const matrix = massMatrix(
      { ...resting, theta1: 0.7, theta2: -0.4 },
      parameters,
    );
    expect(matrix.m12).toBe(matrix.m21);
    expect(matrix.m11).toBeGreaterThan(0);
    expect(matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21).toBeGreaterThan(
      0,
    );
  });

  test("rejects nonphysical parameters", () => {
    expect(() => validateParameters({ ...parameters, mass1: 0 })).toThrow();
    expect(() => validateParameters({ ...parameters, length2: -1 })).toThrow();
    expect(() =>
      validateParameters({ ...parameters, gravity: Number.NaN }),
    ).toThrow();
  });

  test("computes independent kinetic, potential, and total energy", () => {
    const result = energy(resting, parameters);
    expect(result.kinetic).toBe(0);
    expect(result.potential).toBeCloseTo(-29.43, 10);
    expect(result.total).toBeCloseTo(result.kinetic + result.potential, 12);
  });
});

describe("integration and diagnostics", () => {
  const initial: PendulumState = {
    theta1: 1.2,
    theta2: -0.3,
    omega1: 0.2,
    omega2: -0.1,
  };

  test("RK4 conserves energy better than Euler at the same timestep", () => {
    const initialEnergy = energy(initial, parameters).total;
    const eulerFinal = integrate(initial, parameters, 4, 1 / 120, stepEuler).at(
      -1,
    )?.state;
    const rk4Final = integrate(initial, parameters, 4, 1 / 120, stepRk4).at(
      -1,
    )?.state;

    if (!eulerFinal || !rk4Final)
      throw new Error("integration produced no samples");

    const eulerDrift = Math.abs(
      (energy(eulerFinal, parameters).total - initialEnergy) / initialEnergy,
    );
    const rk4Drift = Math.abs(
      (energy(rk4Final, parameters).total - initialEnergy) / initialEnergy,
    );
    expect(rk4Drift).toBeLessThan(eulerDrift * 0.05);
  });

  test("RK4 converges under timestep halving", () => {
    const coarse = integrate(initial, parameters, 0.5, 1 / 60, stepRk4).at(
      -1,
    )?.state;
    const medium = integrate(initial, parameters, 0.5, 1 / 120, stepRk4).at(
      -1,
    )?.state;
    const fine = integrate(initial, parameters, 0.5, 1 / 240, stepRk4).at(
      -1,
    )?.state;
    if (!coarse || !medium || !fine)
      throw new Error("integration produced no samples");

    expect(stateDistance(medium, fine, parameters)).toBeLessThan(
      stateDistance(coarse, fine, parameters) / 8,
    );
  });

  test("wraps angular differences across the branch cut", () => {
    expect(wrapAngle(3 * Math.PI)).toBeCloseTo(-Math.PI, 12);
    const left = { ...resting, theta1: Math.PI - 0.01 };
    const right = { ...resting, theta1: -Math.PI + 0.01 };
    expect(stateDistance(left, right, parameters)).toBeCloseTo(0.02, 8);
  });

  test("identical states have zero distance", () => {
    expect(stateDistance(initial, initial, parameters)).toBe(0);
  });
});
