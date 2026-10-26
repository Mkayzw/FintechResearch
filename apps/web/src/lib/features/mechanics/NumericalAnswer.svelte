<script lang="ts">
  import { checkNumericalAnswer, type NumericalPart } from "./numerical-answer";
  let { part, prefix }: { part: NumericalPart; prefix: string } = $props();
  let response = $state("");
  let feedback = $state<ReturnType<typeof checkNumericalAnswer>>();
</script>

<form onsubmit={event => { event.preventDefault(); feedback = checkNumericalAnswer(part, response); }}>
  <label for={`${prefix}-${part.id}`}>{part.prompt}</label>
  <div class="entry">
    <input id={`${prefix}-${part.id}`} type="number" step="any" inputmode="decimal" value={response} oninput={event => { response = event.currentTarget.value; feedback = undefined; }} aria-describedby={`${prefix}-${part.id}-unit ${prefix}-${part.id}-feedback`} />
    <span id={`${prefix}-${part.id}-unit`}>{part.unit}</span>
    <button>Check this step</button>
  </div>
  <p id={`${prefix}-${part.id}-feedback`} class="feedback" class:correct={feedback?.correct} aria-live="polite">{feedback?.message ?? "Use the unit shown. Signs matter; equivalent rounded results are accepted."}</p>
  <details><summary>Need a method hint?</summary><p>{part.hint}</p></details>
  <details><summary>Compare with full working</summary><p>{part.working}</p></details>
</form>

<style>
  form { padding:1.5rem 0; border-top:1px solid var(--line); }
  label { display:block; font-weight:600; line-height:1.6; margin-bottom:1rem; }
  .entry { display:flex; align-items:center; flex-wrap:wrap; gap:.75rem; }
  input { width:9rem; max-width:100%; min-height:2.8rem; border:1px solid var(--line-strong); background:var(--night); color:var(--ink); padding:.6rem; font:500 1rem var(--mono); }
  .entry span { color:var(--muted); font:500 .8rem var(--mono); }
  button { min-height:2.8rem; padding:.7rem 1rem; background:var(--amber); color:var(--night); border:0; cursor:pointer; font:800 .7rem var(--mono); }
  .feedback { padding:.75rem 1rem; border-left:2px solid var(--amber); color:#b4bfbc; font-size:.85rem; line-height:1.7; }
  .feedback.correct { border-color:var(--teal); color:var(--teal); }
  details { margin-top:.5rem; } summary { cursor:pointer; color:var(--teal); font-size:.8rem; padding:.6rem 0; }
  details p { color:#b4bfbc; font-size:.85rem; line-height:1.7; padding:.5rem 1rem; border-left:1px solid var(--line-strong); }
  input:focus-visible,button:focus-visible,summary:focus-visible { outline:2px solid var(--teal); outline-offset:3px; }
</style>
