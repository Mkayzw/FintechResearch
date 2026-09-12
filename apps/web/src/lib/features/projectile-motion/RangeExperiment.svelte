<script lang="ts">
  import { buildRangeCurve } from "./projectile-study";

  let { speed, height }: { speed: number; height: number } = $props();
  const width = 820;
  const chartHeight = 360;
  const pad = { left: 54, right: 24, top: 28, bottom: 46 };
  let points = $derived(buildRangeCurve({ speed, height, gravity: 9.81 }));
  let maximumRange = $derived(
    Math.max(...points.map((point) => point.vacuumRange)),
  );
  const x = (angle: number) =>
    pad.left + ((angle - 5) / 80) * (width - pad.left - pad.right);
  const y = (range: number) =>
    chartHeight -
    pad.bottom -
    (range / maximumRange) * (chartHeight - pad.top - pad.bottom);
  let vacuumPath = $derived(
    points
      .map((point) => `${x(point.angleDegrees)},${y(point.vacuumRange)}`)
      .join(" "),
  );
  let dragPath = $derived(
    points
      .map((point) => `${x(point.angleDegrees)},${y(point.dragRange)}`)
      .join(" "),
  );
  let vacuumOptimum = $derived(
    points.reduce((best, point) =>
      point.vacuumRange > best.vacuumRange ? point : best,
    ),
  );
  let dragOptimum = $derived(
    points.reduce((best, point) =>
      point.dragRange > best.dragRange ? point : best,
    ),
  );
</script>

<section class="experiment" aria-labelledby="range-title">
  <header>
    <div>
      <p>Range experiment</p>
      <h2 id="range-title">The optimum moves.</h2>
    </div>
    <p>
      Current launch: {speed.toFixed(0)} m/s from {height.toFixed(1)} m. Change those
      values in the laboratory above and this evidence updates.
    </p>
  </header>
  <div class="chart-shell">
    <svg
      viewBox={`0 0 ${width} ${chartHeight}`}
      role="img"
      aria-labelledby="range-chart-title range-chart-desc"
    >
      <title id="range-chart-title">Range against launch angle</title>
      <desc id="range-chart-desc"
        >Vacuum range peaks at {vacuumOptimum.angleDegrees} degrees. Quadratic-drag
        range peaks at {dragOptimum.angleDegrees} degrees.</desc
      >
      <line
        class="axis"
        x1={pad.left}
        y1={chartHeight - pad.bottom}
        x2={width - pad.right}
        y2={chartHeight - pad.bottom}
      />
      <line
        class="axis"
        x1={pad.left}
        y1={pad.top}
        x2={pad.left}
        y2={chartHeight - pad.bottom}
      />
      <polyline class="vacuum" points={vacuumPath} />
      <polyline class="drag" points={dragPath} />
      <circle
        class="vacuum-dot"
        cx={x(vacuumOptimum.angleDegrees)}
        cy={y(vacuumOptimum.vacuumRange)}
        r="7"
      />
      <circle
        class="drag-dot"
        cx={x(dragOptimum.angleDegrees)}
        cy={y(dragOptimum.dragRange)}
        r="7"
      />
      <text x={width - pad.right} y={chartHeight - 12} text-anchor="end"
        >launch angle / degrees</text
      >
      <text x="16" y={pad.top} transform={`rotate(-90 16 ${pad.top})`}
        >range / m</text
      >
    </svg>
    <dl>
      <div>
        <dt>Vacuum optimum</dt>
        <dd>
          {vacuumOptimum.angleDegrees}° · {vacuumOptimum.vacuumRange.toFixed(1)}
          m
        </dd>
      </div>
      <div>
        <dt>Drag optimum</dt>
        <dd>
          {dragOptimum.angleDegrees}° · {dragOptimum.dragRange.toFixed(1)} m
        </dd>
      </div>
      <div>
        <dt>45° rule</dt>
        <dd>
          {height === 0 ? "Exact only for vacuum" : "Broken by launch height"}
        </dd>
      </div>
    </dl>
  </div>
</section>

<style>
  .experiment {
    padding: clamp(4rem, 8vw, 8rem) clamp(1.25rem, 6vw, 7rem);
    background: var(--night-2);
  }
  header {
    display: grid;
    grid-template-columns: 1fr minmax(18rem, 0.55fr);
    gap: 2rem;
    align-items: end;
    margin-bottom: 2.5rem;
  }
  header p:first-child {
    color: var(--teal);
    font: 800 0.65rem var(--mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  header > p {
    color: var(--muted);
    line-height: 1.6;
  }
  h2 {
    margin: 0;
    font: 600 clamp(2.5rem, 6vw, 5rem) / 0.95 var(--serif);
  }
  .chart-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 22rem);
    border: 1px solid var(--line);
    background: var(--night);
  }
  svg {
    width: 100%;
    min-height: 22rem;
  }
  .axis {
    stroke: var(--line-strong);
  }
  polyline {
    fill: none;
    stroke-width: 3;
    vector-effect: non-scaling-stroke;
  }
  .vacuum {
    stroke: var(--amber);
  }
  .drag {
    stroke: var(--teal);
    stroke-dasharray: 8 7;
  }
  .vacuum-dot {
    fill: var(--amber);
  }
  .drag-dot {
    fill: var(--night);
    stroke: var(--teal);
    stroke-width: 3;
  }
  text {
    fill: var(--muted);
    font: 600 11px var(--mono);
  }
  dl {
    margin: 0;
    padding: 1.5rem;
    border-left: 1px solid var(--line);
  }
  dl div {
    padding: 1rem 0;
    border-bottom: 1px solid var(--line);
  }
  dt {
    color: var(--muted);
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  dd {
    margin: 0.4rem 0 0;
    color: var(--ink);
    font: 600 1rem var(--mono);
  }
  @media (max-width: 48rem) {
    header,
    .chart-shell {
      grid-template-columns: 1fr;
    }
    dl {
      border-left: 0;
      border-top: 1px solid var(--line);
    }
  }
</style>
