# Spec: A-Level Mechanics

## Objective

Deliver the complete provisional Forms 5–6 Newtonian Mechanics strand as a connected interactive course. The accessible MoPSE 2024–2030 syllabus mirror identifies six headings: Kinematics; Dynamics; Forces; Work, Energy and Power; Circular Motion; and Gravitational Field.

Projectile Motion remains the deep Kinematics study. Strange Loops remains a research extension. Oscillations is presented only as the bridge from Mechanics to Waves, not as a seventh Newtonian Mechanics heading.

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
- NIST measurement uncertainty: https://physics.nist.gov/cuu/Uncertainty/
