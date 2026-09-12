<script lang="ts">
  import type {
    ExperimentPreset,
    PendulumParameters,
    PendulumState,
    SolverId,
  } from "@strange-loops/contracts";

  let {
    presets,
    selectedPreset,
    state: initialState,
    parameters,
    perturbation,
    solver,
    timeStep,
    onPreset,
    onApply,
  }: {
    presets: readonly ExperimentPreset[];
    selectedPreset: string;
    state: PendulumState;
    parameters: PendulumParameters;
    perturbation: number;
    solver: SolverId;
    timeStep: number;
    onPreset: (id: string) => void;
    onApply: (value: {
      state: PendulumState;
      parameters: PendulumParameters;
      perturbation: number;
      solver: SolverId;
      timeStep: number;
    }) => void;
  } = $props();

  let draftState = $state<PendulumState>({
    theta1: 0,
    theta2: 0,
    omega1: 0,
    omega2: 0,
  });
  let draftParameters = $state<PendulumParameters>({
    mass1: 1,
    mass2: 1,
    length1: 1,
    length2: 1,
    gravity: 9.81,
  });
  let draftPerturbation = $state(0);
  let draftSolver = $state<SolverId>("rk4");
  let draftTimeStep = $state(1 / 240);

  $effect(() => {
    initialState;
    parameters;
    perturbation;
    solver;
    timeStep;
    draftState = { ...initialState };
    draftParameters = { ...parameters };
    draftPerturbation = perturbation;
    draftSolver = solver;
    draftTimeStep = timeStep;
  });

  const toDegrees = (radians: number) => (radians * 180) / Math.PI;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
</script>

<aside class="controls" aria-label="Chaos Lab controls">
  <header>
    <p>Experiment deck</p>
    <h2>Chaos Lab</h2>
  </header>

  <div class="presets" role="list" aria-label="Experiment presets">
    {#each presets as preset, index}
      <button
        class:active={preset.id === selectedPreset}
        onclick={() => onPreset(preset.id)}
      >
        <span>0{index + 1}</span>
        <strong>{preset.name}</strong>
      </button>
    {/each}
  </div>

  <form
    onsubmit={(event) => {
      event.preventDefault();
      onApply({
        state: { ...draftState },
        parameters: { ...draftParameters },
        perturbation: draftPerturbation,
        solver: draftSolver,
        timeStep: draftTimeStep,
      });
    }}
  >
    <fieldset>
      <legend>Initial state</legend>
      <label
        >θ₁ <span>{toDegrees(draftState.theta1).toFixed(0)}°</span><input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={toDegrees(draftState.theta1)}
          oninput={(e) =>
            (draftState.theta1 = toRadians(Number(e.currentTarget.value)))}
        /></label
      >
      <label
        >θ₂ <span>{toDegrees(draftState.theta2).toFixed(0)}°</span><input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={toDegrees(draftState.theta2)}
          oninput={(e) =>
            (draftState.theta2 = toRadians(Number(e.currentTarget.value)))}
        /></label
      >
      <label
        >ω₁ <span>{draftState.omega1.toFixed(1)}</span><input
          type="range"
          min="-4"
          max="4"
          step="0.1"
          bind:value={draftState.omega1}
        /></label
      >
      <label
        >ω₂ <span>{draftState.omega2.toFixed(1)}</span><input
          type="range"
          min="-4"
          max="4"
          step="0.1"
          bind:value={draftState.omega2}
        /></label
      >
    </fieldset>
    <fieldset class="pairs">
      <legend>Physical system</legend>
      <label
        >m₁ (kg)<input
          type="number"
          min="0.1"
          max="5"
          step="0.1"
          bind:value={draftParameters.mass1}
        /></label
      >
      <label
        >m₂ (kg)<input
          type="number"
          min="0.1"
          max="5"
          step="0.1"
          bind:value={draftParameters.mass2}
        /></label
      >
      <label
        >L₁ (m)<input
          type="number"
          min="0.2"
          max="2"
          step="0.1"
          bind:value={draftParameters.length1}
        /></label
      >
      <label
        >L₂ (m)<input
          type="number"
          min="0.2"
          max="2"
          step="0.1"
          bind:value={draftParameters.length2}
        /></label
      >
    </fieldset>
    <fieldset class="pairs">
      <legend>Numerics</legend>
      <label
        >Solver<select bind:value={draftSolver}
          ><option value="rk4">RK4</option><option value="euler">Euler</option
          ></select
        ></label
      >
      <label
        >Δt (s)<select bind:value={draftTimeStep}
          ><option value={1 / 60}>1/60</option><option value={1 / 120}
            >1/120</option
          ><option value={1 / 240}>1/240</option><option value={1 / 480}
            >1/480</option
          ></select
        ></label
      >
      <label
        >Twin Δθ₂<input
          type="number"
          min="0.0000001"
          max="0.1"
          step="0.000001"
          bind:value={draftPerturbation}
        /></label
      >
      <label
        >g (m/s²)<input
          type="number"
          min="1"
          max="20"
          step="0.01"
          bind:value={draftParameters.gravity}
        /></label
      >
    </fieldset>
    <button class="apply" type="submit">Apply & restart experiment ↗</button>
  </form>
</aside>

<style>
  .controls {
    padding: 1.25rem;
    border-left: 1px solid var(--line);
    background: var(--panel);
    overflow-y: auto;
  }
  header p,
  legend {
    color: var(--amber);
    font: 700 0.65rem/1 var(--mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  h2 {
    margin: 0.2rem 0 1.25rem;
    font: 700 2rem/1 var(--serif);
  }
  .presets {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
    margin-bottom: 1.5rem;
  }
  .presets button {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.6rem;
    text-align: left;
    padding: 0.8rem;
    border: 0;
    background: var(--night-2);
    color: var(--muted);
    cursor: pointer;
  }
  .presets button.active {
    background: var(--amber);
    color: var(--night);
  }
  .presets span {
    font: 600 0.62rem var(--mono);
  }
  .presets strong {
    font-size: 0.75rem;
  }
  fieldset {
    border: 0;
    padding: 0;
    margin: 0 0 1.5rem;
    display: grid;
    gap: 0.75rem;
  }
  legend {
    margin-bottom: 0.75rem;
  }
  label {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.35rem;
    color: var(--muted);
    font: 600 0.68rem/1.3 var(--mono);
    text-transform: uppercase;
  }
  label span {
    color: var(--ink);
  }
  input[type="range"] {
    grid-column: 1 / -1;
    width: 100%;
    accent-color: var(--amber);
  }
  input[type="number"],
  select {
    width: 100%;
    min-height: 2.4rem;
    padding: 0 0.5rem;
    border: 1px solid var(--line-strong);
    background: var(--night);
    color: var(--ink);
    font: 500 0.78rem var(--mono);
  }
  .pairs {
    grid-template-columns: 1fr 1fr;
  }
  .pairs legend {
    grid-column: 1 / -1;
  }
  .apply {
    width: 100%;
    min-height: 3rem;
    border: 0;
    background: var(--teal);
    color: var(--night);
    font: 800 0.7rem var(--mono);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
  }
  @media (max-width: 70rem) {
    .controls {
      border: 1px solid var(--line);
    }
  }
</style>
