# Task Checklist

## Platform expansion

- [x] Research provisional ZIMSEC Forms 5–6 curriculum and assessment requirements.
- [x] Define the reusable orient-to-connect learning journey.
- [x] Replace the homepage with a curriculum map.
- [x] Add canonical projectile-motion and double-pendulum routes.
- [x] Preserve legacy double-pendulum experiment links.
- [x] Implement and test ideal and drag projectile models.
- [x] Build guided derivations, vectors, plots and range experiment.
- [x] Add practical uncertainty and exam-style assessment.
- [x] Label examinable core, derived applications and research extensions.
- [ ] Validate nested routes through the production container.

## Complete A-Level Mechanics

- [x] Research the six provisional Newtonian Mechanics headings and General Physics prerequisites.
- [x] Specify the complete Mechanics module contract and scientific boundaries.
- [x] Add tested pure models for every Mechanics heading.
- [x] Build the integrated `/mechanics/` course and laboratory.
- [x] Add practical, misconception and examination guidance to every heading.
- [x] Connect Projectile Motion and the advanced double-pendulum extension.
- [ ] Validate the complete Mechanics course in the production container.

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

## Depth-first Kinematics pass

- [x] Replace breadth expansion with a deeper chapter in the existing Mechanics route.
- [x] Derive constant-acceleration equations and show a variable-acceleration counterexample.
- [x] Connect reversal, signed graph areas, displacement and total distance.
- [x] Add linked reversal, reaction/braking and vertical-launch problems with diagnostic feedback and transfer reasoning.
- [x] Add explicitly synthetic practical data, all-reading line checks, endpoint bounds and systematic-error evaluation.
- [x] Remove complete-course claims; distinguish developed Kinematics from foundation overviews.
- [x] Verify 38 tests, clean Svelte/TypeScript checks, production build and canonical HTTP routes.
- [x] Exercise all three workshop sections at 320, 768, 1024 and 1440 px; inspect narrow and desktop captures.
- [x] Deepen the other five Mechanics headings to the same standard before adding territories.
- [ ] Verify the official current syllabus and assessment documents; keep alignment provisional meanwhile.

Validation limits: Docker is installed but its daemon is unavailable, so no container run was verified. The existing decorative Mechanics hero produces page-level horizontal overflow; workshop controls fit within the viewport at the checked widths. These checks do not claim real-device touch or Safari coverage.

## Five-chapter Mechanics depth pass

- [x] Add 25 reasoned derivation stages, 15 four-part problems and changed-condition transfer arguments.
- [x] Add five explicitly synthetic investigations with residuals, all-reading bounds, unit/axis interpretation, written evaluation and safe practical plans.
- [x] Integrate every workshop and reset chapter-local state on navigation; update coverage claims honestly.
- [x] Independently recompute 76 numerical answers and strictly render 30 equations.
- [x] Fix and regression-test valid rounding at inclusive numerical tolerance boundaries.
- [x] Pass 42 tests / 184 assertions, zero Svelte diagnostics, production build and canonical HTTP routes.
- [x] Submit all 76 new numerical fields in the production browser; exercise feedback, transfer/evaluation guides, resets and keyboard line fitting.
- [x] Check all three sections at 320, 768, 1024 and 1440 px and inspect representative desktop/narrow captures.
- [x] Develop Waves through the depth gate; retain provisional rather than full-syllabus completion claims.

## Beyond Mechanics research and delivery

- [x] Audit the wider topic map against the readable historical Forms 5–6 guide and current-candidate mirror excerpts; distinguish authority levels.
- [x] Research all missing areas: General Physics, Oscillations/Waves, Electricity/Magnetism, Electronics, Matter, Modern Physics and Communication.
- [x] Record 27 proposed chapter contracts with derivation/transfer priorities, numerical anchors, misconceptions, practical analysis and safety in `docs/beyond-mechanics-research.md`.
- [x] Withdraw conflicting assessment weights; do not infer missing current weights, paper codes or official marking rules.
- [x] Correct the delivery plan to include Modern Physics and put circuit prerequisites before Electronics.
- [ ] Obtain and audit the complete authoritative current syllabus, specimen/marking/examiner documents and assessment-version applicability.
- [x] Complete chapter-specific source reviews for the implemented material; do not equate these with exhaustive scientific or syllabus coverage.
- [x] Deliver W1–W4 with explicit G1/G2 measurement and uncertainty progression through the depth gate.
- [x] Deliver E1–E4 and A1–A3 through the depth gate.
- [x] Deliver M1–M5 through the depth gate.
- [x] Deliver E5–E6 and Q1–Q4 through the depth gate.
- [x] Deliver C1–C3 through the depth gate.
- [x] Replace the homepage's incomplete editorial map with an evidence-labelled map including General and Modern Physics; verify the rendered result before delivery.
- [x] Independently calculate 273 answers and strictly render 140 equations; reject all 266 supplied misconception values.
- [x] Exercise all 27 workshops and 273 numerical fields in the production browser; accept/reject practical fits and check 243 width/section combinations.
- [x] Inspect atlas/reason/solve/practical/narrow screenshots and a pointer-driven correction clip.
- [x] Add direct-route coverage for all seven overviews and 27 chapters and regression coverage for atomic-scale grading.

All 27 proposed non-Mechanics workshops are implemented locally. Full-syllabus completion still requires authoritative objective-level mapping, current assessment review and verification, not simply checking off these editorial chapter names. These Physics changes have not been committed, pushed or deployed.
