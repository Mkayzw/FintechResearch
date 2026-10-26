<script lang="ts">
  import Equation from "$lib/components/Equation.svelte";
  import NumericalAnswer from "./NumericalAnswer.svelte";
  import { reversalEvidence, kinematicsProblems, trolleyReadings, velocityBound, evaluateTrolleyLine, practicalParts } from "./kinematics-depth";

  let mode = $state<"reason" | "solve" | "investigate">("reason");
  let time = $state(6);
  let evidence = $derived(reversalEvidence(time));
  let prediction = $state(-1);
  let predictionChecked = $state(false);
  let selectedProblem = $state(0);
  let problem = $derived(kinematicsProblems[selectedProblem]!);
  let gradient = $state(0.4);
  let intercept = $state(0.7);
  let fit = $derived(evaluateTrolleyLine(gradient, intercept));
  let reflection = $state("");
  let showEvaluation = $state(false);
  const tx = (t: number) => 60 + t * 62.5;
  const vy = (v: number) => 160 - v * 8.5;
  const px = (t: number) => 60 + t * 125;
  const py = (v: number) => 270 - v * 65;
</script>

<section class="workshop" id="kinematics-depth" aria-labelledby="depth-title">
  <header class="workshop-head">
    <p class="eyebrow">Kinematics · Go beneath the equations</p>
    <h3 id="depth-title">Don’t just substitute.<br />Build the argument.</h3>
    <p>Work from a graph to a derivation, solve unfamiliar multi-step problems, then ask whether measurements support the model. There is no automatic mastery score: a correct number is only one part of an explanation.</p>
    <nav aria-label="Kinematics workshop sections">
      <button class:active={mode === "reason"} aria-pressed={mode === "reason"} onclick={() => mode = "reason"}>01 · Reason</button>
      <button class:active={mode === "solve"} aria-pressed={mode === "solve"} onclick={() => mode = "solve"}>02 · Solve & transfer</button>
      <button class:active={mode === "investigate"} aria-pressed={mode === "investigate"} onclick={() => mode = "investigate"}>03 · Investigate</button>
    </nav>
  </header>

  <div class="workshop-body">
    {#if mode === "reason"}
      <article>
        <p class="eyebrow">A worked argument · Right is positive</p>
        <h4>Negative acceleration does not mean “always slowing”.</h4>
        <p>A particle starts with u = +12 m/s at x = 0 and maintains a = −3 m/s². Before looking at the areas, predict its motion after t = 4 s. The applied acceleration continues through the turn.</p>
        <form class="predict" onsubmit={event => { event.preventDefault(); predictionChecked = true; }}>
          <fieldset><legend>What happens just after 4 s?</legend>
            {#each ["It remains at rest because velocity reached zero.", "It moves left and speeds up because velocity and acceleration are both negative.", "It moves left and slows down because acceleration is negative."] as option, i}<label><input type="radio" name="reversal-prediction" checked={prediction === i} onchange={() => { prediction = i; predictionChecked = false; }} />{option}</label>{/each}
          </fieldset><button disabled={prediction < 0}>Test my reasoning</button>
          <p class="feedback" aria-live="polite">{predictionChecked ? prediction === 1 ? "Yes. At 4 s velocity crosses zero; afterward velocity becomes more negative and its magnitude grows. Acceleration never changes sign." : prediction === 0 ? "Reaching zero velocity does not remove acceleration. It stops only for an instant, then reverses." : "Negative acceleration decreases signed velocity. When velocity is already negative, that increases speed rather than reducing it." : "Commit to an explanation before inspecting the graph."}</p>
        </form>

        <div class="evidence">
          <label class="scrub" for="reversal-time">Inspect time <strong>{time.toFixed(1)} s</strong></label>
          <input id="reversal-time" type="range" min="0" max="8" step="0.1" bind:value={time} />
          <svg viewBox="0 0 620 330" role="img" aria-labelledby="reversal-plot-title reversal-plot-desc">
            <title id="reversal-plot-title">Velocity-time graph with signed areas</title>
            <desc id="reversal-plot-desc">Straight line from +12 m/s at zero seconds to −12 m/s at eight seconds, crossing zero at four seconds. At the selected time, forward area is {evidence.forwardMeters.toFixed(2)} m and backward area magnitude is {evidence.backwardMeters.toFixed(2)} m. Displacement is their difference; distance is their sum.</desc>
            <defs><pattern id="negative-area-hatch" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" stroke="var(--coral)" stroke-width="1" /></pattern></defs>
            <path d={`M60,160 L60,${vy(12)} L${tx(Math.min(time, 4))},${vy(12 - 3 * Math.min(time, 4))} L${tx(Math.min(time, 4))},160 Z`} fill="var(--teal)" opacity=".25" />
            {#if time > 4}<path d={`M${tx(4)},160 L${tx(time)},${vy(12 - 3 * time)} L${tx(time)},160 Z`} fill="url(#negative-area-hatch)" />{/if}
            {#each [-12, -6, 0, 6, 12] as v}<line x1="60" x2="560" y1={vy(v)} y2={vy(v)} stroke="var(--line-strong)" stroke-dasharray="3 4" /><text x="48" y={vy(v) + 4} text-anchor="end">{v}</text>{/each}
            <line x1="60" x2="560" y1="160" y2="160" stroke="var(--muted)" />
            <path d={`M60,${vy(12)}L560,${vy(-12)}`} fill="none" stroke="var(--ink)" stroke-width="2.5" />
            <line x1={tx(time)} x2={tx(time)} y1="40" y2="275" stroke="var(--amber)" stroke-dasharray="5 4" />
            <circle cx={tx(time)} cy={vy(evidence.velocityMetersPerSecond)} r="5" fill="var(--amber)" />
            {#each [0, 2, 4, 6, 8] as t}<text x={tx(t)} y="292" text-anchor="middle">{t}</text>{/each}
            <text x="60" y="25">Velocity / m s⁻¹</text><text x="310" y="320" text-anchor="middle">Time / s</text>
          </svg>
          <p class="legend">Solid fill: positive area · hatched fill: negative area · dashed cursor: inspected time</p>
          <dl aria-live="polite"><div><dt>Signed velocity</dt><dd>{evidence.velocityMetersPerSecond.toFixed(2)} m/s</dd></div><div><dt>Displacement = +area − |−area|</dt><dd>{evidence.forwardMeters.toFixed(2)} − {evidence.backwardMeters.toFixed(2)} = {evidence.displacementMeters.toFixed(2)} m</dd></div><div><dt>Distance = +area + |−area|</dt><dd>{evidence.distanceMeters.toFixed(2)} m</dd></div></dl>
          <p>At 4 s the particle is 24 m from its start, instantaneously at rest and still accelerating left. At 8 s it returns to x = 0 after travelling 48 m. Scrub both sides of the turn: position, velocity and accumulated distance are different quantities.</p>
        </div>
      </article>

      <article class="derivation-notebook">
        <p class="eyebrow">Derive · Two routes to the same model</p><h4>Where each equation comes from—and where it stops working.</h4>
        <ol>
          <li><h5>Define the quantities before the symbols</h5><p>Position x locates the particle relative to an origin. Displacement s = x − x₀ is a signed change of position. Velocity is the local gradient of x(t); acceleration is the local gradient of v(t). A negative gradient is not a negative distance.</p><Equation formula={String.raw`v=\frac{dx}{dt},\qquad a=\frac{dv}{dt}`} display /><p>Check dimensions: the gradient of position against time has unit m/s. The area under velocity against time has unit (m/s) × s = m. Units are a useful error detector, not a proof that a model is true.</p></li>
          <li><h5>Constant acceleration makes a straight v–t line</h5><p>If a is constant throughout the chosen interval, its gradient is Δv/Δt. Rearranging gives the endpoint velocity. This relation does not say that the starting velocity is zero.</p><Equation formula={String.raw`a=\frac{v-u}{t}\quad\Longrightarrow\quad v=u+at`} display /></li>
          <li><h5>Accumulate velocity, not acceleration</h5><p>The signed area is a rectangle ut plus a triangular contribution ½(at)t. With negative a, the triangle subtracts from the rectangle. Even if the line crosses zero, signed area still gives displacement; split at the crossing only when calculating distance.</p><Equation formula={String.raw`s=\frac{u+v}{2}t=ut+\frac12at^2`} display /><details><summary>Calculus route: why do initial conditions matter?</summary><Equation formula={String.raw`v(t)=u+\int_0^t a\,d\tau=u+at`} display /><Equation formula={String.raw`x(t)=x_0+\int_0^t (u+a\tau)\,d\tau=x_0+ut+\frac12at^2`} display /><p>Integration accumulates changes, so u and x₀ supply the starting values. Omitting them describes a different motion, not a simpler calculation.</p></details></li>
          <li><h5>Eliminate time without losing the direction</h5><p>Combine the velocity change v − u = at with the area s = ½(u + v)t. Multiplication gives (v − u)(v + u) = 2as. Squaring means the resulting equation alone cannot tell you the sign of v.</p><Equation formula={String.raw`v^2=u^2+2as`} display /><p>For the worked particle at x = 18 m, this gives v² = 36 m²/s². The particle passes that position twice: v = +6 m/s at 2 s and v = −6 m/s at 6 s. Choose the branch using the event, not by always taking a positive square root.</p></li>
          <li><h5>Reject a formula when its assumptions fail</h5><p>Suppose v(t) = kt² with k = 1 m/s³ from 0 to 2 s. The endpoint velocities are 0 and 4 m/s, but the graph is curved: its area is 8/3 m, not the trapezium estimate of 4 m. The endpoint average ½(u + v) is not a general law for changing acceleration.</p><Equation formula={String.raw`s=\int_0^2 kt^2\,dt=\frac83\,\mathrm m\ne\frac{0+4}{2}(2)\,\mathrm m`} display /><p>For piecewise constant acceleration, divide the motion into valid intervals and carry the final position and velocity of one interval into the next. Do not use one SUVAT substitution across a reaction-and-braking event.</p></li>
        </ol>
        <button onclick={() => mode = "solve"}>Use the model on a new problem →</button>
      </article>
    {:else if mode === "solve"}
      <article>
        <p class="eyebrow">Structured reasoning · No invented official marks</p><h4>Same principles. Different decisions.</h4>
        <p>Show your diagram and equations on paper before entering a number. Each part is checked independently. Feedback diagnoses common interpretations; it does not grade your working or reproduce a ZIMSEC mark scheme.</p>
        <label class="problem-label" for="kinematics-problem">Choose a problem</label>
        <select id="kinematics-problem" bind:value={selectedProblem}>{#each kinematicsProblems as item, i}<option value={i}>{item.title}</option>{/each}</select>
        {#key problem.id}
          <div class="problem"><h5>{problem.title}</h5><p>{problem.context}</p><details><summary>Plan a method before calculating</summary><p>{problem.strategy}</p></details>
            {#each problem.parts as part}<NumericalAnswer {part} prefix={problem.id} />{/each}
            <aside class="transfer"><p class="eyebrow">Transfer · Change the situation</p><h5>Can you explain it without a fresh formula hunt?</h5><p>{problem.transfer}</p><details><summary>Compare your argument with a worked explanation</summary><p>{problem.transferSolution}</p></details></aside>
          </div>
        {/key}
        <p class="session-note">Answers are local to this open problem and reset when you switch problems. Nothing is saved or sent to a server.</p>
      </article>
    {:else}
      <article>
        <p class="eyebrow">Practical reasoning · Synthetic training dataset</p><h4>Does a straight line survive the uncertainty?</h4>
        <p>A light-gate trolley investigation is represented by the readings below. They are deliberately constructed teaching data, not measurements from a real school. Treat each velocity as bounded by ±0.03 m/s. Time uncertainty is neglected for this exercise; that assumption must be revisited with real equipment.</p>
        <div class="table-wrap"><table><caption>Velocity readings and residuals from your trial line v = u + at</caption><thead><tr><th>t / s</th><th>v / m s⁻¹</th><th>v − v(line) / m s⁻¹</th></tr></thead><tbody>{#each trolleyReadings as reading, i}<tr><td>{reading.time.toFixed(2)}</td><td>{reading.velocity.toFixed(2)} ± 0.03</td><td>{fit.residuals[i]!.toFixed(3)}</td></tr>{/each}</tbody></table></div>
        <div class="fitting">
          <p>Try a line that passes through all the vertical uncertainty bars. Do not force it through the origin: a nonzero intercept can represent a nonzero starting velocity, not necessarily a faulty instrument.</p>
          <label for="trial-gradient">Trial gradient <strong>{gradient.toFixed(2)} m/s²</strong></label><input id="trial-gradient" type="range" min="0.3" max="0.9" step="0.01" bind:value={gradient} />
          <label for="trial-intercept">Trial intercept <strong>{intercept.toFixed(2)} m/s</strong></label><input id="trial-intercept" type="range" min="0" max="0.8" step="0.01" bind:value={intercept} />
          <svg viewBox="0 0 620 330" role="img" aria-labelledby="trolley-plot-title trolley-plot-desc">
            <title id="trolley-plot-title">Trolley velocity readings with uncertainty bars and a trial straight line</title><desc id="trolley-plot-desc">Five points from 0.41 m/s at 0 s to 2.81 m/s at 4 s. Each vertical bar is ±0.03 m/s. Trial slope is {gradient.toFixed(2)} m/s² and intercept is {intercept.toFixed(2)} m/s. {fit.compatible ? "All bars intersect the trial line." : "At least one bar does not intersect the trial line."}</desc>
            <defs><clipPath id="trolley-clip"><rect x="50" y="40" width="520" height="230" /></clipPath></defs>
            {#each [0, 1, 2, 3] as v}<line x1="60" x2="560" y1={py(v)} y2={py(v)} stroke="var(--line-strong)" stroke-dasharray="3 4" /><text x="48" y={py(v) + 4} text-anchor="end">{v}</text>{/each}
            <line x1="60" x2="560" y1="270" y2="270" stroke="var(--muted)" />
            <g clip-path="url(#trolley-clip)"><path d={`M60,${py(intercept)}L560,${py(intercept + gradient * 4)}`} fill="none" stroke="var(--teal)" stroke-width="2" />
              {#each trolleyReadings as reading}<line x1={px(reading.time)} x2={px(reading.time)} y1={py(reading.velocity + velocityBound)} y2={py(reading.velocity - velocityBound)} stroke="var(--amber)" stroke-width="2" /><path d={`M${px(reading.time) - 6},${py(reading.velocity + velocityBound)}h12 M${px(reading.time) - 6},${py(reading.velocity - velocityBound)}h12`} stroke="var(--amber)" /><circle cx={px(reading.time)} cy={py(reading.velocity)} r="3" fill="var(--ink)" />{/each}
            </g>
            {#each [0, 1, 2, 3, 4] as t}<text x={px(t)} y="292" text-anchor="middle">{t}</text>{/each}<text x="60" y="25">Velocity / m s⁻¹</text><text x="310" y="320" text-anchor="middle">Time / s</text>
          </svg>
          <p class="legend">White dots: synthetic readings · capped bars: bounds · solid teal line: your proposed model</p>
          <p class="fit-status" aria-live="polite">{fit.compatible ? "Compatible with all five bounds. This supports the line for these readings; it does not prove constant acceleration or a unique best fit." : "Not compatible with every stated bound. Compare the signed residuals with ±0.03 m/s and adjust slope and intercept."}</p>
        </div>
        {#each practicalParts as part}<NumericalAnswer {part} prefix="practical" />{/each}
        <aside class="transfer"><p class="eyebrow">Evaluate the evidence, not just the graph</p><h5>A shared offset survives every repeat.</h5><p>Suppose the velocity sensor reads 0.10 m/s too high at every time. What happens to the gradient and intercept? Would repeating each measurement remove that error? Could this small dataset rule out a slowly changing acceleration?</p><label for="practical-reflection">Write an evaluation before comparing (not automatically graded)</label><textarea id="practical-reflection" rows="4" bind:value={reflection} maxlength="2000" placeholder="The gradient would… because…"></textarea><button class="secondary" onclick={() => showEvaluation = !showEvaluation} aria-expanded={showEvaluation}>{showEvaluation ? "Hide evaluation guide" : "Compare with evaluation guide"}</button>
          {#if showEvaluation}<div class="evaluation"><p>A constant +0.10 m/s offset raises the intercept by 0.10 m/s but cancels from Δv, so the gradient is unchanged. Repetition reduces some random scatter, not this shared systematic offset. An independent calibration is needed.</p><p>All five bars admitting a straight line makes constant acceleration compatible with this dataset, not proven. A small curvature can hide within the bounds. Collect more readings over a wider safe interval, inspect residual patterns and quantify timing uncertainty. Do not shrink uncertainty merely to make the model look precise.</p><p>The endpoint estimate uses two readings and a conservative bound. A statistical regression through all readings answers a different question and needs an explicit uncertainty model; do not label this endpoint bound a confidence interval.</p></div>{/if}
        </aside>
        <details class="real-practical"><summary>Plan a real investigation: controls, graph, uncertainty and safety</summary><p>Use a trolley on a shallow fixed ramp, light gates or timestamped video, a ruler and a stop before the track end. Measure the interrupt-card length and use v ≈ length/blocking time: this averages over a finite interval, rather than measuring a perfectly instantaneous speed.</p><p>Control ramp angle, release position and trolley mass. Repeat runs without pushing, record raw timing and length uncertainties, and compare v–t gradients. Inspect residuals rather than joining every point. A nonzero intercept may be initial motion or a timing origin offset; investigate before calling it a calibration fault.</p><p>Secure the ramp, keep the run-out clear, catch the trolley safely and use low-voltage school apparatus. Never use a road vehicle, high drop or improvised high-speed launch to reproduce this exercise.</p></details>
      </article>
    {/if}
    <aside class="sources"><p>Independent science references, not proof of current examinability:</p><a href="https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration" target="_blank" rel="noreferrer">OpenStax · Constant-acceleration models ↗</a><a href="https://openstax.org/books/university-physics-volume-1/pages/3-6-finding-velocity-and-displacement-from-acceleration" target="_blank" rel="noreferrer">OpenStax · Derivatives and integrals ↗</a><a href="https://physics.nist.gov/cuu/Uncertainty/" target="_blank" rel="noreferrer">NIST · Distinguishing uncertainty methods ↗</a><p>Curriculum alignment remains provisional. All problems and training data here are independently authored.</p></aside>
  </div>
</section>

<style>
  .workshop { min-width:0; margin:4rem 0; border:1px solid var(--line-strong); background:var(--night-2); }
  .workshop-head,.workshop-body { padding:clamp(1.25rem,3vw,3rem); }
  .workshop-head { border-bottom:1px solid var(--line-strong); background:linear-gradient(120deg,#142222,var(--night)); }
  .eyebrow { color:var(--teal); font:800 .68rem/1.6 var(--mono); letter-spacing:.1em; text-transform:uppercase; }
  h3 { margin:.5rem 0 1.5rem; font:500 clamp(2rem,4vw,3.5rem)/1.05 var(--serif); letter-spacing:-.03em; }
  h4 { font:500 clamp(1.5rem,3vw,2.4rem)/1.15 var(--serif); margin:.5rem 0 1rem; } h5 { font:600 1.3rem/1.4 var(--serif); margin:1rem 0; }
  p,li { color:#b4bfbc; line-height:1.75; font-size:.95rem; } nav { display:flex; flex-wrap:wrap; gap:.5rem; margin-top:2rem; }
  button { min-height:2.8rem; padding:.8rem 1rem; border:1px solid var(--line-strong); background:var(--night); color:var(--ink); cursor:pointer; font:800 .7rem/1.4 var(--mono); }
  button.active { border-color:var(--teal); background:var(--teal); color:var(--night); } button:hover { border-color:var(--amber); } button:disabled { opacity:.5; cursor:not-allowed; }
  button:focus-visible,select:focus-visible,input:focus-visible,textarea:focus-visible,summary:focus-visible,a:focus-visible { outline:2px solid var(--amber); outline-offset:3px; }
  fieldset { padding:0; margin:1.5rem 0; border:0; } legend { color:var(--ink); font-weight:600; margin-bottom:1rem; } .predict label { display:flex; align-items:baseline; gap:.75rem; border:1px solid var(--line-strong); padding:.8rem; margin:.5rem 0; color:#b4bfbc; font-size:.9rem; line-height:1.5; cursor:pointer; } input[type="radio"] { accent-color:var(--teal); }
  .feedback { padding:.75rem 1rem; border-left:2px solid var(--amber); font-size:.85rem; }
  .evidence,.fitting { padding:clamp(.75rem,2vw,1.5rem); margin:2rem 0; background:var(--night); border:1px solid var(--line); }
  .scrub,.fitting label { display:flex; justify-content:space-between; gap:1rem; flex-wrap:wrap; color:var(--muted); font:700 .75rem/1.6 var(--mono); } strong { color:var(--amber); } input[type="range"] { width:100%; min-height:2.8rem; accent-color:var(--amber); margin:.5rem 0 1rem; }
  svg { width:100%; display:block; } svg text { fill:#b4bfbc; font:11px var(--mono); } .legend { color:var(--muted); font-size:.72rem; line-height:1.6; }
  dl { border-top:1px solid var(--line); margin-top:1.5rem; } dl div { padding:.8rem 0; border-bottom:1px solid var(--line); } dt { color:var(--muted); font-size:.75rem; } dd { margin:.4rem 0 0; color:var(--teal); font:500 1.2rem var(--mono); overflow-wrap:anywhere; }
  .derivation-notebook { margin-top:3rem; } ol { padding-left:1.3rem; } .derivation-notebook li { padding:.5rem 0 1.5rem .5rem; border-bottom:1px solid var(--line); } .derivation-notebook button { margin-top:1.5rem; }
  details { border-top:1px solid var(--line); margin-top:1rem; } summary { padding:.8rem 0; cursor:pointer; color:var(--teal); font-size:.85rem; line-height:1.6; } details p { padding-inline:.5rem; }
  .problem-label { display:block; color:var(--muted); font-size:.85rem; margin-top:2rem; } select { min-height:3rem; width:100%; margin:.75rem 0 1.5rem; background:var(--night); color:var(--ink); border:1px solid var(--line-strong); padding:.5rem; }
  .transfer { padding:clamp(1rem,2vw,2rem); border:1px solid var(--teal); margin-top:2rem; } .session-note { font-size:.75rem; color:var(--muted); }
  .table-wrap { overflow-x:auto; } table { width:100%; border-collapse:collapse; font:500 .8rem/1.5 var(--mono); } caption { text-align:left; color:var(--muted); font-size:.75rem; padding:1rem 0; } td,th { border-bottom:1px solid var(--line-strong); padding:.8rem .5rem; text-align:left; } th { color:var(--amber); font-size:.7rem; }
  .fit-status { border-left:2px solid var(--teal); padding:.75rem 1rem; font-size:.85rem; }
  textarea { display:block; width:100%; margin:1rem 0; resize:vertical; background:var(--night); color:var(--ink); border:1px solid var(--line-strong); font:inherit; padding:.8rem; line-height:1.6; } .transfer label { color:var(--muted); font-size:.85rem; }
  .evaluation { padding-top:1rem; } .sources { border-top:1px solid var(--line-strong); margin-top:3rem; padding-top:1rem; } .sources a { display:block; color:var(--teal); font-size:.75rem; line-height:1.7; margin:.5rem 0; } .sources p { font-size:.75rem; color:var(--muted); }
  @media(max-width:36rem) { nav { display:grid; grid-template-columns:1fr; } .workshop-body { padding:1rem; } th,td { font-size:.65rem; padding:.6rem .3rem; } dd { font-size:1rem; } }
</style>
