<script lang="ts">
  import { springState, travellingString, doubleSlit, stringMode } from "./signal-visual-models";

  let { chapterId }: { chapterId: string } = $props();
  let phase = $state(0.125);
  let amplitudeMm = $state(50);
  let waveTimeMs = $state(0);
  let waveAmplitudeMm = $state(4);
  let distance = $state(2);
  let screenMm = $state(1.8);
  let harmonic = $state(3);
  let modePhase = $state(0);
  const titles: Record<string, string> = {
    w1: "Where did the spring’s energy go?",
    w2: "The crest travels. The marked particle does not.",
    w3: "Two paths write a pattern on one screen",
    w4: "The ends choose which wavelengths fit",
  };
  let spring = $derived(springState(amplitudeMm / 1000, phase));
  let massX = $derived(330 + spring.x * 1800);
  let particle = $derived(travellingString(0.1, waveTimeMs / 1000, waveAmplitudeMm / 1000));
  let crestX = $derived(0.1 + 8 * waveTimeMs / 1000);
  let slit = $derived(doubleSlit(distance, screenMm / 1000));
  let mode = $derived(stringMode(harmonic, modePhase, 0));
  // This helper only maps scientific coordinates to SVG pixels.
  const line = (count: number, point: (fraction: number) => [number, number]) =>
    Array.from({ length: count }, (_, i) => point(i / (count - 1)).join(",")).join(" ");
  let springWire = $derived(line(35, (u) => [85 + u * (massX - 115),
    u === 0 || u === 1 ? 155 : 155 + (Math.round(u * 34) % 2 ? 14 : -14)]));
  let waveLine = $derived(line(401, (u) => [65 + u * 590,
    160 - travellingString(u * 0.8, waveTimeMs / 1000, waveAmplitudeMm / 1000).y * 10500]));
  let initialWave = $derived(line(401, (u) => [65 + u * 590,
    160 - travellingString(u * 0.8, 0, waveAmplitudeMm / 1000).y * 10500]));
  let modeLine = $derived(line(401, (u) => [65 + u * 590,
    155 - stringMode(harmonic, modePhase, u * 1.25).y * 11000]));
  let modeEnvelope = $derived(line(401, (u) => [65 + u * 590,
    155 - stringMode(harmonic, 0, u * 1.25).envelope * 11000]));
  let description = $derived(chapterId === "w1"
    ? `Spring displacement ${(spring.x * 1000).toFixed(1)} mm; velocity ${spring.velocity.toFixed(3)} m/s. Potential ${(spring.potential * 1000).toFixed(1)} mJ and kinetic ${(spring.kinetic * 1000).toFixed(1)} mJ.`
    : chapterId === "w2"
      ? `At ${waveTimeMs} ms the particle at x = 0.100 m has displacement ${(particle.y * 1000).toFixed(2)} mm. A crest has moved to x = ${crestX.toFixed(3)} m at 8 m/s.`
      : chapterId === "w3"
        ? `At screen distance ${distance} m, fringe spacing is ${(slit.spacing * 1000).toFixed(2)} mm. Selected y = ${screenMm} mm has intensity ${(slit.relativeIntensity * 100).toFixed(1)} percent of maximum.`
        : `Fixed-end string mode ${harmonic}: ${harmonic + 1} permanent nodes, frequency ${mode.frequency} Hz, phase ${modePhase} turns.`);
</script>

<section class="plate" aria-label={titles[chapterId] ?? "Wave model"}>
  <header><p class="eyebrow">Waves / a model you can interrogate</p><h3>{titles[chapterId]}</h3></header>
  <div class="layout">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard focus enables native horizontal scrolling of the scientific plate.) -->
    <div class="drawing" tabindex="0" role="region" aria-label="Scientific diagram; scroll horizontally on small screens">
      <svg viewBox="0 0 720 330" role="img" aria-labelledby={`${chapterId}-wave-title ${chapterId}-wave-desc`}>
        <title id={`${chapterId}-wave-title`}>{titles[chapterId]}</title>
        <desc id={`${chapterId}-wave-desc`}>{description}</desc>
        <defs>
          <marker id={`${chapterId}-wave-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M0,0 L7,3.5 L0,7" fill="var(--teal)" /></marker>
          <marker id={`${chapterId}-force-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M0,0 L7,3.5 L0,7" fill="var(--amber)" /></marker>
        </defs>
        {#if chapterId === "w1"}
          <text x="45" y="32">HORIZONTAL / frictionless track</text>
          <text x="45" y="55" class="muted">m = 0.400 kg · k = 40.0 N/m · displacement from equilibrium</text>
          <path d="M70 95 V202 M55 105 L70 95 M55 125 L70 115 M55 145 L70 135 M55 165 L70 155 M55 185 L70 175 M70 155 H85" class="apparatus" />
          <line x1="80" y1="195" x2="640" y2="195" class="apparatus" />
          <line x1="330" y1="90" x2="330" y2="218" class="guide" />
          <text x="330" y="238" text-anchor="middle" class="muted">x = 0</text>
          <polyline points={springWire} class="teal stroke" />
          <rect x={massX - 30} y="128" width="60" height="65" rx="4" class="mass" />
          <text x={massX} y="166" text-anchor="middle">m</text>
          <line x1="330" y1="211" x2={massX} y2="211" class="teal stroke" />
          <text x="520" y="225">x = {(spring.x * 1000).toFixed(1)} mm</text>
          {#if Math.abs(spring.velocity) > 0.001}
            <line x1={massX} y1="105" x2={massX + spring.velocity * 110} y2="105" class="teal stroke" marker-end={`url(#${chapterId}-wave-arrow)`} />
          {/if}
          <text x="450" y="85" class="teal">v = {spring.velocity.toFixed(3)} m/s</text>
          {#if Math.abs(spring.acceleration) > 0.001}
            <line x1={massX} y1="255" x2={massX + spring.acceleration * 12} y2="255" class="amber stroke" marker-end={`url(#${chapterId}-force-arrow)`} />
          {/if}
          <text x="450" y="265" class="amber">a = {spring.acceleration.toFixed(2)} m/s²</text>
          <text x="45" y="293">E = {(spring.total * 1000).toFixed(1)} mJ</text>
          <rect x="225" y="279" width={380 * spring.potential / spring.total} height="18" fill="var(--amber)" />
          <rect x={225 + 380 * spring.potential / spring.total} y="279" width={380 * spring.kinetic / spring.total} height="18" fill="var(--teal)" />
          <text x="225" y="318" class="amber">spring U {(spring.potential * 1000).toFixed(1)} mJ</text>
          <text x="460" y="318" class="teal">motion K {(spring.kinetic * 1000).toFixed(1)} mJ</text>
        {:else if chapterId === "w2"}
          <text x="45" y="30">ONE STRING / two kinds of motion</text>
          <text x="45" y="53" class="muted">y = A sin(5πx − 40πt) · vertical scale exaggerated</text>
          <line x1="65" y1="160" x2="665" y2="160" class="guide" />
          <polyline points={initialWave} class="ghost stroke" />
          <polyline points={waveLine} class="teal stroke" />
          <line x1={65 + 0.1 / 0.8 * 590} y1="92" x2={65 + 0.1 / 0.8 * 590} y2="242" class="guide" />
          <circle cx={65 + 0.1 / 0.8 * 590} cy={160 - particle.y * 10500} r="7" fill="var(--amber)" />
          <text x="62" y="264" class="amber">marked particle: x = 0.100 m always</text>
          <text x="62" y="285" class="amber">y = {(particle.y * 1000).toFixed(2)} mm; vᵧ = {particle.velocity.toFixed(3)} m/s</text>
          <line x1="139" y1="80" x2={65 + crestX / 0.8 * 590} y2="80" class="teal stroke" />
          <circle cx={65 + crestX / 0.8 * 590} cy={160 - waveAmplitudeMm * 10.5} r="5" fill="var(--teal)" />
          <line x1="420" y1="90" x2="555" y2="90" class="teal stroke" marker-end={`url(#${chapterId}-wave-arrow)`} />
          <text x="420" y="74" class="teal">phase → 8.00 m/s</text>
          <text x="410" y="245" class="muted">dashed: profile at t = 0</text>
          <text x="410" y="268">λ = 0.400 m · f = 20.0 Hz</text>
          {#each [0, 0.2, 0.4, 0.6, 0.8] as x}
            <text x={65 + x / 0.8 * 590} y="315" text-anchor="middle">{x.toFixed(1)}</text>
          {/each}
          <text x="665" y="315">x / m</text>
        {:else if chapterId === "w3"}
          <text x="35" y="29">COHERENT LIGHT / 540 nm</text>
          <text x="35" y="51" class="muted">equal narrow slits, initially in phase</text>
          <path d="M145 75 V133 M145 145 V185 M145 197 V285" class="apparatus thick" />
          <text x="35" y="163">d =</text><text x="35" y="184">0.300 mm</text>
          <line x1="145" y1="139" x2="465" y2={170 - screenMm * 5} class="teal stroke" />
          <line x1="145" y1="191" x2="465" y2={170 - screenMm * 5} class="amber stroke" />
          <line x1="145" y1="170" x2="465" y2="170" class="guide" />
          <line x1="465" y1="66" x2="465" y2="274" class="apparatus" />
          <text x="260" y="300">D = {distance.toFixed(2)} m</text>
          <text x="35" y="322" class="muted">apparatus schematic; screen y scale fixed</text>
          {#each Array.from({ length: 121 }, (_, i) => (i - 60) / 3) as y}
            <rect x="478" y={170 - y * 5 - 0.9} width="35" height="1.9" fill="var(--teal)" opacity={0.06 + 0.94 * doubleSlit(distance, y / 1000).relativeIntensity} />
          {/each}
          <circle cx="465" cy={170 - screenMm * 5} r="5" fill="var(--ink)" />
          <line x1="465" y1={170 - screenMm * 5} x2="535" y2={170 - screenMm * 5} class="guide" />
          <text x="535" y="51">screen y / mm</text>
          <text x="535" y="74">+20</text><text x="535" y="174">0 · central bright</text><text x="535" y="269">−20</text>
          <text x="180" y="92" class="teal">path 1</text><text x="180" y="255" class="amber">path 2</text>
          <text x="535" y="210">selected: {screenMm.toFixed(1)} mm</text>
          <text x="535" y="232">I/Imax = {slit.relativeIntensity.toFixed(3)}</text>
        {:else if chapterId === "w4"}
          <text x="45" y="29">FIXED / FIXED · string displacement</text>
          <text x="45" y="52" class="muted">L = 1.25 m · tension = 25.0 N · linear density = 0.00250 kg/m</text>
          <path d="M65 83 V225 M655 83 V225" class="apparatus thick" />
          <line x1="65" y1="155" x2="655" y2="155" class="guide" />
          <polyline points={modeEnvelope} class="ghost stroke" />
          <polyline points={line(401, (u) => [65 + 590 * u, 155 + stringMode(harmonic, 0, u * 1.25).envelope * 11000])} class="ghost stroke" />
          <polyline points={modeLine} class="teal stroke" />
          {#each Array.from({ length: harmonic + 1 }, (_, i) => i) as j}
            <circle cx={65 + j / harmonic * 590} cy="155" r="5" fill="var(--amber)" />
            <text x={65 + j / harmonic * 590} y="251" text-anchor="middle" class="amber">N{j}</text>
          {/each}
          {#each Array.from({ length: harmonic }, (_, i) => i) as j}
            <text x={65 + (j + 0.5) / harmonic * 590} y="79" text-anchor="middle" class="teal">A</text>
          {/each}
          <text x="65" y="282" class="amber">N: permanent node</text><text x="350" y="282" class="teal">A: antinode, amplitude 6 mm</text>
          <text x="65" y="310" class="muted">dashed: extreme shapes · adjacent loops move in opposite phase</text>
        {/if}
      </svg>
    </div>
    <aside aria-label="Visual model controls and interpretation">
      {#if chapterId === "w1"}
        <label for={`${chapterId}-phase`}>Phase / turns <output>{phase.toFixed(3)}</output></label>
        <input id={`${chapterId}-phase`} type="range" min="0" max="1" step="0.005" bind:value={phase} />
        <label for={`${chapterId}-amplitude`}>Amplitude / mm <output>{amplitudeMm}</output></label>
        <input id={`${chapterId}-amplitude`} type="range" min="20" max="100" step="5" bind:value={amplitudeMm} />
        <p class="readout">t = {spring.time.toFixed(3)} s<br />T = {spring.period.toFixed(3)} s, fixed</p>
        <p>Scrub phase to exchange spring energy (amber) for motion (teal). At a turning point velocity is zero, not restoring acceleration. Amplitude changes total energy as A², but not period.</p>
        <p class="limit">x = A cos(10t); v = −10A sin(10t). Ideal linear, massless spring; no damping or friction. The energy strip uses the current total as its full width.</p>
      {:else if chapterId === "w2"}
        <label for={`${chapterId}-time`}>Time / ms <output>{waveTimeMs.toFixed(1)}</output></label>
        <input id={`${chapterId}-time`} type="range" min="0" max="50" step="0.5" bind:value={waveTimeMs} />
        <label for={`${chapterId}-amplitude`}>Amplitude / mm <output>{waveAmplitudeMm}</output></label>
        <input id={`${chapterId}-amplitude`} type="range" min="2" max="8" step="1" bind:value={waveAmplitudeMm} />
        <p class="readout">Crest x = {crestX.toFixed(3)} m<br />Particle x = 0.100 m, fixed</p>
        <p>The amber particle moves only up and down. The teal crest travels right as successive particles reach a maximum. Doubling amplitude doubles particle speed, not the 8 m/s phase speed.</p>
        <p class="limit">vᵧ = −40πA cos(5πx − 40πt). Uniform linear string; no attenuation or dispersion. Ghost profile is a time reference, not a second wave.</p>
      {:else if chapterId === "w3"}
        <label for={`${chapterId}-distance`}>Screen distance D / m <output>{distance.toFixed(2)}</output></label>
        <input id={`${chapterId}-distance`} type="range" min="1" max="4" step="0.25" bind:value={distance} />
        <label for={`${chapterId}-position`}>Screen position y / mm <output>{screenMm.toFixed(1)}</output></label>
        <input id={`${chapterId}-position`} type="range" min="-18" max="18" step="0.1" bind:value={screenMm} />
        <p class="readout">β = {(slit.spacing * 1000).toFixed(2)} mm<br />Δℓ ≈ {(slit.pathDifference * 1e9).toFixed(0)} nm<br />δ = {(slit.phase / Math.PI).toFixed(2)}π rad</p>
        <p>Move the screen farther away: fringe spacing increases while wavelength and slit separation stay fixed. Whole-wavelength path differences reinforce; half-integer differences cancel.</p>
        <p class="limit">Δℓ ≈ dy/D; β = λD/d; I/Imax = cos²(πΔℓ/λ). Small-angle far field, equal coherent amplitudes and compatible polarisation. Slit-width envelope omitted.</p>
      {:else if chapterId === "w4"}
        <label for={`${chapterId}-harmonic`}>Harmonic n <output>{harmonic}</output></label>
        <input id={`${chapterId}-harmonic`} type="range" min="1" max="5" step="1" bind:value={harmonic} />
        <label for={`${chapterId}-phase`}>Phase / turns <output>{modePhase.toFixed(3)}</output></label>
        <input id={`${chapterId}-phase`} type="range" min="0" max="1" step="0.025" bind:value={modePhase} />
        <p class="readout">fₙ = {mode.frequency.toFixed(0)} Hz<br />λₙ = {mode.wavelength.toFixed(3)} m<br />node gap = {mode.nodeSpacing.toFixed(3)} m</p>
        <p>{harmonic} loops, {harmonic + 1} permanent nodes. Scrub phase: even when the whole string is straight, only the amber positions remain nodes at every time. Changing n changes wavelength and frequency, not component speed (100 m/s).</p>
        <p class="limit">y = 0.006 sin(nπx/L) cos(2πfₙt); fₙ = nc/(2L). Equal opposing 3 mm travelling components; zero mean net flux. Ideal mode shapes, not a driven-response amplitude prediction.</p>
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
  .teal { color: var(--teal); stroke: var(--teal); } text.teal { fill: var(--teal); stroke: none; }
  .amber { color: var(--amber); stroke: var(--amber); } text.amber { fill: var(--amber); stroke: none; }
  .stroke { fill: none; stroke-width: 2; stroke-linejoin: round; }
  .apparatus { fill: none; stroke: var(--ink); stroke-width: 2; }
  .thick { stroke-width: 5; }
  .guide { stroke: var(--line-strong); stroke-width: 1; stroke-dasharray: 4 4; }
  .ghost { stroke: var(--muted); stroke-dasharray: 5 5; opacity: .55; }
  .mass { fill: var(--night-2); stroke: var(--ink); stroke-width: 2; }
  aside { min-width: 0; font-size: .82rem; line-height: 1.6; }
  label { display: flex; justify-content: space-between; gap: .6rem; font-size: .72rem; margin-top: .7rem; }
  output { color: var(--teal); }
  input { display: block; width: 100%; accent-color: var(--teal); margin: .6rem 0 1.1rem; }
  .readout { font-size: .82rem; color: var(--teal); }
  .limit, .footnote { color: var(--muted); font-size: .72rem; }
  .footnote { margin: 1.25rem 0 0; line-height: 1.6; }
  @media (max-width: 850px) { .layout { grid-template-columns: minmax(0, 1fr); gap: 1rem; } }
</style>
