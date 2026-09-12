<script lang="ts">
  import { onMount } from "svelte";
  import type { PendulumParameters } from "@strange-loops/contracts";
  import type { FrameSample } from "../simulation/types";

  let {
    sample,
    parameters,
    trails = true,
  }: {
    sample: FrameSample;
    parameters: PendulumParameters;
    trails?: boolean;
  } = $props();

  let canvas: HTMLCanvasElement;
  let width = $state(800);
  let height = $state(620);
  let trailA: Array<[number, number]> = [];
  let trailB: Array<[number, number]> = [];
  let lastTime = -1;

  function bobPositions(state: FrameSample["primary"]) {
    const scale =
      Math.min(width, height) /
      (2.7 * (parameters.length1 + parameters.length2));
    const pivotX = width / 2;
    const pivotY = height * 0.34;
    const x1 = pivotX + Math.sin(state.theta1) * parameters.length1 * scale;
    const y1 = pivotY + Math.cos(state.theta1) * parameters.length1 * scale;
    const x2 = x1 + Math.sin(state.theta2) * parameters.length2 * scale;
    const y2 = y1 + Math.cos(state.theta2) * parameters.length2 * scale;
    return { pivotX, pivotY, x1, y1, x2, y2 };
  }

  function drawPendulum(
    context: CanvasRenderingContext2D,
    state: FrameSample["primary"],
    color: string,
    dashed: boolean,
  ) {
    const p = bobPositions(state);
    context.save();
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 3;
    context.setLineDash(dashed ? [8, 7] : []);
    context.beginPath();
    context.moveTo(p.pivotX, p.pivotY);
    context.lineTo(p.x1, p.y1);
    context.lineTo(p.x2, p.y2);
    context.stroke();
    context.setLineDash([]);
    context.beginPath();
    context.arc(p.x1, p.y1, 9, 0, Math.PI * 2);
    context.arc(p.x2, p.y2, 13, 0, Math.PI * 2);
    context.fill();
    context.restore();
    return [p.x2, p.y2] as [number, number];
  }

  function draw() {
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    context.clearRect(0, 0, width, height);

    const glow = context.createRadialGradient(
      width / 2,
      height * 0.34,
      0,
      width / 2,
      height * 0.34,
      width * 0.55,
    );
    glow.addColorStop(0, "rgba(40, 97, 88, 0.24)");
    glow.addColorStop(1, "rgba(9, 11, 15, 0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, width, height);

    const pointA = bobPositions(sample.primary);
    const pointB = bobPositions(sample.twin);
    if (sample.time < lastTime) {
      trailA = [];
      trailB = [];
    }
    if (sample.time !== lastTime) {
      trailA.push([pointA.x2, pointA.y2]);
      trailB.push([pointB.x2, pointB.y2]);
      trailA = trailA.slice(-240);
      trailB = trailB.slice(-240);
      lastTime = sample.time;
    }

    if (trails) {
      for (const [points, color] of [
        [trailA, "#f4b84a"],
        [trailB, "#7be0d0"],
      ] as const) {
        context.beginPath();
        points.forEach(([x, y], index) =>
          index === 0 ? context.moveTo(x, y) : context.lineTo(x, y),
        );
        context.strokeStyle = color + "55";
        context.lineWidth = 1.5;
        context.stroke();
      }
    }

    drawPendulum(context, sample.twin, "#7be0d0", true);
    drawPendulum(context, sample.primary, "#f4b84a", false);
    context.fillStyle = "#e8e6df";
    context.beginPath();
    context.arc(width / 2, height * 0.34, 5, 0, Math.PI * 2);
    context.fill();
  }

  $effect(() => {
    sample;
    parameters;
    trails;
    if (typeof window !== "undefined") requestAnimationFrame(draw);
  });

  onMount(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      width = Math.max(280, Math.floor(entry.contentRect.width));
      height = Math.max(
        400,
        Math.min(660, Math.floor(entry.contentRect.height || 620)),
      );
      draw();
    });
    observer.observe(canvas.parentElement!);
    return () => observer.disconnect();
  });
</script>

<div class="stage">
  <canvas
    bind:this={canvas}
    aria-label={`Double pendulum at ${sample.time.toFixed(2)} seconds. Solid amber trajectory and dashed teal trajectory have state separation ${sample.separation.toExponential(2)}.`}
  ></canvas>
  <div class="legend" aria-hidden="true">
    <span><i class="primary"></i>System A</span>
    <span><i class="twin"></i>System B</span>
  </div>
</div>

<style>
  .stage {
    position: relative;
    min-height: 32rem;
    height: min(68vh, 42rem);
    overflow: hidden;
  }
  canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
  .legend {
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    display: flex;
    gap: 1rem;
    color: var(--muted);
    font: 600 0.7rem/1 var(--mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .legend span {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }
  i {
    display: inline-block;
    width: 1.5rem;
    border-top: 2px solid;
  }
  .primary {
    border-color: var(--amber);
  }
  .twin {
    border-color: var(--teal);
    border-top-style: dashed;
  }
</style>
