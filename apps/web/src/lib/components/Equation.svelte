<script lang="ts">
  import katex from "katex";

  let {
    formula,
    display = false,
    label,
  }: { formula: string; display?: boolean; label?: string } = $props();
  let html = $derived(
    katex.renderToString(formula, {
      displayMode: display,
      throwOnError: false,
      output: "html",
    }),
  );
</script>

<span class:display aria-label={label ?? formula}>{@html html}</span>

<style>
  span {
    color: var(--ink);
  }
  .display {
    display: block;
    overflow-x: auto;
    padding: 0.75rem 0;
    font-size: clamp(0.85rem, 2vw, 1.05rem);
  }
</style>
