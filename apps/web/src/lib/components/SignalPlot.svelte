<script lang="ts">
  import type { FrameSample } from "../simulation/types";

  let {
    history,
    metric,
    label,
    color = "var(--teal)",
  }: {
    history: FrameSample[];
    metric: "separation" | "energy" | "phase";
    label: string;
    color?: string;
  } = $props();

  const width = 600;
  const height = 180;
  const padding = 18;

  let points = $derived.by(() => {
    if (history.length < 2) return "";
    const values = history.map((sample) => {
      if (metric === "separation")
        return Math.log10(Math.max(sample.separation, 1e-12));
      if (metric === "energy") return sample.energyError * 100;
      return sample.primary.omega1;
    });
    const xs =
      metric === "phase"
        ? history.map((sample) => sample.primary.theta1)
        : history.map((sample) => sample.time);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...values);
    const maxY = Math.max(...values);
    return history
      .map((_, index) => {
        const x =
          padding +
          ((xs[index]! - minX) / (maxX - minX || 1)) * (width - padding * 2);
        const y =
          height -
          padding -
          ((values[index]! - minY) / (maxY - minY || 1)) *
            (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  });

  let currentValue = $derived.by(() => {
    const latest = history.at(-1);
    if (!latest) return "—";
    if (metric === "separation") return latest.separation.toExponential(2);
    if (metric === "energy") return `${(latest.energyError * 100).toFixed(3)}%`;
    return `${latest.primary.theta1.toFixed(2)}, ${latest.primary.omega1.toFixed(2)}`;
  });
</script>

<figure>
  <figcaption>
    <span>{label}</span>
    <strong>{currentValue}</strong>
  </figcaption>
  <svg
    viewBox={`0 0 ${width} ${height}`}
    role="img"
    aria-label={`${label}. Current value ${currentValue}.`}
    preserveAspectRatio="none"
  >
    <line
      x1={padding}
      y1={height - padding}
      x2={width - padding}
      y2={height - padding}
    ></line>
    <line x1={padding} y1={padding} x2={padding} y2={height - padding}></line>
    {#if points}
      <polyline {points} style={`stroke: ${color}`}></polyline>
    {/if}
  </svg>
</figure>

<style>
  figure {
    margin: 0;
    min-width: 0;
  }
  figcaption {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;
    color: var(--muted);
    font: 600 0.68rem/1.2 var(--mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  strong {
    color: var(--ink);
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
  }
  svg {
    width: 100%;
    height: 7.5rem;
    overflow: visible;
  }
  line {
    stroke: var(--line);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }
  polyline {
    fill: none;
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
</style>
