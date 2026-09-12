<script lang="ts">
  import { onMount } from "svelte";

  const areas = [
    {
      index: "01",
      name: "Mechanics",
      status: "Active",
      description:
        "Motion, forces, energy, oscillations and nonlinear systems.",
      tone: "amber",
    },
    {
      index: "02",
      name: "Waves",
      status: "Planned",
      description: "Superposition, standing waves, diffraction and sound.",
      tone: "teal",
    },
    {
      index: "03",
      name: "Matter",
      status: "Planned",
      description: "Thermal physics, deformation and the structure of matter.",
      tone: "coral",
    },
    {
      index: "04",
      name: "Electronics",
      status: "Planned",
      description: "Semiconductors, logic, sensing and control.",
      tone: "amber",
    },
    {
      index: "05",
      name: "Telecommunications",
      status: "Planned",
      description: "Signals, modulation, transmission and information.",
      tone: "teal",
    },
    {
      index: "06",
      name: "Electricity + Magnetism",
      status: "Planned",
      description: "Fields, circuits, induction and electromagnetic force.",
      tone: "coral",
    },
  ] as const;

  onMount(() => {
    if (location.hash.startsWith("#experiment=")) {
      location.replace(`/mechanics/double-pendulum/${location.hash}`);
    }
  });
</script>

<svelte:head>
  <title>Fieldlab Physics — Zimbabwe A-Level Interactive Studies</title>
  <meta
    name="description"
    content="A map of interactive, research-led Physics laboratories for Zimbabwe Forms 5–6."
  />
</svelte:head>

<header class="site-head">
  <a class="brand" href="/">FIELDLAB/PHYSICS</a>
  <span>Zimbabwe Forms 5–6 · 2024–2030 alignment</span>
</header>

<main>
  <section class="hero">
    <div>
      <p class="eyebrow">A syllabus you can touch</p>
      <h1>Physics is not<br />a spectator <em>sport.</em></h1>
      <p class="lede">
        Derive it. Predict it. Run it. Break the model. Then explain what
        survived.
      </p>
    </div>
    <aside>
      <span>Current expedition</span>
      <strong>Mechanics</strong>
      <p>
        Travel from kinematics and collisions through forces, energy, circular
        motion and gravitational fields.
      </p>
      <a href="/mechanics/">Enter Mechanics →</a>
    </aside>
  </section>

  <section class="map" aria-labelledby="map-title">
    <header>
      <p class="eyebrow">Curriculum atlas</p>
      <h2 id="map-title">Six territories.<br />One connected world.</h2>
    </header>
    <ol>
      {#each areas as area}
        <li class:active={area.status === "Active"} class={area.tone}>
          <span class="number">{area.index}</span>
          <div>
            <h3>{area.name}</h3>
            <p>{area.description}</p>
          </div>
          <span class="status">{area.status}</span>
        </li>
      {/each}
    </ol>
  </section>

  <section class="mechanics" aria-labelledby="mechanics-title">
    <header>
      <p class="eyebrow">Territory 01</p>
      <h2 id="mechanics-title">Mechanics</h2>
      <p>
        Start with motion that can be solved exactly. Continue toward motion
        that can only be understood statistically.
      </p>
    </header>
    <div class="lessons">
      <a class="lesson mechanics-core" href="/mechanics/">
        <span>Complete strand · Ready</span>
        <h3>A-Level Mechanics</h3>
        <p>
          Kinematics, dynamics, forces, momentum, energy, circular motion,
          gravitation, practical analysis and exam preparation.
        </p>
        <strong>Start the full course ↗</strong>
      </a>
      <a class="lesson primary" href="/mechanics/projectile-motion/">
        <span>Deep core study · Ready</span>
        <h3>Beyond 45°</h3>
        <p>
          Projectile motion, vector components, air resistance, uncertainty and
          range optimisation.
        </p>
        <strong>Launch study ↗</strong>
      </a>
      <a class="lesson chaos" href="/mechanics/double-pendulum/">
        <span>Research extension · Ready</span>
        <h3>Strange Loops</h3>
        <p>
          Double-pendulum chaos, phase space, finite-time divergence and
          numerical trust.
        </p>
        <strong>Enter chaos ↗</strong>
      </a>
      <article class="lesson upcoming">
        <span>Bridge to the next territory</span>
        <h3>Oscillations → Waves</h3>
        <p>
          Simple harmonic motion reuses force, energy and graph reasoning before
          opening the Waves strand.
        </p>
      </article>
    </div>
  </section>
</main>

<footer>
  <span>FIELDLAB/PHYSICS</span>
  <p>
    Evidence-led interactive studies. No accounts. No fake progress. Just the
    model and what it predicts.
  </p>
</footer>

<style>
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
  .brand {
    color: var(--amber);
    text-decoration: none;
  }
  .hero {
    min-height: 80svh;
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
  .eyebrow {
    color: var(--amber);
    font: 800 0.66rem var(--mono);
    text-transform: uppercase;
    letter-spacing: 0.14em;
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
  .lede {
    max-width: 38rem;
    color: #adb8b5;
    font-size: clamp(1.05rem, 2vw, 1.35rem);
    line-height: 1.65;
  }
  .hero aside {
    border-top: 1px solid var(--teal);
    padding-top: 1.25rem;
  }
  .hero aside span,
  .lesson span {
    color: var(--muted);
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
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
    padding: 0.9rem 1rem;
    background: var(--teal);
    color: var(--night);
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
    text-decoration: none;
  }
  .map {
    display: grid;
    grid-template-columns: minmax(18rem, 0.7fr) minmax(0, 1.3fr);
    gap: clamp(3rem, 8vw, 8rem);
    padding: clamp(4rem, 8vw, 8rem) clamp(1.25rem, 6vw, 7rem);
    background: #e8e2d6;
    color: #111417;
  }
  h2 {
    margin: 0.5rem 0;
    font: 600 clamp(3rem, 6vw, 6rem) / 0.9 var(--serif);
    letter-spacing: -0.05em;
  }
  .map .eyebrow {
    color: #8b5a00;
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1px solid #aaa69d;
  }
  li {
    display: grid;
    grid-template-columns: 3rem 1fr auto;
    gap: 1rem;
    align-items: center;
    padding: 1.25rem 0;
    border-bottom: 1px solid #aaa69d;
    opacity: 0.56;
  }
  li.active {
    opacity: 1;
  }
  li .number,
  li .status {
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  li h3 {
    margin: 0;
    font: 600 clamp(1.4rem, 3vw, 2.5rem) var(--serif);
  }
  li p {
    margin: 0.3rem 0 0;
    color: #58605d;
  }
  li.amber.active .number {
    color: #8b5a00;
  }
  .mechanics {
    padding: clamp(4rem, 8vw, 8rem) clamp(1.25rem, 6vw, 7rem);
  }
  .mechanics > header {
    max-width: 52rem;
    margin-bottom: 3rem;
  }
  .mechanics > header > p:last-child {
    color: var(--muted);
    line-height: 1.65;
  }
  .lessons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
  }
  .lesson {
    min-height: 27rem;
    padding: clamp(1.5rem, 4vw, 3.5rem);
    background: var(--panel);
    color: var(--ink);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .lesson h3 {
    margin: auto 0 1rem;
    font: 600 clamp(2.5rem, 5vw, 5rem) / 0.9 var(--serif);
    letter-spacing: -0.045em;
  }
  .lesson p {
    color: var(--muted);
    max-width: 32rem;
    line-height: 1.6;
  }
  .lesson strong {
    margin-top: 1rem;
    color: var(--amber);
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
  }
  .lesson.chaos {
    background: radial-gradient(
        circle at 80% 20%,
        rgba(113, 215, 199, 0.18),
        transparent 32%
      ),
      #0b1114;
  }
  .lesson.mechanics-core {
    grid-column: 1 / -1;
    min-height: 22rem;
    background: linear-gradient(110deg, #15120c, var(--panel));
  }
  .lesson.upcoming {
    grid-column: 1 / -1;
    min-height: 15rem;
    opacity: 0.62;
  }
  .lesson.upcoming h3 {
    margin: auto 0 1rem;
    font-size: clamp(1.8rem, 4vw, 3.5rem);
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
  footer span {
    color: var(--amber);
    font: 800 0.7rem var(--mono);
  }
  @media (max-width: 50rem) {
    .site-head span {
      display: none;
    }
    .hero,
    .map {
      grid-template-columns: 1fr;
    }
    .hero {
      min-height: auto;
    }
    .lessons {
      grid-template-columns: 1fr;
    }
    .lesson.upcoming {
      grid-column: auto;
    }
    li {
      grid-template-columns: 2rem 1fr;
    }
    li .status {
      grid-column: 2;
    }
    footer {
      flex-direction: column;
    }
  }
</style>
