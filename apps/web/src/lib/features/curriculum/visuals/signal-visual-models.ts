/** Ideal teaching models. SI units unless a name explicitly states otherwise. */
const tau = 2 * Math.PI;

export function springState(amplitude: number, phaseTurns: number) {
  const mass = 0.4;
  const stiffness = 40;
  const omega = Math.sqrt(stiffness / mass);
  const x = amplitude * Math.cos(tau * phaseTurns);
  const velocity = -amplitude * omega * Math.sin(tau * phaseTurns);
  const potential = stiffness * x * x / 2;
  const kinetic = mass * velocity * velocity / 2;
  return { x, velocity, acceleration: -omega * omega * x, potential, kinetic,
    total: stiffness * amplitude * amplitude / 2, period: tau / omega,
    time: tau * phaseTurns / omega };
}

export function travellingString(x: number, time: number, amplitude = 0.004) {
  const k = 5 * Math.PI;
  const omega = 40 * Math.PI;
  const phase = k * x - omega * time;
  return { y: amplitude * Math.sin(phase), velocity: -amplitude * omega * Math.cos(phase),
    speed: omega / k, wavelength: tau / k, frequency: omega / tau };
}

/** Equal, in-phase, narrow slits; small-angle far-field screen coordinate. */
export function doubleSlit(screenDistance: number, y: number) {
  const wavelength = 540e-9;
  const separation = 0.3e-3;
  const pathDifference = separation * y / screenDistance;
  const phase = tau * pathDifference / wavelength;
  return { pathDifference, phase, spacing: wavelength * screenDistance / separation,
    relativeIntensity: Math.cos(phase / 2) ** 2 };
}

export function stringMode(n: number, phaseTurns: number, x: number) {
  if (!Number.isInteger(n) || n < 1) throw new RangeError("Mode must be a positive integer");
  const length = 1.25;
  const speed = Math.sqrt(25 / 0.0025);
  const envelope = 0.006 * Math.sin(n * Math.PI * x / length);
  return { y: envelope * Math.cos(tau * phaseTurns), envelope,
    frequency: n * speed / (2 * length), wavelength: 2 * length / n,
    nodeSpacing: length / n, speed };
}

/** Carrier-present AM, restricted to a non-reversing signed envelope. */
export function amplitudeModulation(depth: number, time: number) {
  if (depth < 0 || depth > 1) throw new RangeError("AM depth must be between zero and one");
  const carrierAmplitude = 5;
  const message = Math.cos(tau * 2400 * time);
  const carrier = carrierAmplitude * Math.cos(tau * 800000 * time);
  const envelope = carrierAmplitude * (1 + depth * message);
  return { message, carrier, envelope, signal: (1 + depth * message) * carrier,
    maximum: carrierAmplitude * (1 + depth), minimum: carrierAmplitude * (1 - depth),
    sidebandAmplitude: depth * carrierAmplitude / 2,
    lowerHz: 797600, upperHz: 802400, bandwidthHz: 4800 };
}

/** Cosine aliases agree in phase at integer sample times, including foldover. */
export function aliasFrequency(frequency: number, sampleRate: number) {
  if (frequency < 0 || sampleRate <= 0) throw new RangeError("Require f ≥ 0 and fs > 0");
  return Math.abs(frequency - Math.round(frequency / sampleRate) * sampleRate);
}

/** Unsigned mid-rise quantiser: upper interval at boundaries, endpoint clamp. */
export function quantise(input: number, bits: number, fullScale = 4.096) {
  if (!Number.isInteger(bits) || bits < 1 || bits > 16 || fullScale <= 0) {
    throw new RangeError("Require 1–16 integer bits and positive full scale");
  }
  const levels = 2 ** bits;
  const step = fullScale / levels;
  const scaled = input / step;
  // Decimal boundaries such as 1.011 / 0.001 can divide to 1010.9999999999999.
  // Snap only machine-roundoff-sized differences, not a physical input tolerance.
  const nearest = Math.round(scaled);
  const interval = Math.abs(scaled - nearest) <= 2 * Number.EPSILON * Math.max(1, Math.abs(scaled))
    ? nearest : Math.floor(scaled);
  const code = Math.min(levels - 1, Math.max(0, interval));
  const reconstructed = (code + 0.5) * step;
  return { levels, step, code, reconstructed, error: reconstructed - input };
}

/** Receiver noise is stipulated AFTER link loss, in a fixed common bandwidth. */
export function linkBudget(lengthKm: number, noiseMw: number) {
  if (lengthKm < 0 || noiseMw <= 0) throw new RangeError("Require nonnegative length and positive noise");
  const lossDb = 2.2 * lengthKm + 1.4;
  const signalMw = 5 * 10 ** (-lossDb / 10);
  const snr = signalMw / noiseMw;
  return { lossDb, signalMw, noiseMw, totalMw: signalMw + noiseMw,
    snr, snrDb: 10 * Math.log10(snr), amplitudeFraction: 10 ** (-lossDb / 20) };
}
