<script lang="ts">
  import GeneralVisual from "./GeneralVisual.svelte";
  import WavesVisual from "./WavesVisual.svelte";
  import ElectricityVisual from "./ElectricityVisual.svelte";
  import ElectronicsVisual from "./ElectronicsVisual.svelte";
  import MatterVisual from "./MatterVisual.svelte";
  import ModernVisual from "./ModernVisual.svelte";
  import CommunicationVisual from "./CommunicationVisual.svelte";
  import "./visual-explainer.css";
  let { chapterId }: { chapterId: string } = $props();
</script>

{#if /^[gweamqc]\d+$/.test(chapterId)}
  <div class="visual-explainer" data-chapter={chapterId}>
    {#key chapterId}
      {#if chapterId.startsWith("g")}<GeneralVisual {chapterId} />
      {:else if chapterId.startsWith("w")}<WavesVisual {chapterId} />
      {:else if chapterId.startsWith("e")}<ElectricityVisual {chapterId} />
      {:else if chapterId.startsWith("a")}<ElectronicsVisual {chapterId} />
      {:else if chapterId.startsWith("m")}<MatterVisual {chapterId} />
      {:else if chapterId.startsWith("q")}<ModernVisual {chapterId} />
      {:else if chapterId.startsWith("c")}<CommunicationVisual {chapterId} />{/if}
    {/key}
  </div>
{/if}
