import { expect, test } from "bun:test";
import { loadedDivider, feedbackAmplifier, twoChargeField, capacitorDischarge } from "../src/lib/features/curriculum/visuals/electrical-visual-models";

test("connecting a load changes the divider and splits conserved current", () => {
  expect(loadedDivider(12, 3000, 6000, null).output).toBe(8);
  const loaded = loadedDivider(12, 3000, 6000, 6000);
  expect(loaded.output).toBe(6);
  expect(loaded.loadCurrent).toBeCloseTo(0.001, 10);
  const unequal = loadedDivider(6, 4000, 6000, 12000);
  expect(unequal.output).toBe(3);
  expect(unequal.lowerCurrent).toBeCloseTo(0.0005, 10);
  expect(unequal.loadCurrent).toBeCloseTo(0.00025, 10);
  expect(unequal.sourceCurrent).toBeCloseTo(unequal.lowerCurrent + unequal.loadCurrent, 10);
});

test("feedback input equality stops at saturation, including the lower swing limit", () => {
  expect(feedbackAmplifier(1.2)).toMatchObject({ gain: 2.5, output: 3, clipped: false, invertingInput: 1.2 });
  expect(feedbackAmplifier(2)).toMatchObject({ requested: 5, output: 4.65, clipped: true, invertingInput: 1.86 });
  expect(feedbackAmplifier(0).output).toBe(0.15);
  expect(feedbackAmplifier(1.86).clipped).toBe(false);
});

test("field cancels but potential adds, and off-centre field points away from the nearer charge", () => {
  const centre = twoChargeField(0);
  expect(centre.left + centre.right).toBe(0);
  expect(centre.potential).toBe(120);
  const right = twoChargeField(0.1);
  expect(right.left + right.right).toBeCloseTo(-337.5, 8);
  expect(right.potential).toBeCloseTo(135, 8);
});

test("at one time constant voltage is 1/e but stored energy is 1/e²", () => {
  const initial = capacitorDischarge(0);
  expect(initial.energy).toBeCloseTo(0.0032, 10);
  const later = capacitorDischarge(2);
  expect(later.voltage).toBeCloseTo(2.943035529, 8);
  expect(later.energy / initial.energy).toBeCloseTo(Math.exp(-2), 10);
  expect(capacitorDischarge(2 * Math.log(2)).charge).toBeCloseTo(0.0004, 10);
});
