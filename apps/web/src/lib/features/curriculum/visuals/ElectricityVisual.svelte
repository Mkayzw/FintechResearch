<script lang="ts">
  import { loadedDivider, twoChargeField, capacitorDischarge } from "./electrical-visual-models";
  let { chapterId }: { chapterId: string } = $props();
  let current = $state(0.15);
  let diameter = $state(0.4);
  let loaded = $state(false);
  let load = $state(6);
  let position = $state(0);
  let time = $state(0);
  let negative = $state(false);
  let fieldOut = $state(false);
  let fieldRate = $state(0.2);
  let area = $derived(Math.PI * (diameter * 0.001) ** 2 / 4);
  let drift = $derived(current / (8e28 * area * 1.6e-19));
  let divider = $derived(loadedDivider(12, 3000, 6000, loaded ? load * 1000 : null));
  let field = $derived(twoChargeField(position));
  let discharge = $derived(capacitorDischarge(time));
  let down = $derived(negative !== fieldOut);
  let emf = $derived(-100 * 0.02 * fieldRate);
  const titles: Record<string, string> = { e1: "Slow carriers. Conserved charge. A measurable current.", e2: "Connect a branch. Recalculate the whole network.", e3: "Fields can cancel while potentials add.", e4: "Voltage decays; stored energy falls even faster.", e5: "A sideways force bends motion, not its speed.", e6: "Changing flux—not flux alone—induces an emf." };
  const assumptions: Record<string, string> = {
    e1: "Uniform metal at fixed temperature; n = 8 × 10²⁸ m⁻³, |e| = 1.6 × 10⁻¹⁹ C. Representative electrons and direction-only arrows, not a microscopic time simulation. Random thermal motion is omitted; drift is not signal speed.",
    e2: "Ideal 12 V DC source, ohmic resistors and steady state. A finite load changes the lower branch; source resistance and heating omitted. Schematic distances have no physical scale.",
    e3: "Fixed +2 nC point sources at x = ±0.300 m in vacuum, k = 9.00 × 10⁹, V = 0 at infinity. Infinitesimal probe. Field-arrow lengths share a scale; source circle size does not represent charge radius.",
    e4: "Ideal 100 µF capacitor initially at 8 V, discharged through 20 kΩ; no battery, leakage or meter loading. τ = RC = 2 s. Plate glyphs and brightness are schematic, not a literal count of electrons.",
    e5: "Illustrative particle: |q| = 1.6 × 10⁻¹⁹ C, m = 6.4 × 10⁻²⁷ kg, v = 4.0 × 10⁴ m/s, B = 0.080 T, perpendicular entry. No electric field, gravity or losses. Classical motion; radius 0.020 m.",
    e6: "100-turn coil, area 0.020 m²; positive normal out of page and positive circulation anticlockwise as viewed. Uniform perpendicular B, locally linear change, stationary coil. Emf direction—not current magnitude—is inferred; coil resistance omitted.",
  };
  const voltageY = (t: number) => 255 - 150 * Math.exp(-t / 2);
  const dischargePath = Array.from({ length: 81 }, (_, i) => `${i ? "L" : "M"}${370 + i * 3.75},${voltageY(i / 10)}`).join(" ");
</script>

<section aria-labelledby={`${chapterId}-visual-title`}>
  <p class="scene-kicker">Field notes · Read the physical system</p>
  <h4 class="scene-title" id={`${chapterId}-visual-title`}>{titles[chapterId]}</h4>
  <div class="scene-layout">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard focus enables horizontal scrolling of the scientific diagram.) -->
    <div class="scene-drawing" role="region" tabindex="0" aria-label="Scrollable electricity diagram">
      <svg viewBox="0 0 720 330" role="img" aria-labelledby={`${chapterId}-scene-title ${chapterId}-scene-desc`}>
        <title id={`${chapterId}-scene-title`}>{titles[chapterId]}</title>
        <desc id={`${chapterId}-scene-desc`}>{chapterId === "e1" ? `Current ${current.toFixed(2)} amperes to the right; electron drift ${(drift * 1000).toFixed(3)} millimetres per second to the left.` : chapterId === "e2" ? `Load ${loaded ? "connected" : "open"}, output ${divider.output.toFixed(3)} volts.` : chapterId === "e3" ? `At x ${position.toFixed(2)} metres, net field ${(field.left + field.right).toFixed(1)} newtons per coulomb, potential ${field.potential.toFixed(1)} volts.` : chapterId === "e4" ? `After ${time} seconds, voltage ${discharge.voltage.toFixed(3)} volts, energy ${(discharge.energy * 1000).toFixed(3)} millijoules.` : chapterId === "e5" ? `${negative ? "Negative" : "Positive"} particle entering right, field ${fieldOut ? "out of" : "into"} page, force ${down ? "down" : "up"}, speed unchanged.` : `Magnetic field rate ${fieldRate.toFixed(2)} tesla per second, signed emf ${emf.toFixed(2)} volts; positive means anticlockwise.`}</desc>
        <defs><marker id={`${chapterId}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#72c9b5" /></marker><marker id={`${chapterId}-amber-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#e5b66a" /></marker></defs>
        {#if chapterId === "e1"}
          <text x="30" y="30">A UNIFORM WIRE · ELECTRON DRIFT</text>
          <path d={`M100 ${165 - diameter * 70} H610 A20 ${diameter * 70} 0 0 1 610 ${165 + diameter * 70} H100 Z`} fill="#203b35" stroke="#72c9b5" />
          <ellipse cx="100" cy="165" rx="20" ry={diameter * 70} fill="#294a43" stroke="#72c9b5" />
          {#each [170, 255, 340, 425, 510] as x}<circle cx={x} cy="165" r="7" fill="#e5b66a" /><text x={x} y="169" text-anchor="middle" fill="#101b1c">−</text>{/each}
          <path d="M500 90 H225" stroke="#e5b66a" stroke-width="2" marker-end={`url(#${chapterId}-amber-arrow)`} /><text x="270" y="73" class="scene-amber">Electrons drift left</text>
          <path d="M225 245 H500" stroke="#72c9b5" stroke-width="2" marker-end={`url(#${chapterId}-arrow)`} /><text x="245" y="277" class="scene-teal">Conventional current right</text>
          <text x="30" y="316">A = {(area * 1e6).toFixed(4)} mm² · vᵈ = {(drift * 1000).toFixed(3)} mm/s</text>
          <path d={`M660 ${165 - diameter * 70} V${165 + diameter * 70}`} stroke="#9aaea7" /><text x="627" y="215">d</text>
        {:else if chapterId === "e2"}
          <text x="30" y="30">12 V SOURCE · A LOADED OUTPUT</text>
          <path d="M90 125 V65 H285 V90 M285 145 V175 H510 V183 M510 255 V285 H90 V205 M285 175 V205 M285 255 V285" class="wire" />
          <circle cx="90" cy="165" r="40" fill="none" stroke="#72c9b5" stroke-width="2" /><text x="90" y="170" text-anchor="middle">12 V</text>
          <rect x="272" y="90" width="26" height="55" fill="#263b36" stroke="#72c9b5" /><text x="325" y="123">3 kΩ</text>
          <rect x="272" y="205" width="26" height="50" fill="#263b36" stroke="#72c9b5" /><text x="175" y="238">6 kΩ</text>
          <rect x="497" y="205" width="26" height="50" fill={loaded ? "#4c3d25" : "#101b1c"} stroke="#e5b66a" stroke-dasharray={loaded ? undefined : "4 4"} />
          <path d={loaded ? "M510 183 V205" : "M510 183 L530 173 M510 200 V205"} class="wire" />
          <circle cx="510" cy="183" r="2" fill="#9aaea7" /><circle cx="510" cy="200" r="2" fill="#9aaea7" />
          <circle cx="285" cy="175" r="5" fill="#e5b66a" /><text x="350" y="165" class="scene-big">Vₒ = {divider.output.toFixed(3)} V</text><text x="545" y="228">Load</text><text x="545" y="252">{load.toFixed(1)} kΩ</text>
          <text x="30" y="316">Iᵢₙ {(divider.sourceCurrent * 1000).toFixed(3)} = I₂ {(divider.lowerCurrent * 1000).toFixed(3)} + Iᴸ {(divider.loadCurrent * 1000).toFixed(3)} mA</text>
        {:else if chapterId === "e3"}
          <text x="30" y="30">TWO POSITIVE SOURCES · ONE OBSERVATION POINT</text>
          <path d="M140 115 H580" stroke="#60706a" stroke-dasharray="5 5" />
          {#each [140, 580] as x}<circle cx={x} cy="115" r="25" fill="#4c3d25" stroke="#e5b66a" /><text x={x} y="123" text-anchor="middle" class="scene-big">+</text><text x={x} y="165" text-anchor="middle">+2 nC</text>{/each}
          <text x="140" y="84" text-anchor="middle">−0.300 m</text><text x="580" y="84" text-anchor="middle">+0.300 m</text>
          <circle cx={360 + position * 733.333} cy="115" r="7" fill="#72c9b5" /><text x={360 + position * 733.333} y="78" text-anchor="middle">x = {position.toFixed(2)} m</text>
          <text x="30" y="218">E from left</text><path d={`M${360 + position * 733.333} 210 h${field.left * 0.15}`} stroke="#72c9b5" stroke-width="3" marker-end={`url(#${chapterId}-arrow)`} />
          <text x="30" y="260">E from right</text><path d={`M${360 + position * 733.333} 252 h${field.right * 0.15}`} stroke="#e5b66a" stroke-width="3" marker-end={`url(#${chapterId}-amber-arrow)`} />
          <text x="30" y="310">Eₙₑₜ = {(field.left + field.right).toFixed(1)} N/C</text><text x="390" y="310" class="scene-big">V = {field.potential.toFixed(1)} V</text>
        {:else if chapterId === "e4"}
          <text x="30" y="30">CAPACITOR → RESISTOR · NO BATTERY</text>
          <path d="M130 110 V65 H270 V137 M270 193 V265 H130 V195" class="wire" /><rect x="258" y="137" width="24" height="56" fill="#4c3d25" stroke="#e5b66a" /><text x="230" y="293">20 kΩ</text>
          <line x1="90" x2="170" y1="135" y2="135" stroke="#72c9b5" stroke-width="5" /><line x1="90" x2="170" y1="180" y2="180" stroke="#e5b66a" stroke-width="5" /><path d="M130 110 V135 M130 180 V195" class="wire" />
          {#each [105, 130, 155] as x}<text x={x} y="125" text-anchor="middle" opacity={0.15 + 0.85 * discharge.voltage / 8}>+</text><text x={x} y="205" text-anchor="middle" opacity={0.15 + 0.85 * discharge.voltage / 8}>−</text>{/each}
          <text x="55" y="236">100 µF · ±{(discharge.charge * 1000).toFixed(3)} mC</text>
          <path d="M370 75 V255 H675" class="wire" /><path d={dischargePath} fill="none" stroke="#72c9b5" stroke-width="2" /><circle cx={370 + time * 37.5} cy={voltageY(time)} r="6" fill="#e5b66a" />
          <text x="370" y="65">V / V</text><text x="638" y="280">t / s</text><text x="353" y="110" text-anchor="end">8</text><text x="370" y="278">0</text><text x="666" y="278">8</text>
          <text x="380" y="302" class="scene-big">{discharge.voltage.toFixed(3)} V · {(discharge.energy * 1000).toFixed(3)} mJ</text>
        {:else if chapterId === "e5"}
          <text x="30" y="30">MAGNETIC DEFLECTION · v ⟂ B</text>
          <rect x="230" y="55" width="450" height="235" fill="#172b29" />
          {#each [265, 345, 425, 505, 585, 655] as x}{#each [80, 160, 240] as y}<text x={x} y={y} text-anchor="middle" class="scene-teal">{fieldOut ? "⊙" : "×"}</text>{/each}{/each}
          <path d="M55 165 H230" stroke="#72c9b5" stroke-width="3" marker-end={`url(#${chapterId}-arrow)`} /><text x="60" y="140">v →</text><circle cx="230" cy="165" r="9" fill="#e5b66a" />
          <path d={down ? "M230 165 A105 105 0 0 1 335 270" : "M230 165 A105 105 0 0 0 335 60"} fill="none" stroke="#e5b66a" stroke-width="3" marker-end={`url(#${chapterId}-amber-arrow)`} />
          <path d={down ? "M230 177 V240" : "M230 153 V90"} stroke="#e5b66a" stroke-width="2" marker-end={`url(#${chapterId}-amber-arrow)`} />
          <text x="70" y="217" class="scene-amber">q = {negative ? "−" : "+"}1.6 × 10⁻¹⁹ C</text><text x="430" y="120">B {fieldOut ? "out of page ⊙" : "into page ×"}</text><text x="430" y="195">|F| = 5.12 × 10⁻¹⁶ N</text><text x="430" y="220">r = 0.020 m</text><text x="430" y="265" class="scene-big">ΔK = 0</text><text x="30" y="316">F = q(v × B) · perpendicular force, unchanged speed</text>
        {:else}
          <text x="30" y="30">FARADAY + LENZ · VIEW ALONG COIL AXIS</text>
          <ellipse cx="225" cy="170" rx="120" ry="90" fill="#172b29" stroke="#e5b66a" stroke-width="3" /><ellipse cx="225" cy="170" rx="126" ry="96" fill="none" stroke="#e5b66a" opacity=".4" />
          {#each [165, 225, 285] as x}{#each [130, 170, 210] as y}<text x={x} y={y} class="scene-teal" text-anchor="middle">⊙</text>{/each}{/each}
          <text x="225" y="288" text-anchor="middle">Positive B: out of page</text>
          {#if fieldRate !== 0}<path d={fieldRate > 0 ? "M125 170 A100 75 0 0 1 325 170" : "M125 170 A100 75 0 0 0 325 170"} fill="none" stroke="#72c9b5" stroke-width="3" marker-end={`url(#${chapterId}-arrow)`} />{/if}
          <text x="400" y="92">dB/dt = {fieldRate.toFixed(2)} T/s</text><text x="400" y="142" class="scene-big">ε = {emf.toFixed(2)} V</text>
          <text x="400" y="190" class="scene-teal">{fieldRate === 0 ? "No induced emf" : fieldRate > 0 ? "Clockwise circulation" : "Anticlockwise circulation"}</text><text x="400" y="225">{fieldRate === 0 ? "Flux may still be nonzero" : "Opposes the CHANGE in flux"}</text><text x="400" y="260">ε = −NA dB/dt</text>
        {/if}
      </svg>
    </div>
    <div class="scene-controls">
      {#if chapterId === "e1"}
        <label for="e1-current">Current / A: {current.toFixed(2)}<input id="e1-current" type="range" min="0.05" max="0.6" step="0.01" bind:value={current} /></label>
        <label for="e1-diameter">Diameter / mm: {diameter.toFixed(2)}<input id="e1-diameter" type="range" min="0.2" max="0.8" step="0.01" bind:value={diameter} /></label>
        <p class="scene-result">{(current * 60).toFixed(2)} C crosses each section per minute. Electron drift is {(drift * 1000).toFixed(3)} mm/s in the opposite direction.</p><p>Double diameter at fixed current: area becomes four times greater, so required drift speed falls to one quarter. Charge is not consumed along the wire.</p>
      {:else if chapterId === "e2"}
        <label class="scene-toggle" for="e2-load"><input id="e2-load" type="checkbox" bind:checked={loaded} />Connect the load branch</label>
        <label for="e2-resistance">Load / kΩ: {load.toFixed(1)}<input id="e2-resistance" type="range" min="1" max="20" step="0.1" bind:value={load} /></label>
        <p class="scene-result">{loaded ? `The source now supplies ${(divider.sourceCurrent * 1000).toFixed(3)} mA. This splits between two lower branches; their voltages, not their currents, match.` : "With the load disconnected, output is 8.000 V. Changing the disconnected resistor cannot affect this circuit."}</p><p>At 6 kΩ load, output falls to 6.000 V. The upper resistor is no longer in series with the original lower resistor alone.</p>
      {:else if chapterId === "e3"}
        <label for="e3-position">Observation position / m: {position.toFixed(2)}<input id="e3-position" type="range" min="-0.15" max="0.15" step="0.01" bind:value={position} /></label>
        <p class="scene-result">At {position === 0 ? "the midpoint" : `x = ${position.toFixed(2)} m`}: field {(field.left + field.right).toFixed(1)} N/C, potential {field.potential.toFixed(1)} J/C.</p><p>Fields carry direction; potentials add as scalars. Return to the midpoint: zero force per charge does not mean zero potential energy per charge.</p>
      {:else if chapterId === "e4"}
        <label for="e4-time">Time after disconnect / s: {time.toFixed(1)}<input id="e4-time" type="range" min="0" max="8" step="0.1" bind:value={time} /></label>
        <p class="scene-result">Voltage remaining: {(discharge.voltage / 8 * 100).toFixed(1)}%. Energy remaining: {(discharge.energy / 0.0032 * 100).toFixed(1)}%.</p><p>Set t = 2 s: voltage is 36.8% of its initial value, energy just 13.5%. The missing field energy has heated the discharge resistor.</p>
      {:else if chapterId === "e5"}
        <label class="scene-toggle" for="e5-charge"><input id="e5-charge" type="checkbox" bind:checked={negative} />Use a negative particle</label>
        <label class="scene-toggle" for="e5-field"><input id="e5-field" type="checkbox" bind:checked={fieldOut} />Reverse B out of the page</label>
        <p class="scene-result">Force initially points {down ? "down" : "up"}. Reversing either q or B reverses the curvature; reversing both restores it.</p><p>Throughout the arc, force is perpendicular to velocity. It changes momentum direction but does no work, so speed remains 4.0 × 10⁴ m/s.</p>
      {:else}
        <label for="e6-rate">Field change / T s⁻¹: {fieldRate.toFixed(2)}<input id="e6-rate" type="range" min="-0.5" max="0.5" step="0.05" bind:value={fieldRate} /></label>
        <p class="scene-result">{fieldRate === 0 ? "A nonzero steady field produces no emf. The coil responds to change, not the mere presence of a field." : fieldRate > 0 ? "Outward flux is increasing: the induced circulation would generate an inward field to oppose that increase." : "Outward flux is decreasing: the induced circulation would generate an outward field to oppose that decrease."}</p><p>Cross zero to reverse the induced emf. Positive circulation is defined anticlockwise; the minus sign encodes Lenz’s law, not a negative magnitude.</p>
      {/if}
    </div>
  </div>
  <p class="scene-assumption">{assumptions[chapterId]}</p>
</section>
