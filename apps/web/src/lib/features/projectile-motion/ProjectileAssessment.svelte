<script lang="ts">
  const questions = [
    {
      prompt:
        "At the highest point of an ideal projectile path, which statement is correct?",
      options: [
        "Both velocity components are zero.",
        "Vertical velocity is zero; horizontal velocity remains constant.",
        "Acceleration is zero for an instant.",
      ],
      answer: 1,
      explanation:
        "Gravity still accelerates the projectile downward. Only the vertical component of velocity is zero at the apex.",
    },
    {
      prompt: "Why can an elevated launch have a vacuum optimum below 45°?",
      options: [
        "The projectile already has extra flight time from its height.",
        "Gravity becomes weaker above the ground.",
        "The horizontal velocity increases during flight.",
      ],
      answer: 0,
      explanation:
        "Extra height supplies flight time, so more of the fixed launch speed can be assigned horizontally.",
    },
    {
      prompt:
        "What distinguishes the teal drag result from the amber vacuum result?",
      options: [
        "The teal curve is an exact analytic law.",
        "The teal curve assumes acceleration is always vertical.",
        "The teal curve is a numerical RK4 solution of a stated drag model.",
      ],
      answer: 2,
      explanation:
        "Quadratic drag depends on the changing air-relative velocity, so this study integrates the model numerically.",
    },
  ] as const;

  let responses = $state<number[]>([-1, -1, -1]);
  let submitted = $state(false);
  let score = $derived(
    responses.reduce(
      (total, response, index) =>
        total + (response === questions[index]!.answer ? 1 : 0),
      0,
    ),
  );

  function submit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
  }
</script>

<section class="assessment" aria-labelledby="assessment-title">
  <header>
    <p>Exam bench</p>
    <h2 id="assessment-title">Explain the physics, not just the number.</h2>
    <p class="scope-note">
      The paper labels below follow the accessible 2024–2030 syllabus mirror and
      remain provisional. This coaching rewards defensible working; it does not
      reproduce an unavailable official mark scheme.
    </p>
  </header>

  <div class="paper-map" aria-label="Provisional examination preparation map">
    <article>
      <span>Paper 1 · Multiple choice</span>
      <strong>Discriminate</strong>
      <p>Reject distractors using signs, units, vectors and limiting cases.</p>
    </article>
    <article>
      <span>Paper 2 · Structured</span>
      <strong>Show method</strong>
      <p>Declare axes, resolve components, choose equations and interpret.</p>
    </article>
    <article>
      <span>Paper 3 · Free response</span>
      <strong>Build an argument</strong>
      <p>Connect assumptions, equations, evidence and physical meaning.</p>
    </article>
    <article>
      <span>Paper 4 · Practical</span>
      <strong>Defend evidence</strong>
      <p>Control variables, repeat readings, graph, quantify and evaluate.</p>
    </article>
  </div>

  <div class="assessment-grid">
    <form onsubmit={submit}>
      <h3>Concept check</h3>
      {#each questions as question, questionIndex}
        <fieldset>
          <legend>{questionIndex + 1}. {question.prompt}</legend>
          {#each question.options as option, optionIndex}
            <label class:chosen={responses[questionIndex] === optionIndex}>
              <input
                type="radio"
                name={`question-${questionIndex}`}
                value={optionIndex}
                checked={responses[questionIndex] === optionIndex}
                onchange={() => {
                  responses[questionIndex] = optionIndex;
                  submitted = false;
                }}
              />
              <span>{option}</span>
            </label>
          {/each}
          <p
            aria-live="polite"
            class:correct={submitted &&
              responses[questionIndex] === question.answer}
            class="feedback"
          >
            {submitted
              ? `${responses[questionIndex] === question.answer ? "Correct. " : "Reconsider. "}${question.explanation}`
              : ""}
          </p>
        </fieldset>
      {/each}
      <button disabled={responses.some((response) => response < 0)}
        >Check answers</button
      >
      <p class="score" aria-live="polite">
        {submitted
          ? `${score} of ${questions.length} correct.`
          : "Answer all three questions, then check your reasoning."}
      </p>
    </form>

    <article>
      <p>Structured problem · 8 marks</p>
      <h3>Launch from the kopje</h3>
      <p>
        A stone is projected at 24.0 m/s and 35° above horizontal from a ledge
        12.0 m above level ground. Ignore air resistance and use g = 9.81 m/s².
      </p>
      <ol>
        <li>
          Calculate the initial horizontal and vertical velocity components. <b
            >[2]</b
          >
        </li>
        <li>Determine the time taken to reach the ground. <b>[3]</b></li>
        <li>Calculate the horizontal distance travelled. <b>[1]</b></li>
        <li>
          Explain why changing the angle to 45° does not necessarily maximize
          this range. <b>[2]</b>
        </li>
      </ol>
      <details>
        <summary>Open marking guide</summary>
        <div>
          <p>
            <b>Method:</b> define +x horizontally and +y upward; resolve the launch
            vector before selecting horizontal and vertical equations.
          </p>
          <p><b>Components:</b> v₀x = 19.7 m/s; v₀y = 13.8 m/s.</p>
          <p>
            <b>Time:</b> solve 0 = 12.0 + 13.8t − 4.905t², taking the positive root,
            t ≈ 3.51 s.
          </p>
          <p><b>Distance:</b> x = v₀xt ≈ 69.0 m.</p>
          <p>
            <b>Explanation:</b> 45° is the vacuum optimum only when launch and landing
            heights are equal; the ledge adds flight time.
          </p>
          <p>
            <b>Final check:</b> include SI units, use the positive time root and
            state whether the magnitude is physically plausible.
          </p>
        </div>
      </details>
    </article>
  </div>
</section>

<style>
  .assessment {
    padding: clamp(4rem, 8vw, 8rem) clamp(1.25rem, 6vw, 7rem);
    background: var(--panel);
  }
  header {
    max-width: 58rem;
    margin-bottom: 2.5rem;
  }
  .scope-note {
    max-width: 48rem;
    margin: 1.25rem 0 0;
    padding-left: 1rem;
    border-left: 3px solid var(--coral);
    color: var(--muted);
    line-height: 1.6;
  }
  header p,
  article > p:first-child {
    color: var(--amber);
    font: 800 0.65rem var(--mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  h2 {
    margin: 0;
    font: 600 clamp(2.5rem, 6vw, 5rem) / 0.95 var(--serif);
    letter-spacing: -0.04em;
  }
  .paper-map {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1px;
    margin-bottom: 2rem;
    border: 1px solid var(--line);
    background: var(--line);
  }
  .paper-map article {
    padding: 1.25rem;
    background: var(--night-2);
  }
  .paper-map span {
    color: var(--amber);
    font: 800 0.6rem var(--mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .paper-map strong {
    display: block;
    margin-top: 1.5rem;
    font: 600 1.4rem var(--serif);
  }
  .paper-map p {
    margin-bottom: 0;
    color: var(--muted);
    font-size: 0.85rem;
    line-height: 1.55;
  }
  .assessment-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.9fr);
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
  }
  form,
  article {
    padding: clamp(1.5rem, 4vw, 3rem);
    background: var(--night);
  }
  h3 {
    margin: 0 0 1.5rem;
    font: 600 2rem var(--serif);
  }
  fieldset {
    margin: 0 0 2rem;
    padding: 0;
    border: 0;
  }
  legend {
    margin-bottom: 0.8rem;
    color: var(--ink);
    font-weight: 700;
    line-height: 1.5;
  }
  label {
    display: flex;
    gap: 0.75rem;
    align-items: start;
    padding: 0.75rem;
    border: 1px solid var(--line);
    color: var(--muted);
    cursor: pointer;
  }
  label + label {
    border-top: 0;
  }
  label.chosen {
    color: var(--ink);
    border-color: var(--teal);
  }
  input {
    margin-top: 0.2rem;
    accent-color: var(--teal);
  }
  .feedback {
    margin: 0.75rem 0 0;
    padding-left: 0.75rem;
    border-left: 3px solid var(--coral);
    color: var(--muted);
    line-height: 1.55;
  }
  .feedback.correct {
    border-color: var(--teal);
  }
  button {
    min-height: 3rem;
    padding: 0 1rem;
    border: 0;
    background: var(--amber);
    color: var(--night);
    font: 800 0.68rem var(--mono);
    text-transform: uppercase;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  button:focus-visible,
  summary:focus-visible,
  input:focus-visible {
    outline: 2px solid var(--teal);
    outline-offset: 3px;
  }
  .score {
    min-height: 1.5rem;
    color: var(--teal);
    font: 700 0.75rem var(--mono);
  }
  article {
    background: var(--night-2);
  }
  article > p,
  li {
    color: #adb8b5;
    line-height: 1.7;
  }
  li {
    margin: 0.75rem 0;
    padding-left: 0.4rem;
  }
  li b {
    color: var(--ink);
  }
  details {
    margin-top: 2rem;
    border-top: 1px solid var(--line);
  }
  summary {
    padding: 1rem 0;
    color: var(--teal);
    font: 700 0.7rem var(--mono);
    text-transform: uppercase;
    cursor: pointer;
  }
  details div {
    padding: 0.5rem 1rem;
    border-left: 2px solid var(--teal);
  }
  details p {
    margin: 0 0 0.75rem;
    color: var(--muted);
    line-height: 1.6;
  }
  @media (max-width: 55rem) {
    .paper-map {
      grid-template-columns: 1fr 1fr;
    }
    .assessment-grid {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 34rem) {
    .paper-map {
      grid-template-columns: 1fr;
    }
  }
</style>
