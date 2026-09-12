# Spec: Fieldlab Physics

## Objective

Transform the existing double-pendulum study into the first advanced study inside a Zimbabwe Forms 5–6 interactive Physics platform. The platform presents the syllabus as a map of research laboratories rather than a list of notes.

Initial routes:

- `/` — curriculum map and platform orientation.
- `/mechanics/projectile-motion/` — first core syllabus lesson.
- `/mechanics/double-pendulum/` — existing Strange Loops advanced study.

The curriculum order is Mechanics, Waves, Matter, Electronics, Telecommunications, then Electricity and Magnetism. Only Mechanics is active initially; future areas remain clearly marked as planned rather than simulated placeholders.

## Audience and success

Primary users are Zimbabwe Forms 5–6 Physics students. The first module succeeds when a student can:

- resolve launch velocity into horizontal and vertical components;
- derive and interpret the ideal trajectory equations;
- connect physical motion to $x(t)$, $y(t)$, $v_x(t)$, $v_y(t)$ and energy graphs;
- predict and verify time of flight, apex, range and impact velocity;
- explain why $45^\circ$ maximizes range only for equal launch and landing heights in vacuum;
- compare vacuum motion with quadratic drag without confusing numerical output for an analytic law;
- plan a practical investigation, propagate measurement uncertainty, and answer exam-style questions.

## Curriculum evidence

The revised Zimbabwe Upper Secondary Physics syllabus is identified by available search metadata and mirrors as Forms 5–6, 2024–2030. As of 2026-09-12, the official ZIMSEC website is under maintenance and its syllabus portal is unreachable. Therefore:

- curriculum alignment claims derived from mirrors are labelled provisional;
- scientific equations and teaching claims use authoritative general sources;
- the module must be checked against the official PDF when ZIMSEC restores access.

## Projectile scientific scope

### Coordinates

- $x$ is horizontal and positive right.
- $y$ is vertical and positive upward.
- Launch angle is measured counter-clockwise from $+x$.
- Ground is the horizontal plane $y=y_g$.
- SI units are used throughout.

### Vacuum model

$$
x(t)=x_0+v_{x0}t,
\qquad y(t)=y_0+v_{y0}t-\frac12gt^2,
$$

$$
v_x(t)=v_{x0},
\qquad v_y(t)=v_{y0}-gt.
$$

The analytic model supplies exact impact time, apex and equal-height results.

### Quadratic-drag model

$$
\mathbf v_r=\mathbf v-\mathbf v_{wind},
$$

$$
\dot{\mathbf r}=\mathbf v,
\qquad
\dot{\mathbf v}=\begin{bmatrix}0\\-g\end{bmatrix}
-\frac{\rho C_D A}{2m}\lVert\mathbf v_r\rVert\mathbf v_r.
$$

A fixed-step RK4 trajectory with impact interpolation is used only when drag is selected. Air density, drag coefficient and area are treated as model inputs, not universal object properties.

## Guided module

1. **The launch** — aim by speed and angle; predict the landing zone.
2. **Resolve the vector** — expose $v_{0x}=v_0\cos\theta$ and $v_{0y}=v_0\sin\theta$.
3. **Two clocks, one path** — horizontal uniform motion and vertical accelerated motion share time.
4. **Read the apex** — identify $v_y=0$ without claiming total velocity is zero.
5. **Beyond 45°** — generate range-versus-angle curves and vary launch height.
6. **Air changes the answer** — overlay vacuum and quadratic-drag paths.
7. **Measure like a physicist** — estimate launch speed from measured range/time and inspect uncertainty.
8. **Exam bench** — formative quiz and worked structured problem.
9. **Open range** — free laboratory with share/export support as a follow-up if time permits.

## Required interactions

- Drag or sliders for launch speed, angle and height.
- Play, pause, reset and scrub timeline.
- Velocity and acceleration vector overlays.
- Vacuum/drag overlay with distinct color and line pattern.
- Synchronized trajectory and graph readouts.
- Range-versus-angle experiment.
- Prediction marker before launch.
- Practical investigation table and uncertainty calculator.
- Immediate-feedback quiz and exam-style structured prompt.
- Keyboard-complete controls and reduced-motion mode.

## Architecture

```text
apps/web/src/routes/
  +page.svelte
  mechanics/projectile-motion/+page.svelte
  mechanics/double-pendulum/+page.svelte
apps/web/src/lib/features/projectile-motion/
  ProjectileMotionExperience.svelte
  ProjectileStage.svelte
  ProjectilePlot.svelte
packages/physics/src/
  index.ts
  projectile.ts
packages/physics/tests/
  projectile.test.ts
```

The existing `Equation.svelte` and global visual tokens are reused. Pendulum controls, workers, plots and content remain feature-local because their contracts are chaos-specific. No generic lesson engine or dynamic route registry is introduced before a second core lesson demonstrates real commonality.

## URL and migration behaviour

- SvelteKit prerenders nested routes with `trailingSlash = "always"`.
- Old `/#experiment=...` links redirect client-side to `/mechanics/double-pendulum/#experiment=...` because fragments never reach Elysia.
- Double-pendulum links use Base64URL for new shares and continue decoding legacy Base64.
- Static hosting must serve direct requests to all three canonical routes.

## Testing

### Projectile unit tests

- Analytic state matches hand calculations.
- Equal-height impact, range and apex match closed forms.
- Elevated and horizontal launches use the correct positive impact root.
- Ground-level horizontal/downward launches terminate immediately.
- Numerical zero-drag trajectories converge to vacuum.
- Final numerical impact is exactly on the ground and never duplicated.
- Drag acceleration opposes air-relative velocity.
- Invalid, non-finite and below-ground inputs are rejected.

### Browser tests

- Curriculum links work by click and direct request.
- Existing Strange Loops playback remains operational.
- Projectile parameters update all synchronized outputs.
- Vector overlays and model comparison remain distinguishable without color.
- Quiz is keyboard-operable and feedback is announced.
- Reduced-motion mode starts paused.
- Mobile layouts have no horizontal page overflow.

## Boundaries

### Always

- State model assumptions, coordinates, units and solver.
- Keep analytic vacuum and numerical drag results distinguishable.
- Show uncertainty as a range or distribution, never false precision.
- Mark provisional ZIMSEC alignment until the official PDF is available.

### Ask first

- Accounts, persistence, grading or analytics.
- New database fields or schemas.
- Additional dependencies.
- Spin/Magnus force, Coriolis effects, variable atmosphere or collisions.

### Never

- Present drag coefficient as universal and constant in all real conditions.
- Claim $45^\circ$ is always optimal.
- Add fake completed syllabus modules.
- Break old double-pendulum shared links.

## Sources

- Provisional syllabus discovery: https://www5.zimsec.co.zw/syllabi/
- OpenStax projectile motion: https://openstax.org/books/physics/pages/5-3-projectile-motion
- OpenStax vectors: https://openstax.org/books/physics/pages/5-1-vector-addition-and-subtraction-graphical-methods
- NASA drag equation: https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/drageq.html
- NIST uncertainty guidance: https://physics.nist.gov/cuu/Uncertainty/
- SvelteKit static generation: https://svelte.dev/docs/kit/adapter-static
