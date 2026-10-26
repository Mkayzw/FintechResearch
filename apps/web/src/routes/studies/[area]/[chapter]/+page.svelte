<script lang="ts">
  import DepthWorkshop from "$lib/components/DepthWorkshop.svelte";
  import type { PageData } from "./$types";
  let { data }: { data: PageData } = $props();
  let index = $derived(data.area.chapters.findIndex(item => item.id === data.chapter.id));
  let previous = $derived(data.area.chapters[index - 1]);
  let next = $derived(data.area.chapters[index + 1]);
</script>

<svelte:head>
  <title>{data.chapter.title} — Fieldlab Physics</title>
  <meta name="description" content={`${data.chapter.title}: derivations, linked problems, transfer questions and synthetic practical analysis for Zimbabwe Forms 5–6.`} />
</svelte:head>

<main>
  <a class="skip" href="#chapter-workshop">Skip chapter navigation</a>
  <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">FIELDLAB/PHYSICS</a><span>/</span><a href={`/studies/${data.area.id}/`}>{data.area.title}</a></nav>
  <header>
    <p class="eyebrow">Zimbabwe Forms 5–6 · Research-led study</p>
    <h1>{data.area.title}</h1>
    <p class="lede">Chapter {index + 1} of {data.area.chapters.length} · Reason → Solve → Investigate</p>
    <p class="scope">Provisional alignment: interactive models and authored workshops, with source-labelled examination answers in selected chapters. Current syllabus coverage is not verified exhaustive. <a href={`/studies/${data.area.id}/`}>Prerequisites and evidence →</a></p>
  </header>
  <nav class="chapters" aria-label="Choose a chapter">
    {#each data.area.chapters as chapter, i}
      <a href={`/studies/${data.area.id}/${chapter.id}/`} aria-current={chapter.id === data.chapter.id ? "page" : undefined}><span>{String(i + 1).padStart(2, "0")}</span>{chapter.title}</a>
    {/each}
  </nav>
  <div id="chapter-workshop" tabindex="-1">
    <h2 class="sr-only">Chapter workshop</h2>
    {#key data.chapter.id}<DepthWorkshop chapter={data.chapter} />{/key}
  </div>
  <nav class="continuation" aria-label="Continue studying">
    {#if previous}<a href={`/studies/${data.area.id}/${previous.id}/`}>← {previous.title}</a>{:else}<a href={`/studies/${data.area.id}/`}>← Area overview</a>{/if}
    {#if next}<a href={`/studies/${data.area.id}/${next.id}/`}>{next.title} →</a>{:else}<a href="/">Explore another study area →</a>{/if}
  </nav>
</main>

<style>
  main { max-width:80rem; margin:auto; padding:2rem clamp(1rem,4vw,3rem) 4rem; }
  .breadcrumbs { display:flex; flex-wrap:wrap; gap:.8rem; color:var(--teal); font:700 .75rem/1.8 var(--mono); }
  .breadcrumbs a { text-decoration:none; } header { padding:3rem 0 2rem; max-width:65rem; }
  .eyebrow { color:var(--amber); font:700 .7rem/1.8 var(--mono); text-transform:uppercase; letter-spacing:.08em; }
  h1 { margin:.6rem 0 1.5rem; font:500 clamp(2.8rem,7vw,5.5rem)/1.05 var(--serif); letter-spacing:-.04em; overflow-wrap:anywhere; }
  .lede { color:var(--ink); font-size:1.1rem; } .scope { color:var(--muted); font-size:.85rem; line-height:1.8; } .scope a { color:var(--teal); }
  .chapters { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr)); gap:.5rem; }
  .chapters a { display:flex; align-items:baseline; gap:.75rem; padding:1rem; border:1px solid var(--line-strong); text-decoration:none; color:#b4bfbc; font-size:.85rem; line-height:1.5; }
  .chapters span { color:var(--teal); font:700 .7rem var(--mono); }
  .chapters a[aria-current="page"] { border-color:var(--teal); background:#152522; color:var(--ink); }
  .chapters a:hover { border-color:var(--amber); }
  .continuation { display:flex; justify-content:space-between; flex-wrap:wrap; gap:1.5rem; border-top:1px solid var(--line-strong); padding-top:2rem; }
  .continuation a { max-width:30rem; color:var(--teal); line-height:1.6; font-size:.9rem; }
  a:focus-visible { outline:2px solid var(--amber); outline-offset:4px; }
  .skip { position:absolute; left:1rem; top:-10rem; padding:1rem; background:var(--night); color:var(--ink); z-index:10; } .skip:focus { top:1rem; }
  #chapter-workshop:focus { outline:none; }
  @media(max-width:40rem) { header { padding-top:2rem; } .continuation { flex-direction:column; } }
</style>
