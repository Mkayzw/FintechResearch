<script lang="ts">
  let { chapterId }: { chapterId: string } = $props();
  let diameterBound = $state(0.01);
  let middleOffset = $state(0.5);
  let lineOffset = $state(0);
  let areaBound = $derived(200 * diameterBound / 0.4);
  let exactAreaBound = $derived(100 * ((0.4 + diameterBound) ** 2 / 0.4 ** 2 - 1));
  let residuals = $derived([0, 0, middleOffset, 0, 0].map(value => value - lineOffset));
  let compatible = $derived(residuals.every(value => Math.abs(value) <= 0.2 + 1e-9));
  const sy = (y: number) => 275 - y * 22;
</script>

<section aria-labelledby={`${chapterId}-visual-title`}>
  <p class="scene-kicker">Visual argument · Measurement is a model</p>
  <h4 class="scene-title" id={`${chapterId}-visual-title`}>{chapterId === "g1" ? "A tiny diameter error becomes a larger area error." : "The middle reading can overturn a convincing line."}</h4>
  <div class="scene-layout">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard focus enables horizontal scrolling of the scientific diagram.) -->
    <div class="scene-drawing" role="region" tabindex="0" aria-label="Scrollable measurement diagram">
      <svg viewBox="0 0 720 330" role="img" aria-labelledby={`${chapterId}-scene-title ${chapterId}-scene-desc`}>
        <title id={`${chapterId}-scene-title`}>{chapterId === "g1" ? "Magnified wire section and uncertainty contributions" : "All five measurement bounds compared with a proposed line"}</title>
        <desc id={`${chapterId}-scene-desc`}>{chapterId === "g1" ? `Diameter bound ${diameterBound.toFixed(3)} millimetres gives approximately ${areaBound.toFixed(2)} percent area bound.` : `Residuals are ${residuals.map(r => r.toFixed(2)).join(", ")}. The line is ${compatible ? "compatible" : "incompatible"} with all vertical bounds of 0.20.`}</desc>
        {#if chapterId === "g1"}
          <text x="30" y="32">WIRE CROSS-SECTION · MAGNIFIED</text>
          <circle cx="165" cy="158" r={70 * (1 + diameterBound / 0.4)} fill="#e5b66a" opacity=".25" stroke="#e5b66a" />
          <circle cx="165" cy="158" r="70" fill="#274a44" stroke="#72c9b5" stroke-width="2" />
          <circle cx="165" cy="158" r={70 * (1 - diameterBound / 0.4)} fill="none" stroke="#e5b66a" stroke-dasharray="4 4" />
          <path d="M95 245 H235 M95 237 V253 M235 237 V253" class="wire" />
          <text x="165" y="278" text-anchor="middle">d = 0.400 ± {diameterBound.toFixed(3)} mm</text>
          <text x="165" y="162" text-anchor="middle" class="scene-big">A = πd²/4</text>
          <text x="350" y="65">RESISTIVITY BOUND CONTRIBUTIONS</text>
          <text x="350" y="101">Diameter²</text><rect x="350" y="115" width={areaBound * 14} height="18" fill="#e5b66a" /><text x="350" y="155" class="scene-amber">{areaBound.toFixed(2)}%</text>
          <text x="350" y="188">Resistance</text><rect x="350" y="199" width="14" height="18" fill="#72c9b5" /><text x="390" y="214">1.00%</text>
          <text x="350" y="251">Length</text><rect x="350" y="262" width="11.67" height="18" fill="#72c9b5" /><text x="390" y="277">0.83%</text>
          <text x="350" y="312">Total ≈ {(areaBound + 1 + 100 / 120).toFixed(2)}%</text>
        {:else}
          <text x="30" y="30">SYNTHETIC BOUNDS · NOT CONFIDENCE INTERVALS</text>
          <path d="M70 45 V275 H655" class="wire" />
          <text x="35" y="65">y</text><text x="665" y="280">x</text>
          <line x1="90" y1={sy(1 + lineOffset)} x2="610" y2={sy(9 + lineOffset)} stroke="#72c9b5" stroke-width="2" />
          {#each [0, 1, 2, 3, 4] as x}
            {@const reading = 2 * x + 1 + (x === 2 ? middleOffset : 0)}
            {@const failed = Math.abs(residuals[x]!) > 0.2 + 1e-9}
            <line x1={90 + x * 130} x2={90 + x * 130} y1={sy(reading + 0.2)} y2={sy(reading - 0.2)} stroke={failed ? "#e5b66a" : "#72c9b5"} stroke-width="3" />
            <circle cx={90 + x * 130} cy={sy(reading)} r="4" fill={failed ? "#e5b66a" : "#72c9b5"} />
            <text x={90 + x * 130} y="300" text-anchor="middle">{x}</text>
          {/each}
          <text x="90" y="65" class="scene-big">{compatible ? "Every bound admits the line" : "At least one bound rejects it"}</text>
          <text x="90" y="90">y = 2x + {(1 + lineOffset).toFixed(2)} · each bound ±0.20</text>
          <text x="405" y="186" class="scene-amber">Middle residual: {residuals[2]!.toFixed(2)}</text>
        {/if}
      </svg>
    </div>
    <div class="scene-controls">
      {#if chapterId === "g1"}
        <label for="g1-diameter-bound">Diameter bound / mm: {diameterBound.toFixed(3)}<input id="g1-diameter-bound" type="range" min="0.001" max="0.04" step="0.001" bind:value={diameterBound} /></label>
        <p class="scene-result">Area bound ≈ {areaBound.toFixed(2)}%. Exact upper extreme: +{exactAreaBound.toFixed(2)}%. The linear approximation becomes less accurate as the bound grows.</p>
        <p>Improve the dominant measurement, not just the easiest one. Halving the diameter bound halves its first-order contribution; repeating a biased reading does not fix calibration.</p>
      {:else}
        <label for="g2-middle">Middle reading offset: {middleOffset.toFixed(2)}<input id="g2-middle" type="range" min="0" max="0.8" step="0.05" bind:value={middleOffset} /></label>
        <label for="g2-line">Line intercept shift: {lineOffset.toFixed(2)}<input id="g2-line" type="range" min="-0.3" max="0.5" step="0.05" bind:value={lineOffset} /></label>
        <p class="scene-result">{compatible ? "Compatible with every stipulated bound—not proof of a unique law." : "Incompatible. Check each residual, not just the endpoints or the apparent trend."}</p>
        <p>Try a middle offset of 0.40 and a line shift of 0.20: the line just meets every bound. At 0.50, no intercept shift at this fixed gradient can satisfy both endpoints and centre.</p>
      {/if}
    </div>
  </div>
  <p class="scene-assumption">{chapterId === "g1" ? "Illustrative wire: nominal d = 0.400 mm, R = 3.00 ± 0.03 Ω, L = 1.20 ± 0.01 m; fixed temperature. Bounds, not standard deviations. Cross-section magnified; contribution bars share a percentage scale." : "Separate illustrative dataset, not the investigation answers. Exact x, stipulated constant vertical bounds, fixed candidate gradient 2. No real readings or confidence levels are implied."}</p>
</section>
