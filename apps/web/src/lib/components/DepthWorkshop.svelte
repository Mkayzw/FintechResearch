<script lang="ts">
  import { untrack } from "svelte";
  import Equation from "$lib/components/Equation.svelte";
  import NumericalAnswer from "../features/mechanics/NumericalAnswer.svelte";
  import { evaluateDepthLine, type DepthChapter } from "./depth";

  let { chapter, comparison }: { chapter: DepthChapter; comparison?: { caption: string; columns: string[]; rows: string[][]; takeaway: string } } = $props();
  let mode = $state<"reason" | "solve" | "investigate">("reason");
  let prediction = $state(-1);
  let predictionChecked = $state(false);
  let selectedProblem = $state(0);
  let problem = $derived(chapter.problems[selectedProblem]!);
  let investigation = $derived(chapter.investigation);
  // Each host keys this component by chapter so local state resets on navigation.
  let gradient = $state(untrack(() => chapter.investigation.gradient.initial));
  let intercept = $state(untrack(() => chapter.investigation.intercept.initial));
  let fit = $derived(evaluateDepthLine(investigation, gradient, intercept));
  let reflection = $state("");
  let showEvaluation = $state(false);
  let xMax = $derived(Math.max(...investigation.readings.map(row => row.x)) * 1.06);
  let yMin = $derived(Math.min(0, ...investigation.readings.map(row => row.y - investigation.bound)));
  let yTop = $derived(Math.max(0, ...investigation.readings.map(row => row.y + investigation.bound)));
  let yMax = $derived(yTop + (yTop - yMin) * 0.1);
  const format = (value: number) => Number(value.toPrecision(5)).toString();
  const px = (x: number) => 65 + x / xMax * 500;
  const py = (y: number) => 285 - (y - yMin) / (yMax - yMin) * 235;
</script>

<section class="workshop" id={`${chapter.id}-depth`} aria-labelledby={`${chapter.id}-depth-title`}>
  <header class="workshop-head">
    <p class="eyebrow">{chapter.id} · A deeper study</p>
    <h3 id={`${chapter.id}-depth-title`}>{chapter.title}</h3>
    <p>{chapter.introduction}</p>
    <nav aria-label={`${chapter.id} workshop sections`}>
      <button class:active={mode === "reason"} aria-pressed={mode === "reason"} onclick={() => mode = "reason"}>01 · Reason</button>
      <button class:active={mode === "solve"} aria-pressed={mode === "solve"} onclick={() => mode = "solve"}>02 · Solve & transfer</button>
      <button class:active={mode === "investigate"} aria-pressed={mode === "investigate"} onclick={() => mode = "investigate"}>03 · Investigate</button>
    </nav>
  </header>

  <div class="workshop-body">
    {#if mode === "reason"}
      <article>
        <p class="eyebrow">Predict · Choose the system and defend the model</p>
        <h4>Make the argument before the calculation.</h4>
        <form class="predict" onsubmit={event => { event.preventDefault(); predictionChecked = true; }}>
          <fieldset>
            <legend>{chapter.prediction.prompt}</legend>
            {#each chapter.prediction.options as option, index}
              <label><input type="radio" name={`${chapter.id}-prediction`} checked={prediction === index} onchange={() => { prediction = index; predictionChecked = false; }} />{option}</label>
            {/each}
          </fieldset>
          <button disabled={prediction < 0}>Test my reasoning</button>
          <p class="feedback" aria-live="polite">{predictionChecked ? `${prediction === chapter.prediction.answer ? "Consistent reasoning." : "Revisit the physical interpretation."} ${chapter.prediction.explanation}` : "Commit to a prediction. Then inspect the derivation and justify what changes—and what does not."}</p>
        </form>
        {#if comparison}
        <details class="model-evidence">
          <summary>Inspect calculated evidence—not measured data</summary>
          <!-- svelte-ignore a11y_no_noninteractive_tabindex (A scroll region needs keyboard focus to expose all table columns.) -->
          <div class="table-wrap" tabindex="0" role="region" aria-label="Model comparison table">
            <table><caption>{comparison.caption}</caption><thead><tr>{#each comparison.columns as heading}<th scope="col">{heading}</th>{/each}</tr></thead><tbody>{#each comparison.rows as row}<tr>{#each row as value}<td>{value}</td>{/each}</tr>{/each}</tbody></table>
          </div>
          <p>{comparison.takeaway}</p>
          <p>Use the existing laboratory above to explore further. These fixed comparisons state their own conditions; do not mix their values with a different laboratory setting.</p>
        </details>
        {/if}
      </article>

      <article class="notebook">
        <p class="eyebrow">Derive · Interpret · Find the boundary</p>
        <h4>Each equation needs a reason to apply.</h4>
        <ol>{#each chapter.derivations as step}<li><h5>{step.title}</h5><p>{step.explanation}</p><Equation formula={step.formula} display /><p class="interpretation">{step.interpretation}</p></li>{/each}</ol>
        <button onclick={() => mode = "solve"}>Test the argument on an unfamiliar problem →</button>
      </article>
    {:else if mode === "solve"}
      <article>
        <p class="eyebrow">Structured reasoning · Independent steps</p>
        <h4>Draw the system. Choose the principle. Interpret the answer.</h4>
        <p>Show working on paper before entering numbers. Parts are checked independently, so feedback does not grade your derivation or award official marks. The transfer question changes the conditions: explain why the original method does or does not survive.</p>
        <label for={`${chapter.id}-problem`}>Choose a problem</label>
        <select id={`${chapter.id}-problem`} bind:value={selectedProblem}>{#each chapter.problems as item, index}<option value={index}>{item.title}</option>{/each}</select>
        {#key problem.id}
          <div class="problem"><h5>{problem.title}</h5><p>{problem.context}</p>
            <details><summary>Plan a method before calculating</summary><p>{problem.strategy}</p></details>
            {#each problem.parts as part}<NumericalAnswer {part} prefix={`${chapter.id}-${problem.id}`} />{/each}
            <aside class="transfer"><p class="eyebrow">Transfer · Change one condition</p><h5>Can you defend a different outcome?</h5><p>{problem.transfer}</p><details><summary>Compare with a worked argument</summary><p>{problem.transferSolution}</p></details></aside>
          </div>
        {/key}
      </article>
    {:else}
      <article>
        <p class="eyebrow">Practical reasoning · Synthetic training data</p>
        <h4>{investigation.title}</h4>
        <p>{investigation.context}</p>
        <Equation formula={investigation.equation} display />
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (A scroll region needs keyboard focus to expose all table columns.) -->
        <div class="table-wrap" tabindex="0" role="region" aria-label="Investigation readings and residuals">
          <table><caption>Synthetic readings: vertical bound ±{investigation.bound}. Residual = reading − proposed line. Values shown to five significant figures; compatibility uses unrounded values.</caption><thead><tr><th scope="col">{investigation.xLabel}</th><th scope="col">{investigation.yLabel}</th><th scope="col">Residual (same y units)</th></tr></thead><tbody>{#each investigation.readings as reading, index}<tr><td>{format(reading.x)}</td><td>{format(reading.y)} ± {investigation.bound}</td><td>{format(fit.residuals[index]!)}</td></tr>{/each}</tbody></table>
        </div>
        <div class="fitting">
          <p>Fit a line through every vertical bound, not only the endpoints. Use the residual column to inspect differences too small to see at this plot scale.</p>
          <label for={`${chapter.id}-gradient`}>Trial gradient <strong>{format(gradient)} {investigation.gradient.unit}</strong></label>
          <input id={`${chapter.id}-gradient`} type="range" min={investigation.gradient.min} max={investigation.gradient.max} step={investigation.gradient.step} bind:value={gradient} />
          <label for={`${chapter.id}-intercept`}>Trial intercept <strong>{format(intercept)} {investigation.intercept.unit}</strong></label>
          <input id={`${chapter.id}-intercept`} type="range" min={investigation.intercept.min} max={investigation.intercept.max} step={investigation.intercept.step} bind:value={intercept} />
          <p class="legend">Scroll the plot horizontally if needed; focus it and use the arrow keys. Exact values are in the readings table.</p>
          <!-- svelte-ignore a11y_no_noninteractive_tabindex (The full-size plot needs a keyboard-scrollable region on narrow screens.) -->
          <div class="table-wrap" tabindex="0" role="region" aria-label="Investigation plot: scroll horizontally if needed">
          <svg viewBox="0 0 640 360" role="img" aria-labelledby={`${chapter.id}-plot-title ${chapter.id}-plot-desc`}>
            <title id={`${chapter.id}-plot-title`}>{investigation.yLabel} against {investigation.xLabel}</title>
            <desc id={`${chapter.id}-plot-desc`}>Synthetic points with vertical bounds ±{investigation.bound}. Proposed gradient {format(gradient)}, intercept {format(intercept)}. {fit.compatible ? "All readings admit the line." : "At least one reading rejects the line under the stated bounds."} Readings and residuals are in the table.</desc>
            <defs><clipPath id={`${chapter.id}-plot-clip`}><rect x="55" y="40" width="520" height="250" /></clipPath></defs>
            {#each [0, 0.25, 0.5, 0.75, 1] as fraction}
              {@const y = yMin + fraction * (yMax - yMin)}
              <line x1="65" x2="565" y1={py(y)} y2={py(y)} stroke="var(--line-strong)" stroke-dasharray="3 4" />
              <text x="53" y={py(y) + 4} text-anchor="end">{y.toPrecision(3)}</text>
              <text x={px(fraction * xMax)} y="310" text-anchor="middle">{(fraction * xMax).toPrecision(3)}</text>
            {/each}
            <line x1="65" x2="565" y1={py(0)} y2={py(0)} stroke="var(--muted)" />
            <g clip-path={`url(#${chapter.id}-plot-clip)`}>
              <path d={`M${px(0)},${py(intercept)}L${px(xMax)},${py(gradient * xMax + intercept)}`} fill="none" stroke="var(--teal)" stroke-width="2" />
              {#each investigation.readings as reading}
                <line x1={px(reading.x)} x2={px(reading.x)} y1={py(reading.y + investigation.bound)} y2={py(reading.y - investigation.bound)} stroke="var(--amber)" stroke-width="2" />
                <path d={`M${px(reading.x) - 6},${py(reading.y + investigation.bound)}h12 M${px(reading.x) - 6},${py(reading.y - investigation.bound)}h12`} stroke="var(--amber)" />
                <circle cx={px(reading.x)} cy={py(reading.y)} r="3" fill="var(--ink)" />
              {/each}
            </g>
            <text x="65" y="25">{investigation.yLabel}</text><text x="315" y="345" text-anchor="middle">{investigation.xLabel}</text>
          </svg>
          </div>
          <p class="legend">White dots: synthetic readings · capped bars: stated bounds · teal: proposed line</p>
          <p class="fit-status" aria-live="polite">{fit.compatible ? "Compatible with every stated bound. This does not establish a unique best fit or prove the physical law." : "Not compatible with every stated bound. Inspect residuals, then adjust gradient and intercept."}</p>
          <p>{investigation.interpretation}</p>
        </div>
        {#each investigation.parts as part}<NumericalAnswer {part} prefix={`${chapter.id}-practical`} />{/each}
        <aside class="transfer">
          <p class="eyebrow">Evaluate · Make a causal argument</p><h5>What would change your conclusion?</h5><p>{investigation.evaluation.prompt}</p>
          <label for={`${chapter.id}-reflection`}>Your evaluation (not automatically graded)</label><textarea id={`${chapter.id}-reflection`} rows="4" maxlength="2000" bind:value={reflection}></textarea>
          <button onclick={() => showEvaluation = !showEvaluation} aria-expanded={showEvaluation}>{showEvaluation ? "Hide evaluation guide" : "Compare with evaluation guide"}</button>
          {#if showEvaluation}<div class="evaluation">{#each investigation.evaluation.guide as paragraph}<p>{paragraph}</p>{/each}</div>{/if}
        </aside>
        <details><summary>Plan a real investigation: controls, uncertainty and safety</summary>{#each investigation.plan as paragraph}<p>{paragraph}</p>{/each}</details>
      </article>
    {/if}
    <p class="session-note">Answers reset when leaving a section, changing problems or selecting another chapter. Nothing is saved or sent to a server. Numerical feedback does not assess written reasoning or establish mastery.</p>
    <aside class="sources"><p>Science references—not proof of current examinability. All exercises and training datasets are independently authored; ZIMSEC alignment remains provisional.</p>{#each chapter.sources as source}<a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>{/each}</aside>
  </div>
</section>

<style>
  .workshop { min-width:0; margin:4rem 0; border:1px solid var(--line-strong); background:var(--night-2); }
  .workshop-head,.workshop-body { padding:clamp(1.25rem,3vw,3rem); }
  .workshop-head { background:linear-gradient(120deg,#142222,var(--night)); border-bottom:1px solid var(--line-strong); }
  .eyebrow { color:var(--teal); font:800 .68rem/1.6 var(--mono); letter-spacing:.1em; text-transform:uppercase; }
  h3 { margin:.5rem 0 1.5rem; font:500 clamp(2rem,4vw,3.5rem)/1.05 var(--serif); letter-spacing:-.03em; }
  h4 { font:500 clamp(1.5rem,3vw,2.4rem)/1.15 var(--serif); margin:.5rem 0 1rem; }
  h5 { font:600 1.3rem/1.4 var(--serif); margin:1rem 0; }
  p,li { color:#b4bfbc; line-height:1.75; font-size:.95rem; }
  nav { display:flex; flex-wrap:wrap; gap:.5rem; margin-top:2rem; }
  button { min-height:2.8rem; padding:.8rem 1rem; border:1px solid var(--line-strong); background:var(--night); color:var(--ink); cursor:pointer; font:800 .7rem/1.4 var(--mono); }
  button.active { border-color:var(--teal); background:var(--teal); color:var(--night); }
  button:hover { border-color:var(--amber); } button:disabled { opacity:.5; cursor:not-allowed; }
  button:focus-visible,select:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible,a:focus-visible,.table-wrap:focus-visible { outline:2px solid var(--amber); outline-offset:3px; }
  fieldset { padding:0; margin:1.5rem 0; border:0; }
  legend { color:var(--ink); font-weight:600; margin-bottom:1rem; line-height:1.7; }
  .predict label { display:flex; align-items:baseline; gap:.75rem; border:1px solid var(--line-strong); padding:.8rem; margin:.5rem 0; color:#b4bfbc; font-size:.9rem; line-height:1.5; cursor:pointer; }
  input[type="radio"] { accent-color:var(--teal); }
  .feedback,.interpretation,.fit-status { padding:.75rem 1rem; border-left:2px solid var(--teal); font-size:.85rem; }
  .notebook { margin-top:3rem; } ol { padding-left:1.3rem; } .notebook li { padding:.5rem 0 1.5rem .5rem; border-bottom:1px solid var(--line); } .notebook button { margin-top:1.5rem; }
  details { border-top:1px solid var(--line); margin-top:1rem; } summary { padding:.8rem 0; cursor:pointer; color:var(--teal); font-size:.85rem; line-height:1.6; } details p { padding-inline:.5rem; }
  select { min-height:3rem; width:100%; margin:.75rem 0 1.5rem; background:var(--night); color:var(--ink); border:1px solid var(--line-strong); padding:.5rem; }
  article > label { display:block; color:var(--muted); font-size:.85rem; margin-top:2rem; }
  .transfer { padding:clamp(1rem,2vw,2rem); border:1px solid var(--teal); margin:2rem 0; }
  .table-wrap { max-width:100%; overflow-x:auto; }
  table { width:100%; border-collapse:collapse; font:500 .8rem/1.5 var(--mono); }
  caption { text-align:left; color:var(--muted); font-size:.75rem; padding:1rem 0; }
  td,th { border-bottom:1px solid var(--line-strong); padding:.8rem .5rem; text-align:left; } th { color:var(--amber); font-size:.7rem; min-width:5rem; }
  .fitting { padding:clamp(.75rem,2vw,1.5rem); margin:2rem 0; border:1px solid var(--line); background:var(--night); }
  .fitting label { display:flex; flex-wrap:wrap; justify-content:space-between; gap:.5rem; font:700 .75rem/1.6 var(--mono); color:var(--muted); } strong { color:var(--amber); }
  input[type="range"] { width:100%; min-height:2.8rem; accent-color:var(--amber); margin:.5rem 0 1rem; }
  svg { width:100%; min-width:640px; display:block; } svg text { fill:#b4bfbc; font:11px var(--mono); } .legend { color:var(--muted); font-size:.72rem; }
  textarea { display:block; width:100%; margin:1rem 0; resize:vertical; background:var(--night); color:var(--ink); border:1px solid var(--line-strong); font:inherit; padding:.8rem; line-height:1.6; }
  .transfer label { color:var(--muted); font-size:.85rem; }
  .sources { border-top:1px solid var(--line-strong); margin-top:2rem; padding-top:1rem; }
  .sources a { display:block; color:var(--teal); font-size:.75rem; line-height:1.7; margin:.5rem 0; }
  .sources p,.session-note { font-size:.75rem; color:var(--muted); }
  @media(max-width:36rem) { nav { display:grid; grid-template-columns:1fr; } .workshop-body { padding:1rem; } th,td { font-size:.65rem; padding:.6rem .3rem; } }
</style>
