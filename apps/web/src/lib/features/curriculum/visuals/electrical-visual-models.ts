/** Ideal steady DC divider. Resistances in ohms; a null load means open circuit. */
export function loadedDivider(supply: number, upper: number, lower: number, load: number | null) {
  const effectiveLower = load === null ? lower : lower * load / (lower + load);
  const output = supply * effectiveLower / (upper + effectiveLower);
  return { output, sourceCurrent: (supply - output) / upper, lowerCurrent: output / lower, loadCurrent: load === null ? 0 : output / load };
}

/** Stipulated quasistatic non-inverting stage, not a real device's datasheet. */
export function feedbackAmplifier(input: number, feedback = 18000, ground = 12000) {
  const gain = 1 + feedback / ground;
  const requested = input * gain;
  const output = Math.min(4.65, Math.max(0.15, requested));
  return { gain, requested, output, invertingInput: output / gain, clipped: output !== requested };
}

/** Sources +2 nC at ±0.3 m; observation point strictly between them. */
export function twoChargeField(x: number) {
  const leftDistance = x + 0.3;
  const rightDistance = 0.3 - x;
  return { left: 18 / leftDistance ** 2, right: -18 / rightDistance ** 2, potential: 18 / leftDistance + 18 / rightDistance };
}

/** Initially 8 V across 100 µF, discharged through 20 kΩ. */
export function capacitorDischarge(time: number) {
  const voltage = 8 * Math.exp(-time / 2);
  return { voltage, charge: 100e-6 * voltage, current: voltage / 20000, energy: 0.5 * 100e-6 * voltage ** 2 };
}
