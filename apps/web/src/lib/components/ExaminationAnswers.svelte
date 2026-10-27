<script lang="ts">
  import Equation from "./Equation.svelte";
  import type { ExaminationStudy } from "../features/curriculum/examination";

  let { studies, chapterId }: { studies: readonly ExaminationStudy[]; chapterId: string } = $props();
</script>

<section aria-labelledby={`${chapterId}-exam-heading`}>
  <p class="eyebrow">From the physical model to a written answer</p>
  <h4 id={`${chapterId}-exam-heading`}>Examination answers</h4>
  <p>Use the interactive model in <strong>Reason</strong> to understand the mechanism. Here, practise selecting a method and writing the argument a reader can follow. An answer is more than a final number.</p>
  <p class="scope">Historical paper evidence does not establish the full current syllabus. These are independently written solutions and teaching notes, not official marking schemes. Written answers are not automatically graded and no marks are awarded here.</p>

  {#each studies as study}
    <article aria-labelledby={`${chapterId}-${study.id}-title`}>
      <header>
        <p class="eyebrow">{study.evidence}</p>
        <h5 id={`${chapterId}-${study.id}-title`}>{study.title}</h5>
        <a href={study.source} target="_blank" rel="noreferrer">Read the source: {study.reference} ↗</a>
        <p class="provenance">{study.provenance}</p>
      </header>
      <div class="question"><h6>Question</h6><p>{study.prompt}</p></div>
      <p><strong>Read the instruction:</strong> {study.command}</p>
      <aside><h6>Connect it to the model</h6><p>{study.modelConnection}</p></aside>
      <label for={`${chapterId}-${study.id}-attempt`}>Write your answer before opening the solution</label>
      <textarea id={`${chapterId}-${study.id}-attempt`} rows="6" maxlength="12000" placeholder="State the principle, show the working, then give the conclusion with units and conditions. Your draft is not saved."></textarea>
      <details class="solution">
        <summary>Study the method and complete written answer</summary>
        <h6>1. Select a method</h6><p>{study.plan}</p>
        {#if study.diagram}
          <figure>
            <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard focus provides horizontal access to the labelled scientific drawing on narrow screens.) -->
            <div class="drawing" role="region" tabindex="0" aria-label="Worked solution diagram; scroll horizontally on narrow screens">
              {#if study.diagram === "parallel-refraction"}
                <svg viewBox="0 0 720 350" role="img" aria-labelledby={`${chapterId}-${study.id}-drawing-title ${chapterId}-${study.id}-drawing-description`}>
                  <title id={`${chapterId}-${study.id}-drawing-title`}>Transmitted ray through parallel glass–air–glass boundaries</title>
                  <desc id={`${chapterId}-${study.id}-drawing-description`}>The incident ray makes 40 degrees with the normal in glass. It bends away from the normal in air and towards it in the lower glass, emerging parallel to the incident ray, at 50 degrees to the horizontal. The air angle r is not numerically specified.</desc>
                  <defs><marker id={`${chapterId}-${study.id}-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="var(--amber)" /></marker></defs>
                  <rect width="720" height="110" fill="#172b2c" /><rect y="110" width="720" height="120" fill="#0b1017" /><rect y="230" width="720" height="120" fill="#172b2c" />
                  <path d="M20 110H700 M20 230H700" class="boundary" />
                  <path d="M280 20V200 M500 150V330" class="normal" />
                  <path d="M210 25L280 110 M280 110L500 230 M500 230L570 315" class="ray" marker-end={`url(#${chapterId}-${study.id}-arrow)`} />
                  <path d="M280 70A40 40 0 0 0 254.5 79.2 M280 152A42 42 0 0 0 316.9 130.1 M463.1 209.9A42 42 0 0 0 500 188 M500 274A44 44 0 0 0 528 263.9 M542 230A42 42 0 0 1 526.7 262.3" class="angle" />
                  <text x="35" y="65">GLASS</text><text x="35" y="175">AIR</text><text x="35" y="295">SAME GLASS</text>
                  <text x="295" y="42">normal</text><text x="514" y="168">normal</text>
                  <text x="231" y="67">40°</text><text x="297" y="163">r</text><text x="471" y="185">r</text><text x="456" y="288">40°</text><text x="549" y="267">50°</text>
                  <text x="35" y="335" class="drawing-note">Schematic · angles in air left symbolic · transmitted path assumed</text>
                </svg>
              {:else}
                <svg viewBox="0 0 760 330" role="img" aria-labelledby={`${chapterId}-${study.id}-drawing-title ${chapterId}-${study.id}-drawing-description`}>
                  <title id={`${chapterId}-${study.id}-drawing-title`}>Labelled Young double-slit apparatus</title>
                  <desc id={`${chapterId}-${study.id}-drawing-description`}>A monochromatic red source illuminates narrow source slit S0, which illuminates double slits S1 and S2. Their diffracted waves overlap at a distant screen. Slit separation d is chosen as 0.30 millimetres and screen distance D as 2.0 metres; adjacent bright fringes have separation beta. Dimensions are schematic.</desc>
                  <rect width="760" height="330" fill="#0b1017" />
                  <circle cx="65" cy="145" r="18" fill="#c96d61" /><text x="25" y="220">Red source</text>
                  <path d="M180 65V140 M180 150V235 M330 50V100 M330 110V180 M330 190V240 M610 45V245" class="boundary" />
                  <path d="M85 145H180 M180 145L330 105L610 155 M180 145L330 185L610 155" class="ray" />
                  <path d="M330 105L610 75 M330 185L610 235" class="spread" />
                  <text x="140" y="45">Source slit S₀</text><text x="342" y="88">S₁</text><text x="342" y="210">S₂</text><text x="280" y="30">Double slits</text><text x="575" y="30">Screen</text>
                  <path d="M295 105V185 M289 105H301 M289 185H301 M330 260H610 M330 254V266 M610 254V266" class="dimension" />
                  <text x="270" y="150">d</text><text x="462" y="283">D</text>
                  <path d="M598 75H622 M598 115H622 M598 155H622 M598 195H622 M598 235H622" class="fringes" />
                  <path d="M650 115V155 M644 115H656 M644 155H656" class="dimension" /><text x="667" y="141">β</text>
                  <text x="25" y="310" class="drawing-note">Our estimates: d = 0.30 mm; D = 2.0 m · diagram not to scale</text>
                </svg>
              {/if}
            </div>
            <figcaption>Independently drawn worked solution, not a reproduced paper figure. On a narrow screen, focus the drawing and scroll horizontally to read every label.</figcaption>
          </figure>
        {/if}
        <h6>2. Show the reasoning and working</h6>
        <p class="scope">If an equation exceeds the screen width, focus its box and use the left/right arrow keys, or scroll it horizontally.</p>
        <ol>{#each study.steps as step}<li><p>{step.explanation}</p>{#if step.formula}
          <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard focus lets readers scroll a long worked equation without moving the page.) -->
          <div class="equation" role="region" tabindex="0" aria-label="Worked equation; scroll horizontally if needed"><Equation formula={step.formula} display /></div>
        {/if}</li>{/each}</ol>
        <div class="answer"><h6>3. Write the conclusion</h6>{#each study.answer as paragraph}<p>{paragraph}</p>{/each}</div>
        <h6>4. Diagnose an incomplete answer</h6>
        <blockquote>{study.weakAnswer}</blockquote><p>{study.correction}</p>
        <h6>Review your own response</h6>
        <ul>{#each study.review as item}<li>{item}</li>{/each}</ul>
        <p class="scope">Compare the physical meaning and completeness of your reasoning, not whether your wording exactly matches ours. These checks are teaching guidance, not a point-by-point official mark allocation.</p>
      </details>
    </article>
  {/each}
</section>

<style>
  section { max-width:65rem; min-width:0; }
  .eyebrow { color:var(--teal); font:800 .68rem/1.6 var(--mono); letter-spacing:.08em; text-transform:uppercase; }
  h4 { font:500 clamp(1.7rem,3vw,2.6rem)/1.2 var(--serif); margin:.6rem 0 1rem; }
  h5 { font:500 clamp(1.5rem,2.7vw,2.1rem)/1.3 var(--serif); margin:.5rem 0 1rem; }
  h6 { color:var(--ink); font:700 .95rem/1.5 var(--sans); margin:1.5rem 0 .5rem; }
  p,li,blockquote { color:#b4bfbc; font-size:.95rem; line-height:1.85; overflow-wrap:anywhere; }
  article { margin-top:2.5rem; padding-top:2rem; border-top:1px solid var(--line-strong); }
  a { display:inline-block; color:var(--teal); font:.75rem/1.8 var(--mono); overflow-wrap:anywhere; }
  .scope,.provenance { font-size:.8rem; color:var(--muted); line-height:1.75; }
  .question { margin-top:1.5rem; padding:.1rem 1.25rem .5rem; background:var(--night); border-left:3px solid var(--amber); }
  aside { border:1px solid var(--line-strong); padding:0 1.25rem .5rem; margin:1.5rem 0; }
  label { display:block; color:var(--ink); font-size:.9rem; line-height:1.6; }
  textarea { box-sizing:border-box; display:block; width:100%; margin:.75rem 0 1.5rem; padding:1rem; resize:vertical; background:var(--night); border:1px solid var(--line-strong); color:var(--ink); font:inherit; line-height:1.8; }
  textarea::placeholder { color:var(--muted); }
  details { border-top:1px solid var(--line-strong); border-bottom:1px solid var(--line-strong); }
  summary { padding:1rem .25rem; color:var(--teal); cursor:pointer; line-height:1.7; font-size:.9rem; }
  ol,ul { padding-left:1.5rem; } li { padding:.25rem 0; }
  .equation { overflow-x:auto; max-width:100%; }
  .equation :global(.display) { overflow:visible; }
  figure { margin:1.5rem 0; min-width:0; }
  .drawing { overflow-x:auto; border:1px solid var(--line-strong); background:var(--night); }
  svg { display:block; width:100%; min-width:40rem; height:auto; }
  svg text { fill:var(--ink); font:16px var(--sans); }
  svg .drawing-note { fill:var(--muted); font-size:14px; }
  .boundary { stroke:var(--teal); stroke-width:3; fill:none; }
  .normal { stroke:#899a9e; stroke-width:1.5; stroke-dasharray:5 5; fill:none; }
  .ray { stroke:var(--amber); stroke-width:3; fill:none; }
  .angle,.dimension { stroke:var(--ink); stroke-width:1.5; fill:none; }
  .spread { stroke:var(--amber); stroke-width:1; stroke-dasharray:4 4; fill:none; }
  .fringes { stroke:#e08b7b; stroke-width:7; }
  figcaption { color:var(--muted); font-size:.8rem; line-height:1.7; margin-top:.6rem; }
  .answer { padding:.1rem 1.25rem .5rem; margin-top:1.5rem; border-left:3px solid var(--teal); background:#142522; }
  blockquote { margin:.75rem 0; padding:.5rem 1rem; border-left:2px solid var(--muted); font-style:italic; }
  strong { color:var(--ink); }
  summary:focus-visible,textarea:focus-visible,a:focus-visible,.equation:focus-visible,.drawing:focus-visible { outline:2px solid var(--amber); outline-offset:4px; }
  @media(max-width:36rem) { .question,aside,.answer { padding-inline:.85rem; } }
</style>
