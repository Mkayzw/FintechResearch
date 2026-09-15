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
  import MechanicsDiagram from "./MechanicsDiagram.svelte";
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
      direction: "clockwise",
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
  <div class="experiment-stage">
    <header>
      <div>
        <span>Live apparatus</span><strong
          >Change one variable. Read every consequence.</strong
        >
      </div>
      <small>Amber: state · Teal: result · Coral: applied/loss</small>
    </header>
    <MechanicsDiagram
      {active}
      {kinematics}
      initialVelocity={kinematicsU}
      acceleration={kinematicsA}
      {collision}
      {collisionVelocity}
      mass1={collisionMass1}
      mass2={collisionMass2}
      {force}
      {distance}
      {springConstant}
      {extension}
      {energy}
      {netWork}
      {circular}
      {radius}
      {circularSpeed}
      {orbit}
      {altitudeKilometers}
    />
  </div>
  <div class="controls">
    {#if active === "kinematics"}
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
    {:else if active === "dynamics"}
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
    {:else if active === "forces"}
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
        label="Moment"
        value={`${Math.abs(moment).toFixed(2)} N m clockwise`}
      />
      <MechanicsReadout
        label="Elastic energy"
        value={`${elastic.toFixed(2)} J`}
      />
    {:else if active === "energy"}
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
    {:else if active === "circular"}
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
    {:else}
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
    {/if}
  </div>
</section>

<style>
  .lab,
  .lab > * {
    min-width: 0;
  }
  .lab {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(20rem, 0.55fr);
    border: 1px solid var(--line);
  }
  .experiment-stage > header {
    min-height: 4.75rem;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    padding: 0.9rem 1.25rem;
    border-bottom: 1px solid var(--line);
    background: var(--night-2);
  }
  .experiment-stage header div {
    display: grid;
    gap: 0.25rem;
  }
  .experiment-stage header span,
  .experiment-stage header small {
    color: var(--muted);
    font: 700 0.72rem var(--mono);
    text-transform: uppercase;
  }
  .experiment-stage header strong {
    font: 600 1rem var(--serif);
  }
  .experiment-stage header small {
    text-align: right;
    line-height: 1.4;
  }
  .controls {
    padding: clamp(1.25rem, 3vw, 2.5rem);
    border-left: 1px solid var(--line);
    background: var(--panel);
  }
  @media (max-width: 58rem) {
    .lab {
      grid-template-columns: 1fr;
    }
    .controls {
      border-left: 0;
      border-top: 1px solid var(--line);
    }
    .experiment-stage header {
      align-items: flex-start;
      flex-direction: column;
    }
    .experiment-stage header small {
      text-align: left;
    }
  }
  @media (max-width: 34rem) {
    .controls {
      padding: 1rem;
    }
    .experiment-stage header strong {
      font-size: 0.92rem;
    }
  }
</style>
