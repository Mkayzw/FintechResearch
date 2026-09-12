# Implementation Plan: Strange Loops

## Overview

Build the application as a Bun workspace with a framework-free physics package, a static SvelteKit frontend, and an Elysia production host/API. Work proceeds risk-first: validate equations and integration before investing in animation, then deliver a complete guided twin experiment before expanding the sandbox.

## Architecture decisions

- **Single origin/container:** simplest reproducible deployment and no CORS surface.
- **Browser-owned simulation:** immediate interaction without network latency.
- **Dedicated worker:** keeps integration and history processing off the UI thread.
- **Shared pure physics package:** one tested source for equations, integrators, energy, and diagnostics.
- **Canvas 2D plus SVG plots:** Canvas handles motion efficiently; SVG keeps analytical graphics crisp and semantically describable.
- **No database:** there is no approved persistence requirement.
- **One authoritative clock:** every visual output consumes the same sampled frame/history.

## Dependency graph

```text
workspace/configuration
  └─ physics types and tests
      └─ equations and integrators
          └─ simulation worker and controller
              ├─ pendulum renderer
              ├─ synchronized plots
              └─ guided narrative
                  └─ full Chaos Lab
API contracts
  └─ presets/config API
      └─ production static host and Docker image
```

## Phases

### Phase 1 — Foundation

1. Create Bun workspace, shared TypeScript settings, SvelteKit app, Elysia app, and Docker baseline.
2. Add scientific types and failing validation/equilibrium/energy tests.
3. Implement mass-matrix dynamics, energy, Euler, RK4, and diagnostics until tests pass.

**Checkpoint:** unit tests, type checks, and empty application builds pass.

### Phase 2 — First complete experiment

4. Add simulation worker protocol and controller with run IDs and bounded history.
5. Build synchronized twin-pendulum renderer, transport controls, and core plots.
6. Add the opening guided twin experiment and responsive shell.

**Checkpoint:** a visitor can play, pause, reset, and watch nearby trajectories diverge while plots remain synchronized.

### Phase 3 — Guided study

7. Add equation/derivation scenes and educational checkpoints.
8. Add regular-motion and numerical-trust scenes with solver comparison.
9. Add accessible summaries, data table, keyboard controls, and reduced-motion behavior.

**Checkpoint:** the complete guided narrative is usable with keyboard and reduced motion.

### Phase 4 — Chaos Lab and reproducibility

10. Add parameter controls, presets, twin perturbation, solver/timestep tuning, and staged restart.
11. Add versioned URL sharing and CSV export with metadata.
12. Add schema-validated config/preset/health API routes.

**Checkpoint:** experiments are configurable, shareable, exportable, and API contracts pass integration tests.

### Phase 5 — Production validation

13. Complete production static serving and multi-stage Docker image.
14. Run full tests, Svelte checks, build, API health, and browser validation.
15. Profile interaction and repair measured accessibility/performance issues.

**Checkpoint:** all success criteria in `docs/spec.md` pass.

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Incorrect angle convention/sign | High | Document convention, mass-matrix formulation, equilibrium and energy tests |
| Numerical error presented as chaos | High | Solver comparison, timestep control, energy-error display, cautious language |
| Main-thread jank | High | Worker integration, batched samples, bounded history, Canvas animation |
| Svelte reactivity at physics frequency | Medium | Publish one display snapshot per animation frame, keep bulk history outside deep reactive state |
| Plot/animation desynchronization | High | Shared timestamped samples and authoritative controller |
| Inaccessible Canvas content | High | DOM summaries, scalar readouts, table, labels, keyboard equivalents |
| Mobile visual overload | Medium | One primary plot at a time below tablet width and simplified trails |
| Static host fallback mistakes | Medium | Prerender all routes and integration-test Elysia static delivery |

## Parallel work

After physics contracts are fixed, visual components and narrative content can be developed independently. Worker/controller work must precede component integration. API preset implementation can proceed in parallel with guided content once shared contracts exist.

## Source verification

Framework decisions follow current official documentation listed in `docs/spec.md`. Scientific statements and equations are grounded in the sources listed in `docs/research.md`.
