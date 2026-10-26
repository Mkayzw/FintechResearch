<script lang="ts">
  import { elasticStrip, iceHeating, gasPiston, narrowingPipe, thermalExchange } from "./matter-modern-visual-models";

  let { chapterId }: { chapterId: string } = $props();
  let force = $state(32);
  let area = $state(0.4);
  let retained = $state(7520);
  let temperature = $state(400);
  let rigid = $state(false);
  let outletArea = $state(2);
  let raised = $state(false);
  let bodyTemperature = $state(400);
  let emissivity = $state(0.75);
  let strip = $derived(elasticStrip(force, area));
  let ice = $derived(iceHeating(retained));
  let gas = $derived(gasPiston(temperature, rigid));
  let pipe = $derived(narrowingPipe(outletArea, raised ? 0.4 : 0));
  let heat = $derived(thermalExchange(bodyTemperature, emissivity));
  let extensionPx = $derived(strip.extensionM * 80000);
  let pistonX = $derived(55 + gas.volumeM3 / 0.004157 * 245);
  let pipeRadius = $derived(70 * Math.sqrt(outletArea / 6));
  let outletY = $derived(raised ? 135 : 155);
  let title = $derived(({ m1: "A small strain, made visible", m2: "Where the heater’s energy goes", m3: "A gas pushes back", m4: "The narrowing passage", m5: "A body never radiates alone" } as Record<string, string>)[chapterId] ?? "Matter model");
  let summary = $derived(chapterId === "m1"
    ? `Load ${force} N. Extension ${(strip.extensionM * 1000).toFixed(3)} mm; strain ${strip.strain.toExponential(2)}; stress ${(strip.stressPa / 1e6).toFixed(1)} MPa.`
    : chapterId === "m2" ? `${retained} J retained. Temperature ${ice.temperatureC.toFixed(2)} °C; ${(ice.meltedFraction * 100).toFixed(1)} percent melted. Input ${ice.inputJ.toFixed(1)} J, loss ${ice.lossJ.toFixed(1)} J.`
    : chapterId === "m3" ? `${rigid ? "Rigid vessel" : "Constant-pressure expansion"} at ${temperature} K. Volume ${(gas.volumeM3 * 1000).toFixed(3)} L; absolute pressure ${(gas.pressurePa / 1000).toFixed(1)} kPa. Heat ${gas.heatInJ.toFixed(2)} J; work by gas ${gas.workByJ.toFixed(2)} J.`
    : chapterId === "m4" ? `Outlet area ${outletArea.toFixed(1)} square centimetres, speed ${pipe.outletSpeed.toFixed(2)} metres per second; outlet gauge pressure ${pipe.outletGaugePa.toFixed(0)} Pa. Flow stays 360 cubic centimetres per second.`
    : `Body ${bodyTemperature} K; emissivity ${emissivity.toFixed(2)}. Emission ${heat.emittedW.toFixed(2)} W minus absorption ${heat.absorbedW.toFixed(2)} W gives net radiation ${heat.netRadiationW.toFixed(2)} W. Heater supplies ${heat.heaterW.toFixed(2)} W including convection.`);
</script>

<section class="plate" aria-label={title}>
  <header><span class="eyebrow">Interactive scientific plate · {chapterId}</span><h3>{title}</h3></header>
  <div class="layout">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users must be able to focus and horizontally scroll the scientific plate on narrow screens.) -->
    <div class="drawing" role="region" tabindex="0" aria-label={`${title}; diagram scrolls horizontally on small screens`}>
      <svg viewBox="0 0 720 330" role="img" aria-labelledby={`${chapterId}-matter-title ${chapterId}-matter-desc`}>
        <title id={`${chapterId}-matter-title`}>{title}</title>
        <desc id={`${chapterId}-matter-desc`}>{summary}</desc>
        <defs>
          <marker id={`${chapterId}-matter-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="var(--amber)" /></marker>
          <marker id={`${chapterId}-matter-return`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="var(--teal)" /></marker>
        </defs>
        {#if chapterId === "m1"}
          <text x="40" y="30" class="caption">01 / SAME MATERIAL, DIFFERENT GEOMETRY</text>
          <path d="M85 65V205M65 65h20M65 85h20M65 105h20M65 125h20M65 145h20M65 165h20M65 185h20" class="wall" />
          <rect x="90" y="75" width="350" height="22" class="ghost" />
          <text x="100" y="60">Unloaded reference · L₀ = 1.60 m</text>
          <path d="M440 70V235" class="datum" />
          <rect x="90" y={155 - area * 12} width={350 + extensionPx} height={area * 24} class="material" />
          <path d={`M${440 + extensionPx} 155H665`} class="arrow" marker-end={`url(#${chapterId}-matter-arrow)`} />
          <text x="605" y="137">{force} N →</text>
          <path d={`M440 208H${440 + extensionPx}`} class="arrow" marker-end={force > 0 ? `url(#${chapterId}-matter-arrow)` : undefined} />
          <text x="455" y="248">ΔL = {(strip.extensionM * 1000).toFixed(3)} mm</text>
          <text x="100" y="194">A = {area.toFixed(2)} mm²</text>
          <text x="100" y="239">E = 200 GPa (fixed)</text>
          <text x="40" y="287" class="strong">Strain = ΔL / L₀ = {strip.strain.toExponential(2)}</text>
          <text x="40" y="313" class="note">Extension drawn ×366 relative to the 1.60 m length scale; not a bent or yielded strip.</text>
        {:else if chapterId === "m2"}
          <text x="40" y="30" class="caption">02 / A THERMOMETER IS NOT AN ENERGY METER</text>
          <path d="M70 65V245H250V65" class="wall" />
          <rect x="75" y={120 + 120 * (1 - ice.meltedFraction)} width="170" height={120 * ice.meltedFraction} class="liquid" />
          {#if ice.meltedFraction < 1}
            <rect x="75" y="120" width="170" height={120 * (1 - ice.meltedFraction)} class="ice" />
          {/if}
          <text x="90" y="105">{ice.meltedFraction === 0 ? "solid ice" : ice.meltedFraction < 1 ? "ice + water" : "liquid water"}</text>
          <text x="90" y="269">40.0 g · no mass loss</text>
          <path d="M108 285h105" class="arrow" marker-end={`url(#${chapterId}-matter-arrow)`} />
          <text x="76" y="313">80 W in; 8 W lost</text>
          <rect x="286" y="85" width="15" height="155" rx="7" class="ghost" />
          <rect x="290" y={225 - (ice.temperatureC + 10) * 4} width="7" height={15 + (ice.temperatureC + 10) * 4} class="hot-fill" />
          <text x="275" y="65" class="strong">{ice.temperatureC.toFixed(1)} °C</text>
          <text x="355" y="68">ENERGY RETAINED / J</text>
          <text x="355" y="100">Warm ice: {ice.sensibleIceJ.toFixed(0)} / 840</text>
          <rect x="355" y="110" width="300" height="12" class="track" /><rect x="355" y="110" width={300 * ice.sensibleIceJ / 840} height="12" class="cold-fill" />
          <text x="355" y="153">Melt: {ice.latentJ.toFixed(0)} / 13 360</text>
          <rect x="355" y="163" width="300" height="12" class="track" /><rect x="355" y="163" width={300 * ice.meltedFraction} height="12" class="hot-fill" />
          <text x="355" y="206">Warm water: {ice.sensibleWaterJ.toFixed(0)} / 3 360</text>
          <rect x="355" y="216" width="300" height="12" class="track" /><rect x="355" y="216" width={300 * ice.sensibleWaterJ / 3360} height="12" class="cold-fill" />
          <text x="355" y="266" class="strong">{(100 * ice.meltedFraction).toFixed(1)}% melted</text>
          <text x="355" y="295">{retained >= 840 && retained <= 14200 ? "Melting plateau: 0 °C throughout." : retained < 840 ? "Solid ice warms toward 0 °C." : "All liquid: temperature rises."}</text>
        {:else if chapterId === "m3"}
          <text x="40" y="30" class="caption">03 / MOMENTUM AT THE WALL, ENERGY AT THE BOUNDARY</text>
          <text x="40" y="62">{rigid ? "LOCKED VOLUME" : "FRICTIONLESS PISTON · CONSTANT 90.0 kPa"}</text>
          <rect x="55" y="90" width={pistonX - 55} height="135" class="gas-fill" />
          <path d={`M${pistonX + 60} 90H55V225H${pistonX + 60}`} class="wall" />
          <path d={`M${pistonX} 88V227m0 -68h50`} class="piston" />
          {#each Array.from({ length: 15 }, (_, i) => i) as i}
            {@const x = 80 + (i % 5) * (pistonX - 100) / 5}
            {@const y = 115 + Math.floor(i / 5) * 40}
            <circle cx={x} cy={y} r="4" class="cold-fill" />
            <path d={`M${x} ${y}l${(i % 2 ? -1 : 1) * 19 * Math.sqrt(temperature / 300)} ${(i % 3 === 0 ? -10 : 8) * Math.sqrt(temperature / 300)}`} class="molecule" marker-end={`url(#${chapterId}-matter-return)`} />
          {/each}
          <path d={`M${pistonX - 45} 155h35m0 18h-35`} class="arrow" marker-end={`url(#${chapterId}-matter-arrow)`} />
          <text x="430" y="65">{rigid ? "Lock: no boundary displacement" : "Wall collisions exert pressure"}</text>
          <text x="45" y="256">V = {(gas.volumeM3 * 1000).toFixed(3)} L</text>
          <text x="355" y="256">p = {(gas.pressurePa / 1000).toFixed(1)} kPa absolute</text>
          <text x="45" y="293" class="strong">Q in {gas.heatInJ.toFixed(2)} = ΔU {gas.internalChangeJ.toFixed(2)} + W by {gas.workByJ.toFixed(2)} J</text>
          <text x="45" y="318" class="note">Static molecular snapshot; arrow lengths ∝ √T, positions and piston travel illustrative.</text>
        {:else if chapterId === "m4"}
          <text x="35" y="28" class="caption">04 / ONE FLOW, TWO CROSS-SECTIONS</text>
          <path d={`M35 85H230C340 85 380 ${outletY - pipeRadius} 480 ${outletY - pipeRadius}H685V${outletY + pipeRadius}H480C380 ${outletY + pipeRadius} 340 225 230 225H35Z`} class="liquid" />
          {#each [-0.65, 0, 0.65] as offset}
            <path d={`M40 ${155 + offset * 70}H230C340 ${155 + offset * 70} 380 ${outletY + offset * pipeRadius} 480 ${outletY + offset * pipeRadius}H660`} class="stream" marker-end={`url(#${chapterId}-matter-return)`} />
          {/each}
          <text x="48" y="65">A₁ = 6.00 cm²</text>
          <text x="490" y="45">A₂ = {outletArea.toFixed(1)} cm²</text>
          <text x="55" y="245">v₁ = 0.600 m/s</text><text x="480" y="245">v₂ = {pipe.outletSpeed.toFixed(2)} m/s</text>
          <text x="45" y="267">ENERGY / VOLUME · J/m³ (= Pa)</text>
          <text x="45" y="292" class="strong">In: 15 000 + 180 = {pipe.outletGaugePa.toFixed(0)} + {pipe.kineticOutPa.toFixed(0)} + {pipe.gravityPa.toFixed(0)} :Out</text>
          <text x="45" y="317" class="note">Pressure + kinetic + elevation; {raised ? "outlet rises 0.400 m (height exaggerated)" : "equal heights"}. Q = 360 cm³/s.</text>
        {:else if chapterId === "m5"}
          <text x="40" y="28" class="caption">05 / TWO-WAY RADIATION, ONE NET LOSS</text>
          <rect x="40" y="57" width="640" height="206" rx="7" class="ghost" />
          <text x="340" y="81">Large black enclosure + air: 300 K</text>
          <rect x="90" y="106" width="150" height="107" rx="4" class="material" />
          <text x="107" y="143" class="strong">{bodyTemperature} K</text>
          <text x="107" y="172">ε = {emissivity.toFixed(2)}</text>
          <text x="107" y="196">A = 0.080 m²</text>
          {#if heat.emittedW > 0}<path d="M260 115H630" class="arrow" style={`stroke-width:${2 + heat.emittedW / 35}`} marker-end={`url(#${chapterId}-matter-arrow)`} />{/if}
          <text x="300" y="105">Emitted: {heat.emittedW.toFixed(2)} W →</text>
          {#if heat.absorbedW > 0}<path d="M630 171H260" class="stream" style={`stroke-width:${2 + heat.absorbedW / 35}`} marker-end={`url(#${chapterId}-matter-return)`} />{/if}
          <text x="300" y="155">← Absorbed: {heat.absorbedW.toFixed(2)} W</text>
          {#if heat.convectionW > 0}<path d="M260 230H630" class="arrow" marker-end={`url(#${chapterId}-matter-arrow)`} />{/if}
          <text x="300" y="217">Convection to air: {heat.convectionW.toFixed(2)} W</text>
          <text x="45" y="291" class="strong">Heater {heat.heaterW.toFixed(2)} W = net radiation {heat.netRadiationW.toFixed(2)} + convection</text>
          <text x="45" y="317" class="note">Maintained temperature, not a cooling trajectory. Arrow thickness indicates radiant power.</text>
        {/if}
      </svg>
    </div>
    <aside>
      {#if chapterId === "m1"}
        <label for={`${chapterId}-force`}>Tensile load <b>{force} N</b></label>
        <input id={`${chapterId}-force`} type="range" min="0" max="40" step="1" bind:value={force} />
        <label for={`${chapterId}-area`}>Cross-section <b>{area.toFixed(2)} mm²</b></label>
        <input id={`${chapterId}-area`} type="range" min="0.2" max="0.8" step="0.05" bind:value={area} />
        <p>Widening the strip lowers stress and strain at the same force. Length is fixed; modulus is a material property.</p>
        <p class="limit">Uniform strip; reversible proportional response assumed up to this model’s 40 N limit. The drawing exaggerates extension, not the numerical strain.</p>
      {:else if chapterId === "m2"}
        <label for={`${chapterId}-energy`}>Energy retained <b>{retained.toLocaleString()} J</b></label>
        <input id={`${chapterId}-energy`} type="range" min="0" max="17560" step="40" bind:value={retained} />
        <p>Scrub the energy account: warming ice → melting at 0 °C → warming water. At coexistence, added heat changes the phase fraction, not temperature.</p>
        <p class="limit">Pure ice at −10 °C; fixed pressure with 0 °C melting. c = 2100 / 4200 J/(kg K), L = 334 kJ/kg. Phase areas show mass fractions, not density or volume change. No container heat capacity; constant 8 W loss is stipulated, not a general cooling law.</p>
        <p class="technical">Elapsed {ice.timeS.toFixed(2)} s at net 72 W.</p>
      {:else if chapterId === "m3"}
        <label for={`${chapterId}-temperature`}>Gas temperature <b>{temperature} K</b></label>
        <input id={`${chapterId}-temperature`} type="range" min="300" max="600" step="10" bind:value={temperature} />
        <label class="toggle"><input id={`${chapterId}-rigid`} type="checkbox" bind:checked={rigid} /> Lock the piston (fixed V)</label>
        <p>{rigid ? "The wall cannot move: faster collisions raise pressure; W by = 0." : "At fixed pressure the gas expands as molecular speeds rise. Heat supplies both internal energy and piston work."}</p>
        <p class="limit">0.150 mol dilute monatomic helium model; R = 8.314, M = 0.004 kg/mol. Quasistatic path from 300 K. Pressure is absolute; Q into and W by gas are positive. No friction or condensation.</p>
        <p class="technical">vᵣₘₛ = {gas.rmsSpeed.toFixed(0)} m/s; mean vector velocity = 0.</p>
      {:else if chapterId === "m4"}
        <label for={`${chapterId}-outlet`}>Outlet area <b>{outletArea.toFixed(1)} cm²</b></label>
        <input id={`${chapterId}-outlet`} type="range" min="1" max="6" step="0.1" bind:value={outletArea} />
        <label class="toggle"><input id={`${chapterId}-rise`} type="checkbox" bind:checked={raised} /> Raise outlet by 0.400 m</label>
        <p>Continuity fixes A₁v₁ = A₂v₂. Narrowing converts pressure energy into kinetic energy; lifting also costs gravitational energy.</p>
        <p class="limit">Steady incompressible water, ρ = 1000 kg/m³; same streamline, lossless, no pump. Inlet flow and 15 kPa gauge pressure are maintained externally. Real viscous pipes need loss terms. The drawing shows circular pipe diameter ∝ √area.</p>
        <p class="technical">Pressure drop {pipe.pressureDropPa.toFixed(0)} Pa; kinetic flux gain {pipe.kineticGainW.toFixed(4)} W.</p>
      {:else if chapterId === "m5"}
        <label for={`${chapterId}-body`}>Maintained body <b>{bodyTemperature} K</b></label>
        <input id={`${chapterId}-body`} type="range" min="300" max="450" step="5" bind:value={bodyTemperature} />
        <label for={`${chapterId}-emissivity`}>Emissivity <b>{emissivity.toFixed(2)}</b></label>
        <input id={`${chapterId}-emissivity`} type="range" min="0" max="1" step="0.05" bind:value={emissivity} />
        <p>Changing emissivity changes both emission and absorption. At 300 K they balance even though each remains nonzero for ε &gt; 0.</p>
        <p class="limit">Small grey body in a large black enclosure. Pnet = εσA(T⁴ − 300⁴), not εσA(ΔT)⁴. σ = 5.67 × 10⁻⁸ SI; convection h = 5 W/(m² K). No support conduction or extra irradiation.</p>
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
  .drawing:focus-visible, input:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }
  svg { display: block; width: 100%; min-width: 600px; height: auto; }
  svg text { fill: var(--ink); font: 14px var(--mono); }
  svg .caption { fill: var(--teal); font-size: 12px; letter-spacing: 1px; }
  svg .strong { font-size: 16px; fill: var(--amber); }
  svg .note { font-size: 12px; fill: var(--muted); }
  .wall { fill: none; stroke: var(--ink); stroke-width: 3; }
  .ghost { fill: none; stroke: var(--line-strong); stroke-width: 2; stroke-dasharray: 6 4; }
  .datum { stroke: var(--muted); stroke-dasharray: 3 5; }
  .material { fill: var(--night); stroke: var(--amber); stroke-width: 2; }
  .liquid { fill: color-mix(in srgb, var(--teal) 15%, var(--night)); stroke: var(--teal); stroke-width: 2; }
  .ice { fill: var(--ink); fill-opacity: 0.75; stroke: var(--ink); }
  .gas-fill { fill: color-mix(in srgb, var(--teal) 7%, var(--night)); }
  .track { fill: var(--night); stroke: var(--line-strong); }
  .hot-fill { fill: var(--amber); }
  .cold-fill { fill: var(--teal); }
  .piston { fill: none; stroke: var(--amber); stroke-width: 9; }
  .arrow { fill: none; stroke: var(--amber); stroke-width: 2; }
  .stream, .molecule { fill: none; stroke: var(--teal); stroke-width: 2; }
  .molecule { stroke-width: 1; }
  aside { min-width: 0; font-size: 0.84rem; line-height: 1.6; }
  aside p { margin: 0.8rem 0; }
  label { display: block; font: 0.73rem var(--mono); color: var(--muted); }
  label b { color: var(--amber); display: block; margin-top: 0.35rem; }
  input[type="range"] { display: block; width: 100%; min-height: 44px; margin: 0.3rem 0 0.8rem; accent-color: var(--amber); }
  .toggle { display: flex; align-items: center; gap: 0.6rem; min-height: 44px; }
  input[type="checkbox"] { width: 20px; height: 20px; accent-color: var(--teal); flex-shrink: 0; }
  .limit { color: var(--muted); font-size: 0.76rem; }
  .readout { margin: 1rem 0 0; font: 0.76rem/1.7 var(--mono); overflow-wrap: anywhere; }
  .readout span { display: block; margin-bottom: 0.3rem; }
  @media (max-width: 850px) { .layout { grid-template-columns: minmax(0, 1fr); } aside { max-width: 650px; } }
  @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }
</style>
