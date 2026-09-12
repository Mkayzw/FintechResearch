# Task Checklist

## Platform expansion

- [ ] Replace the homepage with a curriculum map.
- [ ] Add canonical projectile-motion and double-pendulum routes.
- [ ] Preserve legacy double-pendulum experiment links.
- [ ] Implement and test ideal and drag projectile models.
- [ ] Build guided derivations, vectors, plots and range experiment.
- [ ] Add practical uncertainty and exam-style assessment.
- [ ] Validate nested routes through the production container.

## 1. Workspace foundation

- [ ] Create root Bun workspace and strict TypeScript configuration.
- [ ] Scaffold `apps/web`, `apps/api`, `packages/physics`, and `packages/contracts`.
- [ ] Verify `bun install`, checks, and baseline production build.

## 2. Physics model (TDD)

- [ ] Write tests for equilibria, mass-matrix properties, energy, and invalid parameters.
- [ ] Implement absolute-angle mass-matrix dynamics.
- [ ] Implement Euler and RK4 fixed-step integration.
- [ ] Implement wrapped angular/state separation and energy error.
- [ ] Verify convergence and deterministic replay fixtures.

## 3. Simulation runtime

- [ ] Define worker messages with versioned run IDs.
- [ ] Implement fixed-step batched integration and bounded history.
- [ ] Implement play, pause, step, speed, reset, and stale-message rejection.

## 4. First vertical experience

- [ ] Render twin pendulums and trails from synchronized samples.
- [ ] Render separation and energy plots.
- [ ] Add opening explanation and transport controls.
- [ ] Verify divergence preset in a real browser.

## 5. Guided study

- [ ] Add eight guided scenes and progress navigation.
- [ ] Add state geometry and formula panels.
- [ ] Add regular-motion, phase-space, and numerical-trust scenes.
- [ ] Add explanatory checkpoints without blocking exploration.

## 6. Chaos Lab

- [ ] Add physical/state/solver controls with staged restart.
- [ ] Add four curated presets.
- [ ] Add selectable analytical views and responsive layout.
- [ ] Add versioned URL sharing and CSV export.

## 7. Accessibility and polish

- [ ] Add keyboard-complete operation and visible focus.
- [ ] Add reduced-motion behavior and motion toggle.
- [ ] Add Canvas/plot summaries and accessible data table.
- [ ] Validate contrast, responsive breakpoints, and overflow.

## 8. API and deployment

- [ ] Add validated config, presets, and health routes.
- [ ] Serve SvelteKit static output from Elysia.
- [ ] Add multi-stage Dockerfile and health check.

## 9. Final verification

- [ ] `bun test` passes.
- [ ] `bun run check` passes.
- [ ] `bun run build` passes.
- [ ] API integration and container health checks pass.
- [ ] Browser console/network are clean.
- [ ] Guided and lab flows work at desktop and mobile widths.
