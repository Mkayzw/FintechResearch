<script lang="ts">
  let { label, value }: { label: string; value: string } = $props();
</script>

<div><span>{label}</span><strong>{value}</strong></div>

<style>
  div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 0;
    border-top: 1px solid var(--line);
  }
  span {
    color: var(--muted);
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  strong {
    color: var(--teal);
    font: 700 0.72rem var(--mono);
    text-align: right;
  }
</style>
