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
  phenomenon: string;
  prediction: string;
  conditions: readonly string[];
  derivation: readonly {
    label: string;
    explanation: string;
    formula: string;
  }[];
  workedExample: {
    given: string;
    find: string;
    method: readonly string[];
    conclusion: string;
  };
  practicalPlan: {
    apparatus: string;
    variables: string;
    graph: string;
    evaluation: string;
  };
  bridge: string;
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
    phenomenon:
      "A trolley can move to the right while accelerating to the left. Its position, velocity and acceleration tell different parts of the story.",
    prediction:
      "Before changing the controls: if acceleration points opposite to velocity, will the trolley immediately reverse, slow first, or continue speeding up?",
    conditions: [
      "one dimension",
      "constant acceleration",
      "point-like trolley",
    ],
    derivation: [
      {
        label: "Start with acceleration",
        explanation:
          "Constant acceleration means velocity changes by the same amount in every equal time interval.",
        formula: String.raw`a=\frac{v-u}{t}\quad\Rightarrow\quad v=u+at`,
      },
      {
        label: "Use average velocity",
        explanation:
          "For a linear velocity-time graph, average velocity is the midpoint of the initial and final values.",
        formula: String.raw`\bar v=\frac{u+v}{2},\qquad s=\bar vt`,
      },
      {
        label: "Eliminate the final velocity",
        explanation:
          "Substituting v = u + at connects displacement directly to the clock.",
        formula: String.raw`s=ut+\frac12at^2`,
      },
    ],
    workedExample: {
      given: "u = 4.0 m/s, v = 20.0 m/s, t = 8.0 s",
      find: "Acceleration and displacement",
      method: [
        "a = (v − u)/t = (20.0 − 4.0)/8.0 = 2.0 m/s²",
        "s = ½(u + v)t = ½(4.0 + 20.0)(8.0)",
        "s = 96 m in the positive direction",
      ],
      conclusion:
        "The positive gradient of the velocity-time graph is 2.0 m/s²; its area is the 96 m displacement.",
    },
    practicalPlan: {
      apparatus:
        "Dynamics trolley, ramp, two light gates or frame-by-frame video, metre rule and timer.",
      variables:
        "Change elapsed time; measure displacement or velocity while keeping ramp angle and release point fixed.",
      graph:
        "Plot v against t. Gradient = acceleration in m/s²; area beneath the line = displacement in m.",
      evaluation:
        "A delayed release or finite gate width biases timing. Use an automatic release and narrow interrupt cards.",
    },
    bridge:
      "Kinematics describes how velocity changes. Dynamics asks what resultant interaction produced that change.",
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
    phenomenon:
      "During a collision, large internal forces act briefly. Total momentum can remain constant even while kinetic energy changes form.",
    prediction:
      "If two trolleys stick together, is their shared speed closer to the faster trolley, the heavier trolley, or the arithmetic mean?",
    conditions: [
      "one dimension",
      "isolated two-cart system",
      "constant masses",
    ],
    derivation: [
      {
        label: "Choose the system",
        explanation:
          "When external impulse is negligible, the system’s total momentum does not change.",
        formula: String.raw`\sum p_{\mathrm{before}}=\sum p_{\mathrm{after}}`,
      },
      {
        label: "Relate force and impulse",
        explanation:
          "The area beneath a force-time graph is the momentum change of one trolley.",
        formula: String.raw`J=\int F\,dt=\Delta p`,
      },
      {
        label: "Classify the collision",
        explanation:
          "Restitution compares separation speed with approach speed; momentum conservation alone does not imply elasticity.",
        formula: String.raw`e=\frac{\text{relative separation speed}}{\text{relative approach speed}}`,
      },
    ],
    workedExample: {
      given: "m₁ = 2.0 kg, u₁ = 3.0 m/s; m₂ = 1.0 kg, u₂ = 0; trolleys join",
      find: "Common speed and kinetic-energy loss",
      method: [
        "Initial momentum = (2.0)(3.0) = 6.0 kg m/s",
        "v = 6.0/(2.0 + 1.0) = 2.0 m/s",
        "ΔEₖ = ½(3.0)(2.0²) − ½(2.0)(3.0²) = −3.0 J",
      ],
      conclusion:
        "Momentum remains 6.0 kg m/s; 3.0 J leaves the kinetic store through deformation, sound and heating.",
    },
    practicalPlan: {
      apparatus:
        "Two low-friction trolleys, track, collision attachments, two light gates and masses.",
      variables:
        "Change one trolley mass or approach speed; measure all velocities immediately before and after impact.",
      graph:
        "Compare total momentum after against total momentum before. Ideal conservation gives gradient 1 and intercept 0.",
      evaluation:
        "Track friction adds external impulse. Level the track and use velocities close to the collision point.",
    },
    bridge:
      "Momentum describes the change of a system. Forces require isolating one body and resolving every interaction acting on it.",
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
    phenomenon:
      "A beam can remain motionless while several non-zero forces act. Equilibrium demands zero resultant force and zero resultant moment.",
    prediction:
      "Move the same load twice as far from a pivot. Must the balancing force halve, double, or stay unchanged?",
    conditions: ["rigid beam", "static equilibrium", "forces in one plane"],
    derivation: [
      {
        label: "Isolate one body",
        explanation:
          "Draw only forces acting on the chosen body, with directions and points of application.",
        formula: String.raw`\sum \mathbf F=0`,
      },
      {
        label: "Choose a pivot",
        explanation:
          "A force’s turning effect uses the perpendicular distance from the pivot to its line of action.",
        formula: String.raw`\tau=Fd_{\perp}`,
      },
      {
        label: "Test rotational equilibrium",
        explanation:
          "Clockwise and anticlockwise moments balance about any chosen point.",
        formula: String.raw`\sum\tau=0`,
      },
    ],
    workedExample: {
      given:
        "Uniform 4.0 m beam, weight 120 N, hinge at left, vertical cable at right",
      find: "Cable tension and vertical hinge force",
      method: [
        "Moments about hinge: T(4.0) = 120(2.0)",
        "T = 60 N upward",
        "Vertical equilibrium: Hᵧ + 60 − 120 = 0, so Hᵧ = 60 N upward",
      ],
      conclusion:
        "Taking moments about the hinge removes the unknown hinge force from the first equation.",
    },
    practicalPlan: {
      apparatus:
        "Metre rule, knife-edge pivot, known masses, hangers, thread and balance.",
      variables:
        "Change the load position; measure balancing distance while keeping the pivot and masses fixed.",
      graph:
        "Plot balancing force against inverse perpendicular distance if moment is held constant.",
      evaluation:
        "The rule’s own weight acts at its centre of mass. Locate that point experimentally before adding loads.",
    },
    bridge:
      "Force and moment describe interactions at an instant. Work and energy track their accumulated effect through a displacement.",
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
    phenomenon:
      "A force can change speed, height, temperature or deformation. Energy accounting reveals where the transfer went.",
    prediction:
      "If equal net work is done on two equal masses with different starting speeds, do their speeds increase by equal amounts?",
    conditions: [
      "declared system",
      "SI energy stores",
      "losses shown explicitly",
    ],
    derivation: [
      {
        label: "Accumulate the force",
        explanation:
          "Work is the component of force along displacement, accumulated over the path.",
        formula: String.raw`W=Fs\cos\theta`,
      },
      {
        label: "Connect work to motion",
        explanation:
          "Net work changes kinetic energy, not speed by a fixed amount.",
        formula: String.raw`W_{\mathrm{net}}=\Delta E_k=\frac12m(v^2-u^2)`,
      },
      {
        label: "Account for rate",
        explanation:
          "Power measures how quickly energy crosses the chosen system boundary.",
        formula: String.raw`P=\frac{W}{t}=\mathbf F\cdot\mathbf v`,
      },
    ],
    workedExample: {
      given: "m = 900 kg, vertical rise = 25 m, t = 20 s, efficiency = 30%",
      find: "Useful output power and engine input power",
      method: [
        "Useful energy = mgh = (900)(9.81)(25) = 2.21 × 10⁵ J",
        "Useful power = 2.21 × 10⁵/20 = 11.0 kW",
        "Input power = 11.0/0.30 = 36.8 kW",
      ],
      conclusion:
        "The remaining input power is transferred into thermal and sound stores, not destroyed.",
    },
    practicalPlan: {
      apparatus:
        "Staircase, tape measure, balance and stopwatch—or motor, load, power supply and meters.",
      variables:
        "Measure mass, vertical height and time; repeat climbs or lifts under a consistent method.",
      graph:
        "Plot gained gravitational energy against time; gradient gives useful power in watts.",
      evaluation:
        "Human reaction time dominates short trials. Increase the duration and use video timestamps.",
    },
    bridge:
      "Circular motion can preserve speed and kinetic energy while continuously changing the direction of velocity.",
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
    phenomenon:
      "Uniform circular motion has constant speed but a velocity vector that turns every instant, requiring inward acceleration.",
    prediction:
      "At fixed radius, doubling speed multiplies the required inward force by two, four, or eight?",
    conditions: [
      "circular path",
      "instantaneous radial direction",
      "inertial frame",
    ],
    derivation: [
      {
        label: "Measure angular rate",
        explanation:
          "One revolution is 2π radians, connecting period, frequency and angular speed.",
        formula: String.raw`\omega=\frac{2\pi}{T}=2\pi f`,
      },
      {
        label: "Connect angular and linear speed",
        explanation: "An outer point travels a longer arc in the same time.",
        formula: String.raw`v=r\omega`,
      },
      {
        label: "Apply Newton radially",
        explanation:
          "Add the inward components of real forces; their resultant supplies the radial acceleration.",
        formula: String.raw`\sum F_r=\frac{mv^2}{r}=mr\omega^2`,
      },
    ],
    workedExample: {
      given: "m = 0.20 kg, r = 0.80 m, v = 4.0 m/s",
      find: "Inward acceleration, resultant force and period",
      method: [
        "aᵣ = v²/r = 4.0²/0.80 = 20 m/s²",
        "ΣFᵣ = maᵣ = (0.20)(20) = 4.0 N inward",
        "T = 2πr/v = 2π(0.80)/4.0 = 1.26 s",
      ],
      conclusion:
        "The velocity is tangential while acceleration and resultant force point toward the centre.",
    },
    practicalPlan: {
      apparatus:
        "Rubber bung, strong thread, glass tube, hanging masses, marker, stopwatch and ruler.",
      variables:
        "Change speed while keeping rotating mass and radius fixed; hanging weight estimates string tension.",
      graph: "Plot inward force against v². Gradient = m/r with units kg/m.",
      evaluation:
        "Radius changes if the marker moves. Keep the marker at the tube and reject trials with visible drift.",
    },
    bridge:
      "Circular motion states what inward resultant an orbit needs. Gravitation supplies that resultant without contact.",
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
    phenomenon:
      "A satellite continually falls toward Earth while its tangential motion carries it around the curved surface.",
    prediction:
      "Move a satellite to a higher circular orbit: predict what happens to field strength, orbital speed and period before changing altitude.",
    conditions: [
      "spherical central body",
      "circular orbit",
      "radius measured from centre",
    ],
    derivation: [
      {
        label: "Start with the field",
        explanation:
          "Field strength is force per unit test mass and follows the inverse-square law.",
        formula: String.raw`g=\frac{F}{m}=\frac{GM}{r^2}`,
      },
      {
        label: "Make gravity the radial resultant",
        explanation:
          "For a circular satellite orbit, gravitational force supplies exactly the required inward force.",
        formula: String.raw`\frac{GMm}{r^2}=\frac{mv^2}{r}`,
      },
      {
        label: "Solve the orbit",
        explanation:
          "Satellite mass cancels; orbital speed depends on central mass and centre-to-centre radius.",
        formula: String.raw`v=\sqrt{\frac{GM}{r}},\qquad T=2\pi\sqrt{\frac{r^3}{GM}}`,
      },
    ],
    workedExample: {
      given:
        "Earth mass 5.972 × 10²⁴ kg, Earth radius 6.371 × 10⁶ m, altitude 400 km",
      find: "Field strength, orbital speed and period",
      method: [
        "r = 6.371 × 10⁶ + 0.400 × 10⁶ = 6.771 × 10⁶ m",
        "g = GM/r² = 8.69 N/kg and v = √(GM/r) = 7.67 km/s",
        "T = 2πr/v = 5.55 × 10³ s = 92.4 min",
      ],
      conclusion:
        "Low orbit still has nearly 8.7 N/kg field strength; apparent weightlessness comes from shared free fall.",
    },
    practicalPlan: {
      apparatus:
        "Published satellite radius and period dataset, spreadsheet or graph paper and calculator.",
      variables:
        "Use centre-to-centre orbital radius as the independent variable and period as the measured response.",
      graph:
        "Plot T² against r³. Gradient = 4π²/(GM), allowing Earth’s GM or mass to be estimated.",
      evaluation:
        "Treating elliptical orbits as circular biases the relationship. Select low-eccentricity satellites and state that criterion.",
    },
    bridge:
      "Gravitation completes the Newtonian strand. Oscillations then reuse force and energy to explain repeating motion before Waves.",
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
