import { describe, expect, test } from "bun:test";
import { springState, travellingString, doubleSlit, stringMode,
  amplitudeModulation, aliasFrequency, quantise, linkBudget,
} from "../src/lib/features/curriculum/visuals/signal-visual-models";

describe("wave and communication teaching models", () => {
  test("spring exchanges energy without changing its period with amplitude", () => {
    const turning = springState(0.05, 0);
    expect(turning.x).toBeCloseTo(0.05, 12);
    expect(turning.velocity).toBeCloseTo(0, 12);
    expect(turning.acceleration).toBeCloseTo(-5, 12);
    const middle = springState(0.05, 0.25);
    expect(middle.velocity).toBeCloseTo(-0.5, 12);
    expect(middle.kinetic).toBeCloseTo(0.05, 12);
    expect(middle.potential).toBeCloseTo(0, 12);
    for (const phase of [0, 0.125, 0.25, 0.63, 1]) {
      const s = springState(0.05, phase);
      expect(s.potential + s.kinetic).toBeCloseTo(0.05, 12);
    }
    expect(springState(0.1, 0.25).total).toBeCloseTo(0.2, 12);
    expect(springState(0.1, 0).period).toBeCloseTo(0.6283185307, 9);
  });

  test("a crest propagates while a material particle stays at fixed x", () => {
    expect(travellingString(0.1, 0).velocity).toBeCloseTo(0, 12);
    expect(travellingString(0.1, 0).y).toBeCloseTo(0.004, 12);
    expect(travellingString(0.2, 0.0125).y).toBeCloseTo(0.004, 12);
    expect(travellingString(0.1, 0.0125).y).toBeCloseTo(0, 12);
    expect(travellingString(0.1, 0.0125).velocity).toBeCloseTo(-0.5026548246, 9);
    expect(travellingString(0, 0, 0.008).speed).toBe(8);
    expect(travellingString(0, 0, 0.008).velocity).toBeCloseTo(-1.0053096491, 9);
  });

  test("double-slit integer orders are bright, half orders dark; D changes spacing", () => {
    expect(doubleSlit(2, 0).relativeIntensity).toBe(1);
    expect(doubleSlit(2, 0.0036).pathDifference).toBeCloseTo(540e-9, 14);
    expect(doubleSlit(2, 0.0036).relativeIntensity).toBeCloseTo(1, 12);
    expect(doubleSlit(2, 0.0018).relativeIntensity).toBeCloseTo(0, 12);
    expect(doubleSlit(4, 0).spacing).toBeCloseTo(0.0072, 12);
  });

  test("fixed-end modes retain permanent nodes even when all points cross zero", () => {
    for (const phase of [0, 0.125, 0.25, 0.5]) {
      for (const x of [0, 1.25 / 3, 2.5 / 3, 1.25]) {
        expect(stringMode(3, phase, x).y).toBeCloseTo(0, 12);
      }
    }
    expect(stringMode(3, 0, 1.25 / 6).y).toBeCloseTo(0.006, 12);
    expect(stringMode(3, 0, 1.25 / 2).y).toBeCloseTo(-0.006, 12);
    expect(stringMode(3, 0.25, 1.25 / 6).y).toBeCloseTo(0, 12);
    expect(stringMode(3, 0.25, 1.25 / 6).envelope).toBeCloseTo(0.006, 12);
    expect(stringMode(3, 0, 0).frequency).toBe(120);
    expect(stringMode(1, 0, 0).wavelength).toBe(2.5);
    expect(() => stringMode(1.5, 0, 0)).toThrow(RangeError);
  });

  test("AM depth changes envelope and sideband amplitudes, not their frequencies", () => {
    const am = amplitudeModulation(0.6, 0);
    expect(am.maximum).toBe(8);
    expect(am.minimum).toBe(2);
    expect(am.sidebandAmplitude).toBe(1.5);
    expect(am.signal).toBe(8);
    expect(amplitudeModulation(0.6, 1 / 4800).envelope).toBeCloseTo(2, 12);
    for (const depth of [0, 0.6, 1]) {
      const s = amplitudeModulation(depth, 0.000013);
      const expanded = 5 * Math.cos(2 * Math.PI * 800000 * 0.000013)
        + depth * 2.5 * (Math.cos(2 * Math.PI * 797600 * 0.000013)
        + Math.cos(2 * Math.PI * 802400 * 0.000013));
      expect(s.signal).toBeCloseTo(expanded, 10);
      expect(s.upperHz - s.lowerHz).toBe(4800);
    }
    expect(amplitudeModulation(0, 0).sidebandAmplitude).toBe(0);
    expect(amplitudeModulation(1, 0).minimum).toBe(0);
    expect(() => amplitudeModulation(1.1, 0)).toThrow(RangeError);
  });

  test("alias ambiguity is unchanged by bits and Nyquist equality can erase a sine", () => {
    expect(aliasFrequency(9400, 12000)).toBe(2600);
    expect(aliasFrequency(9400, 24000)).toBe(9400);
    expect(aliasFrequency(21400, 12000)).toBe(2600);
    for (let n = 0; n < 12; n++) {
      expect(Math.cos(2 * Math.PI * 9400 * n / 12000))
        .toBeCloseTo(Math.cos(2 * Math.PI * 2600 * n / 12000), 11);
      expect(Math.sin(Math.PI * n)).toBeCloseTo(0, 12);
    }
  });

  test("mid-rise quantisation respects upper intervals, clamps and signed error", () => {
    const q = quantise(1.011, 8);
    expect(q.step).toBe(0.016);
    expect(q.code).toBe(63);
    expect(q.reconstructed).toBe(1.016);
    expect(q.error).toBeCloseTo(0.005, 12);
    expect(quantise(1.024, 8).code).toBe(64);
    expect(quantise(4.096, 8).code).toBe(255);
    expect(quantise(0, 8).reconstructed).toBe(0.008);
    expect(quantise(5, 8).error).toBeCloseTo(-0.912, 12);
    expect(quantise(-1, 8).code).toBe(0);
    expect(quantise(1.011, 12).step).toBe(0.001);
    // Exact decimal boundaries belong to the upper interval despite binary division roundoff.
    expect(quantise(1.011, 12).code).toBe(1011);
    expect(quantise(1.011, 12).reconstructed).toBeCloseTo(1.0115, 12);
    expect(quantise(1.011, 12).error).toBeCloseTo(0.0005, 12);
    expect(quantise(1.011 - 1e-10, 12).code).toBe(1010);
    for (let code = 0; code <= 256; code++) {
      const input = code * 0.016;
      const result = quantise(input, 8);
      expect(result.code).toBe(Math.min(255, code));
      expect(Math.abs(result.error)).toBeLessThanOrEqual(0.008 + 1e-12);
    }
  });

  test("loss reduces signal; separately added noise changes SNR, not attenuation", () => {
    const b = linkBudget(3, 0.002);
    expect(b.lossDb).toBe(8);
    expect(b.signalMw).toBeCloseTo(0.7924465962, 9);
    expect(b.snr).toBeCloseTo(396.2232981, 6);
    expect(b.snrDb).toBeCloseTo(25.97940009, 7);
    expect(b.totalMw).toBeCloseTo(0.7944465962, 9);
    const louderNoise = linkBudget(3, 0.02);
    expect(louderNoise.signalMw).toBe(b.signalMw);
    expect(louderNoise.lossDb).toBe(b.lossDb);
    expect(louderNoise.snrDb).toBeCloseTo(15.97940009, 7);
    expect(linkBudget(0, 0.002).lossDb).toBe(1.4);
    expect(b.amplitudeFraction ** 2).toBeCloseTo(b.signalMw / 5, 12);
  });
});
