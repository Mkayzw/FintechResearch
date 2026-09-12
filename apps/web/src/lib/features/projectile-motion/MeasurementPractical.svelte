<script lang="ts">
  import { estimateLaunchFromMeasurements } from "./projectile-study";

  let range = $state(20);
  let rangeUncertainty = $state(0.2);
  let flightTime = $state(2);
  let timeUncertainty = $state(0.05);
  let height = $state(0);
  let heightUncertainty = $state(0.05);
  let trials = $state([
    { range: 19.8, time: 2.02 },
    { range: 20.1, time: 1.98 },
    { range: 20, time: 2.01 },
  ]);

  let calculation = $derived.by(() => {
    try {
      return {
        estimate: estimateLaunchFromMeasurements({
          rangeMeters: range,
          rangeUncertaintyMeters: rangeUncertainty,
          flightTimeSeconds: flightTime,
          timeUncertaintySeconds: timeUncertainty,
          launchHeightMeters: height,
          heightUncertaintyMeters: heightUncertainty,
          gravityMetersPerSecondSquared: 9.81,
        }),
        error: "",
      };
    } catch (error) {
      return {
        estimate: undefined,
        error:
          error instanceof Error
            ? error.message
            : "Enter valid measurement values.",
      };
    }
  });
  let meanRange = $derived(
    trials.reduce((sum, trial) => sum + trial.range, 0) / trials.length,
  );
  let meanTime = $derived(
    trials.reduce((sum, trial) => sum + trial.time, 0) / trials.length,
  );

  function useMeans() {
    range = Number(meanRange.toFixed(2));
    flightTime = Number(meanTime.toFixed(2));
  }
</script>

<section class="practical" aria-labelledby="practical-title">
  <header>
    <p>Practical investigation</p>
    <h2 id="practical-title">Measure what the apparatus can defend.</h2>
    <p>
      Estimate the launch velocity from horizontal range and flight time. Enter
      instrument uncertainties as absolute ± values; the result is shown as a
      conservative interval from the measurement bounds.
    </p>
  </header>

  <div class="workspace">
    <form onsubmit={(event) => event.preventDefault()}>
      <fieldset>
        <legend>Measured quantities</legend>
        <label
          >Range, R / m<input
            type="number"
            min="0.01"
            step="0.01"
            bind:value={range}
          /></label
        >
        <label
          >Range uncertainty, ±m<input
            type="number"
            min="0"
            step="0.01"
            bind:value={rangeUncertainty}
          /></label
        >
        <label
          >Flight time, T / s<input
            type="number"
            min="0.01"
            step="0.01"
            bind:value={flightTime}
          /></label
        >
        <label
          >Time uncertainty, ±s<input
            type="number"
            min="0"
            max={flightTime - 0.01}
            step="0.01"
            bind:value={timeUncertainty}
          /></label
        >
        <label
          >Launch height, h / m<input
            type="number"
            min="0"
            step="0.01"
            bind:value={height}
          /></label
        >
        <label
          >Height uncertainty, ±m<input
            type="number"
            min="0"
            step="0.01"
            bind:value={heightUncertainty}
          /></label
        >
      </fieldset>
    </form>

    <div class="result" aria-live="polite">
      <p>Estimated launch</p>
      {#if calculation.estimate}
        <strong
          >{calculation.estimate.speedMetersPerSecond.toFixed(2)} m/s</strong
        >
        <span>
          supported interval {calculation.estimate.minimumSpeedMetersPerSecond.toFixed(
            2,
          )}–{calculation.estimate.maximumSpeedMetersPerSecond.toFixed(2)} m/s
        </span>
        <dl>
          <div>
            <dt>Horizontal component</dt>
            <dd>
              {calculation.estimate.horizontalVelocityMetersPerSecond.toFixed(
                2,
              )} m/s
            </dd>
          </div>
          <div>
            <dt>Vertical component</dt>
            <dd>
              {calculation.estimate.verticalVelocityMetersPerSecond.toFixed(2)} m/s
            </dd>
          </div>
          <div>
            <dt>Launch angle</dt>
            <dd>{calculation.estimate.angleDegrees.toFixed(1)}°</dd>
          </div>
        </dl>
      {:else}
        <strong class="invalid">Check values</strong>
        <span>{calculation.error}</span>
      {/if}
    </div>
  </div>

  <div class="trials">
    <div class="table-head">
      <div>
        <p>Repeat measurements</p>
        <h3>Three trials reduce random error.</h3>
      </div>
      <button type="button" onclick={useMeans}>Use means in calculator</button>
    </div>
    <div class="table-scroll">
      <table>
        <caption class="sr-only"
          >Editable projectile range and flight-time trials</caption
        >
        <thead
          ><tr
            ><th>Trial</th><th>Range / m</th><th>Flight time / s</th><th
              >R/T / m s⁻¹</th
            ></tr
          ></thead
        >
        <tbody>
          {#each trials as trial, index}
            <tr>
              <th scope="row">{index + 1}</th>
              <td
                ><input
                  aria-label={`Trial ${index + 1} range in metres`}
                  type="number"
                  min="0.01"
                  step="0.01"
                  bind:value={trial.range}
                /></td
              >
              <td
                ><input
                  aria-label={`Trial ${index + 1} flight time in seconds`}
                  type="number"
                  min="0.01"
                  step="0.01"
                  bind:value={trial.time}
                /></td
              >
              <td>{(trial.range / trial.time).toFixed(2)}</td>
            </tr>
          {/each}
        </tbody>
        <tfoot
          ><tr
            ><th scope="row">Mean</th><td>{meanRange.toFixed(2)}</td><td
              >{meanTime.toFixed(2)}</td
            ><td>{(meanRange / meanTime).toFixed(2)}</td></tr
          ></tfoot
        >
      </table>
    </div>
  </div>
</section>

<style>
  .practical {
    min-width: 0;
    padding: clamp(4rem, 8vw, 8rem) clamp(1.25rem, 6vw, 7rem);
  }
  header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem 4rem;
    margin-bottom: 2.5rem;
  }
  header > p:first-child,
  .result > p,
  .table-head p {
    grid-column: 1 / -1;
    margin: 0;
    color: var(--coral);
    font: 800 0.65rem var(--mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  h2 {
    margin: 0;
    font: 600 clamp(2.5rem, 6vw, 5rem) / 0.95 var(--serif);
    letter-spacing: -0.04em;
  }
  header > p:last-child {
    color: var(--muted);
    line-height: 1.7;
  }
  .workspace {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border: 1px solid var(--line);
  }
  form,
  .result {
    padding: clamp(1.5rem, 4vw, 3rem);
  }
  fieldset {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 0;
    padding: 0;
    border: 0;
  }
  legend {
    grid-column: 1 / -1;
    margin-bottom: 1rem;
    font: 600 1.3rem var(--serif);
  }
  label {
    display: grid;
    gap: 0.4rem;
    color: var(--muted);
    font: 700 0.63rem var(--mono);
    text-transform: uppercase;
  }
  input {
    min-width: 0;
    min-height: 2.6rem;
    padding: 0 0.6rem;
    border: 1px solid var(--line-strong);
    background: var(--night);
    color: var(--ink);
    font: 500 0.85rem var(--mono);
  }
  input:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 2px;
  }
  .result {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: 1px solid var(--line);
    background: var(--panel);
  }
  .result strong {
    margin: 0.7rem 0 0.25rem;
    color: var(--teal);
    font: 600 clamp(3rem, 7vw, 6rem) / 1 var(--serif);
  }
  .result strong.invalid {
    color: var(--coral);
    font-size: clamp(2rem, 5vw, 4rem);
  }
  .result > span {
    color: var(--muted);
    font: 600 0.75rem var(--mono);
  }
  dl {
    margin: 2rem 0 0;
  }
  dl div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
    border-top: 1px solid var(--line);
  }
  dt,
  dd {
    font: 600 0.7rem var(--mono);
  }
  dt {
    color: var(--muted);
    text-transform: uppercase;
  }
  dd {
    margin: 0;
  }
  .trials {
    min-width: 0;
    margin-top: 2rem;
    border: 1px solid var(--line);
  }
  .table-head {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: end;
    padding: 1.25rem;
  }
  h3 {
    margin: 0.35rem 0 0;
    font: 600 1.6rem var(--serif);
  }
  button {
    min-height: 2.7rem;
    padding: 0 0.9rem;
    border: 1px solid var(--coral);
    background: transparent;
    color: var(--ink);
    font: 700 0.65rem var(--mono);
    text-transform: uppercase;
    cursor: pointer;
  }
  .table-scroll {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 0.8rem 1rem;
    border-top: 1px solid var(--line);
    text-align: right;
    font: 600 0.75rem var(--mono);
  }
  th:first-child {
    text-align: left;
  }
  thead th {
    color: var(--muted);
    text-transform: uppercase;
  }
  td input {
    width: 8rem;
    text-align: right;
  }
  @media (max-width: 50rem) {
    header,
    .workspace {
      grid-template-columns: 1fr;
    }
    .result {
      border-left: 0;
      border-top: 1px solid var(--line);
    }
  }
  @media (max-width: 34rem) {
    fieldset {
      grid-template-columns: 1fr;
    }
    .table-head {
      align-items: stretch;
      flex-direction: column;
    }
  }
</style>
