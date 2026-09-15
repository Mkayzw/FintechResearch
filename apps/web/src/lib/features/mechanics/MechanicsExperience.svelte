<script lang="ts">
  import { tick } from "svelte";
  import ModuleLesson from "./ModuleLesson.svelte";
  import {
    mechanicsModules,
    type MechanicsModuleId,
  } from "./mechanics-content";

  let active = $state<MechanicsModuleId>("kinematics");
  let answer = $state(-1);
  let checked = $state(false);
  let visited = $state<MechanicsModuleId[]>(["kinematics"]);
  let module = $derived(mechanicsModules.find((item) => item.id === active)!);
  let activeIndex = $derived(
    mechanicsModules.findIndex((item) => item.id === active),
  );
  let previous = $derived(mechanicsModules[activeIndex - 1]);
  let next = $derived(mechanicsModules[activeIndex + 1]);

  async function select(id: MechanicsModuleId, shouldScroll = true) {
    active = id;
    answer = -1;
    checked = false;
    if (!visited.includes(id)) visited = [...visited, id];
    await tick();
    if (shouldScroll) {
      const reduceMotion = matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document.getElementById("active-lesson")?.scrollIntoView({
        block: "start",
        behavior: reduceMotion ? "auto" : "smooth",
      });
      document.getElementById("module-title")?.focus({ preventScroll: true });
    }
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
    <div class="hero-diagram" aria-hidden="true">
      <i class="path path-one"></i><i class="path path-two"></i><i
        class="path path-three"
      ></i>
      <b class="particle"></b><span>describe → explain → account → orbit</span>
    </div>
  </section>

  <section class="course" id="course-map" aria-labelledby="course-title">
    <header>
      <p class="eyebrow">Newtonian Mechanics</p>
      <h2 id="course-title">One chain of reasoning.</h2>
      <p>
        Move from describing motion to explaining it, accounting for it and
        applying it to orbits.
      </p>
    </header>
    <div class="course-shell">
      <nav class="sequence" aria-label="Mechanics learning sequence">
        <p>Course sequence</p>
        <ol>
          {#each mechanicsModules as item, index}
            <li
              class:visited={visited.includes(item.id)}
              class:active={active === item.id}
            >
              <button
                onclick={() => select(item.id)}
                aria-current={active === item.id ? "step" : undefined}
              >
                <span>{item.number}</span><strong>{item.title}</strong><small
                  >{index === 0
                    ? "Describe"
                    : index === 1
                      ? "Explain"
                      : index === 2
                        ? "Resolve"
                        : index === 3
                          ? "Account"
                          : index === 4
                            ? "Turn"
                            : "Orbit"}</small
                >
              </button>
              {#if index < mechanicsModules.length - 1}<i aria-hidden="true"
                ></i>{/if}
            </li>
          {/each}
        </ol>
        <div class="toolkit">
          <span>Always carry</span>
          <p>SI units · vectors · graphs · uncertainty</p>
        </div>
      </nav>
      <div class="active-module" id="active-lesson">
        <div class="mobile-stepper">
          <span>{module.number} / 06</span><strong>{module.title}</strong>
        </div>
        <ModuleLesson {module} {active} bind:answer bind:checked />
        {#if active === "kinematics"}
          <a class="deep-study" href="/mechanics/projectile-motion/"
            ><span>Deep study · Kinematics branch</span><strong
              >Take two dimensions seriously.</strong
            >
            <p>
              Resolve a launch, predict its landing, derive the path and
              challenge the 45° rule.
            </p>
            <b>Open Projectile Motion ↗</b></a
          >
        {/if}
        <nav
          class="lesson-nav"
          aria-label="Previous and next Mechanics modules"
        >
          {#if previous}<button onclick={() => select(previous.id)}
              ><span>Previous</span><strong>← {previous.title}</strong></button
            >{:else}<div></div>{/if}
          {#if next}<button class="next" onclick={() => select(next.id)}
              ><span>Concept bridge</span>
              <p>{module.bridge}</p>
              <strong>{next.title} →</strong></button
            >{:else}<a class="next" href="#bridges"
              ><span>Core complete</span>
              <p>{module.bridge}</p>
              <strong>Continue to extensions ↓</strong></a
            >{/if}
        </nav>
      </div>
    </div>
  </section>

  <section class="bridges" id="bridges" aria-labelledby="bridges-title">
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
  article {
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
    overflow: hidden;
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
  .hero-diagram {
    position: absolute;
    right: -8rem;
    bottom: -11rem;
    width: min(50vw, 44rem);
    aspect-ratio: 1;
    border: 1px solid rgba(113, 215, 199, 0.16);
    border-radius: 50%;
    pointer-events: none;
  }
  .hero-diagram .path {
    position: absolute;
    border: 1px solid rgba(244, 184, 74, 0.2);
    border-radius: 50%;
    inset: 10%;
  }
  .hero-diagram .path-two {
    inset: 24%;
    border-color: rgba(113, 215, 199, 0.25);
  }
  .hero-diagram .path-three {
    inset: 38%;
    border-style: dashed;
  }
  .hero-diagram .particle {
    position: absolute;
    left: 20%;
    top: 14%;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: var(--amber);
    box-shadow: 0 0 1.5rem var(--amber);
  }
  .hero-diagram span {
    position: absolute;
    left: 12%;
    top: 45%;
    color: rgba(240, 237, 229, 0.25);
    font: 800 0.72rem var(--mono);
    text-transform: uppercase;
    transform: rotate(-28deg);
  }
  h2 {
    margin: 0.5rem 0;
    font: 600 clamp(3rem, 6vw, 6rem) / 0.9 var(--serif);
    letter-spacing: -0.05em;
  }
  .course,
  .bridges {
    padding: clamp(4rem, 8vw, 8rem) clamp(1.25rem, 6vw, 7rem);
  }
  .course > header,
  .bridges > header {
    max-width: 60rem;
    margin-bottom: 3rem;
  }
  .course {
    background: var(--night-2);
  }
  .course > header > p:last-child {
    color: var(--muted);
    line-height: 1.6;
  }
  .course-shell {
    display: grid;
    grid-template-columns: minmax(13rem, 0.23fr) minmax(0, 0.77fr);
    gap: clamp(2rem, 5vw, 5rem);
    align-items: start;
  }
  .sequence {
    position: sticky;
    top: 1rem;
  }
  .sequence > p,
  .toolkit span {
    color: var(--muted);
    font: 800 0.72rem var(--mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .sequence ol {
    margin: 1rem 0 2rem;
    padding: 0;
    list-style: none;
  }
  .sequence li {
    position: relative;
  }
  .sequence li i {
    display: block;
    width: 1px;
    height: 1.15rem;
    margin-left: 1.05rem;
    background: var(--line-strong);
  }
  .sequence button {
    width: 100%;
    min-height: 4.4rem;
    display: grid;
    grid-template-columns: 2.2rem 1fr;
    grid-template-rows: auto auto;
    gap: 0.15rem 0.65rem;
    align-items: center;
    padding: 0.7rem;
    border: 1px solid transparent;
    background: transparent;
    color: var(--muted);
    text-align: left;
    cursor: pointer;
  }
  .sequence button:hover,
  .sequence button:focus-visible {
    border-color: var(--line-strong);
    color: var(--ink);
  }
  .sequence button:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: 2px;
  }
  .sequence li.active button {
    border-color: var(--amber);
    background: rgba(244, 184, 74, 0.08);
    color: var(--ink);
  }
  .sequence li.visited button span::after {
    content: " ·";
    color: var(--teal);
  }
  .sequence button span {
    grid-row: 1/3;
    color: var(--amber);
    font: 800 0.7rem var(--mono);
  }
  .sequence button strong {
    font: 600 1.05rem var(--serif);
  }
  .sequence button small {
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  .toolkit {
    padding: 1rem;
    border-left: 2px solid var(--teal);
  }
  .toolkit p {
    margin: 0.5rem 0 0;
    color: var(--muted);
    font: 700 0.68rem/1.6 var(--mono);
    text-transform: uppercase;
  }
  .active-module {
    scroll-margin-top: 1rem;
  }
  .mobile-stepper {
    display: none;
  }
  .deep-study {
    display: block;
    margin-top: 1px;
    padding: clamp(1.5rem, 4vw, 3.5rem);
    border: 1px solid var(--teal);
    background: radial-gradient(
        circle at 85% 30%,
        rgba(113, 215, 199, 0.15),
        transparent 30%
      ),
      var(--night);
    color: var(--ink);
    text-decoration: none;
  }
  .deep-study span {
    color: var(--teal);
    font: 800 0.72rem var(--mono);
    text-transform: uppercase;
  }
  .deep-study strong {
    display: block;
    margin: 1.5rem 0 0.7rem;
    font: 600 clamp(2rem, 4vw, 3.4rem) var(--serif);
  }
  .deep-study p {
    max-width: 48rem;
    color: var(--muted);
    line-height: 1.65;
  }
  .deep-study b {
    color: var(--amber);
    font: 800 0.72rem var(--mono);
    text-transform: uppercase;
  }
  .lesson-nav {
    display: grid;
    grid-template-columns: 1fr 1.35fr;
    gap: 1px;
    margin-top: clamp(4rem, 8vw, 8rem);
    background: var(--line);
    border: 1px solid var(--line);
  }
  .lesson-nav button,
  .lesson-nav a {
    min-height: 11rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
    border: 0;
    background: var(--night);
    color: var(--ink);
    text-align: left;
    text-decoration: none;
    cursor: pointer;
  }
  .lesson-nav .next {
    background: var(--panel);
  }
  .lesson-nav span {
    color: var(--amber);
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
  }
  .lesson-nav p {
    color: var(--muted);
    line-height: 1.55;
  }
  .lesson-nav strong {
    margin-top: auto;
    font: 600 1.4rem var(--serif);
  }
  .lesson-nav button:hover,
  .lesson-nav button:focus-visible,
  .lesson-nav a:hover,
  .lesson-nav a:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: -4px;
  }
  .course-shell,
  .sequence,
  .active-module {
    min-width: 0;
    max-width: 100%;
  }
  .bridges h3 {
    margin: 1.5rem 0 1rem;
    font: 600 clamp(1.6rem, 3vw, 2.5rem) var(--serif);
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
    .hero {
      grid-template-columns: 1fr;
    }
    .course-shell {
      grid-template-columns: minmax(0, 1fr);
    }
    .sequence {
      overflow: hidden;
    }
    .sequence ol {
      width: 100%;
      max-width: 100%;
    }
    .course-shell {
      grid-template-columns: 1fr;
    }
    .sequence {
      position: static;
    }
    .sequence > p,
    .sequence .toolkit {
      display: none;
    }
    .sequence ol {
      display: flex;
      overflow-x: auto;
      gap: 0.4rem;
      padding-bottom: 0.5rem;
    }
    .sequence li {
      flex: 0 0 auto;
    }
    .sequence li i {
      display: none;
    }
    .sequence button {
      min-height: 3.5rem;
      width: auto;
      grid-template-columns: 1.7rem auto;
      padding: 0.6rem 0.8rem;
    }
    .sequence button small {
      display: none;
    }
    .active-module {
      scroll-margin-top: 0.5rem;
    }
    .mobile-stepper {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--line);
      color: var(--muted);
      font: 800 0.7rem var(--mono);
      text-transform: uppercase;
    }
    .mobile-stepper strong {
      color: var(--ink);
    }
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
    .course {
      padding-inline: 1rem;
    }
    .lesson-nav {
      grid-template-columns: 1fr;
    }
    .lesson-nav button,
    .lesson-nav a {
      min-height: 9rem;
    }
    .hero-diagram {
      opacity: 0.5;
    }
    footer {
      flex-direction: column;
    }
  }
</style>
