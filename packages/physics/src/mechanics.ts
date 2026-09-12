const GRAVITATIONAL_CONSTANT = 6.6743e-11;

function finite(value: number, name: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be finite`);
  }
}

function positive(value: number, name: string): void {
  finite(value, name);
  if (value <= 0) throw new RangeError(`${name} must be positive`);
}

function nonNegative(value: number, name: string): void {
  finite(value, name);
  if (value < 0) throw new RangeError(`${name} must be non-negative`);
}

export interface ConstantAccelerationInput {
  initialPositionMeters: number;
  initialVelocityMetersPerSecond: number;
  accelerationMetersPerSecondSquared: number;
  timeSeconds: number;
}

export function constantAccelerationState(input: ConstantAccelerationInput) {
  finite(input.initialPositionMeters, "initial position");
  finite(input.initialVelocityMetersPerSecond, "initial velocity");
  finite(input.accelerationMetersPerSecondSquared, "acceleration");
  nonNegative(input.timeSeconds, "time");

  const displacementMeters =
    input.initialVelocityMetersPerSecond * input.timeSeconds +
    0.5 * input.accelerationMetersPerSecondSquared * input.timeSeconds ** 2;
  return {
    positionMeters: input.initialPositionMeters + displacementMeters,
    displacementMeters,
    velocityMetersPerSecond:
      input.initialVelocityMetersPerSecond +
      input.accelerationMetersPerSecondSquared * input.timeSeconds,
  };
}

export interface Collision1DInput {
  mass1Kilograms: number;
  velocity1MetersPerSecond: number;
  mass2Kilograms: number;
  velocity2MetersPerSecond: number;
  coefficientOfRestitution: number;
}

export function collision1D(input: Collision1DInput) {
  positive(input.mass1Kilograms, "mass 1");
  positive(input.mass2Kilograms, "mass 2");
  finite(input.velocity1MetersPerSecond, "velocity 1");
  finite(input.velocity2MetersPerSecond, "velocity 2");
  if (
    !Number.isFinite(input.coefficientOfRestitution) ||
    input.coefficientOfRestitution < 0 ||
    input.coefficientOfRestitution > 1
  ) {
    throw new RangeError("coefficient of restitution must be between 0 and 1");
  }

  const totalMass = input.mass1Kilograms + input.mass2Kilograms;
  const momentumBeforeKilogramMetersPerSecond =
    input.mass1Kilograms * input.velocity1MetersPerSecond +
    input.mass2Kilograms * input.velocity2MetersPerSecond;
  const velocity1MetersPerSecond =
    (input.mass1Kilograms * input.velocity1MetersPerSecond +
      input.mass2Kilograms * input.velocity2MetersPerSecond -
      input.mass2Kilograms *
        input.coefficientOfRestitution *
        (input.velocity1MetersPerSecond - input.velocity2MetersPerSecond)) /
    totalMass;
  const velocity2MetersPerSecond =
    velocity1MetersPerSecond +
    input.coefficientOfRestitution *
      (input.velocity1MetersPerSecond - input.velocity2MetersPerSecond);
  const momentumAfterKilogramMetersPerSecond =
    input.mass1Kilograms * velocity1MetersPerSecond +
    input.mass2Kilograms * velocity2MetersPerSecond;
  const kineticEnergyBeforeJoules =
    0.5 * input.mass1Kilograms * input.velocity1MetersPerSecond ** 2 +
    0.5 * input.mass2Kilograms * input.velocity2MetersPerSecond ** 2;
  const kineticEnergyAfterJoules =
    0.5 * input.mass1Kilograms * velocity1MetersPerSecond ** 2 +
    0.5 * input.mass2Kilograms * velocity2MetersPerSecond ** 2;

  return {
    velocity1MetersPerSecond,
    velocity2MetersPerSecond,
    momentumBeforeKilogramMetersPerSecond,
    momentumAfterKilogramMetersPerSecond,
    kineticEnergyBeforeJoules,
    kineticEnergyAfterJoules,
    kineticEnergyChangeJoules:
      kineticEnergyAfterJoules - kineticEnergyBeforeJoules,
  };
}

export function momentOfForce(input: {
  forceNewtons: number;
  perpendicularDistanceMeters: number;
  direction: "clockwise" | "anticlockwise";
}): number {
  nonNegative(input.forceNewtons, "force");
  nonNegative(input.perpendicularDistanceMeters, "perpendicular distance");
  const magnitude = input.forceNewtons * input.perpendicularDistanceMeters;
  return input.direction === "anticlockwise" ? magnitude : -magnitude;
}

export function springEnergy(
  springConstantNewtonsPerMeter: number,
  extensionMeters: number,
): number {
  positive(springConstantNewtonsPerMeter, "spring constant");
  finite(extensionMeters, "extension");
  return 0.5 * springConstantNewtonsPerMeter * extensionMeters ** 2;
}

export function workEnergy(input: {
  massKilograms: number;
  initialSpeedMetersPerSecond: number;
  netWorkJoules: number;
}) {
  positive(input.massKilograms, "mass");
  nonNegative(input.initialSpeedMetersPerSecond, "initial speed");
  finite(input.netWorkJoules, "net work");
  const initialKineticEnergyJoules =
    0.5 * input.massKilograms * input.initialSpeedMetersPerSecond ** 2;
  const finalKineticEnergyJoules =
    initialKineticEnergyJoules + input.netWorkJoules;
  if (finalKineticEnergyJoules < 0) {
    throw new RangeError("net work cannot reduce kinetic energy below zero");
  }
  return {
    initialKineticEnergyJoules,
    finalKineticEnergyJoules,
    finalSpeedMetersPerSecond: Math.sqrt(
      (2 * finalKineticEnergyJoules) / input.massKilograms,
    ),
  };
}

export function radialForce(input: {
  massKilograms: number;
  radiusMeters: number;
  speedMetersPerSecond: number;
}) {
  positive(input.massKilograms, "mass");
  positive(input.radiusMeters, "radius");
  nonNegative(input.speedMetersPerSecond, "speed");
  const angularSpeedRadiansPerSecond =
    input.speedMetersPerSecond / input.radiusMeters;
  const accelerationMetersPerSecondSquared =
    input.speedMetersPerSecond ** 2 / input.radiusMeters;
  return {
    accelerationMetersPerSecondSquared,
    forceNewtons: input.massKilograms * accelerationMetersPerSecondSquared,
    angularSpeedRadiansPerSecond,
    periodSeconds:
      input.speedMetersPerSecond === 0
        ? Number.POSITIVE_INFINITY
        : (2 * Math.PI * input.radiusMeters) / input.speedMetersPerSecond,
  };
}

export function gravitationalOrbit(input: {
  centralMassKilograms: number;
  radiusMeters: number;
}) {
  positive(input.centralMassKilograms, "central mass");
  positive(input.radiusMeters, "orbital radius");
  const gravitationalParameter =
    GRAVITATIONAL_CONSTANT * input.centralMassKilograms;
  const fieldStrengthNewtonsPerKilogram =
    gravitationalParameter / input.radiusMeters ** 2;
  const orbitalSpeedMetersPerSecond = Math.sqrt(
    gravitationalParameter / input.radiusMeters,
  );
  return {
    fieldStrengthNewtonsPerKilogram,
    potentialJoulesPerKilogram: -gravitationalParameter / input.radiusMeters,
    orbitalSpeedMetersPerSecond,
    periodSeconds:
      (2 * Math.PI * input.radiusMeters) / orbitalSpeedMetersPerSecond,
    escapeSpeedMetersPerSecond: Math.sqrt(
      (2 * gravitationalParameter) / input.radiusMeters,
    ),
  };
}
