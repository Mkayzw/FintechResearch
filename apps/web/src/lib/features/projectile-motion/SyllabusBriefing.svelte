<script lang="ts">
  const outcomes = [
    "Resolve a launch velocity into perpendicular components.",
    "Explain uniform horizontal motion and uniformly accelerated vertical motion sharing one time.",
    "Use standard kinematic equations to solve projectile problems without air resistance.",
    "Interpret trajectory, velocity and energy graphs with SI units.",
    "Plan repeat measurements and report uncertainty without false precision.",
  ] as const;

  const journey = [
    ["01", "Orient", "Know the model and target"],
    ["02", "Predict", "Commit before release"],
    ["03", "Explore", "Change one variable"],
    ["04", "Derive", "Build the equations"],
    ["05", "Apply", "Solve and interpret"],
    ["06", "Investigate", "Measure uncertainty"],
    ["07", "Practise", "Train exam responses"],
    ["08", "Extend", "Critique the model"],
  ] as const;
</script>

<section class="briefing" aria-labelledby="briefing-title">
  <div class="source-note">
    <p>Provisional ZIMSEC alignment</p>
    <h2 id="briefing-title">Your mission: explain a two-dimensional path.</h2>
    <p>
      The accessible MoPSE Forms 5–6 Physics syllabus mirror expects learners to
      describe motion produced by uniform velocity in one direction and uniform
      acceleration in a perpendicular direction, then solve problems using
      standard projectile equations. This wording awaits verification against
      the official PDF.
    </p>
    <a href="#sources">Inspect sources and scope ↓</a>
  </div>

  <div class="outcomes">
    <p>By the end, you should be able to</p>
    <ul>
      {#each outcomes as outcome}
        <li>{outcome}</li>
      {/each}
    </ul>
  </div>

  <nav aria-label="Projectile learning journey">
    <ol>
      {#each journey as step}
        <li>
          <span>{step[0]}</span>
          <strong>{step[1]}</strong>
          <small>{step[2]}</small>
        </li>
      {/each}
    </ol>
  </nav>
</section>

<style>
  .briefing {
    padding: clamp(2.5rem, 6vw, 6rem) clamp(1.25rem, 6vw, 7rem);
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
    gap: clamp(2rem, 6vw, 6rem);
    border-block: 1px solid var(--line);
    background: #e8e2d6;
    color: #111417;
  }
  .source-note > p:first-child,
  .outcomes > p {
    margin: 0 0 0.75rem;
    color: #745014;
    font: 800 0.65rem var(--mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  h2 {
    max-width: 13ch;
    margin: 0 0 1.25rem;
    font: 600 clamp(2.5rem, 5vw, 5rem) / 0.94 var(--serif);
    letter-spacing: -0.045em;
  }
  .source-note > p:last-of-type {
    max-width: 48rem;
    color: #444b49;
    line-height: 1.7;
  }
  a {
    display: inline-block;
    margin-top: 1rem;
    color: #745014;
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid #aaa69d;
  }
  li {
    border-bottom: 1px solid #aaa69d;
  }
  ul li {
    padding: 0.85rem 0 0.85rem 1.5rem;
    position: relative;
    line-height: 1.5;
  }
  ul li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #745014;
    font-weight: 800;
  }
  nav {
    grid-column: 1 / -1;
  }
  ol {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid #aaa69d;
  }
  ol li {
    min-height: 7rem;
    display: grid;
    align-content: start;
    gap: 0.35rem;
    padding: 1rem;
    border: 0;
    border-right: 1px solid #aaa69d;
  }
  ol li:nth-child(4),
  ol li:last-child {
    border-right: 0;
  }
  ol li:nth-child(n + 5) {
    border-top: 1px solid #aaa69d;
  }
  ol span,
  ol small {
    color: #686e6b;
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  ol strong {
    font: 600 1.35rem var(--serif);
  }
  @media (max-width: 52rem) {
    .briefing {
      grid-template-columns: 1fr;
    }
    ol {
      grid-template-columns: repeat(2, 1fr);
    }
    ol li:nth-child(even) {
      border-right: 0;
    }
    ol li:nth-child(n + 3) {
      border-top: 1px solid #aaa69d;
    }
  }
  @media (max-width: 30rem) {
    ol {
      grid-template-columns: 1fr;
    }
    ol li {
      border-right: 0;
      border-top: 1px solid #aaa69d;
    }
    ol li:first-child {
      border-top: 0;
    }
  }
</style>
