<script lang="ts">
  import type { MechanicsModuleId } from "./mechanics-content";

  let {
    active,
    kinematics,
    initialVelocity,
    acceleration,
    collision,
    collisionVelocity,
    mass1,
    mass2,
    force,
    distance,
    springConstant,
    extension,
    energy,
    netWork,
    circular,
    radius,
    circularSpeed,
    orbit,
    altitudeKilometers,
  }: {
    active: MechanicsModuleId;
    kinematics: { displacementMeters: number; velocityMetersPerSecond: number };
    initialVelocity: number;
    acceleration: number;
    collision: {
      velocity1MetersPerSecond: number;
      velocity2MetersPerSecond: number;
      momentumBeforeKilogramMetersPerSecond: number;
      momentumAfterKilogramMetersPerSecond: number;
      kineticEnergyBeforeJoules: number;
      kineticEnergyAfterJoules: number;
    };
    collisionVelocity: number;
    mass1: number;
    mass2: number;
    force: number;
    distance: number;
    springConstant: number;
    extension: number;
    energy: {
      initialKineticEnergyJoules: number;
      finalKineticEnergyJoules: number;
    };
    netWork: number;
    circular: {
      accelerationMetersPerSecondSquared: number;
      forceNewtons: number;
    };
    radius: number;
    circularSpeed: number;
    orbit: {
      fieldStrengthNewtonsPerKilogram: number;
      orbitalSpeedMetersPerSecond: number;
      periodSeconds: number;
    };
    altitudeKilometers: number;
  } = $props();

  const width = 860;
  const height = 500;
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  let motionExtent = $derived(
    Math.max(20, Math.abs(kinematics.displacementMeters) * 1.25),
  );
  let motionX = $derived(
    430 + (kinematics.displacementMeters / motionExtent) * 320,
  );
  let circularRadius = $derived(105 + ((radius - 0.5) / 9.5) * 75);
  let orbitRadius = $derived(
    125 +
      ((Math.log10(altitudeKilometers) - Math.log10(160)) /
        (Math.log10(36000) - Math.log10(160))) *
        75,
  );
  let momentX = $derived(175 + (distance / 2) * 245);
  let springLength = $derived(140 + extension * 190);
  let energyScale = $derived(
    Math.max(
      1,
      energy.initialKineticEnergyJoules,
      energy.finalKineticEnergyJoules,
    ),
  );

  let summary = $derived.by(() => {
    if (active === "kinematics") {
      return `The trolley is ${Math.abs(kinematics.displacementMeters).toFixed(1)} metres ${kinematics.displacementMeters >= 0 ? "right" : "left"} of the origin. Velocity is ${kinematics.velocityMetersPerSecond.toFixed(1)} metres per second and acceleration is ${acceleration.toFixed(1)} metres per second squared.`;
    }
    if (active === "dynamics") {
      return `Before impact total momentum is ${collision.momentumBeforeKilogramMetersPerSecond.toFixed(2)} kilogram metres per second. After impact it is ${collision.momentumAfterKilogramMetersPerSecond.toFixed(2)}. Kinetic energy changes from ${collision.kineticEnergyBeforeJoules.toFixed(2)} to ${collision.kineticEnergyAfterJoules.toFixed(2)} joules.`;
    }
    if (active === "forces") {
      return `A ${force.toFixed(0)} newton load acts ${distance.toFixed(1)} metres from the pivot. The separate spring has constant ${springConstant.toFixed(0)} newtons per metre and extension ${extension.toFixed(2)} metres.`;
    }
    if (active === "energy") {
      return `Initial kinetic energy is ${energy.initialKineticEnergyJoules.toFixed(1)} joules. Net work is ${netWork.toFixed(1)} joules. Final kinetic energy is ${energy.finalKineticEnergyJoules.toFixed(1)} joules.`;
    }
    if (active === "circular") {
      return `At radius ${radius.toFixed(1)} metres and speed ${circularSpeed.toFixed(1)} metres per second, acceleration and resultant force point inward. Their magnitudes are ${circular.accelerationMetersPerSecondSquared.toFixed(1)} metres per second squared and ${circular.forceNewtons.toFixed(1)} newtons.`;
    }
    return `At ${altitudeKilometers.toFixed(0)} kilometres altitude, field strength is ${orbit.fieldStrengthNewtonsPerKilogram.toFixed(2)} newtons per kilogram, orbital speed is ${(orbit.orbitalSpeedMetersPerSecond / 1000).toFixed(2)} kilometres per second, and period is ${(orbit.periodSeconds / 60).toFixed(1)} minutes.`;
  });
</script>

<div class="diagram">
  <p class="sr-only" aria-live="polite">{summary}</p>
  <svg
    viewBox={`0 0 ${width} ${height}`}
    role="img"
    aria-labelledby="diagram-title diagram-desc"
  >
    <title id="diagram-title">{active} mechanics experiment</title>
    <desc id="diagram-desc">{summary}</desc>
    <defs>
      <pattern
        id="small-grid"
        width="24"
        height="24"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 24 0 L 0 0 0 24"
          fill="none"
          stroke="var(--line)"
          stroke-width="1"
        />
      </pattern>
      <marker
        id="arrow-amber-mech"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
        ><path d="M0 0L10 5L0 10Z" fill="var(--amber)" /></marker
      >
      <marker
        id="arrow-teal-mech"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
        ><path d="M0 0L10 5L0 10Z" fill="var(--teal)" /></marker
      >
      <marker
        id="arrow-coral-mech"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
        ><path d="M0 0L10 5L0 10Z" fill="var(--coral)" /></marker
      >
      <linearGradient id="earth-gradient" x1="0" y1="0" x2="1" y2="1"
        ><stop offset="0" stop-color="var(--teal)" /><stop
          offset=".55"
          stop-color="#24546a"
        /><stop offset="1" stop-color="#071317" /></linearGradient
      >
    </defs>
    <rect {width} {height} fill="#090d11" />
    <rect {width} {height} fill="url(#small-grid)" opacity=".46" />

    {#if active === "kinematics"}
      <text class="overline" x="54" y="52"
        >CALIBRATED ONE-DIMENSIONAL TRACK</text
      >
      <line class="axis" x1="70" y1="315" x2="790" y2="315" />
      {#each [-2, -1, 0, 1, 2] as tick}
        <line
          class="tick"
          x1={430 + tick * 160}
          y1="307"
          x2={430 + tick * 160}
          y2="323"
        />
        <text
          class="tick-label"
          x={430 + tick * 160}
          y="345"
          text-anchor="middle">{((tick * motionExtent) / 2).toFixed(0)} m</text
        >
      {/each}
      <line class="origin" x1="430" y1="105" x2="430" y2="330" />
      <text class="annotation" x="430" y="92" text-anchor="middle">origin</text>
      <g transform={`translate(${motionX} 276)`}>
        <rect class="apparatus amber" x="-40" y="0" width="80" height="34" />
        <circle class="wheel" cx="-25" cy="37" r="7" /><circle
          class="wheel"
          cx="25"
          cy="37"
          r="7"
        />
        <text class="object-label" x="0" y="22" text-anchor="middle"
          >trolley</text
        >
      </g>
      <line
        class="velocity"
        x1={motionX}
        y1="245"
        x2={motionX + clamp(kinematics.velocityMetersPerSecond * 7, -150, 150)}
        y2="245"
        marker-end="url(#arrow-amber-mech)"
      />
      <text class="vector-label amber-text" x={motionX} y="226"
        >v = {kinematics.velocityMetersPerSecond.toFixed(1)} m/s</text
      >
      <line
        class="acceleration"
        x1={motionX}
        y1="185"
        x2={motionX + clamp(acceleration * 16, -130, 130)}
        y2="185"
        marker-end="url(#arrow-coral-mech)"
      />
      <text class="vector-label coral-text" x={motionX} y="166"
        >a = {acceleration.toFixed(1)} m/s²</text
      >
      <text class="readout-large" x="54" y="430"
        >x = {kinematics.displacementMeters.toFixed(1)} m</text
      >
      <text class="caption" x="54" y="461"
        >Sign gives direction. Arrow length gives signed magnitude.</text
      >
    {:else if active === "dynamics"}
      <text class="overline" x="54" y="52">SYSTEM BOUNDARY · TWO TROLLEYS</text>
      <line class="divider" x1="430" y1="82" x2="430" y2="452" />
      <text class="panel-title" x="70" y="100">BEFORE</text><text
        class="panel-title"
        x="470"
        y="100">AFTER</text
      >
      <line class="track-line" x1="65" y1="325" x2="390" y2="325" /><line
        class="track-line"
        x1="470"
        y1="325"
        x2="795"
        y2="325"
      />
      <g transform="translate(150 260)"
        ><rect
          class="apparatus amber"
          width={60 + mass1 * 15}
          height="52"
        /><text
          class="object-label"
          x={(60 + mass1 * 15) / 2}
          y="31"
          text-anchor="middle">m₁</text
        ></g
      >
      <g transform="translate(310 275)"
        ><rect
          class="apparatus teal"
          width={50 + mass2 * 12}
          height="37"
        /><text
          class="object-label"
          x={(50 + mass2 * 12) / 2}
          y="24"
          text-anchor="middle">m₂</text
        ></g
      >
      <line
        class="velocity"
        x1="145"
        y1="225"
        x2={145 + collisionVelocity * 23}
        y2="225"
        marker-end="url(#arrow-amber-mech)"
      /><text class="vector-label amber-text" x="145" y="204"
        >u₁ = {collisionVelocity.toFixed(1)} m/s</text
      >
      <g transform="translate(500 257)"
        ><rect
          class="apparatus amber"
          width={65 + mass1 * 11}
          height="55"
        /><text
          class="object-label"
          x={(65 + mass1 * 11) / 2}
          y="32"
          text-anchor="middle">m₁</text
        ></g
      >
      <g transform="translate(660 272)"
        ><rect
          class="apparatus teal"
          width={55 + mass2 * 10}
          height="40"
        /><text
          class="object-label"
          x={(55 + mass2 * 10) / 2}
          y="25"
          text-anchor="middle">m₂</text
        ></g
      >
      <line
        class="velocity"
        x1="505"
        y1="215"
        x2={505 + clamp(collision.velocity1MetersPerSecond * 26, -120, 150)}
        y2="215"
        marker-end="url(#arrow-amber-mech)"
      />
      <line
        class="derived"
        x1="670"
        y1="185"
        x2={670 + clamp(collision.velocity2MetersPerSecond * 26, -120, 150)}
        y2="185"
        marker-end="url(#arrow-teal-mech)"
      />
      <text class="vector-label amber-text" x="500" y="195"
        >v₁ = {collision.velocity1MetersPerSecond.toFixed(2)} m/s</text
      ><text class="vector-label teal-text" x="665" y="165"
        >v₂ = {collision.velocity2MetersPerSecond.toFixed(2)} m/s</text
      >
      <text class="ledger" x="70" y="405"
        >Σp = {collision.momentumBeforeKilogramMetersPerSecond.toFixed(2)} kg m/s</text
      ><text class="ledger" x="470" y="405"
        >Σp = {collision.momentumAfterKilogramMetersPerSecond.toFixed(2)} kg m/s</text
      >
      <text class="caption" x="470" y="438"
        >ΔEₖ = {(
          collision.kineticEnergyAfterJoules -
          collision.kineticEnergyBeforeJoules
        ).toFixed(2)} J</text
      >
    {:else if active === "forces"}
      <text class="overline" x="54" y="52">TWO DISTINCT EXPERIMENTS</text>
      <line class="divider" x1="500" y1="82" x2="500" y2="452" />
      <text class="panel-title" x="70" y="100">A · MOMENT BENCH</text><text
        class="panel-title"
        x="540"
        y="100">B · SPRING BENCH</text
      >
      <line class="beam-rule" x1="105" y1="280" x2="445" y2="280" />
      {#each [0, 0.5, 1, 1.5, 2] as mark}<line
          class="tick"
          x1={175 + mark * 122.5}
          y1="269"
          x2={175 + mark * 122.5}
          y2="291"
        />{/each}
      <path class="pivot-shape" d="M145 355 L175 292 L205 355 Z" /><text
        class="annotation"
        x="175"
        y="378"
        text-anchor="middle">pivot</text
      >
      <line
        class="applied"
        x1={momentX}
        y1="145"
        x2={momentX}
        y2="260"
        marker-end="url(#arrow-coral-mech)"
      /><text
        class="vector-label coral-text"
        x={momentX}
        y="132"
        text-anchor="middle">{force.toFixed(0)} N</text
      >
      <line
        class="dimension"
        x1="175"
        y1="330"
        x2={momentX}
        y2="330"
        marker-start="url(#arrow-teal-mech)"
        marker-end="url(#arrow-teal-mech)"
      /><text
        class="annotation"
        x={(175 + momentX) / 2}
        y="320"
        text-anchor="middle">d⊥ = {distance.toFixed(1)} m</text
      >
      <line class="support" x1="650" y1="125" x2="650" y2="155" />
      <path
        class="spring-path"
        d={`M650 155 ${Array.from({ length: 10 }, (_, i) => `L${i % 2 ? 670 : 630} ${155 + ((i + 1) * springLength) / 11}`).join(" ")} L650 ${170 + springLength}`}
      />
      <rect
        class="apparatus teal"
        x="615"
        y={170 + springLength}
        width="70"
        height="48"
      /><text
        class="object-label"
        x="650"
        y={199 + springLength}
        text-anchor="middle">load</text
      >
      <line
        class="derived"
        x1="710"
        y1="170"
        x2="710"
        y2={170 + springLength}
        marker-start="url(#arrow-teal-mech)"
        marker-end="url(#arrow-teal-mech)"
      /><text class="annotation" x="725" y={175 + springLength / 2}
        >x = {extension.toFixed(2)} m</text
      >
      <text class="ledger" x="70" y="430"
        >τ = {(force * distance).toFixed(2)} N m</text
      ><text class="ledger" x="540" y="430"
        >F = {(springConstant * extension).toFixed(2)} N</text
      >
    {:else if active === "energy"}
      <text class="overline" x="54" y="52"
        >ENERGY LEDGER · SAME DECLARED SYSTEM</text
      >
      <line class="baseline" x1="90" y1="405" x2="770" y2="405" />
      {@const initialHeight =
        (230 * energy.initialKineticEnergyJoules) / energyScale}
      {@const finalHeight =
        (230 * energy.finalKineticEnergyJoules) / energyScale}
      <rect
        class="energy-initial"
        x="125"
        y={405 - initialHeight}
        width="150"
        height={initialHeight}
      />
      <rect
        class="energy-final"
        x="585"
        y={405 - finalHeight}
        width="150"
        height={finalHeight}
      />
      <path
        class="work-flow"
        d="M300 260 C385 180 475 180 560 260"
        marker-end="url(#arrow-teal-mech)"
      />
      <text class="panel-title" x="200" y="445" text-anchor="middle"
        >INITIAL Eₖ</text
      ><text class="panel-title" x="660" y="445" text-anchor="middle"
        >FINAL Eₖ</text
      >
      <text
        class="bar-value"
        x="200"
        y={385 - initialHeight}
        text-anchor="middle"
        >{energy.initialKineticEnergyJoules.toFixed(1)} J</text
      ><text
        class="bar-value"
        x="660"
        y={385 - finalHeight}
        text-anchor="middle"
        >{energy.finalKineticEnergyJoules.toFixed(1)} J</text
      >
      <rect class="work-chip" x="350" y="225" width="160" height="54" /><text
        class="object-label"
        x="430"
        y="258"
        text-anchor="middle">Wnet = {netWork.toFixed(1)} J</text
      >
      <text class="caption" x="430" y="95" text-anchor="middle"
        >Wnet = ΔEₖ — compare energy changes, not equal speed changes</text
      >
    {:else if active === "circular"}
      <text class="overline" x="54" y="52">INSTANTANEOUS VECTOR VIEW</text>
      <circle class="orbit-path" cx="430" cy="275" r={circularRadius} />
      <circle class="centre-dot" cx="430" cy="275" r="7" /><text
        class="annotation"
        x="430"
        y="300"
        text-anchor="middle">centre</text
      >
      <line
        class="radius-line"
        x1="430"
        y1="275"
        x2={430 + circularRadius}
        y2="275"
      /><text
        class="annotation"
        x={430 + circularRadius / 2}
        y="260"
        text-anchor="middle">r = {radius.toFixed(1)} m</text
      >
      <circle class="moving-body" cx={430 + circularRadius} cy="275" r="18" />
      {#if circularSpeed > 0}
        <line
          class="velocity"
          x1={430 + circularRadius}
          y1="255"
          x2={430 + circularRadius}
          y2={255 - clamp(circularSpeed * 10, 8, 130)}
          marker-end="url(#arrow-amber-mech)"
        /><text
          class="vector-label amber-text"
          x={450 + circularRadius}
          y={235 - clamp(circularSpeed * 10, 8, 130)}>v tangential</text
        >
        <line
          class="derived"
          x1={410 + circularRadius}
          y1="275"
          x2={430 +
            circularRadius -
            clamp(
              circular.accelerationMetersPerSecondSquared * 6,
              8,
              circularRadius - 20,
            )}
          y2="275"
          marker-end="url(#arrow-teal-mech)"
        /><text
          class="vector-label teal-text"
          x={430 + circularRadius / 2}
          y="325"
          text-anchor="middle">aᵣ, ΣFᵣ inward</text
        >
      {:else}
        <text
          class="annotation"
          x={430 + circularRadius}
          y="225"
          text-anchor="middle">stationary: v = aᵣ = ΣFᵣ = 0</text
        >
      {/if}
      <text class="readout-large" x="54" y="420"
        >ΣFᵣ = {circular.forceNewtons.toFixed(2)} N</text
      ><text class="caption" x="54" y="452"
        >Name the real force: tension, friction, normal reaction or gravity.</text
      >
    {:else}
      <text class="overline" x="54" y="52">ORBIT SCHEMATIC · NOT TO SCALE</text>
      <circle class="orbit-path dashed" cx="430" cy="265" r={orbitRadius} />
      <circle cx="430" cy="265" r="88" fill="url(#earth-gradient)" /><text
        class="earth-label"
        x="430"
        y="271"
        text-anchor="middle">EARTH</text
      >
      <circle class="satellite-body" cx={430 + orbitRadius} cy="265" r="12" />
      <line
        class="radius-line"
        x1="430"
        y1="265"
        x2={430 + orbitRadius}
        y2="265"
        marker-end="url(#arrow-teal-mech)"
      /><text
        class="annotation"
        x={430 + orbitRadius / 2}
        y="249"
        text-anchor="middle">r from centre</text
      >
      <line
        class="altitude-line"
        x1="518"
        y1="305"
        x2={430 + orbitRadius}
        y2="305"
        marker-start="url(#arrow-amber-mech)"
        marker-end="url(#arrow-amber-mech)"
      /><text
        class="annotation amber-text"
        x={(948 + orbitRadius) / 2}
        y="330"
        text-anchor="middle">h = {altitudeKilometers.toFixed(0)} km</text
      >
      <line
        class="velocity"
        x1={430 + orbitRadius}
        y1="245"
        x2={430 + orbitRadius}
        y2="155"
        marker-end="url(#arrow-amber-mech)"
      /><text class="vector-label amber-text" x={450 + orbitRadius} y="165"
        >v orbit</text
      >
      <line
        class="derived"
        x1={410 + orbitRadius}
        y1="265"
        x2={520}
        y2="265"
        marker-end="url(#arrow-teal-mech)"
      /><text
        class="vector-label teal-text"
        x={525 + orbitRadius / 2}
        y="290"
        text-anchor="middle">gravity supplies ΣFᵣ</text
      >
      <text class="readout-large" x="54" y="430"
        >g = {orbit.fieldStrengthNewtonsPerKilogram.toFixed(2)} N/kg</text
      ><text class="caption" x="54" y="462"
        >Low orbit is free fall inside a strong gravitational field.</text
      >
    {/if}
  </svg>
  <div class="legend" aria-hidden="true">
    <span><i class="amber-key"></i> state / velocity</span><span
      ><i class="teal-key"></i> derived / resultant</span
    ><span><i class="coral-key"></i> applied / loss</span>
  </div>
</div>

<style>
  .diagram {
    min-width: 0;
    background: #090d11;
  }
  .diagram svg {
    display: block;
    width: 100%;
    height: auto;
    min-height: 30rem;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    padding: 0.9rem 1.25rem;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font: 700 0.72rem var(--mono);
    text-transform: uppercase;
  }
  .legend span {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }
  .legend i {
    width: 1.5rem;
    border-top: 3px solid;
  }
  .amber-key {
    border-color: var(--amber) !important;
  }
  .teal-key {
    border-color: var(--teal) !important;
  }
  .coral-key {
    border-color: var(--coral) !important;
  }
  .axis,
  .track-line,
  .beam-rule,
  .baseline {
    stroke: var(--line-strong);
    stroke-width: 2;
  }
  .tick {
    stroke: var(--muted);
    stroke-width: 1;
  }
  .origin {
    stroke: var(--teal);
    stroke-width: 1;
    stroke-dasharray: 5 6;
  }
  .divider {
    stroke: var(--line-strong);
    stroke-width: 1;
  }
  .apparatus {
    stroke-width: 2;
  }
  .apparatus.amber {
    fill: rgba(244, 184, 74, 0.16);
    stroke: var(--amber);
  }
  .apparatus.teal {
    fill: rgba(113, 215, 199, 0.12);
    stroke: var(--teal);
  }
  .wheel {
    fill: var(--night);
    stroke: var(--ink);
  }
  .velocity {
    stroke: var(--amber);
    stroke-width: 3;
  }
  .acceleration,
  .applied {
    stroke: var(--coral);
    stroke-width: 3;
  }
  .derived,
  .dimension {
    stroke: var(--teal);
    stroke-width: 3;
  }
  .radius-line,
  .altitude-line {
    stroke: var(--teal);
    stroke-width: 1.5;
  }
  .altitude-line {
    stroke: var(--amber);
  }
  .orbit-path {
    fill: none;
    stroke: var(--line-strong);
    stroke-width: 2;
  }
  .orbit-path.dashed {
    stroke: var(--amber);
    stroke-dasharray: 8 8;
    opacity: 0.75;
  }
  .moving-body,
  .satellite-body {
    fill: var(--amber);
    stroke: var(--night);
    stroke-width: 4;
  }
  .centre-dot {
    fill: var(--teal);
  }
  .pivot-shape {
    fill: rgba(113, 215, 199, 0.15);
    stroke: var(--teal);
    stroke-width: 2;
  }
  .support {
    stroke: var(--ink);
    stroke-width: 4;
  }
  .spring-path {
    fill: none;
    stroke: var(--teal);
    stroke-width: 3;
  }
  .work-flow {
    fill: none;
    stroke: var(--teal);
    stroke-width: 3;
  }
  .energy-initial {
    fill: rgba(244, 184, 74, 0.3);
    stroke: var(--amber);
    stroke-width: 2;
  }
  .energy-final {
    fill: rgba(113, 215, 199, 0.25);
    stroke: var(--teal);
    stroke-width: 2;
  }
  .work-chip {
    fill: var(--panel);
    stroke: var(--teal);
  }
  text {
    fill: var(--ink);
    font-family: var(--mono);
  }
  .overline {
    fill: var(--amber);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .panel-title {
    fill: var(--muted);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.5px;
  }
  .annotation,
  .tick-label,
  .caption {
    fill: var(--muted);
    font-size: 12px;
  }
  .object-label {
    fill: var(--ink);
    font-size: 13px;
    font-weight: 800;
  }
  .vector-label {
    font-size: 12px;
    font-weight: 800;
  }
  .amber-text {
    fill: var(--amber);
  }
  .teal-text {
    fill: var(--teal);
  }
  .coral-text {
    fill: var(--coral);
  }
  .ledger,
  .readout-large {
    fill: var(--ink);
    font-family: var(--serif);
    font-size: 26px;
    font-weight: 600;
  }
  .bar-value {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 600;
  }
  .earth-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
  }
  @media (max-width: 40rem) {
    .diagram svg {
      min-height: 19rem;
    }
    .legend {
      font-size: 0.68rem;
    }
    .ledger,
    .readout-large {
      font-size: 20px;
    }
  }
</style>
