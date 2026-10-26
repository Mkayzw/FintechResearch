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
  .answer { padding:.1rem 1.25rem .5rem; margin-top:1.5rem; border-left:3px solid var(--teal); background:#142522; }
  blockquote { margin:.75rem 0; padding:.5rem 1rem; border-left:2px solid var(--muted); font-style:italic; }
  strong { color:var(--ink); }
  summary:focus-visible,textarea:focus-visible,a:focus-visible,.equation:focus-visible { outline:2px solid var(--amber); outline-offset:4px; }
  @media(max-width:36rem) { .question,aside,.answer { padding-inline:.85rem; } }
</style>
