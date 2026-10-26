import { describe, expect, test } from "bun:test";
import { depthChapters, evaluateDepthLine } from "../src/lib/features/mechanics/mechanics-depth";
import { checkNumericalAnswer } from "../src/lib/features/mechanics/numerical-answer";

describe("Mechanics depth workshops", () => {
  test("accepts rounded results on the tolerance boundary without admitting nearby wrong answers", () => {
    const gradient = depthChapters.forces.investigation.parts[0]!;
    expect(checkNumericalAnswer(gradient, "0.80").correct).toBe(true);
    expect(checkNumericalAnswer(gradient, "0.801").correct).toBe(false);
  });

  test("keeps atomic-scale answers distinct from zero while accepting scientific notation", () => {
    const charge = { id: "charge", prompt: "Find charge", unit: "C", expected: 1.6e-19, tolerance: 1e-21, hint: "", working: "Charge magnitude is 1.6 × 10⁻¹⁹ C." };
    expect(checkNumericalAnswer(charge, "1.60e-19").correct).toBe(true);
    expect(checkNumericalAnswer(charge, "1.61e-19").correct).toBe(true);
    expect(checkNumericalAnswer(charge, "1.62e-19").correct).toBe(false);
    expect(checkNumericalAnswer(charge, "0").correct).toBe(false);
    expect(checkNumericalAnswer(charge, "-1.6e-19").correct).toBe(false);
  });

  test("diagnoses physical misconceptions across the five chapters", () => {
    const cases = [
      ["dynamics", 2, 2, "13.6", "19.6", "weight"],
      ["forces", 2, 0, "0.049", "0.249", "length"],
      ["energy", 0, 1, "-10", "10", "negative"],
      ["circular", 0, 1, "2000", "4000", "limit"],
      ["gravitation", 0, 2, "-5e7", "5e7", "negative"],
    ] as const;
    for (const [chapter, problem, index, right, wrong, diagnosis] of cases) {
      const part = depthChapters[chapter].problems[problem]!.parts[index]!;
      expect(checkNumericalAnswer(part, right).correct).toBe(true);
      const feedback = checkNumericalAnswer(part, wrong);
      expect(feedback.correct).toBe(false);
      expect(feedback.message.toLowerCase()).toContain(diagnosis);
    }
  });

  test("interprets the actual practical axes, including inverse mass and scaled units", () => {
    const cases = [
      ["dynamics", 0, "0.5", "2"],
      ["forces", 1, "79.75", "0.7975"],
      ["energy", 1, "80.40", "66.67"],
      ["circular", 1, "0.200109", "1.975"],
      ["gravitation", 2, "4.00796", "40.0796"],
    ] as const;
    for (const [chapter, index, right, wrong] of cases) {
      const part = depthChapters[chapter].investigation.parts[index]!;
      expect(checkNumericalAnswer(part, right).correct).toBe(true);
      expect(checkNumericalAnswer(part, wrong).correct).toBe(false);
    }
  });

  test("checks all practical bounds, including interior readings and the boundary itself", () => {
    for (const [id, gradient, intercept] of [
      ["dynamics", 2, -0.2], ["forces", 0.8, 0], ["energy", 25, 5],
      ["circular", 3.95, 0], ["gravitation", 0.99, 0],
    ] as const) {
      const investigation = depthChapters[id].investigation;
      expect(evaluateDepthLine(investigation, gradient, intercept).compatible).toBe(true);
      expect(evaluateDepthLine(investigation, gradient, intercept + 1).compatible).toBe(false);
    }
    const spring = depthChapters.forces.investigation;
    const interiorFailure = evaluateDepthLine(spring, 0.8, 0.04);
    expect(interiorFailure.residuals[0]).toBeCloseTo(-0.02, 10);
    expect(interiorFailure.residuals[4]).toBeCloseTo(-0.03, 10);
    expect(interiorFailure.compatible).toBe(false);
    expect(evaluateDepthLine(spring, 0.8, -0.02).compatible).toBe(true);
    expect(evaluateDepthLine(spring, 0.8, -0.02001).compatible).toBe(false);
  });
});
