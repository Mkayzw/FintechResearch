<script lang="ts">
  import type {
    ProjectileState,
    TrajectorySample,
  } from "@strange-loops/physics";

  let {
    vacuum,
    drag,
    currentVacuum,
    currentDrag,
    launchHeight,
    showVectors,
    predictedRange,
  }: {
    vacuum: TrajectorySample[];
    drag: TrajectorySample[];
    currentVacuum: ProjectileState;
    currentDrag: ProjectileState;
    launchHeight: number;
    showVectors: boolean;
    predictedRange: number;
  } = $props();

  const width = 900;
  const height = 500;
  const padding = { left: 58, right: 34, top: 36, bottom: 48 };

  let maximumX = $derived(
    Math.max(
      10,
      ...vacuum.map((sample) => sample.state.positionMeters.x),
      predictedRange * 1.08,
    ),
  );
  let maximumY = $derived(
    Math.max(
      5,
      launchHeight,
      ...vacuum.map((sample) => sample.state.positionMeters.y),
    ) * 1.18,
  );
  const sx = (x: number) =>
    padding.left + (x / maximumX) * (width - padding.left - padding.right);
  const sy = (y: number) =>
    height -
    padding.bottom -
    (y / maximumY) * (height - padding.top - padding.bottom);
  let vacuumPoints = $derived(
    vacuum
      .map(
        (sample) =>
          `${sx(sample.state.positionMeters.x).toFixed(1)},${sy(sample.state.positionMeters.y).toFixed(1)}`,
      )
      .join(" "),
  );
  let dragPoints = $derived(
    drag
      .map(
        (sample) =>
          `${sx(sample.state.positionMeters.x).toFixed(1)},${sy(sample.state.positionMeters.y).toFixed(1)}`,
      )
      .join(" "),
  );

  function vectorEnd(
    state: ProjectileState,
    component: "velocity" | "acceleration",
  ) {
    const scale = component === "velocity" ? 2.2 : 7;
    const vector =
      component === "velocity"
        ? state.velocityMetersPerSecond
        : { x: 0, y: -9.81 };
    return {
      x: sx(state.positionMeters.x) + vector.x * scale,
      y: sy(state.positionMeters.y) - vector.y * scale,
    };
  }
</script>

<figure>
  <svg
    viewBox={`0 0 ${width} ${height}`}
    role="img"
    aria-labelledby="stage-title stage-description"
  >
    <title id="stage-title">Projectile trajectory comparison</title>
    <desc id="stage-description">
      Solid amber vacuum trajectory and dashed teal quadratic-drag trajectory.
      Current vacuum position is {currentVacuum.positionMeters.x.toFixed(1)} metres
      horizontally and {currentVacuum.positionMeters.y.toFixed(1)} metres vertically.
    </desc>
    <defs>
      <marker
        id="arrow-amber"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--amber)" />
      </marker>
      <marker
        id="arrow-coral"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--coral)" />
      </marker>
      <pattern id="grid" width="45" height="45" patternUnits="userSpaceOnUse">
        <path
          d="M 45 0 L 0 0 0 45"
          fill="none"
          stroke="var(--line)"
          stroke-width="1"
        />
      </pattern>
    </defs>
    <rect {width} {height} fill="url(#grid)" opacity=".55" />
    <line
      x1={padding.left}
      y1={height - padding.bottom}
      x2={width - padding.right}
      y2={height - padding.bottom}
      class="axis"
    />
    <line
      x1={padding.left}
      y1={padding.top}
      x2={padding.left}
      y2={height - padding.bottom}
      class="axis"
    />
    <text x={width - padding.right} y={height - 16} text-anchor="end"
      >x / m</text
    >
    <text x="18" y={padding.top} transform={`rotate(-90 18 ${padding.top})`}
      >y / m</text
    >
    {#if predictedRange > 0}
      <line
        class="prediction"
        x1={sx(predictedRange)}
        y1={height - padding.bottom - 12}
        x2={sx(predictedRange)}
        y2={height - padding.bottom + 12}
      />
      <text
        class="prediction-label"
        x={sx(predictedRange)}
        y={height - padding.bottom + 30}
        text-anchor="middle">prediction</text
      >
    {/if}
    <polyline points={vacuumPoints} class="vacuum" />
    <polyline points={dragPoints} class="drag" />
    <circle
      cx={sx(currentVacuum.positionMeters.x)}
      cy={sy(currentVacuum.positionMeters.y)}
      r="9"
      class="ball vacuum-ball"
    />
    <circle
      cx={sx(currentDrag.positionMeters.x)}
      cy={sy(currentDrag.positionMeters.y)}
      r="7"
      class="ball drag-ball"
    />
    {#if showVectors}
      {@const velocityEnd = vectorEnd(currentVacuum, "velocity")}
      {@const accelerationEnd = vectorEnd(currentVacuum, "acceleration")}
      <line
        class="velocity-vector"
        x1={sx(currentVacuum.positionMeters.x)}
        y1={sy(currentVacuum.positionMeters.y)}
        x2={velocityEnd.x}
        y2={velocityEnd.y}
        marker-end="url(#arrow-amber)"
      />
      <line
        class="acceleration-vector"
        x1={sx(currentVacuum.positionMeters.x)}
        y1={sy(currentVacuum.positionMeters.y)}
        x2={accelerationEnd.x}
        y2={accelerationEnd.y}
        marker-end="url(#arrow-coral)"
      />
    {/if}
  </svg>
  <figcaption>
    <span><i class="solid"></i> Vacuum / analytic</span>
    <span><i class="dashed"></i> Air drag / RK4</span>
    <span><b></b> Your prediction</span>
  </figcaption>
</figure>

<style>
  figure {
    margin: 0;
    min-width: 0;
  }
  svg {
    width: 100%;
    height: auto;
    min-height: 24rem;
    display: block;
    background: #090d11;
  }
  .axis {
    stroke: var(--line-strong);
    stroke-width: 1.5;
  }
  text {
    fill: var(--muted);
    font: 600 11px var(--mono);
  }
  polyline {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
  .vacuum {
    stroke: var(--amber);
    stroke-width: 3;
  }
  .drag {
    stroke: var(--teal);
    stroke-width: 2.5;
    stroke-dasharray: 9 7;
  }
  .ball {
    vector-effect: non-scaling-stroke;
  }
  .vacuum-ball {
    fill: var(--amber);
    filter: drop-shadow(0 0 10px rgba(244, 184, 74, 0.6));
  }
  .drag-ball {
    fill: var(--night);
    stroke: var(--teal);
    stroke-width: 3;
  }
  .velocity-vector,
  .acceleration-vector {
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }
  .velocity-vector {
    stroke: var(--amber);
  }
  .acceleration-vector {
    stroke: var(--coral);
  }
  .prediction {
    stroke: #f0ede5;
    stroke-width: 2;
  }
  .prediction-label {
    fill: #f0ede5;
  }
  figcaption {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 0.8rem 0;
    color: var(--muted);
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  figcaption span {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  i {
    width: 1.6rem;
    border-top: 2px solid;
  }
  .solid {
    border-color: var(--amber);
  }
  .dashed {
    border-color: var(--teal);
    border-top-style: dashed;
  }
  b {
    width: 0.7rem;
    height: 0.7rem;
    border: 1px solid var(--ink);
  }

  @media (max-width: 42rem) {
    svg {
      min-height: 17rem;
    }
  }
</style>
