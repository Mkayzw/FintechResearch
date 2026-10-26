// Exercise constants, not fitted data. All public inputs carry units in their names.
const e = 1.602e-19;
const h = 6.626e-34;
const c = 3e8;

function range(value: number, min: number, max = Infinity): number {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`Expected a finite value between ${min} and ${max}`);
  }
  return value;
}

export function elasticStrip(forceN: number, areaMm2 = 0.4) {
  range(forceN, 0, 40);
  range(areaMm2, 0.2, 0.8);
  const stressPa = forceN / (areaMm2 * 1e-6);
  const strain = stressPa / 200e9;
  const extensionM = strain * 1.6;
  return { stressPa, strain, extensionM, energyJ: forceN * extensionM / 2 };
}

export function iceHeating(retainedJ: number) {
  range(retainedJ, 0, 17560);
  const sensibleIceJ = Math.min(retainedJ, 840);
  const latentJ = Math.min(Math.max(retainedJ - 840, 0), 13360);
  const sensibleWaterJ = Math.max(retainedJ - 14200, 0);
  const temperatureC = retainedJ < 840 ? -10 + retainedJ / 84
    : retainedJ <= 14200 ? 0 : sensibleWaterJ / 168;
  const timeS = retainedJ / 72;
  return { temperatureC, meltedFraction: latentJ / 13360, sensibleIceJ, latentJ,
    sensibleWaterJ, timeS, inputJ: 80 * timeS, lossJ: 8 * timeS };
}

export function gasPiston(temperatureK: number, rigid = false) {
  range(temperatureK, 300, 600);
  const initialVolumeM3 = 0.15 * 8.314 * 300 / 90000;
  const volumeM3 = rigid ? initialVolumeM3 : 0.15 * 8.314 * temperatureK / 90000;
  const pressurePa = rigid ? 90000 * temperatureK / 300 : 90000;
  const workByJ = rigid ? 0 : 0.15 * 8.314 * (temperatureK - 300);
  const internalChangeJ = 1.5 * 0.15 * 8.314 * (temperatureK - 300);
  return { volumeM3, pressurePa, workByJ, internalChangeJ,
    heatInJ: internalChangeJ + workByJ, rmsSpeed: Math.sqrt(3 * 8.314 * temperatureK / 0.004) };
}

export function narrowingPipe(outletAreaCm2: number, riseM = 0) {
  range(outletAreaCm2, 1, 6);
  range(riseM, 0, 0.4);
  const flowM3S = 6e-4 * 0.6;
  const outletSpeed = flowM3S / (outletAreaCm2 * 1e-4);
  const kineticInPa = 0.5 * 1000 * 0.6 ** 2;
  const kineticOutPa = 0.5 * 1000 * outletSpeed ** 2;
  const gravityPa = 1000 * 9.8 * riseM;
  const pressureDropPa = kineticOutPa - kineticInPa + gravityPa;
  return { flowM3S, outletSpeed, kineticInPa, kineticOutPa, gravityPa,
    pressureDropPa, outletGaugePa: 15000 - pressureDropPa,
    kineticGainW: (kineticOutPa - kineticInPa) * flowM3S };
}

export function thermalExchange(temperatureK: number, emissivity: number) {
  range(temperatureK, 300, 450);
  range(emissivity, 0, 1);
  const emittedW = emissivity * 5.67e-8 * 0.08 * temperatureK ** 4;
  const absorbedW = emissivity * 5.67e-8 * 0.08 * 300 ** 4;
  const netRadiationW = emittedW - absorbedW;
  const convectionW = 5 * 0.08 * (temperatureK - 300);
  return { emittedW, absorbedW, netRadiationW, convectionW,
    heaterW: netRadiationW + convectionW };
}

export function electronBeam(voltageKV: number, fieldMT: number) {
  range(voltageKV, 0.4, 3.2);
  range(fieldMT, 1, 4);
  const kineticJ = e * voltageKV * 1000;
  const speedMS = Math.sqrt(2 * kineticJ / 9.109e-31);
  const radiusM = 9.109e-31 * speedMS / (e * fieldMT * 1e-3);
  return { kineticJ, speedMS, radiusM, fractionC: speedMS / c,
    periodS: 2 * Math.PI * 9.109e-31 / (e * fieldMT * 1e-3), magneticWorkJ: 0 };
}

// Flux, not optical power, is independently held fixed when frequency changes.
// The 8% collected yield is an ideal above-threshold stipulation, not surface data.
export function photoelectric(frequencyTHz: number, photonFluxPerS: number) {
  range(frequencyTHz, 300, 1000);
  range(photonFluxPerS, 0, 1e13);
  const photonJ = h * frequencyTHz * 1e12;
  const photonEV = photonJ / e;
  const emits = photonEV >= 2.2;
  const kineticEV = emits ? photonEV - 2.2 : 0;
  return { photonEV, emits, kineticEV, stoppingV: emits ? kineticEV : null,
    thresholdTHz: 2.2 * e / h / 1e12, powerW: photonFluxPerS * photonJ,
    currentA: emits ? e * 0.08 * photonFluxPerS : 0 };
}

export function hydrogenTransition(upperN: number, absorption = false) {
  range(upperN, 3, 6);
  if (!Number.isInteger(upperN)) throw new RangeError("A level must be an integer");
  const upperEV = -13.6 / upperN ** 2;
  const lowerEV = -3.4;
  const photonEV = upperEV - lowerEV;
  return { upperEV, lowerEV, photonEV, wavelengthNm: h * c / (photonEV * e) * 1e9,
    atomChangeEV: absorption ? photonEV : -photonEV };
}

export function decayAccount(timeMin: number) {
  range(timeMin, 0, 20);
  const survival = 2 ** (-timeMin / 5);
  const activityBq = 60 * survival;
  const netCpm = 0.25 * activityBq * 60;
  return { survival, expectedSmallPopulation: 64 * survival, activityBq, netCpm,
    backgroundCpm: 60, grossCpm: netCpm + 60,
    expectedSourcePopulation: activityBq / (Math.LN2 / 300) };
}

// A seeded inverse-CDF draw gives each of 64 parents one lifetime. Scrubbing
// time never redraws the trial, so decayed parents cannot reappear as time grows.
export function decayTrial(timeMin: number, seed: number): boolean[] {
  range(timeMin, 0, 20);
  range(seed, 1, 0xffffffff);
  if (!Number.isInteger(seed)) throw new RangeError("Seed must be an integer");
  let state = seed >>> 0;
  return Array.from({ length: 64 }, () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const uniform = (state + 0.5) / 4294967296;
    const lifetimeMin = -5 * Math.log2(uniform);
    return lifetimeMin > timeMin;
  });
}
