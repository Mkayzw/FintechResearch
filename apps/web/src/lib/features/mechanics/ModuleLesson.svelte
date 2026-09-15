<script lang="ts">
  import Equation from "$lib/components/Equation.svelte";
  import MechanicsLab from "./MechanicsLab.svelte";
  import type { MechanicsModule } from "./mechanics-content";

  let {
    module,
    active,
    answer = $bindable(),
    checked = $bindable(),
  }: {
    module: MechanicsModule;
    active: MechanicsModule["id"];
    answer: number;
    checked: boolean;
  } = $props();
</script>

<section class="lesson" aria-labelledby="module-title">
  <header class="lesson-head">
    <div>
      <p class="eyebrow">Core heading {module.number} · Provisional</p>
      <h2 id="module-title" tabindex="-1">{module.title}</h2>
      <p class="thesis">{module.thesis}</p>
    </div>
    <div class="brief">
      <span>Syllabus target</span>
      <p>{module.objective}</p>
      <div class="conditions">
        {#each module.conditions as condition}<small>{condition}</small>{/each}
      </div>
    </div>
  </header>

  <article class="phenomenon">
    <div>
      <span>Observe</span>
      <h3>{module.phenomenon}</h3>
    </div>
    <aside>
      <span>Predict before touching the controls</span>
      <p>{module.prediction}</p>
    </aside>
  </article>

  <MechanicsLab {active} />

  <section class="equation-register" aria-labelledby="equation-register-title">
    <header>
      <span>Core equation register</span>
      <h3 id="equation-register-title">
        Know the relation—and its conditions.
      </h3>
    </header>
    <div>
      {#each module.equations as formula}<Equation {formula} display />{/each}
    </div>
  </section>

  <section class="explanation" aria-labelledby="explain-title">
    <header>
      <span>Explain the model</span>
      <h3 id="explain-title">Diagram → equation → physical meaning.</h3>
    </header>
    <ol>
      {#each module.derivation as step, index}
        <li>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h4>{step.label}</h4>
            <p>{step.explanation}</p>
          </div>
          <Equation formula={step.formula} display />
        </li>
      {/each}
    </ol>
  </section>

  <div class="study-spread">
    <article class="worked">
      <span>Worked example · Paper 2 discipline</span>
      <h3>Given. Find. Model. Interpret.</h3>
      <dl>
        <div>
          <dt>Given</dt>
          <dd>{module.workedExample.given}</dd>
        </div>
        <div>
          <dt>Find</dt>
          <dd>{module.workedExample.find}</dd>
        </div>
      </dl>
      <ol>
        {#each module.workedExample.method as line}<li>{line}</li>{/each}
      </ol>
      <p class="conclusion">{module.workedExample.conclusion}</p>
    </article>

    <article class="practical">
      <span>Practical dossier · Paper 4</span>
      <h3>Turn the relationship into evidence.</h3>
      <dl>
        <div>
          <dt>Apparatus</dt>
          <dd>{module.practicalPlan.apparatus}</dd>
        </div>
        <div>
          <dt>Variables</dt>
          <dd>{module.practicalPlan.variables}</dd>
        </div>
        <div>
          <dt>Graph</dt>
          <dd>{module.practicalPlan.graph}</dd>
        </div>
        <div>
          <dt>Evaluation</dt>
          <dd>{module.practicalPlan.evaluation}</dd>
        </div>
      </dl>
    </article>
  </div>

  <section class="clinic" aria-labelledby="clinic-title">
    <form
      onsubmit={(event) => {
        event.preventDefault();
        checked = true;
      }}
    >
      <span>Misconception clinic · Paper 1</span>
      <h3 id="clinic-title">{module.question.prompt}</h3>
      {#each module.question.options as option, index}
        <label class:chosen={answer === index}>
          <input
            type="radio"
            name={`question-${active}`}
            value={index}
            checked={answer === index}
            onchange={() => {
              answer = index;
              checked = false;
            }}
          />
          <b>{String.fromCharCode(65 + index)}</b>{option}
        </label>
      {/each}
      <button disabled={answer < 0}>Check reasoning</button>
      <p
        class:correct={checked && answer === module.question.answer}
        class:incorrect={checked && answer !== module.question.answer}
        class="feedback"
        aria-live="polite"
      >
        {checked
          ? `${answer === module.question.answer ? "Correct. " : "Reconsider. "}${module.question.explanation}`
          : "Choose an answer, then defend it with the diagram or an equation."}
      </p>
    </form>
    <article>
      <span>Structured / free response</span>
      <h3>{module.examPrompt}</h3>
      <div class="answer-frame">
        <p><b>Model</b> Define the system, axes and assumptions.</p>
        <p><b>Equation</b> Write the relation before substituting.</p>
        <p><b>Working</b> Retain signs and SI units.</p>
        <p><b>Interpret</b> State direction and physical plausibility.</p>
      </div>
    </article>
  </section>

  <aside class="misconception">
    <span>Do not carry this error forward</span>
    <p>{module.misconception}</p>
  </aside>
</section>

<style>
  .lesson {
    min-width: 0;
  }
  .eyebrow,
  .lesson article > span,
  .lesson section > header > span,
  .clinic span,
  .misconception span {
    margin: 0 0 0.65rem;
    color: var(--amber);
    font: 800 0.72rem var(--mono);
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }
  .lesson-head {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr);
    gap: clamp(2rem, 7vw, 7rem);
    align-items: end;
    margin-bottom: 3rem;
  }
  .lesson-head h2 {
    margin: 0.35rem 0;
    font: 600 clamp(3.4rem, 7vw, 7rem) / 0.88 var(--serif);
    letter-spacing: -0.055em;
  }
  .thesis {
    max-width: 15ch;
    margin: 1rem 0 0;
    color: var(--teal);
    font: 500 clamp(1.2rem, 2.2vw, 1.75rem) / 1.35 var(--serif);
  }
  .brief {
    padding: 1.25rem 0;
    border-block: 1px solid var(--line);
  }
  .brief > span {
    color: var(--muted);
    font: 800 0.72rem var(--mono);
    text-transform: uppercase;
  }
  .brief p {
    color: #b4bfbc;
    line-height: 1.7;
  }
  .conditions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .conditions small {
    padding: 0.45rem 0.65rem;
    border: 1px solid var(--line-strong);
    color: var(--muted);
    font: 700 0.68rem var(--mono);
    text-transform: uppercase;
  }
  .phenomenon {
    display: grid;
    grid-template-columns: 1.35fr 0.65fr;
    gap: 1px;
    margin-bottom: 1px;
    background: var(--line);
    border: 1px solid var(--line);
  }
  .phenomenon > div,
  .phenomenon aside {
    padding: clamp(1.5rem, 4vw, 3.5rem);
    background: var(--night-2);
  }
  .phenomenon h3 {
    max-width: 24ch;
    margin: 1.5rem 0 0;
    font: 600 clamp(1.8rem, 3.5vw, 3.2rem) / 1.05 var(--serif);
  }
  .phenomenon aside {
    border-top: 3px solid var(--teal);
  }
  .phenomenon aside span {
    color: var(--teal);
    font: 800 0.72rem var(--mono);
    text-transform: uppercase;
  }
  .phenomenon aside p {
    color: #b4bfbc;
    line-height: 1.7;
  }
  .equation-register {
    display: grid;
    grid-template-columns: minmax(14rem, 0.65fr) minmax(0, 1.35fr);
    gap: 2rem;
    align-items: center;
    margin-top: 1px;
    padding: clamp(1.5rem, 4vw, 3rem);
    border: 1px solid var(--line);
    background: var(--panel);
  }
  .equation-register h3 {
    margin: 0.5rem 0;
    font: 600 clamp(1.5rem, 3vw, 2.4rem) / 1.05 var(--serif);
  }
  .equation-register > div {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    background: var(--line);
  }
  .equation-register > div :global(.equation) {
    min-width: 0;
    padding: 1rem;
    background: var(--night);
  }
  .equation-register :global(.katex-display) {
    margin: 0;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .explanation {
    margin-top: clamp(4rem, 8vw, 8rem);
  }
  .explanation > header {
    max-width: 48rem;
    margin-bottom: 2rem;
  }
  .explanation h3,
  .study-spread h3,
  .clinic h3 {
    margin: 0.5rem 0;
    font: 600 clamp(1.8rem, 3.5vw, 3rem) / 1.05 var(--serif);
  }
  .explanation > ol {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--line);
  }
  .explanation > ol > li {
    display: grid;
    grid-template-columns: 3rem minmax(0, 1fr) minmax(18rem, 0.9fr);
    gap: 1.5rem;
    align-items: center;
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--line);
  }
  .explanation li > span {
    color: var(--amber);
    font: 800 0.72rem var(--mono);
  }
  .explanation h4 {
    margin: 0;
    font: 600 1.35rem var(--serif);
  }
  .explanation p {
    margin: 0.35rem 0 0;
    color: var(--muted);
    line-height: 1.6;
  }
  .explanation :global(.katex-display) {
    margin: 0;
    text-align: left;
  }
  .study-spread {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    margin-top: clamp(4rem, 8vw, 8rem);
    background: var(--line);
    border: 1px solid var(--line);
  }
  .worked,
  .practical {
    padding: clamp(1.5rem, 4vw, 3.5rem);
    background: var(--night-2);
  }
  .worked dl,
  .practical dl {
    margin: 2rem 0;
  }
  .worked dl div,
  .practical dl div {
    display: grid;
    grid-template-columns: 7rem 1fr;
    gap: 1rem;
    padding: 0.8rem 0;
    border-top: 1px solid var(--line);
  }
  dt {
    color: var(--muted);
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
  }
  dd {
    margin: 0;
    color: #b4bfbc;
    line-height: 1.55;
  }
  .worked ol {
    padding-left: 1.3rem;
  }
  .worked li {
    margin: 0.8rem 0;
    color: #b4bfbc;
    line-height: 1.6;
  }
  .conclusion {
    padding: 1rem;
    border-left: 3px solid var(--teal);
    background: var(--night);
    color: var(--ink);
    line-height: 1.6;
  }
  .practical {
    background: #e8e2d6;
    color: #111417;
  }
  .practical > span {
    color: #745014 !important;
  }
  .practical dd {
    color: #454c49;
  }
  .practical dt {
    color: #745014;
  }
  .practical dl div {
    border-color: #aaa69d;
  }
  .clinic {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    margin-top: clamp(4rem, 8vw, 8rem);
    background: var(--line);
    border: 1px solid var(--line);
  }
  .clinic form,
  .clinic > article {
    padding: clamp(1.5rem, 4vw, 3.5rem);
    background: var(--night);
  }
  .clinic > article {
    background: var(--night-2);
  }
  .clinic label {
    min-height: 3.25rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.8rem;
    border: 1px solid var(--line);
    color: var(--muted);
    cursor: pointer;
  }
  .clinic label + label {
    border-top: 0;
  }
  .clinic label.chosen {
    border-color: var(--teal);
    color: var(--ink);
  }
  .clinic label b {
    width: 1.5rem;
    color: var(--amber);
    font: 800 0.75rem var(--mono);
  }
  .clinic input {
    accent-color: var(--teal);
  }
  .clinic button {
    min-height: 3rem;
    margin-top: 1.25rem;
    padding: 0 1rem;
    border: 0;
    background: var(--amber);
    color: var(--night);
    font: 800 0.72rem var(--mono);
    text-transform: uppercase;
    cursor: pointer;
  }
  .clinic button:disabled {
    opacity: 0.4;
  }
  .clinic button:focus-visible,
  .clinic input:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: 3px;
  }
  .feedback {
    min-height: 3.5rem;
    padding: 0.8rem;
    border-left: 3px solid var(--line-strong);
    color: var(--muted);
    line-height: 1.55;
  }
  .feedback.correct {
    border-color: var(--teal);
    color: var(--teal);
  }
  .feedback.incorrect {
    border-color: var(--coral);
    color: #ffab98;
  }
  .answer-frame {
    margin-top: 2rem;
  }
  .answer-frame p {
    display: grid;
    grid-template-columns: 5rem 1fr;
    gap: 1rem;
    padding: 0.75rem 0;
    margin: 0;
    border-top: 1px solid var(--line);
    color: #b4bfbc;
    line-height: 1.5;
  }
  .answer-frame b {
    color: var(--amber);
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
  }
  .misconception {
    margin-top: 1px;
    padding: 1.25rem 1.5rem;
    border: 1px solid var(--coral);
    background: rgba(242, 124, 97, 0.07);
  }
  .misconception span {
    color: var(--coral);
  }
  .misconception p {
    margin: 0.4rem 0 0;
    color: #ffc3b5;
    line-height: 1.6;
  }
  @media (max-width: 58rem) {
    .lesson-head,
    .phenomenon,
    .study-spread,
    .clinic,
    .equation-register {
      grid-template-columns: 1fr;
    }
    .equation-register > div {
      grid-template-columns: 1fr;
    }
    .explanation > ol > li {
      grid-template-columns: 2rem 1fr;
    }
    .explanation > ol > li > :global(.equation) {
      grid-column: 2;
    }
    .phenomenon aside {
      border-top: 1px solid var(--line);
      border-left: 3px solid var(--teal);
    }
  }
  @media (max-width: 36rem) {
    .lesson-head h2 {
      font-size: clamp(2.6rem, 15vw, 4rem);
      overflow-wrap: anywhere;
    }
    .explanation > ol > li {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    .explanation > ol > li > :global(.equation) {
      grid-column: 1;
    }
    .worked dl div,
    .practical dl div,
    .answer-frame p {
      grid-template-columns: 1fr;
      gap: 0.35rem;
    }
    .clinic form,
    .clinic > article {
      padding: 1.25rem;
    }
    .clinic label {
      font-size: 0.95rem;
    }
  }
</style>
