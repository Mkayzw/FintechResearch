# Beyond Mechanics: Zimbabwe Forms 5–6 Physics research

Research and implementation date: **23 October 2026**. This is a research foundation and delivery record, **not an official syllabus transcription or verified exhaustive course**. The worked examples below are independently authored research anchors, not past-paper questions; workshop exercises may use different inputs. All 27 proposed chapters now have working study routes (see §12). Practical activities are proposed, not physically performed.

## 1. What the evidence actually establishes

Curriculum authority and scientific validity are separate. A correct electronics calculation does not establish that the current Zimbabwe syllabus examines it.

| Evidence read | What it establishes | What it does not establish |
|---|---|---|
| [Official MoPSE HBC directory](http://www.mopse.gov.zw/heritage-based-curriculum-syllabi) | A-Level Physics is listed; unlike O-Level Physics, its entry has no PDF hyperlink | Current competence matrix, assessment weights, paper codes |
| [December 2024 mirror, 56 pages](https://www.scribd.com/document/816045036/Physics-a-Level-Syllabusdec2024final) | First pages and page-index excerpts are readable; physical pp. 8–9 show General Physics, Electronics and Matter; p. 18 oscillations; pp. 20–25 E&M; pp. 26–27 electronics; pp. 28–33 matter; pp. 34–38 quantum/atomic/nuclear/communication material | Full objectives, completeness, authenticity or current applicability of every page |
| [MoPSE 2015–2022 teacher guide, mirrored by Zimsake](https://www.zimsake.co.zw/softidrive/download/2/sh/be8e9bc5bb4479b288142270f7168226) | Fully readable **p. 24 Forms 5–6 annexure** lists seven major areas and their subheadings | Proof that those headings or details are unchanged in 2024–2030 |
| [2024–2030 PDF listing on Books.co.zw](https://books.co.zw/past-papers/physics-syllabus-forms-5-6-2024-2030-ciivgvh/) | A current-titled document is catalogued | Its full text: downloading requires an account; it was not obtained |
| [One-page “2026 syllabus” upload](https://www.scribd.com/document/1024852303/ZIMSEC-a-Level-Physics-2026-Syllabus) | A user summary exists | Official robotics, programming or assessment requirements; do not use it as authority |

The teacher guide's earlier Forms 3–4 material is **not** the A-Level list. In particular, do not import its internal-combustion-engine section as a confirmed current A-Level requirement.

**Assessment conflict:** the old research table recorded Paper 3 at 30% and Paper 4 at 15%. The December 2024 mirror's physical p. 42 excerpt instead shows 32 and 16, terminal total 80%; p. 41 mentions a 20% project. The old weights have been withdrawn in [the curriculum research](zimsec-curriculum-research.md#assessment-model--conflicting-evidence-weights-withdrawn). Do not guess the remaining weights or claim that one mirror resolves version applicability.

## 2. Coverage audit and chapter map

The pre-implementation audit found developed Mechanics workshops and projectile/pendulum experiences, but no non-Mechanics workshops. Measurement lacked a standalone progression and the homepage omitted Modern Physics. The implementation now supplies the chapters below and eight linked editorial destinations including Mechanics, General and Modern Physics. Communication remains a separate destination from its historical grouping under Modern Physics; the map is not verified exhaustive syllabus coverage.

In the table, **H** means explicitly listed in the historical Forms 5–6 annexure. **P** means a corresponding heading or claim is also visible in a current-candidate mirror excerpt. These are evidence levels, **not official current objective IDs**. Proposed teaching details below are scientific designs, not transcribed objectives.

| Area | Historical subheadings / current preview corroboration | Authored workshop chapters now implemented |
|---|---|---|
| General Physics | Quantities/units; errors/uncertainties (H, P pp. 8, 44–45) | G1 measurement, dimensions and vectors; G2 graphs, uncertainty and model evaluation |
| Oscillations and Waves | Oscillations, waves, superposition (H); free oscillations including pendulum and spring-mass (P p. 18) | W1 SHM and energy; W2 travelling waves and phase; W3 interference/diffraction; W4 stationary waves and resonance |
| Electricity and Magnetism | Electricity, DC circuits, electric fields, capacitance, electromagnetism, induction, AC (H; area P pp. 20–25) | E1 charge/current/resistivity; E2 circuit energy, internal resistance and loading; E3 field/potential; E4 capacitance and transients; E5 magnetic forces; E6 induction, AC and transformers |
| Electronics | Analogue, digital (H, P pp. 9, 26–27) | A1 components/sensors and loaded dividers; A2 feedback amplifiers and comparators; A3 Boolean logic and control |
| Matter | Phases, deformation, temperature, thermal properties, ideal gases, non-viscous flow, thermal transfer (H; area P pp. 28–33) | M1 elasticity; M2 thermal measurement and phase changes; M3 gases/kinetic interpretation; M4 continuity/Bernoulli; M5 thermal transfer |
| Modern Physics | Charged particles, quantum physics, atomic structure, radioactivity (H; magnetic-charge force P p. 24, quantum/nuclear P pp. 34–36) | Q1 charged-particle paths; Q2 photons/photoelectric evidence; Q3 atomic spectra; Q4 nuclear energy and random decay |
| Communication | Under Modern Physics in H; channel tradeoffs/bandwidth P pp. 37–38 | C1 signals, carriers and modulation; C2 sampling/quantisation; C3 transmission, attenuation and noise |

This is a **27-chapter proposed product decomposition outside Mechanics**, not 27 verified syllabus objectives. Splitting a broad heading into chapters makes depth manageable without inventing additional official requirements.

## 3. What counts as depth

Each chapter needs a connected learning argument:

1. A question and prerequisite check, then a prediction before the result.
2. A derivation from definitions/conservation with a declared system, signs and limits.
3. A linked problem in which later parts use and interpret earlier results; then a changed-condition transfer problem.
4. Feedback that distinguishes a wrong model from arithmetic, units and rounding. A correct final number alone cannot assess an explanation.
5. A practical with apparatus, controls, repeat readings, analysis, uncertainty, model rejection and a specific improvement. Label synthetic data, and state whether uncertainty is a bound or a standard uncertainty.
6. A source and an honest curriculum-evidence label. Numerical checks, keyboard access and rendered narrow-screen verification precede a Ready label.

The following briefs specify the reasoning, competing interpretations and meaningful investigations. They are not instructions to add 27 shallow calculators at once.

## 4. General Physics — a foundation across every territory

**G1: from measurement to a model.** Derive dimensions of a relation rather than only converting prefixes. Resolve vectors before adding them; distinguish vector magnitude from signed component. Use dimensional homogeneity to reject a proposed equation, then explain why homogeneity alone cannot prove it: it cannot determine a dimensionless factor or additive dependence.

**G2: from readings to a defensible claim.** Derive gradient units from both axes, identify intercept meaning, and compare residuals rather than congratulating a high correlation coefficient. A shared zero error does not disappear by taking more repeats. Transforming axes transforms uncertainties too. Endpoint extreme gradients are bounds, not confidence intervals; a line consistent with stipulated error bars is compatible with data, not a proof of the law.

**Numerical anchor G:** a wire has length 1.20 ± 0.01 m, diameter 0.40 ± 0.01 mm and resistance 3.00 ± 0.03 Ω. With \(\rho=R\pi d^2/(4L)\), nominal resistivity is **3.142 × 10⁻⁷ Ω m**. First-order worst-case relative bound is \(\Delta R/R+2\Delta d/d+\Delta L/L\): **6.83%**, not 4.33% obtained by forgetting the squared diameter. This is a small-error approximation, not an exact interval or a NIST combined standard uncertainty. Exact substitution of endpoint bounds gives approximately **2.932–3.362 × 10⁻⁷ Ω m**.

**Investigation:** measure wire diameter at several places/orientations, correct the micrometer zero, and plot resistance against length while controlling heating. Distinguish a contact-resistance intercept from an altered material resistivity. Compare improving diameter precision with merely collecting more voltage readings. Use current limiting and check resistor/wire power.

**Reference read:** [NIST propagation of standard uncertainty](https://physics.nist.gov/cuu/Uncertainty/combination.html). NIST's quadrature rules use standard uncertainties and covariance; they must not be silently substituted for an exercise's worst-case bounds.

## 5. Oscillations and Waves — phase and boundaries, not moving pictures

### W1: SHM and exchange of energy

Start with \(F=-kx\), obtain \(a=-(k/m)x=-\omega^2x\), then differentiate \(x=A\cos(\omega t+\phi)\) to connect displacement, velocity and acceleration. Derive period and \(v^2=\omega^2(A^2-x^2)\) using energy. Treat displacement from equilibrium, not necessarily from the spring's natural length. For a pendulum, show where \(\sin\theta\approx\theta\) enters; do not present amplitude independence as universal. Damping/driving needs a separate energy account; a periodic motion is not automatically SHM.

**Numerical anchor W1:** mass 0.320 kg, spring constant 50.0 N/m, amplitude 0.0600 m. Then angular frequency **12.5 rad/s**, period **0.5027 s**, total energy **0.0900 J**. At displacement +0.0360 m, speed is **0.600 m/s** and acceleration **−5.625 m/s²**; velocity sign depends on the direction of travel. Doubling amplitude quadruples energy but leaves the ideal period unchanged. A common wrong answer uses maximum speed at the turning point; require an energy explanation to repair it.

**Investigation:** time several cycles for several masses, repeat, plot \(T^2\) against mass and interpret slope/intercept. Test a second amplitude to probe the approximation; do not label real non-zero intercepts automatically as mistakes. Secure hanging masses and stay within the elastic range.

### W2–W4: travelling waves, superposition and allowed modes

Move from a snapshot to \(y(x,t)\), distinguish \(\partial y/\partial t\) from wave propagation speed, and connect phase difference to path difference. Superpose **displacements**, not intensities. Derive double-slit fringe separation from path difference and the small-angle geometry; explicitly state coherence and unequal-amplitude limits on complete cancellation. Distinguish interference fringes from a single-slit diffraction envelope.

For standing waves, add opposite-travelling waves, identify permanent nodes, then impose boundaries to obtain permitted wavelengths. A string fixed at both ends, an open-open pipe and an open-closed pipe cannot all use the same harmonic rule. In sound, pressure nodes and displacement nodes are interchanged. Explain how a stationary pattern can coexist with particle motion and equal opposing energy transport. Resonance amplitude depends on damping; it is not infinite in a real apparatus.

**Numerical anchor W2:** wavelength 620 nm, slit separation 0.250 mm, screen distance 1.80 m give fringe separation **4.464 mm**. Eight separations span **35.712 mm**; nine bright-fringe centres delimit those eight intervals. If span, slit separation and screen distance have bounds ±0.400 mm, ±0.005 mm and ±0.010 m respectively, the first-order wavelength bound is **3.68%**. Doubling the screen distance doubles separation, not frequency. Ask why measuring a multi-fringe span reduces the relative endpoint-reading contribution.

**Investigations:** measure string resonances while changing tension and identify mode number before fitting \(f_n=n\sqrt{F_T/\mu}/(2L)\); or measure closed-pipe resonance lengths and use their difference to reduce end-correction sensitivity. For optics use enclosed low-power school apparatus and a beam stop: never direct a laser toward eyes or use the Sun as a viewing source.

**References read:** [SHM](https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion), [standing waves](https://openstax.org/books/university-physics-volume-1/pages/16-6-standing-waves-and-resonance), [double-slit interference](https://openstax.org/books/college-physics-2e/pages/27-3-youngs-double-slit-experiment). Implementation additionally reviewed [single-slit cancellation](https://openstax.org/books/university-physics-volume-3/pages/4-1-single-slit-diffraction) and [forced oscillations](https://openstax.org/books/university-physics-volume-1/pages/15-6-forced-oscillations). W4 derives the shifted displacement-response peak instead of repeating the source's simplified unshifted-peak claim as exact.

## 6. Electricity and Magnetism — track charge, energy and field direction

### E1–E2: current and real sources

Build \(I=\Delta Q/\Delta t\), potential difference as energy per charge and \(P=VI\) before resistance rules. Relate resistance to geometry and temperature, distinguishing the definition \(R=V/I\) from the empirical condition for an ohmic component. Derive junction and loop equations from charge/energy conservation. Current is not consumed and emf is not a force. Explicitly draw meter placement and explain finite meter resistance/loading.

For a discharging source, derive \(V=\mathcal E-Ir\), \(I=\mathcal E/(R+r)\) and \(\mathcal EI=I^2R+I^2r\). Charging reverses the current convention; “terminal voltage is always less than emf” is false. Constant internal resistance is a model, not an immutable property of every battery.

**Numerical anchor E1:** terminal readings 11.4 V at 1.00 A and 10.2 V at 3.00 A imply **0.600 Ω** internal resistance and **12.0 V** emf. With a 3.40 Ω load: current **3.00 A**, terminal voltage **10.2 V**, useful load power **30.6 W**, internal heating **5.40 W**, efficiency **85.0%**. A smaller load resistance draws more current but need not improve useful power or efficiency. Do not propose testing this 30 W case with an underrated classroom resistor.

**Investigation:** use a low-voltage source and appropriately rated loads, take paired V/I readings briefly to limit heating, plot V against I and check for drift/nonlinearity. Include nonzero-current points rather than short-circuiting a cell to obtain an intercept.

### E3–E4: potential, capacitance and transients

Define field as force per positive test charge and potential as energy per charge. Add fields as vectors and potentials as scalars: zero field need not imply zero potential. Connect field direction to decreasing potential; state uniform-field and point-charge assumptions before choosing an equation.

Derive \(C=Q/V\) and stored energy by summing charging work, giving \(U=QV/2\), not \(QV\). Distinguish isolated fixed charge from battery-connected fixed voltage when changing geometry or dielectric. Derive resistor-capacitor discharge from the loop equation and charge conservation; distinguish a time constant from a half-life. During resistive charging, battery energy supplied is not all stored in the capacitor.

**Numerical anchor E2:** a 220 µF capacitor initially at 9.00 V stores **1.980 mC** and **8.910 mJ**. Discharging through 10.0 kΩ gives time constant **2.20 s**. It reaches 3.00 V after **2.417 s**, when current magnitude is **0.300 mA** and stored energy **0.990 mJ**. One third of the voltage leaves one ninth of the initial energy. A real voltmeter connected across the capacitor changes the effective discharge resistance.

**Investigation:** fit a discharge with a finite-input-resistance meter, identify background/offset before taking logarithms, and compare fitted time constant with measured R and C including tolerances. Use low voltage, correct electrolytic polarity and a discharge resistor; no mains or flash-capacitor disassembly.

### E5–E6: magnetic forces, induction and AC

Connect force on a current-carrying wire to force on moving charges; distinguish charge sign from speed. For induction, define flux angle relative to the **area normal**, flux linkage and its rate of change. Lenz's law opposes the **change** of flux, not always the existing field. An induced emf need not produce a current in an open circuit. Derive sinusoidal generator emf from rotating flux, then distinguish peak, instantaneous and RMS values. Transformer turns ratio does not imply power gain; account for winding/core losses and transmission current.

**Numerical anchor E3:** 200 turns, area 0.00300 m², field normal to the coil falls uniformly from 0.0800 T to 0.0200 T in 0.0400 s. Flux-linkage change is **−0.0360 Wb-turn**, so emf magnitude is **0.900 V**. If the circuit is purely resistive at 6.00 Ω, current is **0.150 A** during the change; its magnetic field supports the decreasing original field. After the field stops changing the ideal induced emf is zero, although flux remains nonzero.

**Investigations:** compare magnet insertion/withdrawal polarity and speed using a school coil; then measure transformer ratios only on an isolated, current-limited low-voltage AC supply. Oscilloscope grounding must be checked. Live mains experiments are not learner activities.

**References read:** [emf/internal resistance](https://openstax.org/books/university-physics-volume-2/pages/10-1-electromotive-force), [capacitor energy](https://openstax.org/books/university-physics-volume-2/pages/8-3-energy-stored-in-a-capacitor), [Faraday's law](https://openstax.org/books/university-physics-volume-2/pages/13-1-faradays-law), [charged-particle motion](https://openstax.org/books/university-physics-volume-2/pages/11-3-motion-of-a-charged-particle-in-a-magnetic-field). Implementation additionally reviewed OpenStax UP2 §§7.2/7.4 for field/potential, §10.5 for RC, §§15.1–15.2 for AC and §15.6 for transformers, plus the drift, resistivity and wire-force sections cited in the chapters. Section-level sources support scientific models, not current examinability.

## 7. Electronics — a sensor is part of a circuit

### A1–A2: loading, feedback and operating limits

Derive the unloaded divider from equal series current. Attach a load and replace the lower branch by its parallel equivalent; don't retain the unloaded result. Compare LDR and thermistor characteristics with an ohmic resistor, stating which component is above/below the output. A diode's forward drop is an operating approximation, not a universal fixed constant.

For a non-inverting amplifier derive gain from the feedback divider and \(V_-\approx V_+\), but only in stable linear negative-feedback operation. A comparator does not use that equality. Real input common-mode range, output swing, current limit, bandwidth and slew rate constrain the ideal result. Supply rails are not automatically usable output voltages.

**Numerical anchor A:** 5.00 V source; 6.8 kΩ above the output; LDR below it; 10 kΩ load across the LDR. At LDR resistances 2.2 kΩ bright and 12 kΩ dark, the unloaded outputs are **1.222 V** and **3.191 V**, while loaded outputs are **1.048 V** and **2.226 V**. Loading is not a constant percentage correction. An amplifier with feedback 15 kΩ and ground resistor 10 kΩ requests gain 2.5 and outputs **2.620 V** and **5.564 V**. If the exercise specifies usable output 0.15–4.65 V under the actual load, the dark output saturates near its upper limit, not at 5.564 V. Check that the chosen component's input common-mode range admits both inputs.

### A3: logic and control

Translate a control statement to Boolean form and test **every** input combination, including fault/disable cases. For \(Y=S\land E\land\neg F\), darkness S alone is insufficient: the alarm also needs enable E and no fault F. Establish the logic level interfaces and polarity between comparator and gates; a numeric analogue voltage is not automatically a valid digital high. Two-input XOR means unequal inputs; do not generalise “exactly one high” to arbitrary multi-input XOR.

**Investigation:** measure the divider unloaded, loaded and buffered in both light conditions; compare errors, then show amplifier clipping. Use a separate 3.40 V comparator threshold after amplification to classify the two conditions. Exhaust all eight S/E/F combinations for the alarm. Define all inputs (no floating pins), use LED current limiting, decouple supplies and check the selected devices' datasheets. The nonideal output range above is stipulated for teaching, not a real component specification.

**References read:** [Texas Instruments, Op Amps for Everyone, §§2.3–2.5 and Chapters 3–6, university-hosted PDF](https://faculty.uml.edu/george_cheney/Teaching/Courses/Fall2017/eece-565/TIOpAmpBook.pdf), [All About Circuits, multiple-input gates](https://www.allaboutcircuits.com/textbook/digital/chpt-3/multiple-input-gates/). A selected contemporary part's datasheet and semiconductor/rectifier section research remain necessary before publishing component-specific activities.

## 8. Matter — microscopic models must earn macroscopic equations

### M1: deformation and stored energy

Define stress using cross-sectional area and strain using original length. Derive \(E=FL/(A\Delta L)\), then elastic strain energy from area under the force-extension graph. Elastic does not always mean linear; proportional limit and elastic limit are different. Loading/unloading hysteresis needs an energy-loss account rather than a second unexplained graph.

**Numerical anchor M1:** wire length 1.50 m, diameter 0.500 mm, load 40.0 N, extension 1.20 mm. Area is **1.9635 × 10⁻⁷ m²**, stress **2.037 × 10⁸ Pa**, strain **8.00 × 10⁻⁴**, Young modulus **2.546 × 10¹¹ Pa**, and stored energy **0.0240 J**, assuming linear elastic behaviour. Doubling diameter at the same load and length quarters extension; it does not change the material modulus. A diameter/radius confusion gives a factor-of-four error.

**Investigation:** take increasing/decreasing loads, measure diameter repeatedly, inspect reversibility before choosing a linear region, and propagate the doubled relative diameter contribution. Secure masses, shield eyes and keep clear of possible wire failure; do not load deliberately to fracture.

### M2–M3: temperature, heat, phases and gases

Separate a temperature scale from energy transfer and internal energy. Use energy balances for calorimetry, including container and heat losses, rather than blindly applying \(Q=mc\Delta T\). A phase change can absorb energy at constant temperature; mass loss and container energy matter when estimating latent heat.

Use absolute temperature/pressure in \(pV=nRT\). Derive molecular pressure from momentum transfer and isotropy before relating mean translational kinetic energy to temperature. RMS speed is not mean velocity (zero in a stationary gas). Connect microscopic assumptions to ideal-gas limits. Introduce \(\Delta U=Q-W_{\rm by}\) with a declared convention; the specific-heat model depends on molecular degrees of freedom.

**Numerical anchor M2:** a 0.250 kg sample with specific heat 900 J/(kg K) is heated at 12.0 V, 2.00 A for 180 s. Electrical input **4320 J** minus stipulated total heat loss **540 J**, neglecting container energy, gives temperature rise **16.8 K**. Ignoring the loss predicts **19.2 K** and, when using a measured 16.8 K rise to infer specific heat, overestimates it. Improving insulation targets a different error than improving thermometer resolution.

**Numerical anchor M3:** 0.200 mol of a monatomic ideal gas expands quasi-statically at constant pressure 100 kPa from 300 K to 450 K; take R = 8.314 J/(mol K). Volumes are **4.9884 L** and **7.4826 L**. Work by the gas is **249.42 J**, internal-energy increase **374.13 J**, and heat input **623.55 J**. Repeating between the same temperatures at fixed volume gives zero work and a different required heat, despite the same internal-energy change. Do not generalise monatomic heat capacity to every gas.

**Investigation:** compare heating/cooling curves to estimate loss, record voltage/current over time, include calorimeter heat capacity, and compare repeated runs at different powers. For gas laws use teacher-approved low-pressure equipment with a pressure limit; never heat a sealed improvised vessel. Handle hot surfaces, water and electricity with separate risk controls.

### M4–M5: flow and thermal transport

Derive continuity from mass conservation: \(\rho Av\) constant, with \(Av\) constant only for an incompressible fluid. Derive Bernoulli from pressure work and kinetic/gravitational energy along a streamline for steady, inviscid, incompressible flow. “Faster fluid always has lower pressure” is not valid across arbitrary flows, pumps or elevations.

**Numerical anchor M4:** water of density 1000 kg/m³ flows horizontally through a pipe narrowing from radius 20.0 mm to 10.0 mm. An upstream speed of 1.00 m/s becomes **4.00 m/s**, not 2.00 m/s. Under the ideal assumptions, upstream pressure exceeds downstream pressure by **7500 Pa**. Raise the outlet or introduce dissipative loss and that pressure calculation must change.

For thermal transfer distinguish conduction, convection and radiation mechanisms before choosing a rate equation. Separate steady power from total heat, linear conduction assumptions from temperature-dependent properties, and net radiative exchange from emitted radiation alone. A school insulation comparison cannot isolate conductivity if convection, geometry and radiation change too.

**Investigation:** collect low-head water volume over time at several outlet sizes, control head height and inspect departures from the ideal model; keep spills away from electrical equipment. Compare insulated cooling vessels with matched geometry/lids and analyse the whole cooling trend, not a single final temperature.

**References read:** [stress/strain/modulus](https://openstax.org/books/university-physics-volume-1/pages/12-3-stress-strain-and-elastic-modulus), [ideal-gas macroscopic model](https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas), [first law](https://openstax.org/books/university-physics-volume-2/pages/3-3-first-law-of-thermodynamics), [Bernoulli](https://openstax.org/books/college-physics-2e/pages/12-2-bernoullis-equation). Detailed kinetic-pressure derivation, thermometry, latent-heat and thermal-transfer sources must be reviewed for the respective chapters; these four references alone are not complete coverage.

## 9. Modern Physics — missing from the map, not optional to investigate

### Q1: charged particles

Combine electric work \(|q|V\) with kinetic energy, then apply magnetic force as the centripetal force for perpendicular entry. The magnetic field changes direction, not speed; the accelerating electric field supplies the energy. Reverse charge sign to reverse curvature without changing the radius magnitude. Distinguish perpendicular speed in a helical path from total speed, and state the non-relativistic limit.

**Numerical anchor Q1:** an electron starts effectively at rest and is accelerated through 2.50 kV before entering a perpendicular 2.00 mT field. With e = 1.602 × 10⁻¹⁹ C and electron mass 9.109 × 10⁻³¹ kg, the non-relativistic speed is approximately **2.965 × 10⁷ m/s** and radius **0.08431 m**. Quadrupling the voltage doubles the radius, not quadruples it. These are approximate non-relativistic values (kinetic energy is about 0.49% of rest energy), not exact high-energy predictions.

**Activity:** use a labelled simulation/data-analysis task first; electron-beam apparatus involves high voltage and is teacher-supervised only. Do not instruct students to construct it.

### Q2–Q3: photons, evidence and atomic spectra

Contrast the predictions of continuous energy delivery with threshold and stopping-potential observations. Derive \(hf=\phi+K_{\max}\) and \(eV_s=K_{\max}\). At fixed frequency above threshold, increasing intensity generally increases photocurrent, not maximum electron kinetic energy. Below threshold in the ordinary single-photon model, greater intensity does not rescue emission. A stopped current is not evidence that the incident beam contains no energy.

**Numerical anchor Q2:** take h = 6.626 × 10⁻³⁴ J s and e as above. For work function 2.00 eV and incident frequency 6.00 × 10¹⁴ Hz, photon energy is **2.482 eV**, maximum kinetic energy **0.4816 eV**, stopping-potential magnitude **0.4816 V**, and threshold frequency **4.835 × 10¹⁴ Hz**. At 4.00 × 10¹⁴ Hz the model predicts no emission, not a negative emitted kinetic energy.

Construct energy-level diagrams before using \(hf=E_i-E_f\). Explain why negative bound-state energy is consistent with positive photon energy; absorption requires an allowed energy difference. Atomic line spectra and nuclear emissions are not interchangeable. Bohr's hydrogen model has explanatory limits and is not a literal universal multi-electron orbit model.

**Activity:** analyse a stopping-voltage/frequency dataset, extract slope h/e and intercept −φ/e, and critique contact potentials/frequency bandwidth. Use a safe diffraction spectroscope and approved enclosed sources for spectra; do not look at the Sun, expose students to UV or improvise gas-discharge high-voltage supplies.

### Q4: nuclear energy, randomness and detection

Balance charge and nucleon number while identifying the particle emitted. Derive mass defect and binding energy with consistent atomic/nuclear masses. Use binding energy **per nucleon**, not total binding alone, when discussing relative stability; release depends on the total initial/final energy balance. Avoid claiming that every fusion or fission process releases energy.

Derive expected exponential decay from constant probability per unit time; individual nuclei do not follow a deterministic countdown. Obtain half-life and \(A=\lambda N\). Measured counts include detector efficiency, geometry, background and fluctuations; count rate is not automatically source activity, and neither is absorbed dose.

**Numerical anchor Q4:** total count rate falls from 1280/min to 230/min over 18.0 min, with constant background 80/min. Corrected rates are **1200/min** and **150/min**, a factor of eight, so half-life is **6.00 min** and decay constant **0.001925 s⁻¹**. Applying a logarithm to the uncorrected rates gives a wrong half-life. Count-rate uncertainty becomes relatively important near background; a perfectly smooth synthetic decay curve cannot represent this measurement problem.

**Investigation:** use random trials/dice or explicitly simulated count data, background subtraction and repeated equal-duration counts. Analyse residuals and uncertainty rather than forcing every reading through the exponential. Actual radioactive sources require authorised school procedures, trained supervision and proper storage; no acquisition or home experiments are proposed.

**References read:** [magnetic charged-particle motion](https://openstax.org/books/university-physics-volume-2/pages/11-3-motion-of-a-charged-particle-in-a-magnetic-field), [photoelectric effect](https://openstax.org/books/university-physics-volume-3/pages/6-2-photoelectric-effect), [Bohr/energy levels](https://openstax.org/books/university-physics-volume-3/pages/6-4-bohrs-model-of-the-hydrogen-atom), [binding energy](https://openstax.org/books/university-physics-volume-3/pages/10-2-nuclear-binding-energy), [decay](https://openstax.org/books/university-physics-volume-3/pages/10-3-radioactive-decay). Do not reproduce the decay section's misleading “hundreds of eV” nuclear-energy wording or turn a schematic binding-energy peak into an exact claim about the most tightly bound nuclide.

## 10. Communication — distinguish the signal from its representation

### C1: carriers and modulation

Separate message, carrier, modulation, channel and recovered signal. For a single-tone AM signal, expand the carrier/message product to show components at \(f_c\) and \(f_c\pm f_m\). For ordinary double-sideband AM with baseband bandwidth B, derive occupied width 2B. Changing amplitude is not changing carrier frequency; distinguish carrier-present from suppressed-carrier AM and the detection methods they permit.

For FM, distinguish frequency deviation from message frequency. Single-tone index \(\beta=\Delta f/f_m\); Carson width \(2(\Delta f+B)\) is an effective-bandwidth estimate, **not a hard cutoff**. Do not teach that FM has only two sidebands or is universally immune to noise/fading.

### C2: sampling and quantisation

Sampling discretises time; quantisation discretises amplitude. Derive an alias using indistinguishable sampled phases rather than repeating “Nyquist” without a counterexample. Use \(f_s>2f_{\max}\) for ordinary low-pass sampling, anti-alias filtering and practical margin: equality is unsafe for arbitrary phase. Define the quantiser endpoint/rounding convention before calculating levels, codes or maximum error. PCM payload rate is samples per second × bits per sample × channels; framing/coding adds overhead.

### C3: channel losses and noise

Compare copper, fibre and radio using bandwidth, attenuation, interference, installation/power and environmental constraints. Derive power loss in decibels and accumulate loss along a link. Power attenuation uses 10 log, while 20 log of voltage requires the relevant equal-impedance assumption. Attenuation is not noise; received power alone cannot establish reliability or bit-error rate. Describe signal regeneration without claiming it can recover information already lost before a decision.

**Numerical anchor C:** a message is low-pass limited to 3.30 kHz and sampled at 9.00 ksample/s. If a 6.70 kHz unwanted tone reaches the sampler, it appears at **2.30 kHz**. A uniform **mid-rise** 10-bit quantiser spans 0–3.20 V with step **3.125 mV** and midpoint reconstruction. A 0.937 V sample has interval index **299**, code **0100101011**, reconstruction **0.9359375 V** and error **−1.0625 mV**, within half a step. Unframed mono payload is **90.0 kbit/s**.

As an **alternative analogue representation**, a 720 kHz AM carrier with a 3.30 kHz tone has sidebands **716.70 kHz** and **723.30 kHz**, bandwidth **6.60 kHz**. FM deviation 8.10 kHz gives index **2.455** and Carson width approximately **22.80 kHz**. These widths do not assert that the analogue AM channel carries the above PCM bitstream.

For a separate illustrative link, stipulated power attenuation 1.70 dB/km over 2.60 km plus 1.30 dB additional loss gives **5.72 dB** total loss. Transmitted power 2.40 mW gives received power approximately **0.643 mW**. Noise data would still be needed to judge signal-to-noise ratio.

**Investigation:** compare sampled 2.30 and 6.70 kHz tones at 9.00 ksample/s; insert an analogue low-pass filter **before** sampling and measure rejection. Change bit depth separately to isolate quantisation from aliasing. Use a wired low-voltage bench or simulation, not an unlicensed over-air transmitter; use safe audio levels.

**References read:** [MSU AM/FM laboratory, §§7.2–7.7](https://www.egr.msu.edu/emrg/sites/default/files/content/module7_am_fm.pdf), [Imperial Communications I lecture 14](https://www.commsp.ee.ic.ac.uk/~pld/teaching/comms1_09/lecture_14.pdf), [Open University Exploring Communications Technology, §§1.8, 2, 3.2–3.3, 4.1–4.4](https://www.open.edu/openlearn/digital-computing/exploring-communications-technology/content-section-0?printable=1). The MSU prose has an erroneous statement that angle modulation changes amplitude; use its equations/constant-amplitude explanation instead. Copper frequency-dependent attenuation is not a universal law for every medium. Detailed optical-link and radio-propagation lessons need further specialist sources.

## 11. Delivery order and honest exit criteria

Research and implementation now cover every proposed area below. Preserve this prerequisite sequence in teaching; the delivery record in §12 does not turn these editorial chapters into verified official objectives.

1. **W1–W4**, with G1/G2 embedded and explicitly tracked: build phase/boundary reasoning and practical analysis through one coherent Waves sequence.
2. **E1–E4**, then **A1–A3**: teach circuit energy/loading before sensing and feedback; this avoids electronics formulas without electrical prerequisites.
3. **M1–M5**: connect elasticity/energy to thermal/gas/flow reasoning while retaining the distinctions between those models.
4. **E5–E6 and Q1–Q4**: build magnetic/induction reasoning and the presently missing Modern Physics sequence. Quantum content depends on wave/energy foundations, not on completing every electronics feature.
5. **C1–C3**: use waves, electronics and noise/measurement ideas in an end-to-end communications study.

This is an editorial dependency sequence, not an official school timetable. Each implemented chapter now includes reasoning, linked problems, transfer and practical analysis rather than a token calculator. Additional scientific topics or syllabus objectives not mapped here must not be implied complete.

Before a **full Zimbabwe syllabus complete** claim: obtain a complete authoritative current syllabus/version, map every objective to a delivered lesson and assessment, resolve the assessment conflict, review current specimen/marking/examiner material, and verify each workshop's science, calculations, interactions and accessible rendered states. Never infer completion from the chapter count in this proposal.

### Initial research validation and remaining uncertainty

- The source register distinguishes official listings, historical text, current-candidate previews and science references. No access restriction was bypassed.
- A standalone Python calculation checked **70 numerical claims across 15 worked anchors**, including rounding, background subtraction, loading and unit conversions. The loaded-divider check used nodal current balance independently of the parallel-resistor presentation. These initial research calculations were separate from the later implementation checks.
- Strict KaTeX rendering passed for **38 inline expressions** in this document and the companion research/journey/task documents; relative document targets exist and `git diff --check` passed. No application tests were rerun for this documentation-only pass.
- The initial research pass changed documentation only. Subsequent implementation and browser checks are recorded below; no physical experiment, component measurement or official examination mapping is claimed.
- Scientific references are for fact-checking; write original lessons/examples and review licensing before reproducing text, figures or datasets. Source errors noted above are not silently repeated.

## 12. Implemented workshop delivery

All **27 non-Mechanics chapters** are available at `/studies/{area}/{chapter}/`, with seven area overviews, prerequisites and chapter navigation. Area IDs are `general`, `waves`, `electricity`, `electronics`, `matter`, `modern` and `communication`. The shared workshop also serves the existing five developed Mechanics chapters; Kinematics retains its dedicated experience.

The new material includes **113 reasoned derivation stages, 54 linked multipart problems, 54 worked transfers and 27 five-point synthetic investigations**. There are **273 numerical entries**, including 55 practical-analysis parts. Every chapter contains diagnostic feedback, model limits, evaluation guidance, controls/safety and science sources (37 distinct reference URLs across the new chapters). There are no real-hardware simulation claims, saved learner progress or automatic written-explanation marks.

Validation separates science from wiring:

- Recomputed all 273 numerical results independently from the stated problem inputs during authoring; checked representative competing interpretations in the permanent cross-curriculum regression test.
- Strictly rendered all **140 equation fields** and confirmed the answer checker rejects all **266 supplied misconception values**.
- In the production Chromium browser, exercised predictions, both problems, all **273 numerical fields**, reachable compatible practical fits and deliberately incompatible fits in all 27 chapters. The browser inputs came from content to check interface wiring, not to independently prove the physics answers.
- Checked all three sections in every chapter at **320, 768 and 1440 CSS pixels**: **243 layout/state checks**, with no page-level horizontal overflow. Inspected representative atlas, reasoning, accepted/rejected numerical feedback, negative-log plot and narrow-layout captures; recorded and inspected pointer-driven correction feedback.
- Confirmed problem-local input reset, chapter reset through client-side navigation, and keyboard rejection/restoration of a capacitor practical fit against the final preview; no browser errors were reported in that run.
- With Bun 1.3.14, **46 tests / 416 assertions passed**, Svelte/TypeScript checks reported **zero errors and warnings**, and the production build passed. API integration checks cover every overview and all 27 direct chapter routes, including a cross-area 404. Restarted the orb preview after building so its registered static asset paths match the generated site; health returned `{"status":"ok"}`.

Delivery remains local until explicitly committed and published. Authoritative current syllabus, specimen/marking/examiner review and objective-level coverage mapping remain outstanding. This is substantial implemented teaching material, not a claim that the entire current Zimbabwe Physics syllabus is complete.
