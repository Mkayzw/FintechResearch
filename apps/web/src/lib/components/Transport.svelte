<script lang="ts">
  let {
    playing,
    time,
    speed,
    onToggle,
    onReset,
    onStep,
    onSpeed,
  }: {
    playing: boolean;
    time: number;
    speed: number;
    onToggle: () => void;
    onReset: () => void;
    onStep: () => void;
    onSpeed: (speed: number) => void;
  } = $props();
</script>

<div class="transport" aria-label="Simulation controls">
  <button
    class="play"
    onclick={onToggle}
    aria-label={playing ? "Pause simulation" : "Play simulation"}
  >
    {playing ? "Ⅱ" : "▶"} <span>{playing ? "Pause" : "Release"}</span>
  </button>
  <button onclick={onStep} disabled={playing}>Step</button>
  <button onclick={onReset}>Reset</button>
  <span class="time">t = {time.toFixed(2)} s</span>
  <label>
    <span>Speed</span>
    <select
      value={speed}
      onchange={(event) => onSpeed(Number(event.currentTarget.value))}
    >
      <option value={0.25}>0.25×</option>
      <option value={0.5}>0.5×</option>
      <option value={1}>1×</option>
      <option value={2}>2×</option>
    </select>
  </label>
</div>

<style>
  .transport {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    padding: 0.75rem;
    border: 1px solid var(--line);
    background: rgba(12, 15, 19, 0.88);
    backdrop-filter: blur(14px);
  }
  button,
  select {
    min-height: 2.7rem;
    border: 1px solid var(--line-strong);
    background: transparent;
    color: var(--ink);
    padding: 0 0.9rem;
    font: 700 0.72rem/1 var(--mono);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
  }
  button:hover,
  select:hover {
    border-color: var(--amber);
  }
  button:focus-visible,
  select:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 3px;
  }
  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .play {
    background: var(--amber);
    color: var(--night);
    border-color: var(--amber);
    min-width: 7.5rem;
  }
  .time {
    margin-left: auto;
    color: var(--teal);
    font: 600 0.8rem/1 var(--mono);
  }
  label {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--muted);
    font: 600 0.65rem/1 var(--mono);
    text-transform: uppercase;
  }
  @media (max-width: 38rem) {
    .time {
      order: -1;
      width: 100%;
      margin: 0 0 0.25rem;
    }
    .play span {
      display: none;
    }
    .play {
      min-width: 3rem;
    }
  }
</style>
