import type { ExperimentPreset } from "@strange-loops/contracts";

const degrees = (value: number): number => (value * Math.PI) / 180;

export const presets: readonly ExperimentPreset[] = [
  {
    id: "butterfly",
    name: "Butterfly effect",
    tagline: "One ten-thousandth of a degree changes everything.",
    description:
      "A high-energy release where nearby trajectories overlap, hesitate, and finally part ways.",
    state: { theta1: degrees(120), theta2: degrees(-10), omega1: 0, omega2: 0 },
    parameters: { mass1: 1, mass2: 1, length1: 1, length2: 1, gravity: 9.81 },
    perturbation: degrees(0.0001),
    solver: "rk4",
    timeStep: 1 / 240,
  },
  {
    id: "quiet",
    name: "Quiet orbit",
    tagline: "Order lives inside the same equations.",
    description:
      "Small angles produce nearly regular oscillations and a compact phase portrait.",
    state: { theta1: degrees(12), theta2: degrees(-7), omega1: 0, omega2: 0 },
    parameters: { mass1: 1, mass2: 1, length1: 1, length2: 1, gravity: 9.81 },
    perturbation: degrees(0.0001),
    solver: "rk4",
    timeStep: 1 / 240,
  },
  {
    id: "exchange",
    name: "Energy exchange",
    tagline: "Watch motion migrate between the links.",
    description:
      "An asymmetric release foregrounds the continual transfer of kinetic and potential energy.",
    state: { theta1: degrees(80), theta2: degrees(20), omega1: 0, omega2: 0 },
    parameters: {
      mass1: 1.4,
      mass2: 0.7,
      length1: 1,
      length2: 0.8,
      gravity: 9.81,
    },
    perturbation: degrees(0.001),
    solver: "rk4",
    timeStep: 1 / 240,
  },
  {
    id: "stress",
    name: "Solver stress",
    tagline: "Sometimes the computer invents energy.",
    description:
      "Coarse Euler stepping exposes numerical drift that can masquerade as interesting physics.",
    state: {
      theta1: degrees(135),
      theta2: degrees(-35),
      omega1: 0.4,
      omega2: -0.2,
    },
    parameters: { mass1: 1, mass2: 1, length1: 1, length2: 1, gravity: 9.81 },
    perturbation: degrees(0.01),
    solver: "euler",
    timeStep: 1 / 90,
  },
] as const;

export const defaultPreset = presets[0]!;
