<script lang="ts">
  import { onMount } from "svelte";
  import type {
    ExperimentPreset,
    PendulumParameters,
    PendulumState,
    SolverId,
  } from "@strange-loops/contracts";
  import Equation from "./Equation.svelte";
  import LabControls from "./LabControls.svelte";
  import PendulumStage from "./PendulumStage.svelte";
  import SignalPlot from "./SignalPlot.svelte";
  import Transport from "./Transport.svelte";
  import { defaultPreset, presets } from "../content/presets";
  import type {
    ExperimentDefinition,
    FrameSample,
    WorkerCommand,
    WorkerEvent,
  } from "../simulation/types";

  const initialFrame: FrameSample = {
    time: 0,
    primary: { ...defaultPreset.state },
    twin: {
      ...defaultPreset.state,
      theta2: defaultPreset.state.theta2 + defaultPreset.perturbation,
    },
    separation: defaultPreset.perturbation,
    energyError: 0,
  };

  let worker: Worker;
  let runId = 0;
  let playing = $state(false);
  let speed = $state(1);
  let frame = $state(initialFrame);
  let history = $state<FrameSample[]>([initialFrame]);
  let selectedPreset = $state(defaultPreset.id);
  let experiment = $state<ExperimentDefinition>({
    state: { ...defaultPreset.state },
    parameters: { ...defaultPreset.parameters },
    perturbation: defaultPreset.perturbation,
    solver: defaultPreset.solver,
    timeStep: defaultPreset.timeStep,
  });
  let trails = $state(true);
  let reducedMotion = $state(false);
  let activePlot = $state<"separation" | "phase" | "energy">("separation");
  let error = $state("");
  const plotTabs = [
    ["separation", "Divergence"],
    ["phase", "Phase"],
    ["energy", "Energy"],
  ] as const;

  const scenes = [
    ["01", "A deterministic dare", "#story"],
    ["02", "Four numbers hold the future", "#scene-02"],
    ["03", "The machinery beneath", "#scene-03"],
    ["04", "Order before chaos", "#scene-04"],
    ["05", "The twin experiment", "#scene-05"],
    ["06", "Measure the split", "#scene-06"],
    ["07", "Trust, but verify", "#scene-07"],
    ["08", "Make it yours", "#lab"],
  ] as const;

  function post(command: WorkerCommand) {
    worker?.postMessage(command);
  }

  function configure(next: ExperimentDefinition) {
    runId += 1;
    const plainExperiment: ExperimentDefinition = {
      state: { ...next.state },
      parameters: { ...next.parameters },
      perturbation: next.perturbation,
      solver: next.solver,
      timeStep: next.timeStep,
    };
    experiment = plainExperiment;
    history = [];
    playing = false;
    error = "";
    post({ type: "configure", runId, experiment: plainExperiment });
  }

  function choosePreset(id: string) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;
    selectedPreset = id;
    configure({
      state: { ...preset.state },
      parameters: { ...preset.parameters },
      perturbation: preset.perturbation,
      solver: preset.solver,
      timeStep: preset.timeStep,
    });
  }

  function apply(values: {
    state: PendulumState;
    parameters: PendulumParameters;
    perturbation: number;
    solver: SolverId;
    timeStep: number;
  }) {
    selectedPreset = "custom";
    configure(values);
  }

  function toggle() {
    playing = !playing;
    post(playing ? { type: "play", runId, speed } : { type: "pause", runId });
  }

  function reset() {
    playing = false;
    history = [];
    post({ type: "reset", runId });
  }

  function changeSpeed(next: number) {
    speed = next;
    if (playing) post({ type: "play", runId, speed });
  }

  function movePlotTab(event: KeyboardEvent, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? plotTabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + plotTabs.length) %
            plotTabs.length;
    activePlot = plotTabs[nextIndex]![0];
    document.getElementById(`analysis-tab-${activePlot}`)?.focus();
  }

  function exportCsv() {
    const metadata = `# ${JSON.stringify({ version: 1, selectedPreset, experiment })}`;
    const rows = history.map((sample) =>
      [
        sample.time,
        sample.primary.theta1,
        sample.primary.theta2,
        sample.primary.omega1,
        sample.primary.omega2,
        sample.twin.theta1,
        sample.twin.theta2,
        sample.twin.omega1,
        sample.twin.omega2,
        sample.separation,
        sample.energyError,
      ].join(","),
    );
    const csv = [
      metadata,
      "time,theta1_a,theta2_a,omega1_a,omega2_a,theta1_b,theta2_b,omega1_b,omega2_b,separation,scaled_energy_error",
      ...rows,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `strange-loops-${selectedPreset}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function share() {
    const payload = btoa(JSON.stringify({ v: 1, selectedPreset, experiment }));
    location.hash = `experiment=${payload}`;
    await navigator.clipboard?.writeText(location.href);
  }

  function sharedExperiment():
    | { selectedPreset: string; experiment: ExperimentDefinition }
    | undefined {
    try {
      const value = new URLSearchParams(location.hash.slice(1)).get(
        "experiment",
      );
      if (!value) return undefined;
      const parsed = JSON.parse(atob(value)) as {
        v?: unknown;
        selectedPreset?: unknown;
        experiment?: Partial<ExperimentDefinition>;
      };
      const candidate = parsed.experiment;
      if (
        parsed.v !== 1 ||
        typeof parsed.selectedPreset !== "string" ||
        !candidate?.state ||
        !candidate.parameters ||
        !["rk4", "euler"].includes(String(candidate.solver)) ||
        !Number.isFinite(candidate.timeStep) ||
        !Number.isFinite(candidate.perturbation) ||
        Object.values(candidate.state).some(
          (value) => !Number.isFinite(value),
        ) ||
        Object.values(candidate.parameters).some(
          (value) => !Number.isFinite(value) || value <= 0,
        )
      )
        return undefined;
      return {
        selectedPreset: parsed.selectedPreset,
        experiment: candidate as ExperimentDefinition,
      };
    } catch {
      return undefined;
    }
  }

  onMount(() => {
    reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    trails = !reducedMotion;
    worker = new Worker(
      new URL("../simulation/simulation.worker.ts", import.meta.url),
      { type: "module" },
    );
    worker.onmessage = (message: MessageEvent<WorkerEvent>) => {
      if (message.data.runId !== runId) return;
      if (message.data.type === "error") {
        error = message.data.message;
        playing = false;
        return;
      }
      frame = message.data.sample;
      history = [...history.slice(-719), frame];
    };
    const shared = sharedExperiment();
    if (shared) selectedPreset = shared.selectedPreset;
    configure(shared?.experiment ?? experiment);
    return () => worker.terminate();
  });
</script>

<svelte:window
  onkeydown={(event) => {
    if (
      (event.target as HTMLElement)?.matches("input, select, textarea, button")
    )
      return;
    if (event.code === "Space") {
      event.preventDefault();
      toggle();
    }
    if (event.key.toLowerCase() === "r") reset();
  }}
/>

<section class="hero" id="story">
  <nav aria-label="Primary navigation">
    <a class="brand" href="#story">STRANGE/LOOPS</a>
    <div>
      <a href="#story">The study</a><a href="#lab">Chaos Lab</a><a
        href="#sources">Sources</a
      >
    </div>
  </nav>
  <div class="hero-copy">
    <p class="kicker">An interactive field study in deterministic chaos</p>
    <h1>Almost the same.<br /><em>Until they aren't.</em></h1>
    <p class="intro">
      Two pendulums begin just {(
        (experiment.perturbation * 180) /
        Math.PI
      ).toFixed(4)}° apart. The equations are identical. The future is not.
    </p>
    <a class="start" href="#experiment">Release the twins <span>↓</span></a>
  </div>
  <div class="hero-formula" aria-hidden="true">
    <Equation formula={String.raw`d(t) \approx d_0 e^{\lambda t}`} />
  </div>
  <p class="edition">
    Study 01 / Classical mechanics<br />Built for curious minds
  </p>
</section>

<section class="experience" id="experiment">
  <aside class="story-rail">
    <p class="section-label">Guided investigation</p>
    <ol>
      {#each scenes as scene, index}
        <li class:active={index === 4}>
          <span>{scene[0]}</span><a href={scene[2]}>{scene[1]}</a>
        </li>
      {/each}
    </ol>
    <div class="hint">
      <span>SPACE</span> play / pause<br /><span>R</span> reset
    </div>
  </aside>

  <div class="experiment-main">
    <header class="experiment-head" id="scene-05">
      <div>
        <p class="section-label">05 — The twin experiment</p>
        <h2>How long can two futures pretend to be one?</h2>
      </div>
      <p>
        System B begins with a perturbation too small to see. Track the
        logarithmic separation as the common path fractures.
      </p>
    </header>

    {#if error}<p class="error" role="alert">{error}</p>{/if}

    <div class="visual-grid">
      <div class="pendulum-panel">
        <PendulumStage
          sample={frame}
          parameters={experiment.parameters}
          {trails}
        />
        <Transport
          {playing}
          time={frame.time}
          {speed}
          onToggle={toggle}
          onReset={reset}
          onStep={() => post({ type: "step", runId })}
          onSpeed={changeSpeed}
        />
      </div>
      <div class="analysis-panel">
        <div class="metric-tabs" role="tablist" aria-label="Analysis view">
          {#each plotTabs as tab, index}
            <button
              id={`analysis-tab-${tab[0]}`}
              role="tab"
              aria-selected={activePlot === tab[0]}
              aria-controls="analysis-panel"
              tabindex={activePlot === tab[0] ? 0 : -1}
              onclick={() => (activePlot = tab[0] as typeof activePlot)}
              onkeydown={(event) => movePlotTab(event, index)}>{tab[1]}</button
            >
          {/each}
        </div>
        <div
          id="analysis-panel"
          role="tabpanel"
          aria-labelledby={`analysis-tab-${activePlot}`}
        >
          {#if activePlot === "separation"}
            <SignalPlot
              {history}
              metric="separation"
              label="log₁₀ state separation"
              color="var(--teal)"
            />
            <div class="formula-card">
              <span>What you're measuring</span>
              <Equation
                formula={String.raw`d(t)=\lVert y_A(t)-y_B(t)\rVert`}
                display
                label="State-space separation between trajectories A and B"
              />
              <p>
                A straight rising segment on a logarithmic scale suggests
                finite-time exponential separation—not randomness, and not by
                itself a full Lyapunov proof.
              </p>
            </div>
          {:else if activePlot === "phase"}
            <SignalPlot
              {history}
              metric="phase"
              label="phase portrait θ₁ : ω₁"
              color="var(--amber)"
            />
            <div class="formula-card">
              <span>The state</span><Equation
                formula={String.raw`y=(\theta_1,\theta_2,\omega_1,\omega_2)^T`}
                display
              />
              <p>
                A phase portrait replaces elapsed time with position and
                velocity. Loops signal regularity; folded paths reveal nonlinear
                structure.
              </p>
            </div>
          {:else}
            <SignalPlot
              {history}
              metric="energy"
              label="relative energy error"
              color="var(--coral)"
            />
            <div class="formula-card">
              <span>Numerical trust</span><Equation
                formula={String.raw`\varepsilon_E(t)=\frac{E(t)-E(0)}{E_{\mathrm{scale}}}`}
                display
              />
              <p>
                The ideal model conserves energy. Drift is scaled by a fixed
                gravitational energy, so the percentage does not depend on an
                arbitrary potential zero.
              </p>
            </div>
          {/if}
        </div>
        <dl class="readouts">
          <div>
            <dt>θ₁</dt>
            <dd>{frame.primary.theta1.toFixed(3)} rad</dd>
          </div>
          <div>
            <dt>θ₂</dt>
            <dd>{frame.primary.theta2.toFixed(3)} rad</dd>
          </div>
          <div>
            <dt>ω₁</dt>
            <dd>{frame.primary.omega1.toFixed(3)} rad/s</dd>
          </div>
          <div>
            <dt>ω₂</dt>
            <dd>{frame.primary.omega2.toFixed(3)} rad/s</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</section>

<section class="field-notes" aria-label="Guided study scenes">
  <article id="scene-02">
    <p class="section-label">02 — Four numbers hold the future</p>
    <h2>Freeze the motion.<br />Read the state.</h2>
    <Equation
      formula={String.raw`y=(\theta_1,\theta_2,\omega_1,\omega_2)^T`}
      display
    />
    <p>
      At one instant, these four values completely specify the ideal system. No
      random input is added later: surprising motion follows deterministically
      from this state.
    </p>
  </article>
  <article id="scene-04">
    <p class="section-label">04 — Order before chaos</p>
    <h2>The same machine can whisper.</h2>
    <p>
      Small angles stay close to the linear regime and trace compact phase
      loops. Compare that control case before calling complicated motion
      chaotic.
    </p>
    <button onclick={() => choosePreset("quiet")}>Load quiet orbit</button>
  </article>
  <article id="scene-06">
    <p class="section-label">06 — Measure the split</p>
    <h2>Make sensitivity visible.</h2>
    <Equation
      formula={String.raw`\log d(t)\approx\log d_0+\lambda t`}
      display
    />
    <p>
      An approximately straight early interval indicates finite-time exponential
      growth. Once separation reaches system scale, the curve saturates and that
      simple fit no longer applies.
    </p>
    <button
      onclick={() => {
        activePlot = "separation";
        choosePreset("butterfly");
      }}>Run divergence study</button
    >
  </article>
  <article id="scene-07">
    <p class="section-label">07 — Trust, but verify</p>
    <h2>Chaos is not permission for bad numerics.</h2>
    <p>
      Forward Euler can inject artificial energy. The stress preset makes that
      failure visible; reduce Δt or switch to RK4 and check whether the
      conclusion stabilizes.
    </p>
    <button
      onclick={() => {
        activePlot = "energy";
        choosePreset("stress");
      }}>Stress the solver</button
    >
  </article>
</section>

<section class="theory" id="scene-03">
  <div>
    <p class="section-label">03 — The machinery beneath</p>
    <h2>Simple ingredients.<br />Unruly consequences.</h2>
    <p>
      Positions become velocities. Velocities become kinetic energy.
      Euler–Lagrange turns one scalar function into the coupled equations that
      drive every pixel above.
    </p>
  </div>
  <div class="equations">
    <article>
      <span>01 / Position</span><Equation
        formula={String.raw`x_1=l_1\sin\theta_1,\quad y_1=-l_1\cos\theta_1`}
        display
      />
    </article>
    <article>
      <span>02 / Lagrangian</span><Equation
        formula={String.raw`\mathcal{L}(\theta,\dot\theta)=T-V`}
        display
      />
    </article>
    <article>
      <span>03 / Equations of motion</span><Equation
        formula={String.raw`M(\theta)\ddot\theta+h(\theta,\dot\theta)=0`}
        display
      />
    </article>
  </div>
</section>

<section class="lab" id="lab">
  <div class="lab-workspace">
    <header>
      <p class="section-label">08 — Open investigation</p>
      <h2>Now break the future yourself.</h2>
      <p>
        Change one thing. Predict. Release. Observe. Every run remains
        deterministic and reproducible.
      </p>
    </header>
    <div class="lab-plots">
      <SignalPlot
        {history}
        metric="separation"
        label="trajectory separation"
        color="var(--teal)"
      />
      <SignalPlot
        {history}
        metric="energy"
        label="energy error"
        color="var(--coral)"
      />
      <SignalPlot
        {history}
        metric="phase"
        label="phase portrait"
        color="var(--amber)"
      />
    </div>
    <div class="lab-actions">
      <label><input type="checkbox" bind:checked={trails} /> Show trails</label>
      <button onclick={share}>Copy experiment link</button>
      <button onclick={exportCsv}>Export CSV</button>
    </div>
    <details>
      <summary>Accessible sample data</summary>
      <div class="table-wrap">
        <table>
          <thead
            ><tr
              ><th>t</th><th>A θ₁</th><th>A θ₂</th><th>A ω₁</th><th>A ω₂</th><th
                >B θ₁</th
              ><th>B θ₂</th><th>B ω₁</th><th>B ω₂</th><th>distance</th><th
                >energy error</th
              ></tr
            ></thead
          ><tbody
            >{#each history.slice(-12) as sample}<tr
                ><td>{sample.time.toFixed(2)}</td><td
                  >{sample.primary.theta1.toFixed(3)}</td
                ><td>{sample.primary.theta2.toFixed(3)}</td><td
                  >{sample.primary.omega1.toFixed(3)}</td
                ><td>{sample.primary.omega2.toFixed(3)}</td><td
                  >{sample.twin.theta1.toFixed(3)}</td
                ><td>{sample.twin.theta2.toFixed(3)}</td><td
                  >{sample.twin.omega1.toFixed(3)}</td
                ><td>{sample.twin.omega2.toFixed(3)}</td><td
                  >{sample.separation.toExponential(2)}</td
                ><td>{(sample.energyError * 100).toFixed(3)}%</td></tr
              >{/each}</tbody
          >
        </table>
      </div>
    </details>
  </div>
  <LabControls
    {presets}
    {selectedPreset}
    state={experiment.state}
    parameters={experiment.parameters}
    perturbation={experiment.perturbation}
    solver={experiment.solver}
    timeStep={experiment.timeStep}
    onPreset={choosePreset}
    onApply={apply}
  />
</section>

<footer id="sources">
  <div>
    <span>STRANGE/LOOPS</span>
    <p>A reproducible interactive study of the ideal double pendulum.</p>
  </div>
  <div>
    <strong>Scientific sources</strong><a href="https://doi.org/10.1119/1.16860"
      >Shinbrot et al. (1992)</a
    ><a href="https://scienceworld.wolfram.com/physics/DoublePendulum.html"
      >Wolfram derivation</a
    ><a
      href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html"
      >SciPy integration reference</a
    >
  </div>
  <div>
    <strong>Current run</strong>
    <p>
      {experiment.solver.toUpperCase()} · Δt {experiment.timeStep.toFixed(5)} s<br
      />Absolute angles · SI units
    </p>
  </div>
</footer>

<style>
  .section-label,
  .kicker {
    color: var(--amber);
    font: 700 0.65rem/1.2 var(--mono);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .hero {
    min-height: 100svh;
    position: relative;
    display: grid;
    align-items: center;
    padding: clamp(1.25rem, 4vw, 4rem);
    overflow: hidden;
    background: radial-gradient(
        circle at 78% 45%,
        rgba(35, 92, 82, 0.4),
        transparent 27%
      ),
      linear-gradient(110deg, #090b0f 54%, #0e1718);
  }
  .hero::after {
    content: "";
    position: absolute;
    width: min(52vw, 46rem);
    aspect-ratio: 1;
    right: -4vw;
    top: 18%;
    border: 1px solid rgba(113, 215, 199, 0.18);
    border-radius: 50%;
    box-shadow:
      0 0 0 5rem rgba(113, 215, 199, 0.02),
      0 0 0 11rem rgba(113, 215, 199, 0.015);
  }
  nav {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem clamp(1.25rem, 4vw, 4rem);
    border-bottom: 1px solid var(--line);
    font: 700 0.68rem var(--mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  nav a {
    text-decoration: none;
  }
  nav div {
    display: flex;
    gap: 1.5rem;
    color: var(--muted);
  }
  .brand {
    color: var(--amber);
  }
  .hero-copy {
    position: relative;
    z-index: 1;
    max-width: 70rem;
    padding-top: 4rem;
  }
  h1 {
    margin: 1rem 0 1.5rem;
    font: 600 clamp(4rem, 10vw, 9.5rem) / 0.84 var(--serif);
    letter-spacing: -0.065em;
  }
  h1 em {
    color: var(--teal);
    font-weight: 400;
  }
  .intro {
    max-width: 34rem;
    color: #b4bfbb;
    font: 400 clamp(1.05rem, 2vw, 1.35rem) / 1.6 var(--sans);
  }
  .start {
    display: inline-flex;
    gap: 2rem;
    align-items: center;
    margin-top: 2rem;
    color: var(--night);
    background: var(--amber);
    padding: 1rem 1.25rem;
    text-decoration: none;
    font: 800 0.72rem var(--mono);
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }
  .hero-formula {
    position: absolute;
    z-index: 1;
    right: 7vw;
    bottom: 18%;
    color: var(--teal);
    font-size: clamp(1rem, 2vw, 1.6rem);
    transform: rotate(-4deg);
  }
  .edition {
    position: absolute;
    bottom: 2rem;
    right: 4rem;
    color: var(--muted);
    font: 500 0.62rem/1.5 var(--mono);
    text-transform: uppercase;
  }
  .experience {
    display: grid;
    grid-template-columns: 15rem minmax(0, 1fr);
    min-height: 100vh;
    border-top: 1px solid var(--line);
  }
  .story-rail {
    padding: 2rem 1.5rem;
    border-right: 1px solid var(--line);
    background: var(--panel);
  }
  .story-rail ol {
    list-style: none;
    padding: 1.5rem 0;
    margin: 0;
    display: grid;
    gap: 0;
  }
  .story-rail li {
    display: grid;
    grid-template-columns: 2rem 1fr;
    gap: 0.5rem;
    padding: 0.8rem 0;
    color: #626d6b;
    border-bottom: 1px solid var(--line);
    font-size: 0.76rem;
  }
  .story-rail li.active {
    color: var(--ink);
  }
  .story-rail li.active span {
    color: var(--amber);
  }
  .story-rail a {
    text-decoration: none;
  }
  .hint {
    color: var(--muted);
    font: 500 0.62rem/1.8 var(--mono);
  }
  .hint span {
    color: var(--ink);
    border: 1px solid var(--line-strong);
    padding: 0.12rem 0.3rem;
  }
  .experiment-main {
    min-width: 0;
  }
  .experiment-head {
    display: grid;
    grid-template-columns: 1fr minmax(16rem, 28rem);
    gap: 3rem;
    align-items: end;
    padding: clamp(2rem, 5vw, 4rem);
    border-bottom: 1px solid var(--line);
  }
  .experiment-head h2,
  .theory h2,
  .lab h2 {
    margin: 0.5rem 0 0;
    font: 600 clamp(2.4rem, 5vw, 5.5rem) / 0.95 var(--serif);
    letter-spacing: -0.045em;
  }
  .experiment-head > p,
  .theory > div > p,
  .lab header > p {
    color: var(--muted);
    line-height: 1.65;
  }
  .visual-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(19rem, 0.75fr);
  }
  .pendulum-panel {
    border-right: 1px solid var(--line);
    padding: 1rem;
    background: #080b0e;
  }
  .analysis-panel {
    padding: 1.5rem;
    display: grid;
    align-content: start;
    gap: 1.5rem;
    background: var(--panel);
  }
  .metric-tabs {
    display: flex;
    border-bottom: 1px solid var(--line);
  }
  .metric-tabs button {
    flex: 1;
    padding: 0.75rem 0.25rem;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--muted);
    font: 700 0.65rem var(--mono);
    text-transform: uppercase;
    cursor: pointer;
  }
  .metric-tabs button[aria-selected="true"] {
    color: var(--ink);
    border-color: var(--amber);
  }
  .formula-card {
    padding: 1.25rem;
    border: 1px solid var(--line);
    background: var(--night-2);
  }
  .formula-card > span {
    color: var(--amber);
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .formula-card p {
    color: var(--muted);
    font-size: 0.84rem;
    line-height: 1.55;
  }
  .readouts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0;
    border: 1px solid var(--line);
  }
  .readouts div {
    padding: 0.8rem;
    border: 1px solid var(--line);
  }
  dt {
    color: var(--muted);
    font: 600 0.62rem var(--mono);
  }
  dd {
    margin: 0.25rem 0 0;
    font: 500 0.8rem var(--mono);
  }
  .error {
    margin: 1rem;
    padding: 1rem;
    background: #40221e;
    color: #ffc2b5;
  }
  .field-notes {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-top: 1px solid var(--line);
  }
  .field-notes article {
    min-height: 28rem;
    padding: clamp(2rem, 5vw, 4.5rem);
    border-right: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  .field-notes h2 {
    margin: 0.6rem 0 1rem;
    font: 600 clamp(2.2rem, 4vw, 4rem) / 0.96 var(--serif);
    letter-spacing: -0.04em;
  }
  .field-notes p:not(.section-label) {
    max-width: 36rem;
    color: var(--muted);
    line-height: 1.65;
  }
  .field-notes button {
    margin-top: 1rem;
    border: 1px solid var(--amber);
    background: transparent;
    color: var(--amber);
    padding: 0.8rem 1rem;
    font: 700 0.68rem var(--mono);
    text-transform: uppercase;
    cursor: pointer;
  }
  .theory {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: clamp(2rem, 8vw, 8rem);
    padding: clamp(4rem, 9vw, 9rem);
    background: #e9e4d8;
    color: #111417;
  }
  .theory .section-label {
    color: #8a5a00;
  }
  .theory > div > p {
    color: #4d5654;
    max-width: 34rem;
  }
  .equations article {
    padding: 1.5rem 0;
    border-top: 1px solid #b8b2a7;
  }
  .equations article > span {
    color: #5d6462;
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  .equations :global(.katex) {
    color: #111417;
  }
  .lab {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 24rem;
    min-height: 100vh;
    border-top: 1px solid var(--line);
  }
  .lab-workspace {
    padding: clamp(2rem, 5vw, 4rem);
    min-width: 0;
  }
  .lab header {
    max-width: 50rem;
  }
  .lab-plots {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin: 3rem 0 2rem;
  }
  .lab-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    border-top: 1px solid var(--line);
    padding-top: 1rem;
  }
  .lab-actions label {
    margin-right: auto;
    color: var(--muted);
    font: 600 0.7rem var(--mono);
    text-transform: uppercase;
  }
  .lab-actions button {
    border: 1px solid var(--line-strong);
    background: transparent;
    color: var(--ink);
    padding: 0.75rem 1rem;
    font: 700 0.68rem var(--mono);
    text-transform: uppercase;
    cursor: pointer;
  }
  details {
    margin-top: 2rem;
    border: 1px solid var(--line);
    padding: 1rem;
  }
  summary {
    cursor: pointer;
    color: var(--teal);
    font: 700 0.7rem var(--mono);
    text-transform: uppercase;
  }
  .table-wrap {
    overflow-x: auto;
    margin-top: 1rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font: 500 0.68rem var(--mono);
  }
  th,
  td {
    padding: 0.5rem;
    border-bottom: 1px solid var(--line);
    text-align: right;
  }
  th:first-child,
  td:first-child {
    text-align: left;
  }
  footer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 3rem;
    padding: 3rem clamp(1.5rem, 5vw, 5rem);
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 0.78rem;
    line-height: 1.6;
  }
  footer span {
    color: var(--amber);
    font: 800 0.8rem var(--mono);
  }
  footer strong {
    display: block;
    color: var(--ink);
    font: 700 0.65rem var(--mono);
    text-transform: uppercase;
  }
  footer a {
    display: block;
  }
  @media (max-width: 70rem) {
    .experience {
      grid-template-columns: 1fr;
    }
    .story-rail {
      display: none;
    }
    .lab {
      grid-template-columns: 1fr;
    }
    .lab :global(.controls) {
      border-left: 0;
    }
  }
  @media (max-width: 52rem) {
    nav div {
      display: none;
    }
    .hero-formula,
    .edition {
      display: none;
    }
    .experiment-head,
    .visual-grid,
    .theory,
    .field-notes {
      grid-template-columns: 1fr;
    }
    .experiment-head {
      gap: 1rem;
    }
    .pendulum-panel {
      border-right: 0;
      border-bottom: 1px solid var(--line);
    }
    .lab-plots,
    footer {
      grid-template-columns: 1fr;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero::after {
      display: none;
    }
  }
</style>
