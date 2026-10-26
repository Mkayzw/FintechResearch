<script lang="ts">
  import { loadedDivider, feedbackAmplifier } from "./electrical-visual-models";
  let { chapterId }: { chapterId: string } = $props();
  let loaded = $state(false);
  let sensor = $state(6);
  let input = $state(1.2);
  let darkness = $state(true);
  let enabled = $state(true);
  let fault = $state(false);
  let divider = $derived(loadedDivider(6, 4000, sensor * 1000, loaded ? 12000 : null));
  let amplifier = $derived(feedbackAmplifier(input));
  let alarm = $derived(darkness && enabled && !fault);
  const titles: Record<string, string> = { a1: "The sensor is a circuit, not an isolated voltage.", a2: "Feedback cannot demand an impossible output.", a3: "Trace the decision from sensor to alarm." };
</script>

<section aria-labelledby={`${chapterId}-visual-title`}>
  <p class="scene-kicker">Circuit bench · Change the cause, inspect the consequence</p>
  <h4 class="scene-title" id={`${chapterId}-visual-title`}>{titles[chapterId]}</h4>
  <div class="scene-layout">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard focus enables horizontal scrolling of the scientific diagram.) -->
    <div class="scene-drawing" role="region" tabindex="0" aria-label="Scrollable electronics circuit">
      <svg viewBox="0 0 720 330" role="img" aria-labelledby={`${chapterId}-scene-title ${chapterId}-scene-desc`}>
        <title id={`${chapterId}-scene-title`}>{titles[chapterId]}</title>
        <desc id={`${chapterId}-scene-desc`}>{chapterId === "a1" ? `6 volt source, 4 kiloohm upper resistor, ${sensor} kiloohm sensor, ${loaded ? "12 kiloohm parallel load connected" : "load disconnected"}. Output ${divider.output.toFixed(3)} volts.` : chapterId === "a2" ? `Gain 2.5, input ${input} volts, requested output ${amplifier.requested.toFixed(2)} volts, actual ${amplifier.output.toFixed(2)} volts. ${amplifier.clipped ? "Saturated: inputs are unequal." : "Linear negative feedback."}` : `Darkness ${+darkness}, enable ${+enabled}, fault ${+fault}, alarm ${+alarm}.`}</desc>
        {#if chapterId === "a1"}
          <path d="M95 126 V65 H295 V87 M295 145 V173 H525 V183 M525 255 V290 H95 V205 M295 173 V205 M295 255 V290" class="wire" />
          <circle cx="95" cy="166" r="39" fill="none" stroke="#72c9b5" stroke-width="2" /><text x="95" y="164" text-anchor="middle">6 V</text><text x="95" y="183" text-anchor="middle">DC</text>
          <rect x="282" y="87" width="26" height="58" fill="#263b36" stroke="#72c9b5" /><text x="330" y="121">R₁ = 4 kΩ</text>
          <rect x="282" y="205" width="26" height="50" fill="#263b36" stroke="#72c9b5" /><path d="M265 245 L322 215" stroke="#e5b66a" stroke-width="2" /><text x="172" y="232">Sensor</text><text x="180" y="254">{sensor.toFixed(1)} kΩ</text>
          <rect x="512" y="205" width="26" height="50" fill={loaded ? "#4c3d25" : "#101b1c"} stroke={loaded ? "#e5b66a" : "#60706a"} stroke-dasharray={loaded ? undefined : "4 4"} />
          <path d={loaded ? "M525 183 V205" : "M525 183 L545 173 M525 200 V205"} class="wire" />
          <circle cx="525" cy="183" r="2" fill="#9aaea7" /><circle cx="525" cy="200" r="2" fill="#9aaea7" />
          <text x="557" y="223">Load</text><text x="557" y="246">12 kΩ</text>
          <circle cx="295" cy="173" r="5" fill="#e5b66a" /><text x="360" y="163" class="scene-big">Vₒ = {divider.output.toFixed(3)} V</text>
          <text x="30" y="30">LOADED SENSOR DIVIDER</text><text x="30" y="316">{(divider.sourceCurrent * 1000).toFixed(3)} mA in = {(divider.lowerCurrent * 1000).toFixed(3)} + {(divider.loadCurrent * 1000).toFixed(3)} mA out</text>
        {:else if chapterId === "a2"}
          <text x="30" y="30">NON-INVERTING STAGE · 5 V SUPPLY</text>
          <path d="M270 83 L270 217 L400 150 Z" fill="#203b35" stroke="#72c9b5" stroke-width="2" />
          <text x="284" y="124">+</text><text x="284" y="191">−</text>
          <path d="M75 115 H270 M400 150 H595 M480 150 V265 H408 M348 265 H215 V185 H270 M215 265 H160 M110 265 H75 V288" class="wire" />
          <rect x="348" y="252" width="60" height="26" fill="#263b36" stroke="#72c9b5" /><text x="330" y="302">Rƒ = 18 kΩ</text>
          <rect x="110" y="252" width="50" height="26" fill="#263b36" stroke="#72c9b5" /><text x="30" y="241">Rɡ = 12 kΩ</text><path d="M60 288 H90 M65 294 H85 M70 300 H80" class="wire" />
          <circle cx="480" cy="150" r="4" fill="#72c9b5" /><circle cx="215" cy="265" r="4" fill="#72c9b5" />
          <text x="55" y="91">V+ = {input.toFixed(2)} V</text><text x="165" y="169">V− = {amplifier.invertingInput.toFixed(2)} V</text>
          <text x="435" y="100" class="scene-big">Vₒ = {amplifier.output.toFixed(2)} V</text>
          <text x="435" y="126" class={amplifier.clipped ? "scene-amber" : "scene-teal"}>{amplifier.clipped ? "CLIPPED" : "LINEAR"}</text>
          <text x="435" y="194">Requested {amplifier.requested.toFixed(2)} V</text><text x="435" y="216">Usable 0.15–4.65 V</text>
        {:else}
          <text x="30" y="30">Y = S AND E AND NOT F</text>
          {#each [{ label: "DARK S", value: darkness, y: 90 }, { label: "ENABLE E", value: enabled, y: 155 }, { label: "FAULT F", value: fault, y: 245 }] as signal}
            <text x="30" y={signal.y - 17}>{signal.label}</text><rect x="30" y={signal.y - 6} width="65" height="34" rx="4" fill={signal.value ? "#274a44" : "#1a2423"} stroke={signal.value ? "#72c9b5" : "#60706a"} /><text x="62" y={signal.y + 17} text-anchor="middle">{+signal.value}</text>
          {/each}
          <path d="M95 100 H340 M95 165 H340 M95 255 H175" class="wire" />
          <path d="M175 235 L175 275 L215 255 Z" fill="#263b36" stroke="#e5b66a" /><circle cx="222" cy="255" r="7" fill="none" stroke="#e5b66a" /><text x="164" y="307">NOT</text>
          <path d="M229 255 H295 V215 H340" class="wire" /><text x="242" y="244">{+!fault}</text>
          <path d="M340 75 H390 A85 85 0 0 1 390 245 H340 Z" fill="#203b35" stroke="#72c9b5" stroke-width="2" /><text x="389" y="164">AND</text>
          <path d="M475 160 H560" stroke={alarm ? "#e5b66a" : "#60706a"} stroke-width="3" />
          <circle cx="610" cy="160" r="49" fill={alarm ? "#4c3d25" : "#182322"} stroke={alarm ? "#e5b66a" : "#60706a"} stroke-width="2" /><text x="610" y="157" text-anchor="middle" class="scene-big">{+alarm}</text><text x="610" y="180" text-anchor="middle">ALARM</text>
          <text x="520" y="258" class={alarm ? "scene-amber" : "scene-teal"}>{alarm ? "All conditions met" : "At least one veto"}</text>
        {/if}
      </svg>
    </div>
    <div class="scene-controls">
      {#if chapterId === "a1"}
        <label for="a1-sensor">Sensor resistance / kΩ: {sensor.toFixed(1)}<input id="a1-sensor" type="range" min="1" max="12" step="0.1" bind:value={sensor} /></label>
        <label class="scene-toggle" for="a1-load"><input id="a1-load" type="checkbox" bind:checked={loaded} />Connect the 12 kΩ load</label>
        <p class="scene-result">{loaded ? "The extra current through R₁ increases its voltage drop. The loaded output falls." : "Open output: no current in the load branch. The sensor still carries current."}</p>
        <p>Return to 6 kΩ and connect the load: 3.600 V becomes 3.000 V. A measuring instrument with finite input resistance changes the circuit too.</p>
      {:else if chapterId === "a2"}
        <label for="a2-input">Input / V: {input.toFixed(2)}<input id="a2-input" type="range" min="0" max="2.4" step="0.01" bind:value={input} /></label>
        <p class="scene-result">{amplifier.clipped ? `Input mismatch ${(input - amplifier.invertingInput).toFixed(3)} V. Saturation breaks the approximate equality V− ≈ V+.` : "Feedback holds V− ≈ V+; the external resistor ratio sets gain 1 + 18/12 = 2.5."}</p>
        <p>Pass 1.86 V. The output stops following the requested gain even though the input continues to rise. This is not the 5 V supply rail.</p>
      {:else}
        <label class="scene-toggle" for="a3-dark"><input id="a3-dark" type="checkbox" bind:checked={darkness} />Darkness detected S</label>
        <label class="scene-toggle" for="a3-enable"><input id="a3-enable" type="checkbox" bind:checked={enabled} />System enabled E</label>
        <label class="scene-toggle" for="a3-fault"><input id="a3-fault" type="checkbox" bind:checked={fault} />Fault detected F</label>
        <p class="scene-result">{alarm ? "Alarm on: darkness AND enabled AND no fault." : fault ? "Fault is high, so NOT F is low. The fault vetoes the alarm." : "Darkness and enable must both be high; one alone cannot activate the alarm."}</p>
        <p>Test all eight combinations. Follow the inverted fault signal before reading the final AND output.</p>
      {/if}
    </div>
  </div>
  <p class="scene-assumption">{chapterId === "a1" ? "Ideal 6 V source, ohmic sensor at each setting; no self-heating model. Wire lengths are schematic. Sensor resistance is controlled directly, not calibrated to lux or temperature." : chapterId === "a2" ? "Illustrative static amplifier: negligible input current, stable negative feedback when linear, stipulated 0.15–4.65 V output, admissible 0–4 V inputs. Not a real IC specification; bandwidth and recovery time omitted." : "Ideal Boolean decisions, not voltage-level or propagation-delay simulation. The alarm represents a logic state, not an unprotected gate driving a real sounder."}</p>
</section>
