<script lang="ts">
  import { electronBeam, photoelectric, hydrogenTransition, decayAccount, decayTrial } from "./matter-modern-visual-models";

  let { chapterId }: { chapterId: string } = $props();
  let voltage = $state(1.6);
  let field = $state(2);
  let frequency = $state(700);
  let fluxMultiplier = $state(1);
  let upperN = $state(4);
  let absorption = $state(false);
  let time = $state(5);
  let seed = $state(43);
  const baselineFlux = 2e-6 / (6.626e-34 * 7e14);
  let flux = $derived(baselineFlux * fluxMultiplier);
  let beam = $derived(electronBeam(voltage, field));
  let radiusPx = $derived(beam.radiusM * 550);
  let photo = $derived(photoelectric(frequency, flux));
  let transition = $derived(hydrogenTransition(upperN, absorption));
  let upperY = $derived(65 - transition.upperEV * 50);
  let decay = $derived(decayAccount(time));
  let trial = $derived(decayTrial(time, seed));
  let survivors = $derived(trial.filter(Boolean).length);
  let title = $derived(({ q1: "An accelerator, then a steering field", q2: "One photon must pay the escape cost", q3: "An atom’s energy staircase", q4: "Chance in the sample, expectation at the detector" } as Record<string, string>)[chapterId] ?? "Modern physics model");
  let summary = $derived(chapterId === "q1"
    ? `Electric acceleration through ${voltage.toFixed(1)} kV gives ${(beam.kineticJ / 1e-16).toFixed(4)} × 10⁻¹⁶ J. Entry speed ${(beam.speedMS / 1e7).toFixed(3)} × 10⁷ m/s. Magnetic radius ${(beam.radiusM * 100).toFixed(3)} cm at ${field.toFixed(1)} mT; magnetic work is zero.`
    : chapterId === "q2" ? `Frequency ${frequency} THz; photon energy ${photo.photonEV.toFixed(3)} eV. ${photo.emits ? `Allowed maximum electron energy ${photo.kineticEV.toFixed(3)} eV; stopping magnitude ${photo.stoppingV?.toFixed(3)} V.` : "Below the 2.200 eV work function: no single-photon emission and no stopping voltage to assign."} Incident flux ${(flux / 1e12).toFixed(3)} × 10¹² photons/s; power ${(photo.powerW * 1e6).toFixed(3)} μW; saturation current ${(photo.currentA * 1e9).toFixed(3)} nA.`
    : chapterId === "q3" ? `${absorption ? "Absorption" : "Emission"} between n = ${upperN} and n = 2. Photon energy ${transition.photonEV.toFixed(3)} eV, always positive; wavelength ${transition.wavelengthNm.toFixed(2)} nm. Atom energy change ${transition.atomChangeEV.toFixed(3)} eV.`
    : `At ${time.toFixed(1)} minutes, trial ${seed} has ${survivors} of 64 parents surviving; ensemble expectation ${decay.expectedSmallPopulation.toFixed(2)}. Separate large-source expectation: activity ${decay.activityBq.toFixed(2)} Bq; detected net ${decay.netCpm.toFixed(2)} plus background 60 equals gross ${decay.grossCpm.toFixed(2)} counts/min.`);
</script>

<section class="plate" aria-label={title}>
  <header><span class="eyebrow">Interactive scientific plate · {chapterId}</span><h3>{title}</h3></header>
  <div class="layout">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users must be able to focus and horizontally scroll the scientific plate on narrow screens.) -->
    <div class="drawing" role="region" tabindex="0" aria-label={`${title}; diagram scrolls horizontally on small screens`}>
      <svg viewBox="0 0 720 330" role="img" aria-labelledby={`${chapterId}-modern-title ${chapterId}-modern-desc`}>
        <title id={`${chapterId}-modern-title`}>{title}</title>
        <desc id={`${chapterId}-modern-desc`}>{summary}</desc>
        <defs>
          <marker id={`${chapterId}-modern-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="var(--amber)" /></marker>
          <marker id={`${chapterId}-modern-velocity`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="var(--teal)" /></marker>
        </defs>
        {#if chapterId === "q1"}
          <text x="35" y="28" class="caption">01 / ELECTRIC WORK BEFORE MAGNETIC STEERING</text>
          <rect x="320" y="45" width="365" height="250" class="field" />
          {#each [0, 1, 2, 3, 4] as i}
            {#each [0, 1, 2] as j}<text x={335 + i * 75} y={122 + j * 70} class="field-symbol">×</text>{/each}
          {/each}
          <path d="M75 55V180M240 55V180" class="plate-line" />
          <text x="56" y="202">−</text><text x="230" y="202">+</text>
          <text x="86" y="236">ΔV = {voltage.toFixed(1)} kV</text>
          <path d="M110 65H285" class="velocity" marker-end={`url(#${chapterId}-modern-velocity)`} />
          <circle cx="112" cy="65" r="7" class="electron" /><text x="98" y="48">e⁻</text>
          <text x="123" y="114">F electric, v →</text>
          <path d="M215 155H110" class="arrow" marker-end={`url(#${chapterId}-modern-arrow)`} />
          <text x="140" y="177">← E</text>
          <path d={`M285 65H360A${radiusPx} ${radiusPx} 0 0 1 360 ${65 + radiusPx * 2}`} class="trajectory" />
          <path d="M360 65h70" class="velocity" marker-end={`url(#${chapterId}-modern-velocity)`} />
          <text x="438" y="69">v →</text>
          <path d={`M360 65v${Math.min(45, radiusPx)}`} class="arrow" marker-end={`url(#${chapterId}-modern-arrow)`} />
          <text x="375" y="154">F magnetic ↓</text>
          <path d={`M360 ${65 + radiusPx}h${radiusPx}`} class="radius" />
          <text x="490" y="206">r = {(beam.radiusM * 100).toFixed(3)} cm</text>
          <text x="490" y="233">B = {field.toFixed(1)} mT into page ×</text>
          <text x="35" y="286" class="strong">Electric: ΔK = eΔV. Magnetic: F ⟂ v, W = 0.</text>
          <text x="35" y="315" class="note">Arc scale: 550 drawing units/m; field region schematic, not apparatus dimensions.</text>
        {:else if chapterId === "q2"}
          <text x="35" y="28" class="caption">02 / ENERGY PER PHOTON ≠ PHOTONS PER SECOND</text>
          <text x="40" y="65">{frequency} THz photons →</text>
          {#each Array.from({ length: Math.ceil(fluxMultiplier * 3) }, (_, i) => i) as i}
            <path d={`M45 ${95 + i * 22}q8 -10 16 0t16 0t16 0t16 0t16 0h105`} class="photon" marker-end={`url(#${chapterId}-modern-velocity)`} />
          {/each}
          <path d="M230 80V235h35V80Z" class="metal" />
          <text x="202" y="260">metal</text>
          <text x="165" y="285">φ = 2.200 eV</text>
          {#if photo.emits && flux > 0}
            <path d={`M270 128Q315 128 ${330 + photo.kineticEV * 18} 88`} class="arrow" marker-end={`url(#${chapterId}-modern-arrow)`} />
            <circle cx="285" cy="123" r="5" class="electron" />
            <text x="282" y="169">e⁻ escapes</text>
          {:else}
            <text x="280" y="130">{flux === 0 ? "Beam off" : "No escape"}</text>
          {/if}
          <text x="430" y="66">PER-PHOTON LEDGER</text>
          <rect x="450" y="80" width="35" height="140" class="ghost" />
          <rect x="450" y={220 - photo.photonEV * 32} width="35" height={photo.photonEV * 32} class="cold-fill" />
          {#if photo.emits}<rect x="450" y={220 - photo.photonEV * 32} width="35" height={photo.kineticEV * 32} class="hot-fill" />{/if}
          <path d="M425 149.6H660" class="threshold" />
          <text x="500" y="143">φ threshold</text>
          <text x="500" y="108" class="strong">{photo.emits ? `Kmax ${photo.kineticEV.toFixed(3)} eV` : "hf < φ"}</text>
          <text x="430" y="246">hf = {photo.photonEV.toFixed(3)} eV</text>
          <text x="400" y="281">I sat = {(photo.currentA * 1e9).toFixed(3)} nA</text>
          <text x="35" y="316" class="note">Packet count is illustrative; bar height scales with energy, not optical brightness.</text>
        {:else if chapterId === "q3"}
          <text x="35" y="28" class="caption">03 / HYDROGEN LEVELS, NOT PLANETARY ORBITS</text>
          <path d="M160 65H430" class="ghost" /><text x="450" y="69">0 eV · ionisation</text>
          <path d={`M160 ${upperY}H400`} class="level" />
          <text x="38" y={upperY - 10}>n = {upperN}</text><text x="38" y={upperY + 10}>{transition.upperEV.toFixed(3)} eV</text>
          <path d="M160 235H400" class="level" />
          <text x="38" y="227">n = 2</text><text x="38" y="247">−3.400 eV</text>
          <path d={absorption ? `M330 232V${upperY + 3}` : `M330 ${upperY + 3}V232`} class="arrow" marker-end={`url(#${chapterId}-modern-arrow)`} />
          <circle cx="210" cy={absorption ? 235 : upperY} r="7" class="electron" />
          <text x="180" y="269">{absorption ? `n = 2 → ${upperN}` : `n = ${upperN} → 2`}</text>
          <path d={absorption ? "M665 161h-25q-10 -18 -20 0t-20 0t-20 0t-20 0h-55" : "M445 161h25q10 -18 20 0t20 0t20 0t20 0h55"} class="photon" marker-end={`url(#${chapterId}-modern-velocity)`} />
          <text x="445" y="117" class="strong">{absorption ? "Absorb" : "Emit"} {transition.photonEV.toFixed(3)} eV</text>
          <text x="445" y="207">λ = {transition.wavelengthNm.toFixed(2)} nm</text>
          <text x="445" y="234">Photon energy &gt; 0</text>
          <text x="35" y="305" class="note">Vertical level positions scale with energy. Ground state n = 1 lies below this window.</text>
        {:else if chapterId === "q4"}
          <text x="35" y="28" class="caption">04 / A NUCLEUS HAS NO DECAY DEADLINE</text>
          <text x="40" y="60">64-parent simulated trial #{seed}</text>
          {#each trial as alive, i}
            {@const x = 55 + (i % 8) * 26}
            {@const y = 85 + Math.floor(i / 8) * 24}
            {#if alive}<circle cx={x} cy={y} r="6" class="cold-fill" />
            {:else}<path d={`M${x - 4} ${y - 4}l8 8m-8 0l8 -8`} class="decayed" />{/if}
          {/each}
          <text x="40" y="290">● parent · × decayed</text>
          <text x="340" y="65" class="strong">Trial survivors: {survivors}</text>
          <text x="340" y="91">Expected: {decay.expectedSmallPopulation.toFixed(2)} / 64</text>
          <text x="340" y="126">SEPARATE LARGE-SOURCE DETECTOR</text>
          <rect x="340" y="144" width="125" height="64" rx="3" class="source" />
          <text x="350" y="170">A = {decay.activityBq.toFixed(2)}</text><text x="350" y="193">decays/s</text>
          <path d="M480 176H540" class="arrow" marker-end={`url(#${chapterId}-modern-arrow)`} />
          <path d="M555 147v60h110v-60Z" class="detector" />
          <text x="565" y="172">ε = 0.25</text><text x="565" y="194">detector</text>
          <text x="340" y="241">Net {decay.netCpm.toFixed(2)} + background 60</text>
          <text x="340" y="270" class="strong">= {decay.grossCpm.toFixed(2)} counts/min gross</text>
          <text x="340" y="298" class="note">Rates are instantaneous expectations, not counts.</text>
          <text x="40" y="319" class="note">Seeded random lifetimes; scrub time without redrawing. Individual deaths are not predictable.</text>
        {/if}
      </svg>
    </div>
    <aside>
      {#if chapterId === "q1"}
        <label for={`${chapterId}-voltage`}>Accelerating potential <b>{voltage.toFixed(1)} kV</b></label>
        <input id={`${chapterId}-voltage`} type="range" min="0.4" max="3.2" step="0.1" bind:value={voltage} />
        <label for={`${chapterId}-field`}>Magnetic field <b>{field.toFixed(1)} mT</b></label>
        <input id={`${chapterId}-field`} type="range" min="1" max="4" step="0.1" bind:value={field} />
        <p>The electron gains energy between the plates. In B into the page its negative charge makes the initial force downward. Increasing B tightens the arc without changing speed.</p>
        <p class="limit">Starts at rest, perpendicular entry, uniform separate fields; no collisions or radiation. Classical K = mv²/2; here v/c = {beam.fractionC.toFixed(3)}. Relativistic corrections are omitted, not valid at arbitrary voltage.</p>
        <p class="technical">Full-turn period {(beam.periodS * 1e9).toFixed(3)} ns; same K all along the arc.</p>
      {:else if chapterId === "q2"}
        <label for={`${chapterId}-frequency`}>Frequency <b>{frequency} THz</b></label>
        <input id={`${chapterId}-frequency`} type="range" min="300" max="1000" step="10" bind:value={frequency} />
        <label for={`${chapterId}-flux`}>Photon flux multiplier <b>×{fluxMultiplier.toFixed(2)}</b></label>
        <input id={`${chapterId}-flux`} type="range" min="0" max="2" step="0.25" bind:value={fluxMultiplier} />
        <p>Frequency sets energy per photon; flux sets the number arriving. More subthreshold photons still cannot free an electron in this single-photon model.</p>
        <p class="technical">Threshold {photo.thresholdTHz.toFixed(2)} THz. Flux {(flux / 1e12).toFixed(3)} × 10¹²/s. P = flux × hf = {(photo.powerW * 1e6).toFixed(3)} μW.</p>
        <p class="limit">Flux, NOT power, stays fixed as frequency changes. For a fixed 1 cm² spot, intensity = {(photo.powerW / 1e-4).toFixed(4)} W/m². Invented φ = 2.200 eV; above-threshold collected yield 8%, saturated collection, no space charge or multiphoton effects. Kmax is an endpoint, not mean energy.</p>
      {:else if chapterId === "q3"}
        <label for={`${chapterId}-upper`}>Upper level <b>n = {upperN}</b></label>
        <input id={`${chapterId}-upper`} type="range" min="3" max="6" step="1" bind:value={upperN} />
        <label class="toggle"><input id={`${chapterId}-absorption`} type="checkbox" bind:checked={absorption} /> Reverse to absorption</label>
        <p>{absorption ? "An atom in n = 2 absorbs the matching gap energy to reach the upper level." : "The atom loses energy on the downward transition. The emitted photon carries that positive difference."} Larger gaps mean shorter wavelengths.</p>
        <p class="limit">Approximate hydrogen Eₙ = −13.6/n² eV. Stipulated allowed transitions; no fine structure, recoil or linewidth. Negative bound energy is relative to ionisation, never a negative photon energy. h = 6.626 × 10⁻³⁴, c = 3.00 × 10⁸ SI.</p>
      {:else if chapterId === "q4"}
        <label for={`${chapterId}-time`}>Elapsed time <b>{time.toFixed(1)} min</b></label>
        <input id={`${chapterId}-time`} type="range" min="0" max="20" step="0.5" bind:value={time} />
        <button id={`${chapterId}-resample`} type="button" onclick={() => seed += 1}>Draw new 64-parent trial</button>
        <p>Each parent is assigned a random lifetime once per trial; scrubbing time reveals it. New trials fluctuate around 64 × 2⁻ᵗ/⁵, not exactly half every five minutes.</p>
        <p class="limit">Both models have T½ = 5 min. The detector’s separate source starts at 60 Bq (expected N₀ ≈ 25 969), NOT 64 nuclei. Constant efficiency and 60 counts/min background; no daughter counts or dead time. Detector rates are deterministic expectations; real counts fluctuate. Counts alone cannot establish dose.</p>
        <p class="technical">Correct gross − 60 before log analysis. At this time: Nsource ≈ {decay.expectedSourcePopulation.toFixed(0)}; net/60/0.25 = {decay.activityBq.toFixed(2)} Bq.</p>
      {/if}
    </aside>
  </div>
  <p class="readout" aria-live="polite"><span>Model readout · not an answer field</span>{summary}</p>
</section>

<style>
  .plate { min-width: 0; padding: 1.6rem 0; border-block: 1px solid var(--line-strong); color: var(--ink); }
  header { margin-bottom: 1.2rem; }
  .eyebrow, .technical, .readout span { font: 0.7rem var(--mono); color: var(--teal); }
  h3 { margin: 0.5rem 0; font: 400 clamp(1.7rem, 3vw, 2.5rem) var(--serif); }
  .layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(210px, 250px); gap: 1.4rem; align-items: start; }
  .drawing { min-width: 0; max-width: 100%; overflow-x: auto; background: var(--night-2); }
  .drawing:focus-visible, input:focus-visible, button:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }
  svg { display: block; width: 100%; min-width: 600px; height: auto; }
  svg text { fill: var(--ink); font: 14px var(--mono); }
  svg .caption { fill: var(--teal); font-size: 12px; letter-spacing: 1px; }
  svg .strong { font-size: 16px; fill: var(--amber); }
  svg .note { font-size: 12px; fill: var(--muted); }
  .field { fill: color-mix(in srgb, var(--teal) 4%, var(--night)); stroke: var(--line-strong); }
  svg .field-symbol { fill: var(--teal); opacity: 0.3; font-size: 23px; }
  .plate-line { stroke: var(--amber); stroke-width: 5; }
  .trajectory { fill: none; stroke: var(--ink); stroke-width: 3; }
  .electron { fill: var(--amber); stroke: var(--night); stroke-width: 2; }
  .radius { fill: none; stroke: var(--muted); stroke-dasharray: 3 4; }
  .velocity, .photon { fill: none; stroke: var(--teal); stroke-width: 2; }
  .arrow { fill: none; stroke: var(--amber); stroke-width: 2; }
  .metal, .source { fill: var(--night); stroke: var(--amber); stroke-width: 2; }
  .ghost { fill: none; stroke: var(--line-strong); stroke-dasharray: 5 4; }
  .cold-fill { fill: var(--teal); }
  .hot-fill { fill: var(--amber); }
  .threshold { fill: none; stroke: var(--amber); stroke-dasharray: 4 4; }
  .level { stroke: var(--teal); stroke-width: 3; }
  .decayed { fill: none; stroke: var(--muted); opacity: 0.55; }
  .detector { fill: none; stroke: var(--teal); stroke-width: 3; }
  aside { min-width: 0; font-size: 0.84rem; line-height: 1.6; }
  aside p { margin: 0.8rem 0; }
  label { display: block; font: 0.73rem var(--mono); color: var(--muted); }
  label b { color: var(--amber); display: block; margin-top: 0.35rem; }
  input[type="range"] { display: block; width: 100%; min-height: 44px; margin: 0.3rem 0 0.8rem; accent-color: var(--amber); }
  .toggle { display: flex; align-items: center; gap: 0.6rem; min-height: 44px; }
  input[type="checkbox"] { width: 20px; height: 20px; accent-color: var(--teal); flex-shrink: 0; }
  button { min-height: 44px; width: 100%; padding: 0.5rem; border: 1px solid var(--teal); background: var(--night); color: var(--ink); font: 0.73rem var(--mono); cursor: pointer; }
  .limit { color: var(--muted); font-size: 0.76rem; }
  .readout { margin: 1rem 0 0; font: 0.76rem/1.7 var(--mono); overflow-wrap: anywhere; }
  .readout span { display: block; margin-bottom: 0.3rem; }
  @media (max-width: 850px) { .layout { grid-template-columns: minmax(0, 1fr); } aside { max-width: 650px; } }
  @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
</style>
