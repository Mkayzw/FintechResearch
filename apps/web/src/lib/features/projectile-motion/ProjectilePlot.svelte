<script lang="ts">
  import type { TrajectorySample } from "@strange-loops/physics";

  let {
    samples,
    quantity,
    label,
    currentTime,
  }: {
    samples: TrajectorySample[];
    quantity: "height" | "velocity" | "energy";
    label: string;
    currentTime: number;
  } = $props();
  const width = 520;
  const height = 180;
  const pad = 18;
  let values = $derived(
    samples.map((sample) => {
      if (quantity === "height") return sample.state.positionMeters.y;
      if (quantity === "velocity")
        return sample.state.velocityMetersPerSecond.y;
      const speed2 =
        sample.state.velocityMetersPerSecond.x ** 2 +
        sample.state.velocityMetersPerSecond.y ** 2;
      return 0.5 * speed2 + 9.81 * sample.state.positionMeters.y;
    }),
  );
  let points = $derived.by(() => {
    if (samples.length < 2) return "";
    const maxT = samples.at(-1)?.timeSeconds ?? 1;
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const effectivelyConstant = Math.abs(rawMax - rawMin) < 1e-9;
    const valuePadding = effectivelyConstant
      ? Math.max(1, Math.abs(rawMax) * 0.01)
      : 0;
    const minV = effectivelyConstant ? rawMin - valuePadding : rawMin;
    const maxV = effectivelyConstant ? rawMax + valuePadding : rawMax;
    return samples
      .map((sample, index) => {
        const x = pad + (sample.timeSeconds / maxT) * (width - 2 * pad);
        const y =
          height -
          pad -
          ((values[index]! - minV) / (maxV - minV || 1)) * (height - 2 * pad);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  });
  let currentValue = $derived.by(() => {
    if (samples.length === 0) return 0;
    const nextIndex = samples.findIndex(
      (sample) => sample.timeSeconds >= currentTime,
    );
    if (nextIndex < 0) return values.at(-1) ?? 0;
    if (nextIndex === 0) return values[0] ?? 0;
    const previous = samples[nextIndex - 1]!;
    const next = samples[nextIndex]!;
    const fraction =
      (currentTime - previous.timeSeconds) /
      (next.timeSeconds - previous.timeSeconds);
    return (
      values[nextIndex - 1]! +
      fraction * (values[nextIndex]! - values[nextIndex - 1]!)
    );
  });
  let markerX = $derived.by(() => {
    const maxT = samples.at(-1)?.timeSeconds ?? 1;
    return pad + (Math.min(currentTime, maxT) / maxT) * (width - 2 * pad);
  });
</script>

<figure>
  <figcaption>
    {label}<strong>{currentValue.toFixed(2)}</strong>
  </figcaption>
  <svg
    viewBox={`0 0 ${width} ${height}`}
    role="img"
    aria-label={`${label} against time`}
    preserveAspectRatio="none"
  >
    <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} />
    <line x1={pad} y1={pad} x2={pad} y2={height - pad} />
    <polyline {points} />
    <line class="marker" x1={markerX} y1={pad} x2={markerX} y2={height - pad} />
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
    color: var(--muted);
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  strong {
    color: var(--ink);
  }
  svg {
    width: 100%;
    height: 8rem;
  }
  line {
    stroke: var(--line);
    vector-effect: non-scaling-stroke;
  }
  line.marker {
    stroke: var(--teal);
    stroke-dasharray: 3 3;
  }
  polyline {
    fill: none;
    stroke: var(--amber);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }
</style>
