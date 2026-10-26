import { expect, test } from "bun:test";
import {
  elasticStrip, iceHeating, gasPiston, narrowingPipe, thermalExchange,
  electronBeam, photoelectric, hydrogenTransition, decayAccount, decayTrial,
} from "../src/lib/features/curriculum/visuals/matter-modern-visual-models";

test("strip: specimen extension is not strain or modulus; geometry changes stress", () => {
  const strip = elasticStrip(32);
  expect(strip.stressPa).toBeCloseTo(80e6, 1);
  expect(strip.strain).toBeCloseTo(0.0004, 9);
  expect(strip.extensionM).toBeCloseTo(0.00064, 9);
  expect(strip.energyJ).toBeCloseTo(0.01024, 8); // triangular, not rectangular work
  expect(elasticStrip(32, 0.8).extensionM).toBeCloseTo(0.00032, 9);
  expect(elasticStrip(0).energyJ).toBe(0);
  expect(elasticStrip(40, 0.2).strain).toBeCloseTo(0.001, 9);
});

test("ice: sensible heating stops at the melting boundary, energy does not", () => {
  expect(iceHeating(0).temperatureC).toBe(-10);
  expect(iceHeating(420).temperatureC).toBe(-5);
  expect(iceHeating(840).temperatureC).toBe(0);
  expect(iceHeating(840).meltedFraction).toBe(0);
  const half = iceHeating(7520);
  expect(half.temperatureC).toBe(0);
  expect(half.meltedFraction).toBe(0.5);
  expect(half.latentJ).toBe(6680);
  expect(half.timeS).toBeCloseTo(104.444444, 5);
  expect(iceHeating(14200).temperatureC).toBe(0);
  expect(iceHeating(14200).meltedFraction).toBe(1);
  expect(iceHeating(14368).temperatureC).toBe(1);
  const finish = iceHeating(17560);
  expect(finish.temperatureC).toBe(20);
  expect(finish.timeS).toBeCloseTo(243.888889, 5);
  expect(finish.inputJ - finish.lossJ).toBeCloseTo(17560, 6);
  expect(finish.sensibleIceJ + finish.latentJ + finish.sensibleWaterJ).toBe(17560);
});

test("gas: path determines boundary work, not endpoint temperature alone", () => {
  const piston = gasPiston(400);
  expect(piston.volumeM3 * 1000).toBeCloseTo(5.542666667, 7);
  expect(piston.pressurePa).toBe(90000);
  expect(piston.workByJ).toBeCloseTo(124.710, 6);
  expect(piston.internalChangeJ).toBeCloseTo(187.065, 6);
  expect(piston.heatInJ).toBeCloseTo(311.775, 6);
  const locked = gasPiston(400, true);
  expect(locked.volumeM3 * 1000).toBeCloseTo(4.157, 8);
  expect(locked.pressurePa).toBe(120000);
  expect(locked.workByJ).toBe(0);
  expect(locked.heatInJ).toBeCloseTo(187.065, 6);
  expect(gasPiston(600, true).rmsSpeed).toBeCloseTo(1934.24404, 4);
  expect(gasPiston(600, true).pressurePa).toBe(180000);
  expect(gasPiston(300).heatInJ).toBe(0);
});

test("pipe: continuity uses area, pressure drop subtracts inlet kinetic energy", () => {
  const pipe = narrowingPipe(2);
  expect(pipe.flowM3S).toBeCloseTo(0.00036, 9);
  expect(pipe.outletSpeed).toBeCloseTo(1.8, 8);
  expect(pipe.pressureDropPa).toBeCloseTo(1440, 7); // not 1620
  expect(pipe.outletGaugePa).toBeCloseTo(13560, 7);
  expect(pipe.kineticGainW).toBeCloseTo(0.5184, 8);
  const raised = narrowingPipe(2, 0.4);
  expect(raised.gravityPa).toBe(3920);
  expect(raised.outletGaugePa).toBeCloseTo(9640, 7);
  expect(raised.outletSpeed).toBeCloseTo(1.8, 8);
  expect(narrowingPipe(6).pressureDropPa).toBeCloseTo(0, 7);
  expect(narrowingPipe(1).outletSpeed).toBeCloseTo(3.6, 8);
});

test("thermal exchange: heater replaces net radiation plus convection, not emission alone", () => {
  const heat = thermalExchange(400, 0.75);
  expect(heat.emittedW).toBeCloseTo(87.0912, 6);
  expect(heat.absorbedW).toBeCloseTo(27.5562, 6);
  expect(heat.netRadiationW).toBeCloseTo(59.535, 6);
  expect(heat.convectionW).toBe(40);
  expect(heat.heaterW).toBeCloseTo(99.535, 6);
  const equilibrium = thermalExchange(300, 0.75);
  expect(equilibrium.emittedW).toBeGreaterThan(0);
  expect(equilibrium.netRadiationW).toBe(0);
  expect(equilibrium.heaterW).toBe(0);
  expect(thermalExchange(400, 0).heaterW).toBe(40);
  expect(thermalExchange(400, 1).netRadiationW).toBeCloseTo(79.38, 6);
});

test("beam: electric work sets speed; B changes radius and period but supplies no work", () => {
  const beam = electronBeam(1.6, 2);
  expect(beam.kineticJ / 1e-16).toBeCloseTo(2.5632, 7);
  expect(beam.speedMS).toBeCloseTo(23723070.2, 0);
  expect(beam.radiusM).toBeCloseTo(0.067444896, 8);
  expect(beam.periodS * 1e9).toBeCloseTo(17.863151, 5);
  const stronger = electronBeam(1.6, 4);
  expect(stronger.speedMS).toBe(beam.speedMS);
  expect(stronger.kineticJ).toBe(beam.kineticJ);
  expect(stronger.radiusM).toBeCloseTo(0.033722448, 8);
  expect(stronger.magneticWorkJ).toBe(0);
  expect(electronBeam(3.2, 2).speedMS / beam.speedMS).toBeCloseTo(Math.SQRT2, 8);
});

test("photoelectric: independent flux doubles current, not Kmax or stopping voltage", () => {
  const flux = 4.312017593e12; // independent rounded exercise expectation
  const normal = photoelectric(700, flux);
  expect(normal.photonEV).toBeCloseTo(2.89525593, 7);
  expect(normal.kineticEV).toBeCloseTo(0.69525593, 7);
  expect(normal.stoppingV).toBeCloseTo(0.69525593, 7);
  expect(normal.powerW * 1e6).toBeCloseTo(2, 7);
  expect(normal.currentA * 1e9).toBeCloseTo(55.26281747, 6);
  const bright = photoelectric(700, flux * 2);
  expect(bright.kineticEV).toBe(normal.kineticEV);
  expect(bright.stoppingV).toBe(normal.stoppingV);
  expect(bright.currentA * 1e9).toBeCloseTo(110.52563494, 6);
  const higherFrequency = photoelectric(800, flux);
  expect(higherFrequency.currentA).toBe(normal.currentA); // flux held, not power
  expect(higherFrequency.powerW).toBeGreaterThan(normal.powerW);
  expect(higherFrequency.kineticEV).toBeGreaterThan(normal.kineticEV);
});

test("photoelectric: below threshold has no negative-energy electrons or stopping voltage", () => {
  const below = photoelectric(400, 1e13);
  expect(below.emits).toBe(false);
  expect(below.currentA).toBe(0);
  expect(below.kineticEV).toBe(0);
  expect(below.stoppingV).toBeNull();
  expect(below.thresholdTHz).toBeCloseTo(531.904618, 5);
  expect(photoelectric(530, 1e13).emits).toBe(false);
  expect(photoelectric(540, 1e13).emits).toBe(true);
  expect(photoelectric(700, 0).currentA).toBe(0);
  expect(photoelectric(700, 0).powerW).toBe(0);
});

test("spectrum: reversing the transition changes the atom sign, never photon energy", () => {
  const emission = hydrogenTransition(4);
  expect(emission.upperEV).toBe(-0.85);
  expect(emission.photonEV).toBeCloseTo(2.55, 8);
  expect(emission.wavelengthNm).toBeCloseTo(486.597635, 5);
  expect(emission.atomChangeEV).toBeCloseTo(-2.55, 8);
  const absorption = hydrogenTransition(4, true);
  expect(absorption.photonEV).toBe(emission.photonEV);
  expect(absorption.wavelengthNm).toBe(emission.wavelengthNm);
  expect(absorption.atomChangeEV).toBeCloseTo(2.55, 8);
  expect(hydrogenTransition(5).photonEV).toBeCloseTo(2.856, 8);
  expect(hydrogenTransition(5).wavelengthNm).toBeCloseTo(434.462174, 5);
  expect(hydrogenTransition(6).wavelengthNm).toBeLessThan(hydrogenTransition(3).wavelengthNm);
});

test("decay: subtract background before ratios; detected rate is not source activity", () => {
  const initial = decayAccount(0);
  expect(initial.grossCpm).toBe(960);
  expect(initial.netCpm).toBe(900);
  expect(initial.activityBq).toBe(60);
  expect(initial.expectedSourcePopulation).toBeCloseTo(25968.510736, 5);
  const defaultState = decayAccount(5);
  expect(defaultState.expectedSmallPopulation).toBe(32);
  expect(defaultState.grossCpm).toBe(510);
  const later = decayAccount(15);
  expect(later.netCpm).toBe(112.5);
  expect(later.grossCpm).toBe(172.5);
  expect(later.activityBq).toBe(7.5);
  expect(later.expectedSmallPopulation).toBe(8);
  expect(initial.netCpm / later.netCpm).toBe(8);
  expect(initial.grossCpm / later.grossCpm).not.toBe(8);
  expect(decayAccount(20).grossCpm).toBe(116.25);
});

test("random lifetime trials are repeatable, integer-valued, and monotone in scrubbed time", () => {
  const initial = decayTrial(0, 42);
  expect(initial.filter(Boolean).length).toBe(64);
  const first = decayTrial(5, 42);
  expect(first).toEqual(decayTrial(5, 42));
  expect(first).not.toEqual(decayTrial(5, 43));
  const later = decayTrial(15, 42);
  expect(later.every((alive, i) => !alive || first[i])).toBe(true);
  const populations = Array.from({ length: 300 }, (_, i) => decayTrial(5, i + 1).filter(Boolean).length);
  expect(new Set(populations).size).toBeGreaterThan(5);
  // A generous ensemble check, not an assertion that every trial halves exactly.
  const mean = populations.reduce((sum, n) => sum + n, 0) / populations.length;
  expect(mean).toBeGreaterThan(30);
  expect(mean).toBeLessThan(34);
});

test("model boundaries reject unsupported or nonphysical inputs rather than drawing fiction", () => {
  for (const invalid of [
    () => elasticStrip(-1), () => elasticStrip(32, 0), () => iceHeating(17561),
    () => gasPiston(0), () => narrowingPipe(0), () => narrowingPipe(2, -1),
    () => thermalExchange(400, 1.1), () => thermalExchange(NaN, 0.75),
    () => electronBeam(1.6, 0), () => electronBeam(Infinity, 2),
    () => photoelectric(0, 1e12), () => photoelectric(700, -1),
    () => hydrogenTransition(4.5), () => hydrogenTransition(2),
    () => decayAccount(-1), () => decayTrial(1, 0), () => decayTrial(1, 1.5),
  ]) expect(invalid).toThrow(RangeError);
});
