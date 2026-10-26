<script lang="ts">
  import { amplitudeModulation, aliasFrequency, quantise, linkBudget } from "./signal-visual-models";

  let { chapterId }: { chapterId: string } = $props();
  let depth = $state(0.6);
  let messagePhase = $state(0);
  let sampleRateKhz = $state(12);
  let bits = $state(8);
  let lengthKm = $state(3);
  let noiseMicrowatts = $state(2);
  const titles: Record<string, string> = {
    c1: "Let the message shape a carrier, not replace it",
    c2: "A clock chooses when. A code chooses how finely.",
    c3: "A weaker signal is not the same thing as added noise",
  };
  let startTime = $derived(messagePhase / 2400);
  let am = $derived(amplitudeModulation(depth, startTime));
  let alias = $derived(aliasFrequency(9400, sampleRateKhz * 1000));
  let quantiser = $derived(quantise(1.011, bits));
  let budget = $derived(linkBudget(lengthKm, noiseMicrowatts / 1000));
  // Coordinate mapping only; physical models are shared with contract tests.
  const line = (count: number, point: (fraction: number) => [number, number]) =>
    Array.from({ length: count }, (_, i) => point(i / (count - 1)).join(",")).join(" ");
  let messageLine = $derived(line(241, (u) => [200 + 470 * u,
    81 - 25 * amplitudeModulation(depth, u / 2400).message]));
  let carrierLine = $derived(line(1001, (u) => [200 + 470 * u,
    159 - 4 * amplitudeModulation(depth, startTime + u * 12.5e-6).carrier]));
  let amLine = $derived(line(1001, (u) => [200 + 470 * u,
    254 - 4 * amplitudeModulation(depth, startTime + u * 12.5e-6).signal]));
  let envelopeUpper = $derived(line(101, (u) => [200 + 470 * u,
    254 - 4 * amplitudeModulation(depth, startTime + u * 12.5e-6).envelope]));
  let envelopeLower = $derived(line(101, (u) => [200 + 470 * u,
    254 + 4 * amplitudeModulation(depth, startTime + u * 12.5e-6).envelope]));
  const toneVoltage = (frequency: number, time: number) => 2.048 + 1.5 * Math.cos(2 * Math.PI * frequency * time);
  let trueTone = $derived(line(601, (u) => [65 + 590 * u, 161 - 48 * (toneVoltage(9400, u * 0.0006) - 2.048)]));
  let aliasTone = $derived(line(601, (u) => [65 + 590 * u, 161 - 48 * (toneVoltage(alias, u * 0.0006) - 2.048)]));
  const voltageX = (voltage: number) => 65 + (voltage - 0.88) / 0.28 * 590;
  let description = $derived(chapterId === "c1"
    ? `AM depth ${depth.toFixed(2)}, envelope ${am.minimum.toFixed(2)} to ${am.maximum.toFixed(2)} V peak. The 800 kHz carrier is shown in a 12.5 microsecond zoom at message phase ${messagePhase.toFixed(2)} turns.`
    : chapterId === "c2"
      ? `A 9.4 kHz cosine sampled at ${sampleRateKhz} kilosamples per second appears at ${(alias / 1000).toFixed(2)} kHz in the low-pass Nyquist interval. Independently, ${bits} bits reconstruct 1.011 V as ${quantiser.reconstructed.toFixed(4)} V.`
      : `A ${lengthKm} km link loses ${budget.lossDb.toFixed(2)} dB. Receiver signal is ${budget.signalMw.toFixed(4)} mW; separately added noise is ${noiseMicrowatts.toFixed(1)} microwatts. SNR ${budget.snrDb.toFixed(2)} dB, with no error-rate prediction.`);
</script>

<section class="plate" aria-label={titles[chapterId] ?? "Communication model"}>
  <header><p class="eyebrow">Communication / follow the information</p><h3>{titles[chapterId]}</h3></header>
  <div class="layout">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard focus enables native horizontal scrolling of the scientific plate.) -->
    <div class="drawing" tabindex="0" role="region" aria-label="Scientific diagram; scroll horizontally on small screens">
      <svg viewBox="0 0 720 330" role="img" aria-labelledby={`${chapterId}-signal-title ${chapterId}-signal-desc`}>
        <title id={`${chapterId}-signal-title`}>{titles[chapterId]}</title>
        <desc id={`${chapterId}-signal-desc`}>{description}</desc>
        <defs>
          <marker id={`${chapterId}-signal-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="var(--teal)" /></marker>
          <marker id={`${chapterId}-noise-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="var(--amber)" /></marker>
        </defs>
        {#if chapterId === "c1"}
          <text x="35" y="26">CARRIER-PRESENT AM / two time scales, true frequency ratio</text>
          <text x="35" y="72" class="amber">message, normalised</text>
          <text x="35" y="94" class="muted">2.40 kHz · −1 to +1</text>
          <line x1="200" y1="81" x2="670" y2="81" class="guide" />
          <polyline points={messageLine} class="amber stroke" />
          <circle cx={200 + 470 * messagePhase} cy={81 - 25 * am.message} r="5" fill="var(--amber)" />
          <text x="200" y="125" class="muted">0</text><text x="490" y="125" class="muted">one message period: 416.7 µs</text>
          <text x="35" y="155" class="teal">carrier / V</text>
          <text x="35" y="177" class="muted">800 kHz · ±5 V</text>
          <line x1="200" y1="159" x2="670" y2="159" class="guide" />
          <polyline points={carrierLine} class="teal stroke" />
          <text x="200" y="204" class="muted">RF zoom begins at t₀ = {(startTime * 1e6).toFixed(1)} µs</text>
          <text x="35" y="251" class="teal">AM output / V</text>
          <text x="35" y="273" class="amber">dashed: ±E(t)</text>
          <line x1="200" y1="254" x2="670" y2="254" class="guide" />
          <polyline points={amLine} class="teal stroke" />
          <polyline points={envelopeUpper} class="amber envelope" />
          <polyline points={envelopeLower} class="amber envelope" />
          <text x="200" y="310">t₀</text><text x="544" y="310">t₀ + 12.5 µs</text>
          <text x="35" y="326" class="muted">RF rows share time & voltage scales; the message row does not.</text>
        {:else if chapterId === "c2"}
          <text x="35" y="27">SAMPLER / discrete times, not rounded voltages</text>
          <text x="35" y="50" class="teal">solid: input 9.40 kHz cosine</text>
          <text x="360" y="50" class="amber">dashed: {(alias / 1000).toFixed(2)} kHz equivalent</text>
          <text x="35" y="72" class="muted">V = 2.048 + 1.500 cos(2πft); dots are unquantised samples</text>
          <line x1="65" y1="161" x2="655" y2="161" class="guide" />
          <polyline points={trueTone} class="teal stroke" />
          <polyline points={aliasTone} class="amber envelope" />
          {#each Array.from({ length: Math.floor(0.6 * sampleRateKhz) + 1 }, (_, n) => n) as n}
            {@const time = n / (sampleRateKhz * 1000)}
            {@const x = 65 + time / 0.0006 * 590}
            {@const y = 161 - 48 * (toneVoltage(9400, time) - 2.048)}
            <line x1={x} y1="161" x2={x} y2={y} class="sample-stem" />
            <circle cx={x} cy={y} r="4.5" fill="var(--ink)" />
          {/each}
          <text x="65" y="249">0</text><text x="555" y="249">0.60 ms →</text>
          <text x="35" y="272">QUANTISER / independent fixed sample: 1.011 V</text>
          <line x1="65" y1="291" x2="655" y2="291" class="apparatus" />
          {#each Array.from({ length: Math.ceil(0.28 / quantiser.step) + 2 }, (_, j) => Math.floor(0.88 / quantiser.step) + j) as k}
            {@const boundary = k * quantiser.step}
            {#if boundary >= 0.88 && boundary <= 1.16}
              <line x1={voltageX(boundary)} y1="285" x2={voltageX(boundary)} y2="298" class="interval" />
            {/if}
          {/each}
          <rect x={Math.max(65, voltageX(quantiser.code * quantiser.step))} y="280" width={Math.min(655, voltageX((quantiser.code + 1) * quantiser.step)) - Math.max(65, voltageX(quantiser.code * quantiser.step))} height="21" fill="var(--amber)" opacity=".22" />
          <path d={`M${voltageX(1.011)} 276 v25`} class="teal stroke" />
          <circle cx={voltageX(quantiser.reconstructed)} cy="291" r="5" fill="var(--amber)" />
          <text x="65" y="320">0.880 V</text><text x="250" y="320" class="amber">● midpoint of selected interval</text><text x="602" y="320">1.160 V</text>
        {:else if chapterId === "c3"}
          <text x="35" y="28">A LINK BUDGET / signal power is traced in teal</text>
          <rect x="40" y="95" width="100" height="94" rx="4" class="instrument" />
          <text x="90" y="126" text-anchor="middle">source</text><text x="90" y="150" text-anchor="middle" class="teal">5.00 mW</text>
          <text x="90" y="172" text-anchor="middle" class="muted">mean Pₜ</text>
          <path d="M140 142 H195" class="teal stroke" marker-end={`url(#${chapterId}-signal-arrow)`} />
          <path d="M200 110 H410 V174 H200 Z M210 120 H400 M210 164 H400" class="apparatus" />
          <text x="305" y="141" text-anchor="middle">{lengthKm.toFixed(2)} km channel</text>
          <text x="305" y="160" text-anchor="middle" class="muted">2.20 dB/km</text>
          <text x="200" y="206" class="muted">connections: +1.40 dB total</text>
          <path d="M410 142 H465" class="teal stroke" marker-end={`url(#${chapterId}-signal-arrow)`} />
          <circle cx="484" cy="142" r="16" class="instrument" /><text x="484" y="147" text-anchor="middle">+</text>
          <path d="M500 142 H548" class="teal stroke" marker-end={`url(#${chapterId}-signal-arrow)`} />
          <rect x="555" y="95" width="120" height="94" rx="4" class="instrument" />
          <text x="615" y="125" text-anchor="middle">receiver</text><text x="615" y="150" text-anchor="middle" class="teal">{budget.signalMw.toFixed(3)} mW</text><text x="615" y="172" text-anchor="middle" class="muted">signal only</text>
          <path d="M484 71 V119" class="amber stroke" marker-end={`url(#${chapterId}-noise-arrow)`} />
          <text x="370" y="54" class="amber">additive noise: {noiseMicrowatts.toFixed(1)} µW</text>
          <text x="40" y="238">Received signal / mW · fixed scale 0–5</text>
          <rect x="40" y="250" width="380" height="14" fill="var(--night-2)" />
          <rect x="40" y="250" width={380 * budget.signalMw / 5} height="14" fill="var(--teal)" />
          <text x="40" y="282">0</text><text x="410" y="282">5</text>
          <text x="465" y="244" class="teal">signal: {budget.signalMw.toFixed(4)} mW</text>
          <text x="465" y="266" class="amber">noise: {budget.noiseMw.toFixed(4)} mW</text>
          <text x="465" y="288">sum: {budget.totalMw.toFixed(4)} mW</text>
          <text x="40" y="318" class="muted">Noise enters after attenuation here; it is not another loss coefficient.</text>
        {/if}
      </svg>
    </div>
    <aside aria-label="Visual model controls and interpretation">
      {#if chapterId === "c1"}
        <label for={`${chapterId}-modulation-depth`}>AM depth μ <output>{depth.toFixed(2)}</output></label>
        <input id={`${chapterId}-modulation-depth`} type="range" min="0" max="1" step="0.05" bind:value={depth} />
        <label for={`${chapterId}-phase`}>Message phase / turns <output>{messagePhase.toFixed(2)}</output></label>
        <input id={`${chapterId}-phase`} type="range" min="0" max="1" step="0.025" bind:value={messagePhase} />
        <p class="readout">Emax / Emin = {am.maximum.toFixed(2)} / {am.minimum.toFixed(2)} V<br />E(t₀) = {am.envelope.toFixed(2)} V<br />Each sideband = {am.sidebandAmplitude.toFixed(2)} V peak</p>
        <p>The message scales the carrier’s envelope. Move the zoom to a message trough: RF amplitude shrinks, but carrier and message frequencies stay fixed. At μ = 0 only the carrier remains.</p>
        <p class="limit">s = 5[1 + μ cos(2π·2400t)] cos(2π·800000t) V. Ideal linear AM, 0 ≤ μ ≤ 1; no envelope reversal. At μ &gt; 0, sidebands at 797.6 and 802.4 kHz span 4.8 kHz; depth changes their amplitudes, not spacing. This is AM, not FM.</p>
      {:else if chapterId === "c2"}
        <label for={`${chapterId}-sample-rate`}>Sampling / ksample/s <output>{sampleRateKhz}</output></label>
        <input id={`${chapterId}-sample-rate`} type="range" min="12" max="24" step="1" bind:value={sampleRateKhz} />
        <label for={`${chapterId}-bits`}>Bit depth / bits <output>{bits}</output></label>
        <input id={`${chapterId}-bits`} type="range" min="4" max="12" step="1" bind:value={bits} />
        <p class="readout">Tₛ = {(1000 / sampleRateKhz).toFixed(2)} µs<br />folded tone = {(alias / 1000).toFixed(2)} kHz<br />q = {(quantiser.step * 1000).toFixed(3)} mV<br />code {quantiser.code} → {quantiser.reconstructed.toFixed(4)} V<br />error = {(quantiser.error * 1000).toFixed(3)} mV</p>
        <p>{sampleRateKhz * 1000 > 18800 ? "This tone is below Nyquist; the two curves coincide." : "Both curves pass through every sample: sampling alone cannot distinguish them."} More bits narrow the voltage intervals but do not change the alias. More samples do not change q.</p>
        <p class="limit">Cosine fold: fₐ = |f − kfₛ| ≤ fₛ/2. Fixed input tone, amplitude and offset; no anti-alias filter shown. Require fₛ &gt; 2fmax with filtering margin for ordinary low-pass signals; equality can fail for arbitrary phase.</p>
        <p class="limit">Separate static sample: V = 1.011 V, full scale 4.096 V. Unsigned mid-rise: q = VFS/2ⁿ, floor to an interval, clamp endpoints, reconstruct its midpoint. Error = reconstruction − input; no random-noise or SNR model.</p>
      {:else if chapterId === "c3"}
        <label for={`${chapterId}-length`}>Channel length / km <output>{lengthKm.toFixed(2)}</output></label>
        <input id={`${chapterId}-length`} type="range" min="0" max="6" step="0.25" bind:value={lengthKm} />
        <label for={`${chapterId}-noise`}>Receiver noise / µW <output>{noiseMicrowatts.toFixed(1)}</output></label>
        <input id={`${chapterId}-noise`} type="range" min="1" max="20" step="0.5" bind:value={noiseMicrowatts} />
        <p class="readout">Loss = {budget.lossDb.toFixed(2)} dB<br />S/N = {budget.snr.toFixed(2)}<br />SNR = {budget.snrDb.toFixed(2)} dB</p>
        <p>Length reduces received signal while this receiver noise stays fixed. Raising noise lowers SNR without changing loss or signal power. Even zero length retains the connections’ 1.40 dB loss.</p>
        <p class="limit">L = 2.20ℓ + 1.40 dB; Pᵣ = 5·10^(−L/10) mW; SNRdB = 10 log₁₀(Pᵣ/Pₙ). Stipulated fixed operating band and receiver bandwidth; uncorrelated additive noise powers sum. No distortion, noise distribution or decision rule is specified, so no bit-error rate or reliability conclusion follows.</p>
      {/if}
    </aside>
  </div>
  <p class="footnote">Explore the visual independently: these inputs do not change the exercise questions or their answers. No automatic motion.</p>
</section>

<style>
  .plate { max-width: 100%; min-width: 0; padding: 1.5rem 0; color: var(--ink); border-block: 1px solid var(--line-strong); }
  header { margin-bottom: 1.3rem; }
  .eyebrow, .footnote, .readout, label { font-family: var(--mono); }
  .eyebrow { color: var(--teal); text-transform: uppercase; font-size: .68rem; letter-spacing: .12em; }
  h3 { font-family: var(--serif); font-weight: 400; font-size: clamp(1.4rem, 2.5vw, 2rem); line-height: 1.15; margin: .5rem 0; color: var(--ink); }
  .layout { display: grid; grid-template-columns: minmax(0, 2.2fr) minmax(220px, 1fr); gap: 1.75rem; min-width: 0; }
  .drawing { overflow-x: auto; max-width: 100%; min-width: 0; align-self: center; background: var(--night); border-radius: 3px; }
  .drawing:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }
  svg { display: block; width: 100%; min-width: 620px; height: auto; }
  svg text { fill: var(--ink); font-family: var(--mono); font-size: 12px; }
  .muted { fill: var(--muted); }
  .teal { stroke: var(--teal); } text.teal { fill: var(--teal); stroke: none; }
  .amber { stroke: var(--amber); } text.amber { fill: var(--amber); stroke: none; }
  .stroke { fill: none; stroke-width: 2; stroke-linejoin: round; }
  .envelope { fill: none; stroke-width: 1.5; stroke-dasharray: 5 4; }
  .guide { stroke: var(--line-strong); stroke-width: 1; stroke-dasharray: 4 4; }
  .apparatus { fill: none; stroke: var(--ink); stroke-width: 1.5; }
  .instrument { fill: var(--night-2); stroke: var(--ink); stroke-width: 1.5; }
  .sample-stem { stroke: var(--muted); stroke-width: 1; opacity: .65; }
  .interval { stroke: var(--amber); stroke-width: 1; opacity: .65; }
  aside { min-width: 0; font-size: .82rem; line-height: 1.6; }
  label { display: flex; justify-content: space-between; gap: .6rem; font-size: .72rem; margin-top: .7rem; }
  output { color: var(--teal); }
  input { display: block; width: 100%; accent-color: var(--teal); margin: .6rem 0 1.1rem; }
  .readout { font-size: .82rem; color: var(--teal); }
  .limit, .footnote { color: var(--muted); font-size: .72rem; }
  .footnote { margin: 1.25rem 0 0; line-height: 1.6; }
  @media (max-width: 850px) { .layout { grid-template-columns: minmax(0, 1fr); gap: 1rem; } }
</style>
