<script lang="ts">
  import Equation from "$lib/components/Equation.svelte";
  import MechanicsLab from "./MechanicsLab.svelte";
  import {
    mechanicsModules,
    type MechanicsModuleId,
  } from "./mechanics-content";

  let active = $state<MechanicsModuleId>("kinematics");
  let answer = $state(-1);
  let checked = $state(false);
  let module = $derived(mechanicsModules.find((item) => item.id === active)!);

  function select(id: MechanicsModuleId) {
    active = id;
    answer = -1;
    checked = false;
    document
      .getElementById("mechanics-lab")
      ?.scrollIntoView({ block: "start" });
  }
</script>

<svelte:head>
  <title>A-Level Mechanics — Fieldlab Physics</title>
  <meta
    name="description"
    content="A complete interactive provisional ZIMSEC A-Level Newtonian Mechanics course covering kinematics, dynamics, forces, energy, circular motion and gravitation."
  />
</svelte:head>

<header class="site-head">
  <a href="/">FIELDLAB/PHYSICS</a>
  <span>Forms 5–6 · Newtonian Mechanics</span>
</header>

<main>
  <section class="hero">
    <div>
      <p class="eyebrow">Territory 01 · Complete Mechanics</p>
      <h1>From motion<br />to <em>orbit.</em></h1>
      <p>
        Predict what happens. Expose the forces. Choose the system. Test the
        equation against evidence. Then write the answer an examiner can follow.
      </p>
    </div>
    <aside>
      <span>Provisional ZIMSEC alignment</span>
      <strong>6 core headings</strong>
      <p>
        Based on an accessible mirror of the MoPSE Forms 5–6 Physics syllabus
        for 2024–2030, awaiting verification against the official PDF.
      </p>
      <a href="#course-map">See the course map ↓</a>
    </aside>
  </section>

  <section class="instruments" aria-labelledby="instruments-title">
    <header>
      <p class="eyebrow">General Physics toolkit</p>
      <h2 id="instruments-title">Four instruments travel everywhere.</h2>
    </header>
    <div>
      <article>
        <span>01</span>
        <h3>Units + dimensions</h3>
        <p>
          Use SI units, prefixes and dimensional homogeneity to inspect every
          result.
        </p>
      </article>
      <article>
        <span>02</span>
        <h3>Vectors</h3>
        <p>
          Resolve, recombine and preserve direction rather than manipulating
          magnitudes alone.
        </p>
      </article>
      <article>
        <span>03</span>
        <h3>Graphs</h3>
        <p>
          Read physical meaning from gradients, intercepts, areas and justified
          linearisation.
        </p>
      </article>
      <article>
        <span>04</span>
        <h3>Uncertainty</h3>
        <p>
          Repeat measurements, separate random from systematic effects and
          defend precision.
        </p>
      </article>
    </div>
  </section>

  <section class="course-map" id="course-map" aria-labelledby="course-title">
    <header>
      <p class="eyebrow">Newtonian Mechanics</p>
      <h2 id="course-title">One chain of reasoning.</h2>
      <p>
        Move from describing motion to explaining it, accounting for it and
        applying it to orbits.
      </p>
    </header>
    <ol>
      {#each mechanicsModules as item}
        <li>
          <button
            class:active={active === item.id}
            onclick={() => select(item.id)}
            aria-pressed={active === item.id}
          >
            <span>{item.number}</span>
            <strong>{item.title}</strong>
            <small>{item.thesis}</small>
          </button>
        </li>
      {/each}
    </ol>
  </section>

  <section class="module" id="mechanics-lab" aria-labelledby="module-title">
    <header class="module-head">
      <div>
        <p class="eyebrow">Core heading {module.number} · Provisional</p>
        <h2 id="module-title">{module.title}</h2>
      </div>
      <p>{module.objective}</p>
    </header>

    <MechanicsLab {active} />

    <div class="evidence-grid">
      <article class="equations">
        <span>Core equations</span>
        {#each module.equations as formula}
          <Equation {formula} display />
        {/each}
        {#if active === "kinematics"}
          <a href="/mechanics/projectile-motion/"
            >Open the complete Projectile Motion study ↗</a
          >
        {/if}
      </article>
      <article>
        <span>Practical / Paper 4 preparation</span>
        <h3>Make the evidence defensible.</h3>
        <p>{module.practical}</p>
        <ul>
          <li>Name independent, dependent and controlled variables.</li>
          <li>Record repeats with units in table headings.</li>
          <li>Use a graph whose gradient or area has physical meaning.</li>
          <li>Evaluate a specific limitation, effect and improvement.</li>
        </ul>
      </article>
      <article class="warning">
        <span>Misconception checkpoint</span>
        <h3>Do not carry this error forward.</h3>
        <p>{module.misconception}</p>
      </article>
    </div>
  </section>

  <section class="exam" aria-labelledby="exam-title">
    <header>
      <p class="eyebrow">Exam bench</p>
      <h2 id="exam-title">Switch the mode of thinking.</h2>
    </header>
    <div class="exam-grid">
      <form
        onsubmit={(event) => {
          event.preventDefault();
          checked = true;
        }}
      >
        <span>Paper 1 · Discriminate</span>
        <h3>{module.question.prompt}</h3>
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
            {option}
          </label>
        {/each}
        <button disabled={answer < 0}>Check reasoning</button>
        <p class="feedback" aria-live="polite">
          {checked
            ? `${answer === module.question.answer ? "Correct. " : "Reconsider. "}${module.question.explanation}`
            : "Choose an answer, then defend it using the model."}
        </p>
      </form>
      <article class="structured">
        <span>Paper 2/3 · Show method</span>
        <h3>{module.title} structured prompt</h3>
        <p>{module.examPrompt}</p>
        <ol>
          <li><b>Model:</b> define the system, axes and assumptions.</li>
          <li><b>Equation:</b> write the relation before substituting.</li>
          <li><b>Working:</b> retain signs and SI units.</li>
          <li><b>Interpret:</b> state direction and physical plausibility.</li>
        </ol>
      </article>
    </div>
  </section>

  <section class="bridges" aria-labelledby="bridges-title">
    <header>
      <p class="eyebrow">After the core</p>
      <h2 id="bridges-title">The model eventually bends.</h2>
    </header>
    <div>
      <article>
        <span>Bridge to Waves</span>
        <h3>Oscillations</h3>
        <p>
          Restoring force, phase, energy and resonance reuse Mechanics but
          belong to the Oscillations and Waves strand in the accessible syllabus
          structure.
        </p>
        <strong>Next platform module</strong>
      </article>
      <a href="/mechanics/double-pendulum/">
        <span>Research extension · Not verified exam core</span>
        <h3>Strange Loops</h3>
        <p>
          Push force, energy and oscillation models beyond the small-angle
          regime into deterministic chaos and numerical trust.
        </p>
        <strong>Enter the double-pendulum study ↗</strong>
      </a>
    </div>
  </section>
</main>

<footer>
  <a href="/">← Curriculum atlas</a>
  <p>
    Curriculum claims remain provisional until the official ZIMSEC-hosted PDF is
    available.
  </p>
  <a href="/mechanics/projectile-motion/">Projectile Motion ↗</a>
</footer>

<style>
  main,
  section,
  section > *,
  article,
  form {
    min-width: 0;
  }
  .site-head {
    min-height: 4.5rem;
    padding: 0 clamp(1.25rem, 4vw, 4rem);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--line);
    color: var(--muted);
    font: 700 0.66rem var(--mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .site-head a {
    color: var(--amber);
    text-decoration: none;
  }
  .eyebrow,
  .evidence-grid article > span,
  .exam span,
  .bridges span {
    margin: 0 0 0.75rem;
    color: var(--amber);
    font: 800 0.65rem var(--mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .hero {
    min-height: 78svh;
    padding: clamp(4rem, 9vw, 9rem) clamp(1.25rem, 6vw, 7rem);
    display: grid;
    grid-template-columns: minmax(0, 1.4fr) minmax(18rem, 0.6fr);
    gap: clamp(3rem, 8vw, 9rem);
    align-items: center;
    background: radial-gradient(
        circle at 78% 35%,
        rgba(113, 215, 199, 0.15),
        transparent 25%
      ),
      linear-gradient(115deg, var(--night) 55%, #0d1718);
  }
  h1 {
    margin: 1rem 0 1.5rem;
    font: 600 clamp(4.2rem, 10vw, 9rem) / 0.84 var(--serif);
    letter-spacing: -0.065em;
  }
  h1 em {
    color: var(--teal);
    font-weight: 400;
  }
  .hero > div > p:last-child {
    max-width: 42rem;
    color: #adb8b5;
    font-size: clamp(1.05rem, 2vw, 1.35rem);
    line-height: 1.65;
  }
  .hero aside {
    border-top: 1px solid var(--teal);
    padding-top: 1.25rem;
  }
  .hero aside span {
    color: var(--muted);
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  .hero aside strong {
    display: block;
    margin: 0.5rem 0;
    font: 600 clamp(2rem, 4vw, 4rem) var(--serif);
  }
  .hero aside p {
    color: var(--muted);
    line-height: 1.6;
  }
  .hero aside a {
    display: inline-block;
    margin-top: 1rem;
    color: var(--teal);
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
  }
  h2 {
    margin: 0.5rem 0;
    font: 600 clamp(3rem, 6vw, 6rem) / 0.9 var(--serif);
    letter-spacing: -0.05em;
  }
  .instruments,
  .course-map,
  .module,
  .exam,
  .bridges {
    padding: clamp(4rem, 8vw, 8rem) clamp(1.25rem, 6vw, 7rem);
  }
  .instruments {
    background: #e8e2d6;
    color: #111417;
  }
  .instruments .eyebrow {
    color: #745014;
  }
  .instruments > header,
  .course-map > header,
  .exam > header,
  .bridges > header {
    max-width: 60rem;
    margin-bottom: 3rem;
  }
  .instruments > div {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid #aaa69d;
  }
  .instruments article {
    min-height: 14rem;
    padding: 1.25rem;
    border-right: 1px solid #aaa69d;
  }
  .instruments article:last-child {
    border-right: 0;
  }
  .instruments span {
    color: #745014;
    font: 800 0.65rem var(--mono);
  }
  .instruments h3 {
    margin: 3rem 0 0.75rem;
    font: 600 1.5rem var(--serif);
  }
  .instruments p {
    color: #4d5552;
    line-height: 1.55;
  }
  .course-map {
    background: var(--night-2);
  }
  .course-map header > p:last-child {
    color: var(--muted);
    line-height: 1.6;
  }
  .course-map ol {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    margin: 0;
    padding: 0;
    list-style: none;
    background: var(--line);
    border: 1px solid var(--line);
  }
  .course-map button {
    width: 100%;
    min-height: 14rem;
    display: grid;
    align-content: space-between;
    gap: 1rem;
    padding: 1.5rem;
    border: 0;
    background: var(--night);
    color: var(--ink);
    text-align: left;
    cursor: pointer;
  }
  .course-map button:hover,
  .course-map button:focus-visible,
  .course-map button.active {
    background: var(--amber);
    color: var(--night);
  }
  .course-map button:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: -4px;
  }
  .course-map span,
  .course-map small {
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  .course-map strong {
    font: 600 clamp(1.7rem, 3vw, 2.7rem) var(--serif);
  }
  .course-map small {
    color: var(--muted);
    line-height: 1.5;
  }
  .course-map button.active small,
  .course-map button:hover small {
    color: #47391e;
  }
  .module {
    scroll-margin-top: 1rem;
  }
  .module-head {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: end;
    margin-bottom: 2.5rem;
  }
  .module-head > p {
    color: var(--muted);
    line-height: 1.7;
  }
  .evidence-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    margin-top: 2rem;
    background: var(--line);
    border: 1px solid var(--line);
  }
  .evidence-grid article {
    padding: clamp(1.5rem, 3vw, 2.5rem);
    background: var(--night-2);
  }
  .evidence-grid h3,
  .exam h3,
  .bridges h3 {
    margin: 1.5rem 0 1rem;
    font: 600 clamp(1.6rem, 3vw, 2.5rem) var(--serif);
  }
  .evidence-grid p,
  .evidence-grid li {
    color: var(--muted);
    line-height: 1.65;
  }
  .evidence-grid li {
    margin: 0.65rem 0;
  }
  .evidence-grid .warning {
    border-top: 3px solid var(--coral);
  }
  .equations a {
    display: inline-block;
    margin-top: 1rem;
    color: var(--teal);
    font: 800 0.65rem var(--mono);
    text-transform: uppercase;
  }
  .exam {
    background: var(--panel);
  }
  .exam-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
  }
  .exam form,
  .structured {
    padding: clamp(1.5rem, 4vw, 3rem);
    background: var(--night);
  }
  .exam label {
    display: flex;
    gap: 0.75rem;
    padding: 0.8rem;
    border: 1px solid var(--line);
    color: var(--muted);
    cursor: pointer;
  }
  .exam label + label {
    border-top: 0;
  }
  .exam label.chosen {
    border-color: var(--teal);
    color: var(--ink);
  }
  .exam input {
    accent-color: var(--teal);
  }
  .exam button {
    margin-top: 1.5rem;
    min-height: 3rem;
    padding: 0 1rem;
    border: 0;
    background: var(--amber);
    color: var(--night);
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
    cursor: pointer;
  }
  .exam button:disabled {
    opacity: 0.4;
  }
  .exam button:focus-visible,
  .exam input:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: 3px;
  }
  .feedback {
    min-height: 3rem;
    color: var(--teal);
    line-height: 1.55;
  }
  .structured {
    background: var(--night-2);
  }
  .structured > p,
  .structured li {
    color: #adb8b5;
    line-height: 1.7;
  }
  .structured li {
    margin: 0.75rem 0;
  }
  .bridges > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
  }
  .bridges article,
  .bridges a {
    min-height: 22rem;
    display: flex;
    flex-direction: column;
    padding: clamp(1.5rem, 4vw, 3rem);
    background: var(--night-2);
    color: var(--ink);
    text-decoration: none;
  }
  .bridges a {
    background: radial-gradient(
        circle at 80% 20%,
        rgba(113, 215, 199, 0.18),
        transparent 32%
      ),
      #0b1114;
  }
  .bridges p {
    color: var(--muted);
    line-height: 1.65;
  }
  .bridges strong {
    margin-top: auto;
    color: var(--teal);
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
  }
  footer {
    padding: 2.5rem clamp(1.25rem, 6vw, 7rem);
    border-top: 1px solid var(--line);
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    color: var(--muted);
    font-size: 0.75rem;
  }
  footer a {
    color: var(--amber);
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
  }
  @media (max-width: 58rem) {
    .hero,
    .module-head {
      grid-template-columns: 1fr;
    }
    .instruments > div {
      grid-template-columns: 1fr 1fr;
    }
    .instruments article:nth-child(2) {
      border-right: 0;
    }
    .instruments article:nth-child(n + 3) {
      border-top: 1px solid #aaa69d;
    }
    .course-map ol {
      grid-template-columns: 1fr 1fr;
    }
    .evidence-grid {
      grid-template-columns: 1fr;
    }
    .exam-grid,
    .bridges > div {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 38rem) {
    .site-head span {
      display: none;
    }
    h1 {
      font-size: clamp(3.2rem, 18vw, 4.2rem);
      overflow-wrap: anywhere;
    }
    .module h2 {
      font-size: clamp(2.4rem, 15vw, 3.5rem);
      overflow-wrap: anywhere;
    }
    .instruments > div,
    .course-map ol {
      grid-template-columns: 1fr;
    }
    .instruments article {
      border-right: 0;
      border-top: 1px solid #aaa69d;
    }
    .instruments article:first-child {
      border-top: 0;
    }
    .course-map button {
      min-height: 11rem;
    }
    .exam form,
    .structured {
      padding: 1.25rem;
    }
    .exam label {
      overflow-wrap: anywhere;
    }
    footer {
      flex-direction: column;
    }
  }
</style>
