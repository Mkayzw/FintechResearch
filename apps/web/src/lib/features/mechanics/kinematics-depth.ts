import { constantAccelerationState } from "@strange-loops/physics";
import type { NumericalPart } from "./numerical-answer";

export const kinematicsProblems = [
  {
    id: "reversal",
    title: "01 · A reversal is not a reset",
    context: "A particle starts at x = 0 with velocity +10.0 m/s and maintains acceleration −2.00 m/s² for 8.00 s. Take right as positive. The acceleration continues after the particle stops momentarily; this is not a vehicle whose brakes switch off at rest.",
    strategy: "Sketch v against t first. Locate the zero crossing before calculating any area. Use signed areas for displacement, but add area magnitudes for distance.",
    parts: [
      { id: "turn", prompt: "When does the particle first reverse direction?", unit: "s", expected: 5, tolerance: 0.02, hint: "At a reversal, v = 0. Set 0 = u + at; do not set a = 0.", working: "0 = 10 − 2t gives t = 5.00 s. Acceleration remains −2.00 m/s² at that instant.", mistakes: [{ value: 0, explanation: "Zero velocity is the condition for this turning point, not the elapsed time. Solve 10 − 2t = 0." }] },
      { id: "velocity", prompt: "Find the signed velocity at 8.00 s.", unit: "m/s", expected: -6, tolerance: 0.03, hint: "Continue the same straight velocity-time line beyond the crossing. The particle is now moving left.", working: "v = 10 + (−2)(8) = −6.00 m/s. Speed is 6.00 m/s, but velocity must retain the negative direction.", mistakes: [{ value: 6, explanation: "You found the speed. The requested velocity is negative because the particle moves left after t = 5 s." }] },
      { id: "displacement", prompt: "Find displacement from the starting point at 8.00 s.", unit: "m", expected: 16, tolerance: 0.1, hint: "Calculate ½ × 5 × 10 above the axis, then subtract ½ × 3 × 6 below it.", working: "Forward area = +25 m; backward area = −9 m. Displacement = 25 − 9 = +16.0 m. Equivalently s = 10(8) − ½(2)(8²).", mistakes: [{ value: 34, explanation: "34 m adds both area magnitudes: that is distance, not signed displacement." }, { value: 25, explanation: "25 m is the turning-point position. There are another 3 s of motion back toward the origin." }] },
      { id: "distance", prompt: "Find the total distance travelled in the 8.00 s.", unit: "m", expected: 34, tolerance: 0.1, hint: "Split the motion at t = 5 s. Distance cannot be obtained by taking the absolute value of net displacement after a reversal.", working: "Distance = |25| + |−9| = 34.0 m. The final position is only 16 m from the start because some ground was covered twice.", mistakes: [{ value: 16, explanation: "16 m is net displacement. Distance counts the return journey too: add 25 m outward and 9 m back." }] },
    ] satisfies NumericalPart[],
    transfer: "Without recalculating the whole path, explain why at t = 10 s the displacement is zero but distance is not. Then calculate the distance and compare average speed with average velocity over those 10 s.",
    transferSolution: "The two triangular areas are +25 m and −25 m. Displacement = 0; distance = 50 m. Average velocity = 0 m/s, but average speed = 5.0 m/s. Zero average velocity does not mean the particle remained stationary.",
  },
  {
    id: "braking",
    title: "02 · Two phases, two models",
    context: "A minibus travels at 20.0 m/s when the driver sees an obstacle. For a reaction interval of 0.800 s its speed is constant. It then brakes uniformly with acceleration −5.00 m/s² until stationary. Ignore gradients and changes in road conditions. This is a mathematical exercise, not a safe-following-distance recommendation.",
    strategy: "Draw a horizontal velocity segment followed by a sloping segment. Set a new time origin at the start of braking; the reaction interval is not part of the braking duration.",
    parts: [
      { id: "reaction", prompt: "How far does the minibus travel before braking starts?", unit: "m", expected: 16, tolerance: 0.1, hint: "No braking has begun. The reaction phase has a = 0, so use distance = speed × reaction time.", working: "Reaction distance = 20.0 × 0.800 = 16.0 m.", mistakes: [{ value: 14.4, explanation: "You applied −5 m/s² during the reaction interval. The stated model keeps speed constant until braking begins." }] },
      { id: "braking-time", prompt: "How long does the braking phase alone last?", unit: "s", expected: 4, tolerance: 0.02, hint: "Use 0 = 20 − 5t for the braking phase only.", working: "Braking time = (0 − 20)/(−5) = 4.00 s. Total time from seeing the obstacle is 4.80 s.", mistakes: [{ value: 4.8, explanation: "4.80 s includes reaction. This part asks only for the time after the brakes begin to act." }] },
      { id: "braking-distance", prompt: "Find distance travelled while braking.", unit: "m", expected: 40, tolerance: 0.2, hint: "Use the triangle under the braking graph, or v² = u² + 2as. Do not use u × braking time at constant speed.", working: "0 = 20² + 2(−5)s gives s = 40.0 m; graph check: ½ × 4 × 20 = 40 m.", mistakes: [{ value: 80, explanation: "80 m assumes the minibus stays at 20 m/s for all 4 s. During uniform braking its average speed is 10 m/s." }, { value: -40, explanation: "The acceleration is negative, but the minibus still moves forward. In 0 − 400 = −10s, both negatives cancel." }] },
      { id: "total", prompt: "Find total stopping distance measured from first seeing the obstacle.", unit: "m", expected: 56, tolerance: 0.2, hint: "Add the reaction rectangle to the braking triangle. They describe different intervals.", working: "Total stopping distance = 16.0 + 40.0 = 56.0 m.", mistakes: [{ value: 40, explanation: "You omitted the 16 m travelled during reaction. The question begins when the obstacle is seen, not when braking starts." }] },
    ] satisfies NumericalPart[],
    transfer: "Keep reaction time and braking acceleration unchanged, but increase initial speed to 30.0 m/s. Is the total distance 1.5 times larger? Derive a general expression before substituting.",
    transferSolution: "D = uτ + u²/(2b), where b is the positive braking-acceleration magnitude. At 30 m/s, reaction distance = 24 m and braking distance = 90 m: total 114 m, not 84 m. The linear and squared terms scale differently. Stop the model at rest; continuing −b beyond rest would incorrectly make a braking vehicle reverse.",
  },
  {
    id: "vertical",
    title: "03 · Choose the root, defend the sign",
    context: "A ball is thrown vertically upward at 8.00 m/s from a platform 20.0 m above the ground. Use g = 10.0 m/s² for this exercise and neglect air resistance. Set y = 0 at the release point and take upward as positive, so the ground is at y = −20.0 m. Stop the model at impact.",
    strategy: "Keep one coordinate convention on ascent and descent. Gravity remains −10 m/s² even when the ball moves downward. The ground is a position, not a positive distance to substitute blindly.",
    parts: [
      { id: "apex-time", prompt: "Find time from release to the apex.", unit: "s", expected: 0.8, tolerance: 0.005, hint: "At the apex v = 0, not a = 0. Use 0 = 8 − 10t.", working: "t = 8/10 = 0.800 s. Acceleration is still −10.0 m/s².", mistakes: [{ value: 1.6, explanation: "1.60 s is the time to return to the release height, not the time to reach the apex." }] },
      { id: "apex-height", prompt: "Find the greatest height above the ground, not above the platform.", unit: "m", expected: 23.2, tolerance: 0.05, hint: "First find rise above the release point from 0 = 8² − 20Δy, then add the platform height.", working: "Rise = 64/20 = 3.20 m. Height above ground = 20.0 + 3.20 = 23.2 m.", mistakes: [{ value: 3.2, explanation: "3.20 m is the rise above the platform. The requested height is measured from the ground 20 m below release." }] },
      { id: "impact-time", prompt: "Find the positive time at which the ball reaches the ground.", unit: "s", expected: (8 + Math.sqrt(464)) / 10, tolerance: 0.01, hint: "Set −20 = 8t − 5t². Solve 5t² − 8t − 20 = 0 and decide which root lies after release.", working: "t = (8 ± √464)/10 gives +2.954 s or −1.354 s. The negative root is an extrapolated event before the specified launch, not a second impact in this experiment.", mistakes: [{ value: -1.354, explanation: "That is the negative-time root. We defined release as t = 0 and need the event after release." }, { value: 2, explanation: "2 s treats the ball as dropped from rest. The actual initial upward velocity adds flight time." }] },
      { id: "impact-velocity", prompt: "Find the signed velocity immediately before impact.", unit: "m/s", expected: -Math.sqrt(464), tolerance: 0.05, hint: "Use v = 8 − 10t with the positive impact time, or v² = 8² + 2(−10)(−20) and choose the downward root.", working: "v = −√464 ≈ −21.54 m/s. The speed is 21.54 m/s; the minus sign gives downward motion, not negative kinetic energy.", mistakes: [{ value: 21.54, explanation: "The magnitude is right, but the velocity is downward on impact. With upward positive, retain the negative sign." }, { value: -20, explanation: "−20 m/s is the impact velocity for a drop from rest over 20 m. The thrown ball starts with kinetic energy too." }] },
    ] satisfies NumericalPart[],
    transfer: "Now launch downward from the same platform at 8.00 m/s. Predict which changes: impact speed, impact time, or both. Justify with kinematics, then independently with energy.",
    transferSolution: "The downward launch takes (−8 + √464)/10 ≈ 1.354 s, but has the same impact speed √464 ≈ 21.54 m/s. In v² = u² + 2aΔy, u² is unchanged. Energy also depends on initial speed squared and the same 20 m height loss. Equal impact speed does not imply equal journey time.",
  },
] as const;

/** Fixed teaching example: +12 m/s initially, −3 m/s² continuously, 0 ≤ t ≤ 8 s. */
export function reversalEvidence(timeSeconds: number) {
  if (!Number.isFinite(timeSeconds) || timeSeconds < 0 || timeSeconds > 8) throw new RangeError("time must be between 0 and 8 seconds");
  const state = constantAccelerationState({ initialPositionMeters: 0, initialVelocityMetersPerSecond: 12, accelerationMetersPerSecondSquared: -3, timeSeconds });
  const beforeTurn = Math.min(timeSeconds, 4);
  const forwardMeters = 12 * beforeTurn - 1.5 * beforeTurn ** 2;
  const backwardMeters = 1.5 * Math.max(0, timeSeconds - 4) ** 2;
  return { ...state, forwardMeters, backwardMeters, distanceMeters: forwardMeters + backwardMeters };
}

/** Synthetic readings for an exercise, never represented as a real experiment. */
export const trolleyReadings = [
  { time: 0, velocity: 0.41 }, { time: 1, velocity: 1.00 },
  { time: 2, velocity: 1.62 }, { time: 3, velocity: 2.19 },
  { time: 4, velocity: 2.81 },
] as const;
export const velocityBound = 0.03;

export function evaluateTrolleyLine(gradient: number, intercept: number) {
  if (!Number.isFinite(gradient) || !Number.isFinite(intercept)) throw new RangeError("line parameters must be finite");
  const residuals = trolleyReadings.map(reading => reading.velocity - (intercept + gradient * reading.time));
  return { residuals, compatible: residuals.every(residual => Math.abs(residual) <= velocityBound + 1e-12) };
}

export const practicalParts: readonly NumericalPart[] = [
  { id: "gradient", prompt: "Estimate acceleration using the nominal first-to-last velocity gradient.", unit: "m/s²", expected: 0.6, tolerance: 0.005, hint: "Use Δv/Δt = (2.81 − 0.41)/(4.00 − 0.00), not v/t for a line with a nonzero intercept.", working: "a = 2.40/4.00 = 0.600 m/s². Units: (m/s)/s = m/s².", mistakes: [{ value: 0.7025, explanation: "You used final v/t as though initial velocity were zero. Subtract the initial 0.41 m/s before dividing." }] },
  { id: "bound", prompt: "With exact times for this exercise, estimate the first-to-last gradient bound from two ±0.03 m/s endpoint bounds.", unit: "m/s²", expected: 0.015, tolerance: 0.0005, hint: "For a conservative bound on a difference, add the two absolute velocity bounds, then divide by the 4.00 s interval.", working: "δa = (0.03 + 0.03)/4.00 = 0.015 m/s², giving 0.600 ± 0.015 m/s². This is an endpoint worst-case bound, not a confidence interval or a statistical best-fit uncertainty.", mistakes: [{ value: 0.0075, explanation: "Both endpoint velocities are uncertain. Using only one ±0.03 bound underestimates the worst-case gradient range." }, { value: 0.06, explanation: "0.06 m/s is the bound on Δv, not on acceleration. Divide by the 4 s time interval." }] },
];
