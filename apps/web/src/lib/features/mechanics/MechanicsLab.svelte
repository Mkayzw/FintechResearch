<script lang="ts">
  import {
    collision1D,
    constantAccelerationState,
    gravitationalOrbit,
    momentOfForce,
    radialForce,
    springEnergy,
    workEnergy,
  } from "@strange-loops/physics";
  import MechanicsReadout from "./MechanicsReadout.svelte";
  import MechanicsSlider from "./MechanicsSlider.svelte";
  import type { MechanicsModuleId } from "./mechanics-content";

  let { active }: { active: MechanicsModuleId } = $props();

  let kinematicsU = $state(4);
  let kinematicsA = $state(2);
  let kinematicsT = $state(6);
  let collisionMass1 = $state(2);
  let collisionMass2 = $state(1);
  let collisionVelocity = $state(3);
  let restitution = $state(0.6);
  let force = $state(20);
  let distance = $state(0.5);
  let springConstant = $state(40);
  let extension = $state(0.25);
  let energyMass = $state(4);
  let initialSpeed = $state(2);
  let netWork = $state(24);
  let circularMass = $state(2);
  let radius = $state(4);
  let circularSpeed = $state(6);
  let altitudeKilometers = $state(400);

  const earthMass = 5.972e24;
  const earthRadius = 6.371e6;

  let kinematics = $derived(
    constantAccelerationState({
      initialPositionMeters: 0,
      initialVelocityMetersPerSecond: kinematicsU,
      accelerationMetersPerSecondSquared: kinematicsA,
      timeSeconds: kinematicsT,
    }),
  );
  let collision = $derived(
    collision1D({
      mass1Kilograms: collisionMass1,
      velocity1MetersPerSecond: collisionVelocity,
      mass2Kilograms: collisionMass2,
      velocity2MetersPerSecond: 0,
      coefficientOfRestitution: restitution,
    }),
  );
  let moment = $derived(
    momentOfForce({
      forceNewtons: force,
      perpendicularDistanceMeters: distance,
      direction: "anticlockwise",
    }),
  );
  let elastic = $derived(springEnergy(springConstant, extension));
  let energy = $derived(
    workEnergy({
      massKilograms: energyMass,
      initialSpeedMetersPerSecond: initialSpeed,
      netWorkJoules: netWork,
    }),
  );
  let circular = $derived(
    radialForce({
      massKilograms: circularMass,
      radiusMeters: radius,
      speedMetersPerSecond: circularSpeed,
    }),
  );
  let orbit = $derived(
    gravitationalOrbit({
      centralMassKilograms: earthMass,
      radiusMeters: earthRadius + altitudeKilometers * 1000,
    }),
  );
</script>

<section class="lab" aria-label="Interactive Mechanics laboratory">
  {#if active === "kinematics"}
    <div class="visual motion" aria-label="Rectilinear motion diagram">
      <div class="track"></div>
      <div
        class="cart"
        style={`left: ${Math.min(88, 8 + kinematics.displacementMeters)}%`}
      >
        <span>v = {kinematics.velocityMetersPerSecond.toFixed(1)} m/s</span>
      </div>
      <div class="axis">
        0 m <span>{kinematics.displacementMeters.toFixed(1)} m</span>
      </div>
    </div>
    <div class="controls">
      <MechanicsSlider
        label="Initial velocity"
        unit="m/s"
        min={-10}
        max={20}
        step={1}
        bind:value={kinematicsU}
      />
      <MechanicsSlider
        label="Acceleration"
        unit="m/s²"
        min={-5}
        max={8}
        step={0.5}
        bind:value={kinematicsA}
      />
      <MechanicsSlider
        label="Time"
        unit="s"
        min={0}
        max={10}
        step={0.5}
        bind:value={kinematicsT}
      />
      <MechanicsReadout
        label="Displacement"
        value={`${kinematics.displacementMeters.toFixed(2)} m`}
      />
      <MechanicsReadout
        label="Final velocity"
        value={`${kinematics.velocityMetersPerSecond.toFixed(2)} m/s`}
      />
    </div>
  {:else if active === "dynamics"}
    <div
      class="visual collision"
      aria-label="One-dimensional collision diagram"
    >
      <div class="momentum before">
        <span>Before</span>
        <i
          style={`width:${Math.abs(collisionVelocity) * collisionMass1 * 10}px`}
        ></i>
        <b
          >{collision.momentumBeforeKilogramMetersPerSecond.toFixed(2)} kg m/s</b
        >
      </div>
      <div class="carts">
        <div class="cart-one">m₁</div>
        <div class="cart-two">m₂</div>
      </div>
      <div class="momentum after">
        <span>After</span>
        <i
          style={`width:${Math.abs(collision.momentumAfterKilogramMetersPerSecond) * 10}px`}
        ></i>
        <b>{collision.momentumAfterKilogramMetersPerSecond.toFixed(2)} kg m/s</b
        >
      </div>
    </div>
    <div class="controls">
      <MechanicsSlider
        label="Moving mass"
        unit="kg"
        min={0.5}
        max={5}
        step={0.5}
        bind:value={collisionMass1}
      />
      <MechanicsSlider
        label="Target mass"
        unit="kg"
        min={0.5}
        max={5}
        step={0.5}
        bind:value={collisionMass2}
      />
      <MechanicsSlider
        label="Approach speed"
        unit="m/s"
        min={0.5}
        max={8}
        step={0.5}
        bind:value={collisionVelocity}
      />
      <MechanicsSlider
        label="Restitution"
        unit=""
        min={0}
        max={1}
        step={0.1}
        bind:value={restitution}
      />
      <MechanicsReadout
        label="Final velocities"
        value={`${collision.velocity1MetersPerSecond.toFixed(2)}, ${collision.velocity2MetersPerSecond.toFixed(2)} m/s`}
      />
      <MechanicsReadout
        label="Kinetic-energy change"
        value={`${collision.kineticEnergyChangeJoules.toFixed(2)} J`}
      />
    </div>
  {:else if active === "forces"}
    <div class="visual beam" aria-label="Moment and spring diagram">
      <div class="pivot">▲</div>
      <div class="beam-line"></div>
      <div
        class="force-arrow"
        style={`right:${Math.max(5, 50 - distance * 30)}%`}
      >
        ↓ {force.toFixed(0)} N
      </div>
      <div class="spring" style={`height:${60 + extension * 180}px`}>
        /\/\/\/\
      </div>
    </div>
    <div class="controls">
      <MechanicsSlider
        label="Force"
        unit="N"
        min={0}
        max={80}
        step={1}
        bind:value={force}
      />
      <MechanicsSlider
        label="Perpendicular distance"
        unit="m"
        min={0}
        max={2}
        step={0.1}
        bind:value={distance}
      />
      <MechanicsSlider
        label="Spring constant"
        unit="N/m"
        min={5}
        max={100}
        step={5}
        bind:value={springConstant}
      />
      <MechanicsSlider
        label="Extension"
        unit="m"
        min={-0.5}
        max={0.5}
        step={0.05}
        bind:value={extension}
      />
      <MechanicsReadout
        label="Anticlockwise moment"
        value={`${moment.toFixed(2)} N m`}
      />
      <MechanicsReadout
        label="Elastic energy"
        value={`${elastic.toFixed(2)} J`}
      />
    </div>
  {:else if active === "energy"}
    <div class="visual energy-bars" aria-label="Work-energy accounting diagram">
      <div>
        <span>Initial kinetic</span><i
          style={`height:${Math.min(90, energy.initialKineticEnergyJoules * 2)}%`}
        ></i>
      </div>
      <div>
        <span>Net work</span><i
          style={`height:${Math.min(90, Math.max(2, netWork * 2))}%`}
        ></i>
      </div>
      <div>
        <span>Final kinetic</span><i
          style={`height:${Math.min(90, energy.finalKineticEnergyJoules * 2)}%`}
        ></i>
      </div>
    </div>
    <div class="controls">
      <MechanicsSlider
        label="Mass"
        unit="kg"
        min={0.5}
        max={10}
        step={0.5}
        bind:value={energyMass}
      />
      <MechanicsSlider
        label="Initial speed"
        unit="m/s"
        min={0}
        max={12}
        step={0.5}
        bind:value={initialSpeed}
      />
      <MechanicsSlider
        label="Net work"
        unit="J"
        min={0}
        max={80}
        step={2}
        bind:value={netWork}
      />
      <MechanicsReadout
        label="Final speed"
        value={`${energy.finalSpeedMetersPerSecond.toFixed(2)} m/s`}
      />
      <MechanicsReadout
        label="Final kinetic energy"
        value={`${energy.finalKineticEnergyJoules.toFixed(2)} J`}
      />
    </div>
  {:else if active === "circular"}
    <div class="visual orbit-local" aria-label="Circular motion vector diagram">
      <div class="circle"></div>
      <div class="body">m</div>
      <div class="velocity-arrow">v ↑</div>
      <div class="radial-arrow">← ΣFᵣ</div>
    </div>
    <div class="controls">
      <MechanicsSlider
        label="Mass"
        unit="kg"
        min={0.1}
        max={5}
        step={0.1}
        bind:value={circularMass}
      />
      <MechanicsSlider
        label="Radius"
        unit="m"
        min={0.5}
        max={10}
        step={0.5}
        bind:value={radius}
      />
      <MechanicsSlider
        label="Speed"
        unit="m/s"
        min={0}
        max={15}
        step={0.5}
        bind:value={circularSpeed}
      />
      <MechanicsReadout
        label="Inward acceleration"
        value={`${circular.accelerationMetersPerSecondSquared.toFixed(2)} m/s²`}
      />
      <MechanicsReadout
        label="Radial resultant"
        value={`${circular.forceNewtons.toFixed(2)} N`}
      />
      <MechanicsReadout
        label="Period"
        value={Number.isFinite(circular.periodSeconds)
          ? `${circular.periodSeconds.toFixed(2)} s`
          : "Stationary"}
      />
    </div>
  {:else}
    <div class="visual earth-orbit" aria-label="Circular Earth orbit diagram">
      <div class="earth">Earth</div>
      <div
        class="orbit-ring"
        style={`inset:${Math.max(10, 34 - altitudeKilometers / 100)}px`}
      ></div>
      <div class="satellite">●</div>
      <span>r = Rₑ + altitude</span>
    </div>
    <div class="controls">
      <MechanicsSlider
        label="Altitude"
        unit="km"
        min={160}
        max={36000}
        step={100}
        bind:value={altitudeKilometers}
      />
      <MechanicsReadout
        label="Field strength"
        value={`${orbit.fieldStrengthNewtonsPerKilogram.toFixed(3)} N/kg`}
      />
      <MechanicsReadout
        label="Orbital speed"
        value={`${(orbit.orbitalSpeedMetersPerSecond / 1000).toFixed(2)} km/s`}
      />
      <MechanicsReadout
        label="Period"
        value={`${(orbit.periodSeconds / 3600).toFixed(2)} h`}
      />
      <MechanicsReadout
        label="Potential"
        value={`${(orbit.potentialJoulesPerKilogram / 1e6).toFixed(2)} MJ/kg`}
      />
    </div>
  {/if}
</section>

<style>
  .lab,
  .lab > * {
    min-width: 0;
  }
  .lab {
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(18rem, 0.75fr);
    border: 1px solid var(--line);
  }
  .visual {
    min-height: 31rem;
    position: relative;
    overflow: hidden;
    background: radial-gradient(
        circle at 50% 50%,
        rgba(113, 215, 199, 0.11),
        transparent 45%
      ),
      #090d11;
  }
  .controls {
    padding: clamp(1.25rem, 3vw, 2.5rem);
    border-left: 1px solid var(--line);
    background: var(--panel);
  }
  .motion .track {
    position: absolute;
    left: 8%;
    right: 8%;
    top: 55%;
    height: 2px;
    background: var(--line-strong);
  }
  .motion .cart {
    position: absolute;
    top: calc(55% - 2.7rem);
    width: 5rem;
    height: 2.7rem;
    transform: translateX(-50%);
    background: var(--amber);
    color: var(--night);
    transition: left 0.2s;
  }
  .motion .cart span {
    position: absolute;
    width: 11rem;
    top: -2rem;
    left: -3rem;
    color: var(--ink);
    font: 700 0.68rem var(--mono);
  }
  .motion .axis {
    position: absolute;
    left: 8%;
    right: 8%;
    top: 58%;
    display: flex;
    justify-content: space-between;
    color: var(--muted);
    font: 600 0.65rem var(--mono);
  }
  .collision {
    display: grid;
    place-content: center;
    gap: 3rem;
    padding: 2rem;
  }
  .carts {
    display: flex;
    justify-content: center;
    align-items: end;
    gap: 0.25rem;
    border-bottom: 2px solid var(--line-strong);
  }
  .cart-one,
  .cart-two {
    display: grid;
    place-items: center;
    color: var(--night);
    font: 800 1rem var(--mono);
  }
  .cart-one {
    width: 8rem;
    height: 5rem;
    background: var(--amber);
  }
  .cart-two {
    width: 5rem;
    height: 3.5rem;
    background: var(--teal);
  }
  .momentum {
    display: grid;
    grid-template-columns: 4rem 1fr auto;
    align-items: center;
    gap: 1rem;
    color: var(--muted);
    font: 700 0.65rem var(--mono);
    text-transform: uppercase;
  }
  .momentum i {
    display: block;
    height: 3px;
    max-width: 15rem;
    background: var(--coral);
  }
  .momentum b {
    color: var(--ink);
  }
  .beam .beam-line {
    position: absolute;
    left: 15%;
    right: 15%;
    top: 46%;
    height: 0.8rem;
    background: var(--amber);
  }
  .beam .pivot {
    position: absolute;
    left: 14%;
    top: 48%;
    color: var(--teal);
    font-size: 3rem;
  }
  .force-arrow {
    position: absolute;
    top: 30%;
    color: var(--coral);
    font: 800 0.8rem var(--mono);
  }
  .spring {
    position: absolute;
    right: 15%;
    top: 55%;
    width: 4rem;
    color: var(--teal);
    font: 800 1.3rem/1.1 var(--mono);
    writing-mode: vertical-rl;
    overflow: hidden;
  }
  .energy-bars {
    display: flex;
    justify-content: center;
    align-items: end;
    gap: clamp(1rem, 5vw, 4rem);
    padding: 4rem 2rem;
  }
  .energy-bars div {
    height: 22rem;
    width: min(8rem, 25%);
    display: flex;
    flex-direction: column;
    justify-content: end;
    gap: 0.75rem;
  }
  .energy-bars span {
    min-height: 2rem;
    color: var(--muted);
    font: 700 0.62rem var(--mono);
    text-transform: uppercase;
  }
  .energy-bars i {
    display: block;
    min-height: 0.3rem;
    background: linear-gradient(var(--amber), var(--coral));
    transition: height 0.2s;
  }
  .orbit-local .circle {
    position: absolute;
    width: 18rem;
    height: 18rem;
    border: 1px solid var(--line-strong);
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .orbit-local .body {
    position: absolute;
    left: calc(50% + 8rem);
    top: calc(50% - 1rem);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--amber);
    color: var(--night);
  }
  .velocity-arrow {
    position: absolute;
    left: calc(50% + 10.7rem);
    top: calc(50% - 4rem);
    color: var(--amber);
    font: 800 0.8rem var(--mono);
  }
  .radial-arrow {
    position: absolute;
    left: calc(50% + 2rem);
    top: calc(50% + 1.5rem);
    color: var(--teal);
    font: 800 0.8rem var(--mono);
  }
  .earth-orbit {
    display: grid;
    place-items: center;
  }
  .earth {
    width: 9rem;
    height: 9rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(
      circle at 30% 25%,
      var(--teal),
      #183a47 55%,
      #071317
    );
    font: 800 0.7rem var(--mono);
    text-transform: uppercase;
  }
  .orbit-ring {
    position: absolute;
    border: 1px dashed var(--amber);
    border-radius: 50%;
  }
  .satellite {
    position: absolute;
    top: 12%;
    left: 50%;
    color: var(--amber);
    font-size: 2rem;
  }
  .earth-orbit > span {
    position: absolute;
    bottom: 2rem;
    color: var(--muted);
    font: 700 0.65rem var(--mono);
  }
  @media (max-width: 58rem) {
    .lab {
      grid-template-columns: 1fr;
    }
    .controls {
      border-left: 0;
      border-top: 1px solid var(--line);
    }
    .visual {
      min-height: 24rem;
    }
  }
  @media (max-width: 34rem) {
    .visual {
      min-height: 19rem;
    }
    .collision {
      padding: 1rem;
    }
    .momentum {
      grid-template-columns: 3rem 1fr;
    }
    .momentum b {
      grid-column: 2;
    }
    .energy-bars {
      padding: 2rem 1rem;
    }
    .energy-bars div {
      height: 15rem;
    }
    .orbit-local .circle {
      width: 13rem;
      height: 13rem;
    }
    .orbit-local .body {
      left: calc(50% + 5.5rem);
    }
    .velocity-arrow {
      left: calc(50% + 4rem);
    }
    .radial-arrow {
      left: calc(50% - 1rem);
    }
  }
</style>
