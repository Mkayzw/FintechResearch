import { describe, expect, test } from "bun:test";
import { checkNumericalAnswer as checkKinematicsAnswer } from "../src/lib/features/mechanics/numerical-answer";
import {
  reversalEvidence, kinematicsProblems,
  practicalParts, evaluateTrolleyLine,
} from "../src/lib/features/mechanics/kinematics-depth";

describe("Kinematics depth workshop", () => {
  test("distinguishes signed displacement and total distance on both sides of the turn", () => {
    const before = reversalEvidence(2);
    expect(before.velocityMetersPerSecond).toBe(6);
    expect(before.displacementMeters).toBe(18);
    expect(before.distanceMeters).toBe(18);
    const turn = reversalEvidence(4);
    expect(turn.velocityMetersPerSecond).toBe(0);
    expect(turn.distanceMeters).toBe(24);
    const after = reversalEvidence(6);
    expect(after.velocityMetersPerSecond).toBe(-6);
    expect(after.displacementMeters).toBe(18);
    expect(after.forwardMeters).toBe(24);
    expect(after.backwardMeters).toBe(6);
    expect(after.distanceMeters).toBe(30);
    expect(reversalEvidence(8).displacementMeters).toBe(0);
    expect(reversalEvidence(8).distanceMeters).toBe(48);
    expect(() => reversalEvidence(-1)).toThrow(RangeError);
  });

  test("gives specific direction and distance feedback rather than accepting magnitudes", () => {
    const parts = kinematicsProblems[0].parts;
    expect(checkKinematicsAnswer(parts[1], "6").message).toContain("speed");
    expect(checkKinematicsAnswer(parts[1], "-6").correct).toBe(true);
    expect(checkKinematicsAnswer(parts[2], "34").message).toContain("distance");
    expect(checkKinematicsAnswer(parts[3], "16").correct).toBe(false);
    expect(checkKinematicsAnswer(parts[3], "34").correct).toBe(true);
    expect(checkKinematicsAnswer(parts[3], "3400").correct).toBe(false);
    expect(checkKinematicsAnswer(parts[0], " ").message).toContain("blank");
    expect(checkKinematicsAnswer(parts[0], "Infinity").correct).toBe(false);
  });

  test("separates reaction and braking and accepts rounded vertical-flight results", () => {
    const braking = kinematicsProblems[1].parts;
    for (const [i, response] of ["16", "4", "40", "56"].entries()) {
      expect(checkKinematicsAnswer(braking[i]!, response).correct).toBe(true);
    }
    expect(checkKinematicsAnswer(braking[1], "4.8").message).toContain("includes reaction");
    expect(checkKinematicsAnswer(braking[3], "40").message).toContain("omitted");
    const vertical = kinematicsProblems[2].parts;
    expect(checkKinematicsAnswer(vertical[2], "2.95").correct).toBe(true);
    expect(checkKinematicsAnswer(vertical[2], "-1.354").correct).toBe(false);
    expect(checkKinematicsAnswer(vertical[3], "-21.5").correct).toBe(true);
    expect(checkKinematicsAnswer(vertical[3], "21.5").message).toContain("downward");
    expect(checkKinematicsAnswer(vertical[3], "-21.4").correct).toBe(false);
  });

  test("requires a line consistent with every reading, not only the endpoints", () => {
    expect(evaluateTrolleyLine(0.6, 0.4).compatible).toBe(true);
    expect(evaluateTrolleyLine(0.6, 0.41).compatible).toBe(true);
    expect(evaluateTrolleyLine(0.4, 0.7).compatible).toBe(false);
    expect(evaluateTrolleyLine(0.6, 0).compatible).toBe(false);
    // Both endpoint bars admit this line; an interior reading rejects it.
    expect(evaluateTrolleyLine(0.6, 0.44).compatible).toBe(false);
    expect(evaluateTrolleyLine(0.6, 0.4).residuals[2]).toBeCloseTo(0.02, 10);
  });

  test("checks endpoint gradient and a conservative two-endpoint bound", () => {
    expect(checkKinematicsAnswer(practicalParts[0]!, "0.600").correct).toBe(true);
    expect(checkKinematicsAnswer(practicalParts[0]!, "0.7025").message).toContain("initial velocity");
    expect(checkKinematicsAnswer(practicalParts[1]!, "1.5e-2").correct).toBe(true);
    expect(checkKinematicsAnswer(practicalParts[1]!, "0.0075").message).toContain("Both endpoint");
    expect(checkKinematicsAnswer(practicalParts[1]!, "0.06").correct).toBe(false);
  });
});
