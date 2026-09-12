<script lang="ts">
  let {
    label,
    unit,
    min,
    max,
    step,
    value = $bindable(),
  }: {
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    value: number;
  } = $props();
</script>

<label>
  <span>{label} <b>{value.toFixed(step < 1 ? 1 : 0)} {unit}</b></span>
  <input type="range" {min} {max} {step} bind:value />
</label>

<style>
  label {
    display: grid;
    gap: 0.6rem;
    margin: 0 0 1.35rem;
    color: var(--muted);
    font: 700 0.65rem var(--mono);
    text-transform: uppercase;
  }
  span {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  b {
    color: var(--ink);
  }
  input {
    width: 100%;
    accent-color: var(--amber);
  }
  input:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 3px;
  }
</style>
