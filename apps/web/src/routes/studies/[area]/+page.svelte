<script lang="ts">
  import type { PageData } from "./$types";
  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.area.title} — Fieldlab Physics</title>
  <meta name="description" content={`${data.area.description} Reasoning workshops with structured problems and practical analysis.`} />
</svelte:head>

<main>
  <a class="back" href="/">← Fieldlab / Curriculum atlas</a>
  <header>
    <p class="eyebrow">Zimbabwe Forms 5–6 · Provisional alignment</p>
    <h1>{data.area.title}</h1>
    <p class="lede">{data.area.description}</p>
    <p>Build the argument, solve linked problems, change the assumptions, and test a model against practical data.</p>
  </header>
  <aside aria-label="Study scope">
    <p><strong>Before you begin:</strong> {data.area.prerequisites}</p>
    <p><strong>Coverage evidence:</strong> {data.area.evidence}</p>
    <p>These are independently authored study workshops, not official past papers or a verified complete syllabus. Practical readings are explicitly synthetic; numerical checks do not grade written reasoning. Progress is not saved.</p>
  </aside>
  <ol aria-label="Chapters">
    {#each data.area.chapters as chapter, index}
      <li><a href={`/studies/${data.area.id}/${chapter.id}/`}><span class="eyebrow">{String(index + 1).padStart(2, "0")} · Reason / Solve / Investigate</span><h2>{chapter.title}</h2><span class="enter">Open workshop →</span></a></li>
    {/each}
  </ol>
  <footer><a href="/studies/general/">Measurement foundations</a><a href="/mechanics/">Mechanics workshops</a><a href="/">All study areas</a></footer>
</main>

<style>
  main { max-width:76rem; margin:auto; padding:2rem clamp(1rem,5vw,4rem) 4rem; }
  .back,.eyebrow,.enter { font:700 .72rem/1.8 var(--mono); color:var(--teal); }
  .back { text-decoration:none; } header { padding:4rem 0 2rem; max-width:58rem; }
  h1 { font:500 clamp(2.8rem,7vw,6rem)/1.02 var(--serif); letter-spacing:-.035em; margin:.75rem 0 1.5rem; overflow-wrap:anywhere; }
  p { color:#b4bfbc; line-height:1.8; } .lede { font-size:1.2rem; } strong { color:var(--ink); }
  aside { padding:1rem 1.5rem; border:1px solid var(--line-strong); border-left:3px solid var(--amber); }
  ol { list-style:none; margin:3rem 0; padding:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1rem; }
  li a { display:flex; flex-direction:column; height:100%; gap:1rem; padding:2rem; text-decoration:none; border:1px solid var(--line-strong); background:var(--night-2); }
  h2 { font:500 1.8rem/1.25 var(--serif); margin:.5rem 0 1rem; } .enter { margin-top:auto; color:var(--amber); }
  li a:hover { border-color:var(--teal); } a:focus-visible { outline:2px solid var(--amber); outline-offset:4px; }
  footer { display:flex; flex-wrap:wrap; gap:1.5rem; border-top:1px solid var(--line); padding-top:2rem; color:var(--teal); font-size:.85rem; }
  @media(max-width:42rem) { ol { grid-template-columns:1fr; } li a { padding:1.25rem; } header { padding-top:2rem; } }
</style>
