export type MechanicsModuleId =
  | "kinematics"
  | "dynamics"
  | "forces"
  | "energy"
  | "circular"
  | "gravitation";

export interface MechanicsQuestion {
  prompt: string;
  options: readonly string[];
  answer: number;
  explanation: string;
}

export interface MechanicsModule {
  id: MechanicsModuleId;
  number: string;
  title: string;
  thesis: string;
  objective: string;
  equations: readonly string[];
  practical: string;
  examPrompt: string;
  misconception: string;
  question: MechanicsQuestion;
}

export const mechanicsModules: readonly MechanicsModule[] = [
  {
    id: "kinematics",
    number: "01",
    title: "Kinematics",
    thesis: "Motion leaves evidence in gradients and areas.",
    objective:
      "Describe rectilinear motion, interpret motion graphs, derive constant-acceleration equations and solve free-fall and projectile problems.",
    equations: [
      String.raw`v = u + at`,
      String.raw`s = ut + \frac{1}{2}at^2`,
      String.raw`v^2 = u^2 + 2as`,
    ],
    practical:
      "Track a trolley or falling body. Plot v against t to obtain acceleration from the gradient, or s against t² to test constant acceleration.",
    examPrompt:
      "A vehicle accelerates uniformly from 4.0 m/s to 20.0 m/s in 8.0 s. Determine its acceleration and displacement, showing the equation selected.",
    misconception:
      "Negative velocity specifies direction; it does not automatically mean the object is slowing down.",
    question: {
      prompt: "An object has zero velocity at one instant. What must be true?",
      options: [
        "Its acceleration is zero.",
        "Its displacement is zero.",
        "Neither statement must be true.",
      ],
      answer: 2,
      explanation:
        "At a turning point velocity can be zero while acceleration is non-zero, and the position need not be the origin.",
    },
  },
  {
    id: "dynamics",
    number: "02",
    title: "Dynamics + Momentum",
    thesis: "Choose the system before claiming momentum is conserved.",
    objective:
      "Apply Newton’s laws, force as rate of change of momentum, impulse and conservation of momentum to interactions and collisions.",
    equations: [
      String.raw`\sum F = \frac{dp}{dt}`,
      String.raw`p = mv`,
      String.raw`J = \int F\,dt = \Delta p`,
    ],
    practical:
      "Use light gates or video to measure cart velocities before and after a collision. Compare total momentum with uncertainty and report kinetic-energy change separately.",
    examPrompt:
      "A 2.0 kg trolley moving at 3.0 m/s strikes a stationary 1.0 kg trolley. They join. Calculate their common speed and the kinetic energy lost.",
    misconception:
      "Third-law force pairs are equal and opposite but act on different bodies, so they do not cancel on one free-body diagram.",
    question: {
      prompt:
        "During a collision between a lorry and a car, which force is larger?",
      options: [
        "The lorry’s force on the car.",
        "The car’s force on the lorry.",
        "The forces have equal magnitude.",
      ],
      answer: 2,
      explanation:
        "Newton’s third law gives equal-magnitude, opposite-direction forces on the two different vehicles.",
    },
  },
  {
    id: "forces",
    number: "03",
    title: "Forces",
    thesis: "A free-body diagram is an argument about one body.",
    objective:
      "Resolve forces, apply translational and rotational equilibrium, analyse friction and moments, and investigate elastic response.",
    equations: [
      String.raw`\sum F = ma`,
      String.raw`\tau = Fd_{\perp}`,
      String.raw`F = kx`,
    ],
    practical:
      "Balance a metre rule to determine an unknown mass, or plot force against extension to obtain a spring constant and identify the limit of proportionality.",
    examPrompt:
      "A uniform 4.0 m beam of weight 120 N is hinged at one end and supported horizontally by a vertical cable at the other. Determine the cable tension and hinge force.",
    misconception:
      "Static friction adjusts up to its limiting value; it is not always equal to μN.",
    question: {
      prompt: "A book rests on a horizontal table. Why is it in equilibrium?",
      options: [
        "No forces act on it.",
        "The normal reaction balances its weight.",
        "Its weight and normal reaction are a third-law pair.",
      ],
      answer: 1,
      explanation:
        "Both forces act on the book and sum to zero. Their third-law partners act on Earth and the table.",
    },
  },
  {
    id: "energy",
    number: "04",
    title: "Work, Energy + Power",
    thesis: "Energy accounting begins by declaring the system.",
    objective:
      "Calculate work, kinetic and potential energy, apply conservation and work-energy, and determine power and efficiency.",
    equations: [
      String.raw`W = Fs\cos\theta`,
      String.raw`E_k = \frac{1}{2}mv^2`,
      String.raw`P = \frac{W}{t} = \mathbf F\cdot\mathbf v`,
    ],
    practical:
      "Measure the useful power produced while climbing stairs, or use the area under a force-extension graph to determine elastic energy.",
    examPrompt:
      "A 900 kg car climbs 25 m vertically at constant speed in 20 s. If the engine is 30% efficient, determine its input power.",
    misconception:
      "Energy is transferred or dissipated into less useful stores; it is not used up or destroyed.",
    question: {
      prompt:
        "A force is perpendicular to an object’s displacement. What work does it do?",
      options: ["Positive work.", "Zero work.", "Negative work."],
      answer: 1,
      explanation:
        "W = Fs cos 90° = 0 even though the force may change direction.",
    },
  },
  {
    id: "circular",
    number: "05",
    title: "Circular Motion",
    thesis: "Constant speed can still mean continuous acceleration.",
    objective:
      "Relate angular and linear quantities and apply Newton’s second law radially to circular-motion systems.",
    equations: [
      String.raw`v = r\omega`,
      String.raw`a_c = \frac{v^2}{r} = r\omega^2`,
      String.raw`\sum F_r = \frac{mv^2}{r}`,
    ],
    practical:
      "Rotate a bung while controlling mass and radius. Test one proportionality such as inward force against speed squared and justify the chosen graph.",
    examPrompt:
      "A 0.20 kg mass moves in a horizontal circle of radius 0.80 m at 4.0 m/s. Calculate the inward acceleration and resultant radial force.",
    misconception:
      "Centripetal force is not an extra force: it names the inward resultant supplied by real forces such as tension, friction or gravity.",
    question: {
      prompt:
        "If the string breaks during horizontal circular motion, the mass initially moves…",
      options: [
        "radially outward.",
        "toward the centre.",
        "along the tangent.",
      ],
      answer: 2,
      explanation:
        "Its instantaneous velocity is tangential; removing the inward force removes the curvature.",
    },
  },
  {
    id: "gravitation",
    number: "06",
    title: "Gravitational Field",
    thesis: "Orbit is continuous free fall, not an absence of gravity.",
    objective:
      "Apply Newton’s gravitation law, field strength and potential, and analyse circular satellite orbits using centre-to-centre radius.",
    equations: [
      String.raw`F = \frac{GMm}{r^2}`,
      String.raw`g = \frac{GM}{r^2}`,
      String.raw`v_o = \sqrt{\frac{GM}{r}}`,
    ],
    practical:
      "Plot satellite period squared against orbital radius cubed. Use the gradient to estimate GM and distinguish orbital altitude from radius.",
    examPrompt:
      "A satellite orbits 400 km above Earth. Using Earth’s radius 6.37 × 10⁶ m, determine its field strength, orbital speed and period.",
    misconception:
      "Astronauts feel weightless because spacecraft and occupants fall together; Earth’s gravitational field remains substantial in low orbit.",
    question: {
      prompt:
        "A satellite moves to a higher circular orbit. Its orbital speed…",
      options: ["increases.", "decreases.", "stays constant."],
      answer: 1,
      explanation:
        "Since v = √(GM/r), increasing orbital radius reduces speed.",
    },
  },
] as const;

export function mechanicsModule(id: MechanicsModuleId): MechanicsModule {
  const module = mechanicsModules.find((candidate) => candidate.id === id);
  if (!module) throw new RangeError(`unknown mechanics module: ${id}`);
  return module;
}
