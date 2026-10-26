import type { DepthChapter } from "./mechanics-depth";

export const dynamicsDepth = {
  id: "dynamics",
  title: "Dynamics: decide what belongs inside the system",
  introduction:
    "For Fieldlab Zimbabwe Forms 5–6, the important advance is not a longer formula list: it is defending a model before calculating. A cart alone exchanges momentum with its collision partner; the pair can have nearly constant total momentum over the same interval. A string force disappears from a combined-system calculation but is essential when checking whether the string will break. We will distinguish signed momentum from positive kinetic energy, instantaneous force from impulse, and a small external impulse from no external forces at all. Use inertial laboratory coordinates and g = 9.8 m s^-2 throughout. Each problem states its own positive direction; velocities are signed, not merely speeds.",
  prediction: {
    prompt:
      "Two unequal carts collide on a level track and stick. Horizontal external impulse is negligible. Which claim is defensible for the pair, but not usually for either cart alone?",
    options: [
      "Both momentum and kinetic energy must be unchanged.",
      "Total momentum is unchanged; kinetic energy can decrease.",
      "The collision forces cancel on each individual cart.",
    ],
    answer: 1,
    explanation:
      "The contact forces are internal to the pair and have cancelling impulses. Each force acts on a different cart, so neither cart separately has conserved momentum. Sticking generally converts kinetic energy into deformation, heating and sound; it does not destroy energy.",
  },
  derivations: [
    {
      title: "1. Draw a boundary before summing forces",
      explanation:
        "Choose a fixed collection of particles and an inertial frame. Add their momentum equations: third-law internal force pairs cancel in the sum, while forces exerted by objects outside the boundary remain. Integrate over the interval to decide whether conservation is justified. Vertical weight and track reaction can be non-zero yet cancel; small horizontal friction may be negligible only over a sufficiently short interval.",
      formula: String.raw`\mathbf P=\sum_i m_i\mathbf v_i,\qquad \frac{d\mathbf P}{dt}=\sum\mathbf F_{\rm ext},\qquad \mathbf P_f-\mathbf P_i=\int_{t_i}^{t_f}\sum\mathbf F_{\rm ext}\,dt`,
      interpretation:
        "Conservation between endpoints requires negligible net external impulse, not the absence of every external force. Counterexample: for a falling ball alone, gravity is external and its momentum changes; enlarging the system to ball plus Earth changes that classification. A long collision on a rough track cannot automatically be treated as isolated.",
    },
    {
      title: "2. Recover acceleration only under the right mass assumption",
      explanation:
        "For one constant-mass body, substitute momentum into the derivative and take mass outside it. The acceleration form is therefore a consequence of the momentum form, not a licence to ignore mass crossing a boundary. For a rocket alone, expelled gas carries momentum out: a momentum-flux balance is needed. Differentiating the rocket's mv and calling the result the external force omits that transport.",
      formula: String.raw`\mathbf p=m\mathbf v,\qquad \sum\mathbf F=\frac{d(m\mathbf v)}{dt}=m\frac{d\mathbf v}{dt}=m\mathbf a\quad(m\text{ constant})`,
      interpretation:
        "The force is the resultant on this body. Equal and opposite interaction forces do not cancel on its diagram. The constant-mass restriction is explicit; for an open system neither a naive ma nor a naive d(mv)/dt accounts for outgoing momentum by itself.",
    },
    {
      title: "3. Read impulse as signed area, not peak height",
      explanation:
        "Integrate the x-component of the net force. A triangular pulse contributes half base times height; a pulse below the time axis contributes negative area. Divide total impulse by duration to obtain the constant force with the same momentum effect. This average need not equal the force at the midpoint of time.",
      formula: String.raw`J_x=\int_{t_i}^{t_f}F_{\rm net,x}\,dt=m(v_x-u_x),\qquad \overline F_x=\frac{J_x}{\Delta t},\qquad J_{\rm triangle}=\frac12 F_{\rm peak}\Delta t`,
      interpretation:
        "Area units N s equal kg m s^-1. Equal areas produce equal momentum changes for the same body, but different peak forces and injury risks. A positive impulse on an initially left-moving body can first stop it and then reverse it; positive impulse does not always mean increasing speed.",
    },
    {
      title: "4. Close the signed collision equations and audit energy",
      explanation:
        "Put cart 1 to the left, choose right positive and require u1 > u2 for approach. Neglect external impulse for the pair. Momentum supplies one equation; measured or stipulated restitution supplies the other. Substituting v2 = v1 + e(u1-u2) into momentum gives v1. Kinetic energy must be calculated separately; the relative-motion expression exposes why an ordinary inelastic collision loses kinetic energy.",
      formula: String.raw`\begin{gathered}m_1u_1+m_2u_2=m_1v_1+m_2v_2,\qquad e=\frac{v_2-v_1}{u_1-u_2},\\ v_1=\frac{m_1u_1+m_2u_2-m_2e(u_1-u_2)}{m_1+m_2},\\ K_i-K_f=\frac12\frac{m_1m_2}{m_1+m_2}(1-e^2)(u_1-u_2)^2.\end{gathered}`,
      interpretation:
        "For passive one-dimensional impacts, 0 ≤ e ≤ 1: e = 0 gives a shared immediate velocity and e = 1 gives an elastic collision. Oppositely directed initial velocities must retain their signs. Stored energy release can give e > 1, outside this passive model; momentum conservation still does not guarantee kinetic-energy conservation.",
    },
    {
      title: "5. Combine connected bodies, then isolate one to recover tension",
      explanation:
        "For a table mass M connected to hanging mass m, let positive be toward the pulley on the table and downward for the hanging mass. A taut inextensible light string over a smooth negligible-inertia pulley gives equal acceleration magnitudes and equal tensions. Write each equation along its own coordinate and add to eliminate tension. This is addition of scalar constraint equations, not a claim that perpendicular tension vectors cancel in the vector momentum of the two masses alone.",
      formula: String.raw`T-f=Ma,\qquad mg-T=ma,\qquad a=\frac{mg-f}{M+m},\qquad T=m(g-a)`,
      interpretation:
        "The pulley/support changes the direction of momentum. The formula assumes the hanging mass is moving down and friction f opposes table motion. If the system starts at rest, first test whether static friction can hold it. A massive rotating pulley generally requires unequal tensions, so the simple elimination no longer applies.",
    },
  ],
  problems: [
    {
      id: "dynamics-pulse",
      title: "A pulse that reverses a cart",
      context:
        "A constant-mass 0.50 kg cart initially moves left at 2.0 m s^-1. Right is +x. A measured NET horizontal force pulse rises linearly from zero to +12 N and returns linearly to zero over 0.40 s. Vertical forces balance; g = 9.8 m s^-2. Ignore any other horizontal impulse. Decide whether the cart merely slows or reverses before interpreting its energy change.",
      strategy:
        "Use the triangular signed area, then momentum, then average force. Compare endpoint kinetic energies using squared velocities; do not use peak force as if constant.",
      parts: [
        { id: "dp-a", prompt: "Find the signed net impulse.", unit: "N s", expected: 2.4, tolerance: 0.01, hint: "Use half the rectangle enclosing the pulse.", working: "J = ½ × 12 × 0.40 = +2.40 N s.", mistakes: [{ value: 4.8, explanation: "That is the enclosing rectangle: the force is not 12 N throughout the pulse." }] },
        { id: "dp-b", prompt: "Find the signed final velocity; does reversal occur?", unit: "m s^-1", expected: 2.8, tolerance: 0.02, hint: "Initial velocity is -2.0, not +2.0.", working: "0.50(v - (-2.0)) = 2.40; v = +2.80 m s^-1. The final direction is right, so reversal occurs.", mistakes: [{ value: 6.8, explanation: "You treated the initially leftward velocity as positive." }] },
        { id: "dp-c", prompt: "Find the signed average net force over the pulse.", unit: "N", expected: 6, tolerance: 0.02, hint: "Replace the pulse by a rectangle with equal area and duration.", working: "Average F = J/Δt = 2.40/0.40 = +6.00 N.", mistakes: [{ value: 12, explanation: "12 N is the peak, not the time average of a triangular pulse." }] },
        { id: "dp-d", prompt: "Find K_final minus K_initial.", unit: "J", expected: 0.96, tolerance: 0.01, hint: "K is positive for either direction; subtract endpoint kinetic energies.", working: "K_i = ½(0.50)(-2.0)² = 1.00 J; K_f = ½(0.50)(2.80)² = 1.96 J. ΔK = +0.96 J: it first slows, then gains enough speed to exceed its initial speed.", mistakes: [{ value: 1.96, explanation: "That is final kinetic energy, not its change." }] },
      ],
      transfer:
        "Replace the pulse by a rectangle lasting 0.80 s with the same impulse. Predict its height, final velocity and whether its peak force is reduced. Can impulse alone establish the maximum speed during an arbitrary pulse?",
      transferSolution:
        "The rectangle is +3.0 N because 2.40/0.80 = 3.0. Final velocity remains +2.80 m s^-1; peak force falls from 12 N to 3 N. Impulse fixes endpoint momentum, not the full trajectory: pulses with positive and negative sections can have intermediate speed peaks hidden by the net area.",
    },
    {
      id: "dynamics-collision",
      title: "Head-on collision: one sign changes the whole answer",
      context:
        "Cart 1 (2.0 kg) approaches from the left at +3.0 m s^-1; cart 2 (1.0 kg) approaches from the right at -1.0 m s^-1. Right is +x. The measured coefficient of restitution is 0.50. Treat the two carts as a constant-mass system with negligible external horizontal impulse during contact. Vertical forces balance; g = 9.8 m s^-2.",
      strategy:
        "Conserve signed total momentum for the pair, not either cart. Combine it with the separation-speed equation. Then audit kinetic energy and the impulse on cart 1 independently.",
      parts: [
        { id: "dc-a", prompt: "Calculate cart 1's signed final velocity.", unit: "m s^-1", expected: 1, tolerance: 0.01, hint: "Initial momentum is 2(3) + 1(-1); separation speed is 0.50[3 - (-1)].", working: "P_i = 5 kg m s^-1 and v2 - v1 = 2. Thus 2v1 + (v1 + 2) = 5, so v1 = +1.00 m s^-1.", mistakes: [{ value: 1.6666667, explanation: "5/3 is the shared speed only if they stick (e = 0); here e = 0.50." }] },
        { id: "dc-b", prompt: "Calculate cart 2's signed final velocity.", unit: "m s^-1", expected: 3, tolerance: 0.01, hint: "After collision, cart 2 is moving away ahead of cart 1.", working: "v2 = v1 + 0.50(3 - (-1)) = 1 + 2 = +3.00 m s^-1. Check: 2(1) + 1(3) = 5.", mistakes: [{ value: -1, explanation: "That is cart 2's initial velocity; its momentum is not individually conserved." }] },
        { id: "dc-c", prompt: "Calculate the positive kinetic-energy loss of the pair.", unit: "J", expected: 4, tolerance: 0.02, hint: "Square each velocity, weight by its own mass, and compare the two totals.", working: "K_i = ½(2)(3²) + ½(1)(-1)² = 9.50 J. K_f = ½(2)(1²) + ½(1)(3²) = 5.50 J. Loss = 4.00 J, transferred to internal energy and sound.", mistakes: [{ value: 0, explanation: "Conserved momentum does not imply conserved kinetic energy; e is less than 1." }, { value: -4, explanation: "-4 J is ΔK; the requested loss is K_i - K_f." }] },
        { id: "dc-d", prompt: "Find the signed impulse on cart 1.", unit: "N s", expected: -4, tolerance: 0.02, hint: "Now shrink the system to cart 1 and calculate its momentum change.", working: "J1 = 2(1 - 3) = -4.00 N s. Cart 2 receives +4.00 N s; the pair's net horizontal impulse is zero.", mistakes: [{ value: 0, explanation: "Zero is the pair's external impulse, not the contact impulse on one cart." }] },
      ],
      transfer:
        "For the same approach velocities, replace the bumpers by a sticking attachment. Find the shared velocity and kinetic-energy loss; explain why the loss increases.",
      transferSolution:
        "With e = 0, v = 5/3 = +1.667 m s^-1. K_f = ½(3)(5/3)² = 25/6 J, so loss = 9.5 - 25/6 = 16/3 = 5.333 J. For fixed total momentum, eliminating all relative motion leaves the minimum possible translational kinetic energy of these two masses.",
    },
    {
      id: "dynamics-connected",
      title: "Connected bodies: the string is not the driving force",
      context:
        "A 3.0 kg trolley on a horizontal table is connected to a 2.0 kg hanging mass by a taut light inextensible string over a smooth negligible-inertia pulley. The trolley is already sliding toward the pulley and the hanging mass is moving downward; constant table resistance is 4.6 N opposite motion. Use g = 9.8 m s^-2. Take +x toward the pulley for the trolley and positive downward for the hanging mass. The trolley has no vertical acceleration. No static-friction decision is needed because sliding is stipulated.",
      strategy:
        "Use the two scalar acceleration constraints to eliminate tension, then isolate the hanging mass. Distinguish its weight from its resultant force. The pulley support is an external interaction for the two-mass system.",
      parts: [
        { id: "db-a", prompt: "Find the table's normal force on the trolley.", unit: "N", expected: 29.4, tolerance: 0.05, hint: "The string segment at the trolley is horizontal.", working: "Vertical balance on the trolley gives N - 3.0g = 0, so N = 29.4 N.", mistakes: [{ value: 49, explanation: "The table supports only the trolley, not the hanging mass as well." }] },
        { id: "db-b", prompt: "Find the common acceleration magnitude in the stated positive directions.", unit: "m s^-2", expected: 3, tolerance: 0.02, hint: "Add T - 4.6 = 3a and 19.6 - T = 2a.", working: "19.6 - 4.6 = (3 + 2)a; a = 15/5 = 3.00 m s^-2. This is consistent with the stipulated downward motion.", mistakes: [{ value: 5, explanation: "The net driving force accelerates both masses, not just the 3 kg trolley." }] },
        { id: "db-c", prompt: "Find the tension in the string.", unit: "N", expected: 13.6, tolerance: 0.05, hint: "The hanging mass accelerates, so its forces do not balance.", working: "19.6 - T = 2(3.00), hence T = 13.6 N. Independently, T = 3(3.00) + 4.6 = 13.6 N on the trolley.", mistakes: [{ value: 19.6, explanation: "T equals the hanging weight only at zero acceleration, not here." }] },
        { id: "db-d", prompt: "Find the signed net impulse on the hanging mass over a further 2.0 s while this model holds.", unit: "N s", expected: 12, tolerance: 0.05, hint: "Use its net force, not tension alone or weight alone.", working: "J = (19.6 - 13.6)(2.0) = +12.0 N s, also mΔv = 2(3 × 2) = 12.0 N s downward.", mistakes: [{ value: 39.2, explanation: "That counts gravity's impulse but omits the opposing tension impulse." }] },
      ],
      transfer:
        "If released from rest instead, and the maximum available static friction is 22 N, would the calculated sliding acceleration apply? Find the static friction and tension actually required.",
      transferSolution:
        "No. Static equilibrium requires hanging tension 19.6 N and table friction 19.6 N. Since 19.6 < 22 N, that state is possible and acceleration is zero. The 4.6 N sliding resistance must not be used before motion is established.",
    },
  ],
  investigation: {
    title: "Synthetic trolley data: infer inertia and resistance",
    context:
      "These are synthetic readings, not observations from a Zimbabwe school or an official assessment. A fixed-mass trolley moves in +x on a level track under a measured horizontal applied force F; a constant opposing resistance f is assumed. Use g = 9.8 m s^-2. For this exercise each acceleration has a stipulated ±0.04 m s^-2 bound and force uncertainty is neglected. The explicitly stipulated nominal model is a = 2F - 0.2, with a in m s^-2 and F in N; infer parameters from that model, not from the current slider settings.",
    xLabel: "Applied force / N",
    yLabel: "Acceleration / m s^-2",
    readings: [{ x: 0.3, y: 0.41 }, { x: 0.5, y: 0.79 }, { x: 0.7, y: 1.21 }, { x: 0.9, y: 1.59 }, { x: 1.1, y: 2.01 }],
    bound: 0.04,
    gradient: { unit: "kg^-1", min: 1, max: 3, step: 0.05, initial: 1.5 },
    intercept: { unit: "m s^-2", min: -0.5, max: 0.2, step: 0.01, initial: 0 },
    equation: String.raw`a=\frac{F-f}{m}=\frac1m F-\frac fm,\qquad a_{\rm nominal}=2F-0.2`,
    interpretation:
      "Gradient is inverse mass, not mass, because acceleration is plotted vertically against applied force. The nominal residuals (observed minus predicted) are +0.01, -0.01, +0.01, -0.01, +0.01 m s^-2, each within ±0.04. That is compatibility with the stipulated bounds, not proof of constant resistance or a unique best line. Negative intercept represents resistance only if the track is level and force and acceleration zero offsets are controlled; do not extrapolate this sliding model to a stationary trolley at F = 0.",
    parts: [
      { id: "di-a", prompt: "Using the explicitly stated nominal gradient 2 (m s^-2)/N, infer the moving mass.", unit: "kg", expected: 0.5, tolerance: 0.005, hint: "Match the coefficient of F to 1/m.", working: "1/m = 2 kg^-1, hence m = 1/2 = 0.500 kg.", mistakes: [{ value: 2, explanation: "The gradient is inverse mass for these axes, not mass." }] },
      { id: "di-b", prompt: "Using the nominal intercept -0.2 m s^-2 and inferred mass, find the positive resistance magnitude.", unit: "N", expected: 0.1, tolerance: 0.005, hint: "The intercept is -f/m, not -f.", working: "-f/m = -0.2, so f = 0.500 × 0.2 = 0.100 N opposing +x.", mistakes: [{ value: 0.2, explanation: "The intercept is acceleration, so multiply its magnitude by the mass." }] },
    ],
    evaluation: {
      prompt: "Write an evaluation that distinguishes bounded agreement, systematic bias and a genuine model failure. Explain how you would test one alternative explanation for the intercept.",
      guide: [
        "Report all five nominal residuals and compare their magnitudes to 0.04; these stipulated bounds are not automatically standard deviations or confidence intervals.",
        "A force sensor reading F_read = F_true + δ gives intercept -(f + δ)/m: a positive zero offset makes the intercept more negative and overestimates friction. Zero and check the sensor with known forces before and after the run.",
        "A slight track slope also contributes a constant gravitational component and can mimic an intercept. Reverse travel direction and level the track independently; do not label every negative intercept friction.",
        "Repeat at different speeds with the same mass. Curved residuals or speed-dependent inferred resistance would challenge constant friction; adding masses without accounting for them challenges the fixed-mass model. Repeats reduce random spread, not an unchanged calibration bias.",
      ],
    },
    plan: [
      "For a real investigation use a low-friction trolley, level track, calibrated force sensor and motion sensor/light gates; check length and timing calibration, sensor zero and mass including all attachments.",
      "Vary the measured horizontal force while holding total moving mass, track surface, force direction and measurement region fixed. If using a hanging driver, changing its mass changes the system inertia: measure tension at the trolley or explicitly model the driver rather than calling its weight the trolley force.",
      "Collect repeated acceleration measurements during sliding, away from release and end stops; measure real uncertainties on both axes rather than inheriting these synthetic bounds. Compare residuals over a wider safe force/speed range.",
      "Use small loads, secure the pulley and track, keep feet clear of hanging masses, and use a catcher/end stop so the trolley cannot leave the bench. Ensure adequate travel before each release.",
    ],
  },
  sources: [
    { title: "OpenStax University Physics 1 §9.2 — impulse, signed area and momentum form of Newton's law", url: "https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions" },
    { title: "OpenStax University Physics 1 §9.3 — system boundaries and external-force conditions", url: "https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum" },
    { title: "OpenStax University Physics 1 §9.4 — elastic and inelastic kinetic-energy accounting", url: "https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions" },
  ],
} satisfies DepthChapter;

export const forcesDepth = {
  id: "forces",
  title: "Forces: a free-body diagram is a testable argument",
  introduction:
    "For Fieldlab Zimbabwe Forms 5–6, resolving a force is only the beginning. The decisive questions are whether contact persists, whether static friction can supply the required force, whether a body can rotate despite zero resultant force, and whether a spring remains in its proportional range. Draw forces acting ON one chosen body and locate their lines of action. Do not add third-law partners acting on other bodies. Use an inertial laboratory frame, +x right and +y upward, anticlockwise moments positive, and g = 9.8 m s^-2 unless a context defines a local spring-extension coordinate. A numerical answer is defensible only alongside the assumptions that allow it.",
  prediction: {
    prompt:
      "A crate remains at rest when pulled gently at an upward angle. If the pull is increased slightly but the crate still stays at rest, what happens to static friction?",
    options: [
      "It stays equal to μ_s mg at all times.",
      "It adjusts to balance the horizontal pull, provided it remains within μ_s N.",
      "It vanishes because there is no sliding.",
    ],
    answer: 1,
    explanation:
      "Static friction is a response, bounded by μ_s N. The upward pull also reduces N, so both the required friction and its available maximum must be recalculated. Equality with μ_s N describes impending slip only, not every resting state.",
  },
  derivations: [
    {
      title: "1. Resolve the pull and check contact",
      explanation:
        "Isolate a crate pulled by P at angle θ above a horizontal floor. Resolve along the chosen axes. Assuming no vertical acceleration while in contact, the upward component of the pull replaces part of the normal support. Only the horizontal component competes with friction. Writing these equations before substituting numbers avoids silently replacing N by mg.",
      formula: String.raw`P_x=P\cos\theta,\qquad P_y=P\sin\theta,\qquad N+P\sin\theta-mg=0,\qquad P\cos\theta-f=ma_x`,
      interpretation:
        "Thus N = mg - P sin θ, valid only while N ≥ 0 and the vertical constraint holds. If the expression becomes negative, a floor cannot pull the crate down: contact is lost and a new motion model is required. At θ = 0 the familiar N = mg is recovered.",
    },
    {
      title: "2. Decide the friction regime before calculating acceleration",
      explanation:
        "First suppose the crate remains at rest and calculate the required friction from horizontal equilibrium. Compare that requirement with the maximum available static friction. At impending rightward slip equality defines the threshold pull. Once rightward sliding is established, use the kinetic coefficient instead, with friction directed left.",
      formula: String.raw`\begin{gathered}0\le f_s\le\mu_sN,\qquad f_{s,\rm required}=P\cos\theta,\\ P_{\rm crit}=\frac{\mu_smg}{\cos\theta+\mu_s\sin\theta},\\ f_k=\mu_kN,\qquad a_x=\frac{P\cos\theta-\mu_k(mg-P\sin\theta)}{m}.\end{gathered}`,
      interpretation:
        "The threshold expression assumes contact and a pull with rightward horizontal component. Below threshold the acceleration is zero, not the result of inserting μ_s N as an actual friction force. These coefficients are empirical approximations; contamination and surface changes may invalidate them. Friction opposes relative slipping or its tendency, not necessarily a body's laboratory velocity in every situation.",
    },
    {
      title: "3. Derive the perpendicular lever arm",
      explanation:
        "Let r run from the pivot to a force's application point and θ be the angle between r and the force. Only the component perpendicular to r turns the body. Equivalently multiply the whole force by the shortest distance to its line of action. A force through the pivot contributes no moment even if it is large.",
      formula: String.raw`\tau_z=r_xF_y-r_yF_x,\qquad |\tau|=rF|\sin\theta|=Fd_\perp,\qquad d_\perp=r|\sin\theta|`,
      interpretation:
        "Assign the sign from the turning sense: anticlockwise positive here. The distance along a beam is not generally d_perp. A cable nearly parallel to a horizontal beam has a small lever arm and needs very large tension for a fixed moment; at exactly zero angle it cannot support a non-zero load moment.",
    },
    {
      title: "4. Impose force AND moment equilibrium",
      explanation:
        "For a stationary rigid body in a plane, zero linear acceleration requires both force components to sum to zero; zero angular acceleration also requires zero net moment. Choose a hinge as pivot to eliminate its unknown reactions from the moment equation, then recover those reactions using force balance. For a horizontal beam, its own weight acts at its centre of mass, not automatically at its geometric centre unless uniform.",
      formula: String.raw`\sum F_x=0,\qquad\sum F_y=0,\qquad\sum\tau_z=0,\qquad TL\sin\theta=W_b\frac L2+W_\ell x_\ell\quad(\text{uniform beam})`,
      interpretation:
        "Counterexample: equal opposite forces on different parallel lines have zero resultant force but a non-zero couple, so force balance alone does not establish equilibrium. Zero resultant force and moment ensure no acceleration, not necessarily rest; the initially stationary condition matters for static equilibrium.",
    },
    {
      title: "5. Separate proportionality from elastic recovery",
      explanation:
        "Measure extension x from the unloaded length, not the total length. In the proportional range a load-extension graph is a straight line through the correctly zeroed origin. Its gradient is the spring constant when extension is in metres. Integrating this load from zero extension gives stored elastic energy. The spring's restoring force has the opposite sign to extension.",
      formula: String.raw`x=L-L_0,\qquad F_{\rm load}=kx,\qquad F_{\rm spring}=-kx,\qquad E_{\rm elastic}=\int_0^x ks\,ds=\frac12kx^2,\qquad 1\ \mathrm{N\,cm^{-1}}=100\ \mathrm{N\,m^{-1}}`,
      interpretation:
        "The integral assumes quasistatic loading in the Hooke-law range without appreciable hysteresis. Beyond the proportional limit the graph can curve while the spring still recovers fully on unloading; beyond the elastic limit permanent deformation remains. Thus non-linearity is not proof of plastic deformation, and F/x at one point is not a constant stiffness for a nonlinear spring.",
    },
  ],
  problems: [
    {
      id: "forces-pull",
      title: "An angled pull: test rest before predicting motion",
      context:
        "A 5.0 kg crate rests on a horizontal floor. A pull P acts 30° above +x. Use +y up, g = 9.8 m s^-2, μ_s = 0.50 and μ_k = 0.30. Initially P = 20 N. Later the pull is increased to 30 N and the crate is sliding right. Assume no tipping and continued floor contact. Decide which friction law applies in each state.",
      strategy:
        "Use vertical balance for N, compare required static friction with its bound, solve the threshold equation, then use kinetic friction for the explicitly sliding state.",
      parts: [
        { id: "fp-a", prompt: "At P = 20 N, find the normal reaction.", unit: "N", expected: 39, tolerance: 0.05, hint: "The upward pull supports part of the 49 N weight.", working: "N = 5(9.8) - 20 sin 30° = 49 - 10 = 39.0 N; contact is possible.", mistakes: [{ value: 49, explanation: "You omitted the upward component of the pull." }] },
        { id: "fp-b", prompt: "At P = 20 N, find the actual friction magnitude after testing whether rest is possible.", unit: "N", expected: 17.320508, tolerance: 0.03, hint: "Compare P cos 30° with μ_s N; equality with the bound is not automatic.", working: "Required friction = 20 cos 30° = 17.3205 N left. Available maximum = 0.50(39) = 19.5 N. Since 17.3205 < 19.5, rest is possible and actual friction is 17.32 N.", mistakes: [{ value: 19.5, explanation: "That is the maximum static friction; this resting state requires less." }, { value: 11.7, explanation: "That is μ_k N, inappropriate because the crate has not started sliding." }] },
        { id: "fp-c", prompt: "Find the pull at impending rightward slip, retaining its 30° direction.", unit: "N", expected: 21.952905, tolerance: 0.04, hint: "N changes as P increases: solve P cos 30° = 0.50(49 - P sin 30°).", working: "P(cos 30° + 0.50 sin 30°) = 24.5. Therefore P_crit = 24.5/1.1160254 = 21.9529 N. N remains positive at this threshold.", mistakes: [{ value: 28.290163, explanation: "Using μ_s mg for the limiting friction misses the reduction in normal force caused by the upward pull." }] },
        { id: "fp-d", prompt: "At P = 30 N while sliding right, find the signed horizontal acceleration.", unit: "m s^-2", expected: 3.156152, tolerance: 0.02, hint: "Recalculate N at 30 N, then use μ_k, not μ_s.", working: "N = 49 - 30 sin 30° = 34 N; f_k = 0.30(34) = 10.2 N. a_x = (30 cos 30° - 10.2)/5 = +3.15615 m s^-2.", mistakes: [{ value: 1.796152, explanation: "That uses μ_s = 0.50 during sliding; kinetic friction uses μ_k = 0.30." }] },
      ],
      transfer:
        "Push at 30° below horizontal instead. Derive the impending-slip pull magnitude and explain the difference from pulling upward.",
      transferSolution:
        "Now N = 49 + P sin 30°. The threshold equation is P(cos 30° - 0.50 sin 30°) = 24.5, giving P = 39.77 N. Pushing increases the normal force and hence the available static friction; it is harder to initiate sliding under this model.",
    },
    {
      id: "forces-beam",
      title: "A beam needs force balance and rotational balance",
      context:
        "A uniform horizontal 4.0 m beam weighs 100 N and is hinged at its left end. A 60 N load hangs 3.0 m from the hinge. A cable at the right end pulls up and left at 30° to the horizontal beam. The beam is stationary and rigid, the hinge exerts no couple, and cable weight is negligible. Use +x right, +y up, anticlockwise moments positive; g = 9.8 m s^-2 (weights are already given in N).",
      strategy:
        "Take moments about the hinge using the cable's perpendicular lever arm, then resolve cable tension to obtain both hinge reactions. Do not mistake zero hinge moment for zero hinge force.",
      parts: [
        { id: "fb-a", prompt: "Find the perpendicular distance from hinge to cable line of action.", unit: "m", expected: 2, tolerance: 0.01, hint: "The force is not perpendicular to the beam.", working: "d_perp = L sin 30° = 4.0(0.50) = 2.00 m.", mistakes: [{ value: 4, explanation: "4 m is the pivot-to-attachment distance, not the perpendicular lever arm of this angled force." }] },
        { id: "fb-b", prompt: "Find the cable tension needed for equilibrium.", unit: "N", expected: 190, tolerance: 0.2, hint: "Include both the beam's own weight and the added load in clockwise moments.", working: "T(2.00) - 100(2.0) - 60(3.0) = 0, so T = 380/2 = 190 N.", mistakes: [{ value: 95, explanation: "95 N is the required vertical component; tension must be larger because the cable is angled." }, { value: 90, explanation: "You included only the hanging load and omitted the uniform beam's weight." }] },
        { id: "fb-c", prompt: "Find the signed horizontal hinge force on the beam.", unit: "N", expected: 164.544827, tolerance: 0.2, hint: "The cable pulls left, so the hinge must supply a rightward reaction.", working: "H_x - T cos 30° = 0. H_x = 190 cos 30° = +164.545 N.", mistakes: [{ value: -164.544827, explanation: "That is the cable's horizontal component or the beam's force on the hinge, not the hinge's force on the beam." }] },
        { id: "fb-d", prompt: "Find the signed vertical hinge force on the beam.", unit: "N", expected: 65, tolerance: 0.1, hint: "Use vertical force balance after the moment calculation.", working: "H_y + 190 sin 30° - 100 - 60 = 0. Thus H_y = 160 - 95 = +65.0 N upward.", mistakes: [{ value: 160, explanation: "The cable supports 95 N of the total load; the hinge does not support all of it vertically." }] },
      ],
      transfer:
        "Move the 60 N load to the hinge without changing anything else. Find the new cable tension and vertical hinge reaction. Why has the total weight not determined the tension by itself?",
      transferSolution:
        "The load now contributes zero hinge moment. T(2) = 100(2) gives T = 100 N; H_y = 160 - 100 sin 30° = 110 N upward. Total weight is unchanged, but its moment distribution has changed; force equilibrium alone could not select the cable tension.",
    },
    {
      id: "forces-spring",
      title: "A spring with a stated validity boundary",
      context:
        "A vertical spring has unloaded length 0.200 m and k = 80 N m^-1. Its load-extension relation is proportional only up to extension 0.060 m. A 0.400 kg mass is lowered gently until stationary. Take extension x positive downward from the unloaded end, with g = 9.8 m s^-2. Ignore spring mass. A later trial uses a 0.600 kg mass; the manufacturer supplies no law beyond the proportional range.",
      strategy:
        "Balance the first load against the spring force, distinguish extension from length, integrate only within the stated linear range, and calculate a maximum load rather than extrapolating blindly.",
      parts: [
        { id: "fs-a", prompt: "Find the equilibrium extension for the 0.400 kg mass.", unit: "m", expected: 0.049, tolerance: 0.0002, hint: "Use kx = mg and check against 0.060 m.", working: "x = 0.400(9.8)/80 = 0.0490 m, less than 0.060 m, so the assumed proportional law is self-consistent.", mistakes: [{ value: 0.249, explanation: "0.249 m is total length, not extension from the unloaded length." }] },
        { id: "fs-b", prompt: "Find the loaded spring's total length for that mass.", unit: "m", expected: 0.249, tolerance: 0.0005, hint: "Add extension to unloaded length.", working: "L = L0 + x = 0.200 + 0.0490 = 0.2490 m.", mistakes: [{ value: 0.049, explanation: "That is extension only; the spring already had an unloaded length of 0.200 m." }] },
        { id: "fs-c", prompt: "Find the elastic energy stored at that extension.", unit: "J", expected: 0.09604, tolerance: 0.0006, hint: "The load rises from zero to kx during quasistatic extension: use the triangular graph area.", working: "E = ½kx² = ½(80)(0.0490)² = 0.09604 J. The slowly lowering hand removes the other half of the gravitational energy released; this is not a sudden-release problem.", mistakes: [{ value: 0.19208, explanation: "kx² treats the final load as constant over the full extension; the load-extension area has a factor ½." }] },
        { id: "fs-d", prompt: "Find the greatest equilibrium mass for which the stated proportional law remains applicable.", unit: "kg", expected: 0.489795918, tolerance: 0.001, hint: "At the boundary, mg = k(0.060).", working: "m_max = 80(0.060)/9.8 = 0.489796 kg. The later 0.600 kg trial exceeds this boundary; x = 0.0735 m would be an unsupported linear extrapolation, not a justified prediction.", mistakes: [{ value: 4.8, explanation: "4.8 N is the maximum load in the proportional range, not its mass in kg." }] },
      ],
      transfer:
        "The 0.600 kg trial produces a curved load-extension trace but returns to the same unloaded length. Does that establish permanent deformation? What extra measurement would test the elastic limit?",
      transferSolution:
        "No. A spring can be nonlinear yet elastic. Record a complete loading and unloading sequence with repeated zero-load length measurements and their uncertainty. A reproducible residual extension after unloading supports permanent deformation; curvature alone only challenges proportionality. Do not use ½kx² for the nonlinear region without a measured force-extension integral.",
    },
  ],
  investigation: {
    title: "Synthetic spring data: a gradient with units matters",
    context:
      "These are synthetic loading readings, not a claimed school experiment. Extension x is positive downward from the unloaded length in centimetres; y is applied load magnitude in N. Use g = 9.8 m s^-2 if converting real masses to loads. Each y has a stipulated ±0.04 N bound; x uncertainty is neglected for this exercise. The nominal comparison model is F = 0.8x with these axis units. For the numerical parts use the first and last listed readings, not an arbitrary slider line.",
    xLabel: "Extension / cm",
    yLabel: "Force / N",
    readings: [{ x: 1, y: 0.82 }, { x: 2, y: 1.59 }, { x: 3, y: 2.42 }, { x: 4, y: 3.18 }, { x: 5, y: 4.01 }],
    bound: 0.04,
    gradient: { unit: "N cm^-1", min: 0.4, max: 1.2, step: 0.01, initial: 0.6 },
    intercept: { unit: "N", min: -0.2, max: 0.2, step: 0.01, initial: 0.1 },
    equation: String.raw`F_{\rm nominal}=0.8x_{\rm cm},\qquad k=100\frac{\Delta F}{\Delta x_{\rm cm}}\ \mathrm{N\,m^{-1}}`,
    interpretation:
      "The nominal line has residuals +0.02, -0.01, +0.02, -0.02, +0.01 N, all within ±0.04 N. This establishes compatibility over 1–5 cm under the stipulated bounds, not proof of Hooke's law for all extensions or elastic recovery. The endpoint estimate 0.7975 N cm^-1 differs slightly from the nominal 0.8 without contradiction. A non-zero fitted intercept could reflect zero error or omitted preload, rather than a new spring law.",
    parts: [
      { id: "fi-a", prompt: "Find the nominal first-to-last gradient using the listed central readings (not the slider state).", unit: "N cm^-1", expected: 0.7975, tolerance: 0.0025, hint: "Use changes in force and extension between the endpoints.", working: "Gradient = (4.01 - 0.82)/(5 - 1) = 3.19/4 = 0.7975 N cm^-1. This is an endpoint estimate, not a least-squares fit.", mistakes: [{ value: 0.802, explanation: "4.01/5 uses a single point and assumes a zero intercept; use the two specified endpoints." }] },
      { id: "fi-b", prompt: "Convert that endpoint gradient to the spring constant in SI units.", unit: "N m^-1", expected: 79.75, tolerance: 0.3, hint: "The same force increment occurs over 0.04 m, not 4 m.", working: "k = 3.19/(0.05 - 0.01) = 79.75 N m^-1, equivalently 100 × 0.7975.", mistakes: [{ value: 0.7975, explanation: "That is N per centimetre; multiply by 100 to obtain N per metre." }] },
    ],
    evaluation: {
      prompt: "Write an evaluation of linear compatibility, possible systematic error and the limits of this loading-only dataset. Propose a discriminating follow-up rather than merely saying 'take more readings'.",
      guide: [
        "Compare every nominal residual with the stipulated ±0.04 N bounds. These bounds are not standard deviations, and compatibility neither proves an exact straight law nor establishes its range beyond the sampled extensions.",
        "If the ruler reads x_read = x_true + δ cm, F = k_cm x_read - k_cm δ. A positive extension zero error therefore creates a negative force intercept without changing the gradient. Remeasure the unloaded reference and check the intercept sign before diagnosing preload.",
        "An omitted hanger weight gives an approximately constant force offset; record whether hanger mass is included. A multiplicative force calibration error rescales gradient and inferred k, and is not removed by averaging repeats. Check known masses and balance calibration independently.",
        "The endpoint worst-case gradient bound from y alone is ±(0.04 + 0.04)/4 = ±0.02 N cm^-1, or ±2 N m^-1; it is not a statistical confidence interval. Real ruler uncertainty would also affect the result.",
        "Add small safe increments and unload in stages. Curvature challenges proportionality; a residual unloaded extension suggests plastic deformation, while differing loading/unloading curves indicate hysteresis. Stop before unsafe loads rather than deliberately breaking a spring.",
      ],
    },
    plan: [
      "Clamp a spring securely above a tray with a ruler close and parallel to it; use a fixed pointer and read at eye level to reduce parallax. Check ruler scale and force/mass calibration; record unloaded length and hanger mass explicitly.",
      "Vary total load in small known increments; hold the spring, reference point, temperature and ruler alignment fixed. Convert mass to force with the stated g, wait for oscillations to settle, and repeat readings at each load.",
      "Measure both load and extension uncertainties in a real trial. Plot load against extension, inspect residuals, and compare loading with unloading, including return to the original reference; do not inherit the synthetic exercise's neglected x uncertainty.",
      "Wear eye protection, secure the stand against toppling, keep hands and feet out from under masses, use a catcher tray and stay within the spring's safe rated load. Stop if permanent extension or attachment damage appears.",
    ],
  },
  sources: [
    { title: "OpenStax University Physics 1 §6.2 — static bounds and kinetic friction", url: "https://openstax.org/books/university-physics-volume-1/pages/6-2-friction" },
    { title: "OpenStax University Physics 1 §12.1 — force and torque equilibrium", url: "https://openstax.org/books/university-physics-volume-1/pages/12-1-conditions-for-static-equilibrium" },
    { title: "OpenStax University Physics 1 §12.4 — proportional limit, elasticity and plasticity", url: "https://openstax.org/books/university-physics-volume-1/pages/12-4-elasticity-and-plasticity" },
  ],
} satisfies DepthChapter;
