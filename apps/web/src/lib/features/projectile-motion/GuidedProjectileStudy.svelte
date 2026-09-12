<script lang="ts">
  import Equation from "$lib/components/Equation.svelte";

  const stages = [
    {
      title: "The launch",
      question: "Where will it land?",
      body: "Set a prediction marker before release. A useful model begins with a falsifiable prediction, not a curve fitted after the event.",
      formula: String.raw`\mathbf v_0 = v_0(\cos\theta\,\hat{\mathbf i}+\sin\theta\,\hat{\mathbf j})`,
    },
    {
      title: "Resolve the vector",
      question: "What does the angle control?",
      body: "The launch speed is one vector with independent horizontal and vertical components. Changing the angle redistributes the same speed between them.",
      formula: String.raw`v_{0x}=v_0\cos\theta,\qquad v_{0y}=v_0\sin\theta`,
    },
    {
      title: "Two clocks, one path",
      question: "Why is the path curved?",
      body: "Horizontal motion is uniform in the vacuum model while gravity changes the vertical velocity. Both coordinates are evaluated at the same time.",
      formula: String.raw`x=x_0+v_{0x}t,\qquad y=y_0+v_{0y}t-\tfrac12gt^2`,
    },
    {
      title: "Read the apex",
      question: "Does the projectile stop?",
      body: "At the apex, vertical velocity is zero. Horizontal velocity remains, so the total velocity is not zero unless the launch has no horizontal component.",
      formula: String.raw`v_y=v_{0y}-gt=0,\qquad v_x=v_{0x}`,
    },
    {
      title: "Beyond 45°",
      question: "When is 45° best?",
      body: "Only equal launch and landing heights in vacuum give the familiar 45° optimum. Elevation and drag shift the best angle lower.",
      formula: String.raw`R=\frac{v_0^2\sin 2\theta}{g}\quad(y_0=y_g,\ \text{vacuum})`,
    },
    {
      title: "Air changes the answer",
      question: "Why is there no simple parabola?",
      body: "Quadratic drag opposes velocity relative to the air. Its direction and magnitude change continuously, so the teal path is integrated numerically.",
      formula: String.raw`\dot{\mathbf v}=\begin{bmatrix}0\\-g\end{bmatrix}-\frac{\rho C_DA}{2m}\lVert\mathbf v_r\rVert\mathbf v_r`,
    },
    {
      title: "Measure like a physicist",
      question: "How certain is the launch speed?",
      body: "Measured range, time and height each carry uncertainty. Report an interval supported by the measurements, not more digits than the apparatus justifies.",
      formula: String.raw`v_{0x}=\frac{R}{T},\qquad v_{0y}=\frac{gT}{2}-\frac{h}{T}`,
    },
    {
      title: "Exam bench",
      question: "Can the model support an argument?",
      body: "State the assumptions, select equations from the coordinate model, substitute with units, and interpret whether the answer is physically plausible.",
      formula: String.raw`\text{model}\rightarrow\text{equation}\rightarrow\text{substitution}\rightarrow\text{interpretation}`,
    },
    {
      title: "Open range",
      question: "What will you investigate next?",
      body: "Change one variable at a time, export the trajectory, and share the exact initial conditions so another student can reproduce the result.",
      formula: String.raw`\text{claim}+\text{method}+\text{evidence}+\text{limitations}`,
    },
  ] as const;

  let active = $state(0);

  function move(event: KeyboardEvent, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    active =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? stages.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + stages.length) %
            stages.length;
    document.getElementById(`study-stage-${active}`)?.focus();
  }
</script>

<section class="study" aria-labelledby="study-title">
  <header>
    <p>Guided investigation</p>
    <h2 id="study-title">Nine stops from launch to evidence.</h2>
  </header>
  <div class="stage-tabs" role="tablist" aria-label="Projectile study stages">
    {#each stages as stage, index}
      <button
        id={`study-stage-${index}`}
        role="tab"
        aria-selected={active === index}
        aria-controls="study-panel"
        tabindex={active === index ? 0 : -1}
        class:active={active === index}
        onclick={() => (active = index)}
        onkeydown={(event) => move(event, index)}
      >
        <span>{String(index + 1).padStart(2, "0")}</span>{stage.title}
      </button>
    {/each}
  </div>
  <div
    class="stage-panel"
    id="study-panel"
    role="tabpanel"
    aria-labelledby={`study-stage-${active}`}
  >
    <div>
      <p>Stage {active + 1} / {stages.length}</p>
      <h3>{stages[active]!.question}</h3>
      <p>{stages[active]!.body}</p>
    </div>
    <Equation formula={stages[active]!.formula} display />
  </div>
</section>

<style>
  .study {
    padding: clamp(4rem, 8vw, 8rem) clamp(1.25rem, 6vw, 7rem);
  }
  header {
    max-width: 54rem;
    margin-bottom: 2.5rem;
  }
  header p,
  .stage-panel > div > p:first-child {
    color: var(--amber);
    font: 800 0.65rem var(--mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  h2 {
    margin: 0;
    font: 600 clamp(2.5rem, 6vw, 5rem) / 0.95 var(--serif);
    letter-spacing: -0.04em;
  }
  .stage-tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    border: 1px solid var(--line);
    background: var(--line);
  }
  button {
    min-height: 4.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.8rem;
    border: 0;
    background: var(--night-2);
    color: var(--muted);
    text-align: left;
    cursor: pointer;
  }
  button span {
    color: var(--amber);
    font: 700 0.62rem var(--mono);
  }
  button.active {
    background: var(--amber);
    color: var(--night);
  }
  button.active span {
    color: var(--night);
  }
  button:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: -4px;
  }
  .stage-panel {
    min-height: 18rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 6vw, 6rem);
    align-items: center;
    padding: clamp(2rem, 5vw, 5rem);
    border: 1px solid var(--line);
    border-top: 0;
    background: var(--panel);
  }
  h3 {
    margin: 0 0 1rem;
    font: 600 clamp(2rem, 4vw, 3.5rem) var(--serif);
  }
  .stage-panel p:last-child {
    color: #adb8b5;
    line-height: 1.7;
  }
  .stage-panel :global(.katex-display) {
    margin: 0;
  }
  @media (max-width: 48rem) {
    .stage-tabs {
      grid-template-columns: 1fr 1fr;
    }
    .stage-panel {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 32rem) {
    .stage-tabs {
      grid-template-columns: 1fr;
    }
  }
</style>
