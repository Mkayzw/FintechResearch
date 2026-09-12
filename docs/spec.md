# Spec: Strange Loops — An Interactive Double-Pendulum Study

## Objective

Build a literature-grounded, reproducible web study for undergraduate STEM learners. The central experience is visceral: two double pendulums begin almost identically, diverge dramatically, and synchronized equations and plots explain why.

The product has two modes:

1. **Guided story** — a curated sequence moving from state and energy to sensitive dependence and numerical trust.
2. **Chaos Lab** — a playful sandbox with presets, physical parameters, twin perturbations, slow motion, trails, phase portraits, energy diagnostics, sharing, and CSV export.

Success means visitors can distinguish deterministic chaos from randomness and numerical error, connect motion to state-space representations, and reproduce each experiment from its visible parameters.

## Scientific Scope

### Model

- Planar, unforced, undamped double pendulum.
- Point masses, massless rigid rods, frictionless joints, uniform gravity.
- Absolute angles measured clockwise from the downward vertical.
- SI units and radians internally; degrees only at the UI boundary.
- State: $y=(\theta_1,\theta_2,\omega_1,\omega_2)^T$.

The engine computes accelerations by solving the $2\times2$ mass-matrix system $M(\theta)\ddot\theta=-h(\theta,\dot\theta)$ rather than duplicating expanded quotient equations.

### Numerical methods

- Fixed-step classical RK4 is the default interactive solver.
- Forward Euler is available as a deliberately poor comparison.
- Physics timestep is independent from display refresh.
- Energy, angular separation, phase points, and plots derive from the same state samples.
- The UI calls trajectory-separation slopes “finite-time divergence estimates,” not definitive Lyapunov exponents.

### Guided scenes

1. **Deterministic, not predictable** — release a dramatic preset and make a prediction.
2. **Meet the state** — inspect the four state variables and coordinate convention.
3. **The machinery** — reveal positions, kinetic/potential energy, the Lagrangian, and mass-matrix equation.
4. **Order before chaos** — contrast a small-angle trajectory with nonlinear motion.
5. **The twin experiment** — run nearby initial conditions together.
6. **Measure divergence** — relate visual separation to a logarithmic distance plot.
7. **Trust the simulation** — compare RK4 with coarse Euler and inspect energy drift.
8. **Open the lab** — transition into free experimentation.

### Required visual outputs

- Synchronized dual-pendulum Canvas animation with solid/dashed twin identities.
- Configurable trails and reduced-motion alternative.
- Angle time series.
- Phase portrait $(\theta_1,\omega_1)$.
- Logarithmic state-separation plot.
- Total-energy relative-error plot.
- Live scalar readouts and an accessible data table.

## Product Behaviour

- Play, pause, reset, single-step, and playback speed controls.
- Curated presets: butterfly effect, quiet orbit, energy exchange, solver stress.
- Initial state: $\theta_1,\theta_2,\omega_1,\omega_2$.
- Physical parameters: $m_1,m_2,L_1,L_2,g$.
- Twin perturbation magnitude.
- Solver and timestep controls.
- Parameter changes stage a new experiment and apply on restart; they never mutate mechanics mid-flight.
- A versioned URL fragment stores shareable experiment state.
- CSV export includes metadata and sampled states for both trajectories.
- No account, database, server-side persistence, or telemetry.

## Tech Stack

Versions were checked on 2026-09-12.

- Bun 1.3.14 runtime, package manager, workspace runner, and test runner.
- Svelte 5.57.0 and SvelteKit 2.70.3.
- `@sveltejs/adapter-static` 3.0.10 for a fully prerendered frontend.
- Elysia 1.4.30 and `@elysiajs/static` 1.4.10.
- Vite 8.3.0 and TypeScript 6.0.3. TypeScript 7.0.2 was evaluated but rejected because the current `svelte-check` release crashes before diagnostics under that compiler.
- Canvas 2D for rendering; a dedicated Web Worker for integration.
- KaTeX for mathematical typesetting.
- One multi-stage Docker image; Elysia serves the static build and API from one origin.

## Commands

- Install: `bun install`
- Develop both apps: `bun run dev`
- Develop frontend: `bun run dev:web`
- Develop API: `bun run dev:api`
- Unit tests: `bun test`
- Type and Svelte checks: `bun run check`
- Production build: `bun run build`
- Production server: `bun run start`
- Docker build: `docker build -t strange-loops .`
- Docker run: `docker run --rm -p 3000:3000 strange-loops`

## Project Structure

```text
apps/
  web/                  SvelteKit UI, worker, components, guided content
  api/                  Elysia API and static production host
packages/
  physics/              Framework-free equations, integrators, diagnostics
  contracts/            Shared API and preset types/constants only
docs/
  spec.md               Product and engineering source of truth
  research.md           Scientific derivation, claims, and bibliography
tasks/
  plan.md               Ordered implementation plan
  todo.md               Verifiable task checklist
```

No database package or persistence abstraction is included because the approved scope does not require one.

## Code Style

- TypeScript strict mode; explicit domain names and units.
- Pure physics functions; immutable state values.
- Svelte components remain focused; numerical work never runs in component render paths.
- Semantic HTML and native controls before ARIA.
- CSS custom properties supply a small, consistent token system.

```ts
export function stepRk4(
  state: PendulumState,
  parameters: PendulumParameters,
  dtSeconds: number,
): PendulumState {
  // Pure deterministic transformation; no hidden clock or mutation.
}
```

## Accessibility and Motion

- Target WCAG 2.2 AA.
- Complete keyboard operation and visible focus states.
- Identity is encoded by color plus line pattern/direct label.
- Every Canvas/plot has an accessible name, summary, scalar values, and tabular equivalent.
- `prefers-reduced-motion` starts simulations paused and removes decorative trails/transitions.
- Essential physics motion begins only after explicit activation in reduced-motion mode.

## Performance

- LCP $\le 2.5$ s at p75.
- INP $\le 200$ ms at p75.
- CLS $\le 0.1$.
- No normal-playback main-thread task above 50 ms.
- 60 FPS desktop with graceful 30 FPS mobile degradation.
- Bounded history; no memory growth with elapsed runtime.

## Testing Strategy

### Unit

- Static equilibria yield zero acceleration.
- Mass matrix is symmetric and positive definite for positive masses/lengths.
- RK4 converges faster than Euler under timestep halving.
- Energy error decreases as RK4 timestep decreases.
- Nearby identical states have zero separation; angular wrapping is handled.
- Presets and URL state satisfy declared limits.

### Integration

- Worker messages carry run identifiers so stale batches are ignored.
- API routes return schema-validated config, presets, and health responses.
- CSV output includes complete reproducibility metadata.

### Browser

- Guided story can be completed using a keyboard.
- Lab parameters restart a run and update all synchronized views.
- Reduced-motion mode begins paused.
- No console errors, broken API requests, or horizontal overflow at 320, 768, 1024, and 1440 px.

## Boundaries

### Always

- Display coordinate conventions, units, solver, and timestep.
- Derive every visualization from one authoritative simulation clock.
- Validate numerical claims with convergence or energy checks.
- Cite scientific claims and distinguish inference from proof.
- Run tests, checks, and build after behavioural changes.

### Ask first

- Adding persistence, authentication, telemetry, or external services.
- Changing the ideal mechanical model (damping, forcing, distributed rods).
- Adding dependencies not needed by the approved scope.
- Changing deployment into multiple services.

### Never

- Claim that visual divergence alone proves chaos.
- Label the simple pair-separation slope as the asymptotic Lyapunov exponent.
- Hide energy or solver error when discussing numerical trust.
- Commit secrets or collect user data.
- Allow unbounded simulation history.

## Success Criteria

- The opening twin experiment is usable within 10 seconds of page load.
- Two trajectories separated initially by a visible documented perturbation diverge in a curated preset.
- Pendulum, plots, equations, readouts, and time cursor remain synchronized.
- Users can switch among four presets and tune all approved model/state parameters.
- Euler visibly produces larger energy drift than RK4 for the solver-stress preset.
- Every experiment can be shared by URL and exported as CSV.
- Physics tests, API tests, Svelte checks, production build, and Docker health check pass.
- The experience remains coherent with reduced motion and keyboard-only input.

## Explicit Non-goals

- User accounts, saved cloud experiments, collaboration, or course administration.
- Arbitrary mechanical systems or pendulum counts.
- Experimental apparatus calibration.
- Full Lyapunov spectrum, Poincaré maps, GPU sweeps, or publication-grade adaptive solver research.
- A server-stepped animation loop.

## Sources

- Shinbrot et al., “Chaos in a double pendulum” (1992): https://doi.org/10.1119/1.16860
- Wolfram ScienceWorld derivation: https://scienceworld.wolfram.com/physics/DoublePendulum.html
- SciPy IVP solver reference: https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html
- SvelteKit static adapter: https://svelte.dev/docs/kit/adapter-static
- Bun workspaces: https://bun.sh/docs/pm/workspaces
- Elysia validation: https://elysiajs.com/essential/validation
- MDN Web Workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
- WCAG motion guidance: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
