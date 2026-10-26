# Spec: A-Level Mechanics

## Objective

Build a connected Forms 5–6 Newtonian Mechanics course, deepening existing chapters before adding territories. The provisional curriculum map has six headings: Kinematics; Dynamics; Forces; Work, Energy and Power; Circular Motion; and Gravitational Field. All six now have reasoning, structured-problem and investigation workshops. This is a developed Mechanics increment, not evidence of complete official syllabus coverage.

Projectile Motion remains the deep Kinematics study. Strange Loops remains a research extension. Oscillations is presented only as the bridge from Mechanics to Waves, not as a seventh Newtonian Mechanics heading.

## Depth-first acceptance standard

Before calling a chapter developed, it should teach students to construct and defend an argument, not only substitute into equations:

- Derive the main relations, stating coordinates, initial conditions and assumptions; include a counterexample where an assumption fails.
- Predict before inspecting evidence. Connect the graph, numerical values and physical interpretation, including a non-default state that exposes a misconception.
- Solve linked, independently checked problems with feedback that identifies common incorrect interpretations, then transfer the reasoning to a changed situation.
- Analyse data, uncertainty and residuals; distinguish compatibility from proof and random scatter from systematic error.
- Require interpretation and written working without pretending numerical feedback grades a derivation or implements an official mark scheme.

### Current Kinematics workshop

The integrated chapter now includes a signed-area reversal investigation, five derivation stages, three four-part problems (reversal, reaction/braking and vertical launch), transfer explanations and a trolley-data investigation. The five trolley readings are explicitly synthetic. The line must intersect every stated velocity bound; its compatibility does not prove constant acceleration. The endpoint gradient uncertainty is a conservative bound, not a regression confidence interval. Answers and reflections are session-local, not persisted or assessed as mastery.

### Remaining Mechanics workshops

Each of the other five headings now includes a conceptual prediction, calculated comparisons, five derivation stages, three four-part problems with diagnoses and transfer arguments, and a synthetic-data investigation:

| Heading | Reasoning and transfer | Practical interpretation |
|---|---|---|
| Dynamics | Signed impulse, system momentum, restitution, connected bodies and static/sliding decisions | Acceleration–force gradient gives inverse mass; intercept can reflect resistance, sensor bias or slope |
| Forces | Angled pulls, actual versus limiting friction, beam reactions, elasticity boundaries | Convert N/cm gradient to N/m; do not assume zero intercept |
| Work, Energy and Power | Signed work, dissipation, reversible loading, useful versus input power | Separate running efficiency from startup cost and total efficiency |
| Circular Motion | Real radial forces, banking, taut-string thresholds and conical geometry | Force against squared frequency gives 4π²mr, not m/r |
| Gravitational Field | Radius versus altitude, signed potential, orbital energy, transfer and geostationary conditions | Preserve axis scale factors when inferring GM from period squared against radius cubed |

The shared renderer keeps chapter content feature-local. Numerical responses reset when leaving the section/changing problems; chapter navigation resets the whole workshop. Written evaluations are learner-authored and ungraded. All datasets explicitly stipulate vertical bounds and neglect x uncertainty for training only. A compatible line is not a unique best fit or proof of a law.

Validation: 42 tests / 184 assertions; zero Svelte errors or warnings; production build and canonical HTTP routes pass. Independently recomputed all 76 new numerical answers and strictly rendered all 30 new equations. Production-browser checks submitted all 76 fields, exercised diagnoses, transfer/evaluation guides, keyboard fitting, section resets and all three sections at 320, 768, 1024 and 1440 px. Workshop controls fit those viewports. The pre-existing decorative hero still causes page-level horizontal overflow; no container runtime, real-device touch or Safari claim is made.

## Curriculum structure

### General Physics instruments used throughout

- SI quantities, units and dimensional reasoning
- vectors and perpendicular components
- measurement, uncertainty and experimental design
- graphs, gradients, intercepts, areas and linearisation

### Newtonian Mechanics

1. **Kinematics** — rectilinear motion, motion graphs, constant acceleration, free fall and projectile motion.
2. **Dynamics** — Newton’s laws, momentum, impulse and collisions.
3. **Forces** — free-body diagrams, friction, equilibrium, moments and elasticity.
4. **Work, Energy and Power** — work-energy, conservation, dissipation, power and efficiency.
5. **Circular Motion** — angular quantities, centripetal acceleration and radial force analysis.
6. **Gravitational Field** — inverse-square fields, potential, orbital motion and satellite data.

## Module contract

Every heading must provide:

- a provisional syllabus objective;
- an interactive prediction or manipulable model;
- core equations with assumptions and SI units;
- synchronized numerical or graphical evidence;
- one practical/data-analysis method;
- common misconception feedback;
- representative multiple-choice and structured/free-response prompts;
- links to prerequisite and next modules.

## Architecture

- `/mechanics/` is the Mechanics course map and integrated core laboratory.
- `/mechanics/projectile-motion/` remains the complete projectile study.
- `/mechanics/double-pendulum/` remains an advanced research extension.
- `packages/physics/src/mechanics.ts` owns pure framework-free calculations.
- One feature-local Svelte experience renders the integrated course; no database, route registry or generic CMS is introduced.
- The Kinematics workshop and its diagnostic exercises stay feature-local and reuse the shared constant-acceleration model.

## Scientific boundaries

### Always

- Validate non-finite and nonphysical inputs.
- State system boundaries, signs, coordinate directions and model assumptions.
- Distinguish vector quantities from magnitudes.
- Treat centripetal force as the inward resultant, not an additional force.
- Use centre-to-centre orbital radius rather than altitude alone.

### Never

- Claim dimensional consistency proves physical truth.
- Imply action-reaction forces act on the same body.
- Claim kinetic energy is conserved in every collision.
- Claim balanced forces require an object to be stationary.
- Claim there is no gravity in orbit.
- Present double-pendulum chaos as verified examinable core.

## Verification

- Pure mechanics calculations have boundary and hand-calculation tests.
- All canonical routes prerender and return HTTP 200 from the production container.
- The integrated course is keyboard-operable and has no horizontal overflow at 320, 768, 1024 or 1440 px.
- Tests, Svelte checks and production build pass.

## Sources

- Provisional curriculum mirror: https://www.scribd.com/document/988333508/Revised-Physics-Syllabus-F5-6
- Intended official portal: https://www5.zimsec.co.zw/syllabi/
- OpenStax University Physics Volume 1: https://openstax.org/details/books/university-physics-volume-1
- Constant-acceleration derivations: https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration
- Calculus and variable-acceleration boundaries: https://openstax.org/books/university-physics-volume-1/pages/3-6-finding-velocity-and-displacement-from-acceleration
- NIST measurement uncertainty: https://physics.nist.gov/cuu/Uncertainty/
