<script lang="ts">
  import { onMount } from "svelte";
  import {
    launchVelocity,
    optimizeVacuumRange,
    simulateProjectile,
    solveVacuumFlight,
    vacuumStateAt,
    type ProjectileProblem,
    type ProjectileState,
    type TrajectorySample,
    type VacuumModel,
  } from "@strange-loops/physics";
  import GuidedProjectileStudy from "./GuidedProjectileStudy.svelte";
  import MeasurementPractical from "./MeasurementPractical.svelte";
  import ProjectileAssessment from "./ProjectileAssessment.svelte";
  import ProjectilePlot from "./ProjectilePlot.svelte";
  import ProjectileStage from "./ProjectileStage.svelte";
  import RangeExperiment from "./RangeExperiment.svelte";
  import {
    decodeLaunchState,
    encodeLaunchState,
    trajectoryCsv,
  } from "./projectile-study";

  const gravity = 9.81;
  let speed = $state(30);
  let angleDegrees = $state(45);
  let launchHeight = $state(2);
  let predictedRange = $state(80);
  let showVectors = $state(true);
  let time = $state(0);
  let playing = $state(false);
  let reducedMotion = $state(false);
  let shareStatus = $state("");

  let simulation = $derived.by(() => {
    const initialState: ProjectileState = {
      positionMeters: { x: 0, y: launchHeight },
      velocityMetersPerSecond: launchVelocity(
        speed,
        (angleDegrees * Math.PI) / 180,
      ),
    };
    const vacuumProblem: ProjectileProblem & { model: VacuumModel } = {
      initialState,
      groundHeightMeters: 0,
      model: { kind: "vacuum", gravityMetersPerSecondSquared: gravity },
    };
    const vacuumResult = solveVacuumFlight(vacuumProblem);
    const duration = vacuumResult.impact.timeSeconds;
    const sampleCount = Math.max(2, Math.ceil(duration / 0.025));
    const vacuum: TrajectorySample[] = Array.from(
      { length: sampleCount + 1 },
      (_, index) => {
        const timeSeconds = (index / sampleCount) * duration;
        const state = vacuumStateAt(initialState, gravity, timeSeconds);
        if (index === sampleCount) state.positionMeters.y = 0;
        return { timeSeconds, state };
      },
    );
    const dragResult = simulateProjectile(
      {
        initialState,
        groundHeightMeters: 0,
        model: {
          kind: "quadratic-drag",
          gravityMetersPerSecondSquared: gravity,
          massKilograms: 0.145,
          airDensityKilogramsPerCubicMeter: 1.225,
          dragCoefficient: 0.47,
          referenceAreaSquareMeters: 0.0042,
          windVelocityMetersPerSecond: { x: 0, y: 0 },
        },
      },
      { timeStepSeconds: 0.025, maxTimeSeconds: 30 },
    );
    const optimum = optimizeVacuumRange({
      launchPositionMeters: { x: 0, y: launchHeight },
      launchSpeedMetersPerSecond: speed,
      groundHeightMeters: 0,
      gravityMetersPerSecondSquared: gravity,
    });
    return {
      vacuum,
      drag: dragResult.samples,
      duration,
      range: vacuumResult.impact.horizontalDisplacementMeters,
      dragRange:
        dragResult.termination === "impact"
          ? dragResult.impact.horizontalDisplacementMeters
          : (dragResult.samples.at(-1)?.state.positionMeters.x ?? 0),
      apex: vacuumResult.extrema.apex.state.positionMeters.y,
      optimumDegrees: (optimum.angleRadians * 180) / Math.PI,
    };
  });

  function sampleAt(samples: TrajectorySample[], targetTime: number) {
    return (
      samples.find((sample) => sample.timeSeconds >= targetTime) ??
      samples.at(-1)!
    ).state;
  }

  let currentVacuum = $derived(sampleAt(simulation.vacuum, time));
  let currentDrag = $derived(sampleAt(simulation.drag, time));

  function restart() {
    time = 0;
    playing = false;
  }

  function togglePlayback() {
    if (reducedMotion) {
      time =
        time >= simulation.duration
          ? 0
          : Math.min(simulation.duration, time + 0.1);
      playing = false;
      return;
    }
    if (!playing && time >= simulation.duration) time = 0;
    playing = !playing;
  }

  async function shareExperiment() {
    const payload = encodeLaunchState({ speed, angleDegrees, launchHeight });
    location.hash = `launch=${payload}`;
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(location.href);
      shareStatus = "Link copied";
    } catch {
      shareStatus = "Link ready in address bar";
    }
  }

  function exportTrajectory() {
    const csv = trajectoryCsv(
      { speed, angleDegrees, launchHeight },
      simulation.vacuum,
    );
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `projectile-${angleDegrees}deg-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  onMount(() => {
    const shared = decodeLaunchState(
      new URLSearchParams(location.hash.slice(1)).get("launch") ?? "",
    );
    if (shared) {
      speed = shared.speed;
      angleDegrees = shared.angleDegrees;
      launchHeight = shared.launchHeight;
    }
    reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let previous = performance.now();
    const animate = (now: number) => {
      if (playing && !reducedMotion) {
        time = Math.min(simulation.duration, time + (now - previous) / 1000);
        if (time >= simulation.duration) playing = false;
      }
      previous = now;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  });
</script>

<header class="site-head">
  <a href="/">FIELDLAB/PHYSICS</a>
  <span>Mechanics · Projectile motion</span>
</header>

<main>
  <section class="intro">
    <p class="eyebrow">Core study 01 · Beyond 45°</p>
    <h1>A launch is two motions sharing one clock.</h1>
    <p>
      Change the initial vector, compare the exact vacuum path with a
      quadratic-drag RK4 model, and test when the familiar 45° rule stops
      applying.
    </p>
  </section>

  <section class="laboratory" aria-labelledby="lab-title">
    <div class="stage-panel">
      <header class="panel-head">
        <div>
          <p class="eyebrow">Live model</p>
          <h2 id="lab-title">Launch laboratory</h2>
        </div>
        <button
          class="vector-toggle"
          class:active={showVectors}
          onclick={() => (showVectors = !showVectors)}
        >
          Vectors {showVectors ? "on" : "off"}
        </button>
      </header>

      <ProjectileStage
        vacuum={simulation.vacuum}
        drag={simulation.drag}
        {currentVacuum}
        {currentDrag}
        {launchHeight}
        {showVectors}
        {predictedRange}
      />

      <div class="transport" aria-label="Projectile playback controls">
        <button class="release" onclick={togglePlayback}>
          {reducedMotion
            ? time >= simulation.duration
              ? "Reset timeline"
              : "Step 0.1 s"
            : playing
              ? "Pause"
              : time >= simulation.duration
                ? "Replay"
                : "Release"}
        </button>
        <button onclick={restart}>Reset</button>
        <label class="scrubber">
          <span>t = {time.toFixed(2)} s</span>
          <input
            type="range"
            min="0"
            max={simulation.duration}
            step="0.01"
            bind:value={time}
            oninput={() => (playing = false)}
          />
        </label>
        <button onclick={shareExperiment}>Share</button>
        <button onclick={exportTrajectory}>Export CSV</button>
        <span class="share-status" aria-live="polite">{shareStatus}</span>
      </div>
    </div>

    <aside class="controls" aria-label="Launch controls">
      <p class="eyebrow">Initial conditions</p>
      <label>
        <span>Speed <b>{speed.toFixed(0)} m/s</b></span>
        <input
          type="range"
          min="5"
          max="60"
          step="1"
          bind:value={speed}
          oninput={restart}
        />
      </label>
      <label>
        <span>Angle <b>{angleDegrees.toFixed(0)}°</b></span>
        <input
          type="range"
          min="5"
          max="85"
          step="1"
          bind:value={angleDegrees}
          oninput={restart}
        />
      </label>
      <label>
        <span>Launch height <b>{launchHeight.toFixed(1)} m</b></span>
        <input
          type="range"
          min="0"
          max="20"
          step="0.5"
          bind:value={launchHeight}
          oninput={restart}
        />
      </label>
      <label>
        <span>Predict range <b>{predictedRange.toFixed(0)} m</b></span>
        <input
          type="range"
          min="0"
          max="250"
          step="1"
          bind:value={predictedRange}
        />
      </label>

      <dl>
        <div>
          <dt>Vacuum range</dt>
          <dd>{simulation.range.toFixed(1)} m</dd>
        </div>
        <div>
          <dt>Drag range</dt>
          <dd>{simulation.dragRange.toFixed(1)} m</dd>
        </div>
        <div>
          <dt>Apex</dt>
          <dd>{simulation.apex.toFixed(1)} m</dd>
        </div>
        <div>
          <dt>Best vacuum angle</dt>
          <dd>{simulation.optimumDegrees.toFixed(1)}°</dd>
        </div>
      </dl>
      <p class="model-note">
        Coordinates: +x right, +y up. SI units. Amber is analytic vacuum motion;
        teal uses fixed-step RK4 with quadratic drag.
      </p>
    </aside>
  </section>

  <section class="plots" aria-label="Synchronized projectile plots">
    <ProjectilePlot
      samples={simulation.vacuum}
      quantity="height"
      label="Height / m"
      currentTime={time}
    />
    <ProjectilePlot
      samples={simulation.vacuum}
      quantity="velocity"
      label="Vertical velocity / m s⁻¹"
      currentTime={time}
    />
    <ProjectilePlot
      samples={simulation.vacuum}
      quantity="energy"
      label="Specific energy / J kg⁻¹"
      currentTime={time}
    />
  </section>

  <GuidedProjectileStudy />
  <RangeExperiment {speed} height={launchHeight} />
  <MeasurementPractical />
  <ProjectileAssessment />
</main>

<style>
  .site-head {
    min-height: 4.5rem;
    padding: 0 clamp(1.25rem, 4vw, 4rem);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--line);
    color: var(--muted);
    font: 700 0.66rem var(--mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .site-head a {
    color: var(--amber);
    text-decoration: none;
  }
  main {
    min-height: 100svh;
  }
  .intro {
    padding: clamp(4rem, 8vw, 8rem) clamp(1.25rem, 6vw, 7rem);
    background: radial-gradient(
      circle at 80% 40%,
      rgba(244, 184, 74, 0.12),
      transparent 28%
    );
  }
  .eyebrow {
    margin: 0 0 0.75rem;
    color: var(--amber);
    font: 800 0.66rem var(--mono);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  h1 {
    max-width: 13ch;
    margin: 0 0 1.5rem;
    font: 600 clamp(3.5rem, 9vw, 8rem) / 0.88 var(--serif);
    letter-spacing: -0.06em;
  }
  .intro > p:last-child {
    max-width: 48rem;
    color: #adb8b5;
    font-size: clamp(1rem, 2vw, 1.25rem);
    line-height: 1.65;
  }
  .laboratory {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 24rem);
    border-block: 1px solid var(--line);
  }
  .stage-panel {
    padding: clamp(1rem, 3vw, 2.5rem);
    min-width: 0;
  }
  .panel-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  h2 {
    margin: 0;
    font: 600 clamp(2rem, 4vw, 3.5rem) var(--serif);
  }
  button {
    min-height: 2.7rem;
    border: 1px solid var(--line-strong);
    padding: 0 0.9rem;
    background: transparent;
    color: var(--ink);
    font: 700 0.68rem var(--mono);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
  }
  button:hover,
  button:focus-visible {
    border-color: var(--amber);
  }
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 3px;
  }
  .vector-toggle.active,
  .release {
    border-color: var(--amber);
    background: var(--amber);
    color: var(--night);
  }
  .transport {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .scrubber {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: 0.5rem;
    color: var(--teal);
    font: 600 0.72rem var(--mono);
  }
  .scrubber input {
    flex: 1;
  }
  .share-status {
    min-width: 5.5rem;
    color: var(--teal);
    font: 700 0.65rem var(--mono);
    text-transform: uppercase;
  }
  .controls {
    padding: clamp(1.25rem, 3vw, 2.5rem);
    border-left: 1px solid var(--line);
    background: var(--panel);
  }
  .controls > label {
    display: grid;
    gap: 0.65rem;
    margin: 1.5rem 0;
    color: var(--muted);
    font: 700 0.68rem var(--mono);
    text-transform: uppercase;
  }
  .controls label span {
    display: flex;
    justify-content: space-between;
  }
  .controls b {
    color: var(--ink);
  }
  input[type="range"] {
    width: 100%;
    accent-color: var(--amber);
  }
  dl {
    margin: 2.5rem 0 1.5rem;
    border-top: 1px solid var(--line);
  }
  dl div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--line);
  }
  dt {
    color: var(--muted);
    font: 600 0.68rem var(--mono);
    text-transform: uppercase;
  }
  dd {
    margin: 0;
    color: var(--teal);
    font: 700 0.8rem var(--mono);
  }
  .model-note {
    color: var(--muted);
    font-size: 0.8rem;
    line-height: 1.6;
  }
  .plots {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    padding: clamp(1.25rem, 4vw, 4rem);
    background: var(--line);
  }
  .plots :global(figure) {
    padding: 1rem;
    background: var(--night);
  }

  @media (max-width: 58rem) {
    .laboratory {
      grid-template-columns: 1fr;
    }
    .controls {
      border-left: 0;
      border-top: 1px solid var(--line);
    }
    .plots {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 42rem) {
    .site-head span {
      display: none;
    }
    .panel-head,
    .transport,
    .scrubber {
      align-items: stretch;
      flex-direction: column;
    }
    .scrubber {
      margin: 0;
    }
  }
</style>
