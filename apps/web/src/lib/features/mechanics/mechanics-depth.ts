import type { MechanicsModuleId } from "./mechanics-content";
import type { DepthChapter as StudyChapter } from "../../components/depth";
export type { DepthProblem, DepthInvestigation } from "../../components/depth";
export { evaluateDepthLine } from "../../components/depth";
import { collision1D, workEnergy, radialForce, gravitationalOrbit } from "@strange-loops/physics";
import { dynamicsDepth, forcesDepth } from "./dynamics-forces-depth";
import { energyDepth, circularDepth, gravitationDepth } from "./energy-orbits-depth";

export type DepthChapter = StudyChapter & { id: Exclude<MechanicsModuleId, "kinematics"> };

export const depthChapters: Record<DepthChapter["id"], DepthChapter> = {
  dynamics: dynamicsDepth,
  forces: forcesDepth,
  energy: energyDepth,
  circular: circularDepth,
  gravitation: gravitationDepth,
};

/** Fixed comparisons reuse the existing models, with explicit force-component checks. */
export function depthEvidence(id: DepthChapter["id"]) {
  switch (id) {
    case "dynamics":
      return {
        caption: "Isolated head-on collision: mA = 0.40 kg, mB = 0.60 kg, uA = +4 m/s, uB = −1 m/s; right positive",
        columns: ["Restitution e", "vA / m s⁻¹", "vB / m s⁻¹", "Total p after / kg m s⁻¹", "Change in K / J"],
        rows: [0, 0.5, 1].map(e => {
          const result = collision1D({ mass1Kilograms: 0.4, mass2Kilograms: 0.6, velocity1MetersPerSecond: 4, velocity2MetersPerSecond: -1, coefficientOfRestitution: e });
          return [e.toFixed(1), result.velocity1MetersPerSecond.toFixed(2), result.velocity2MetersPerSecond.toFixed(2), result.momentumAfterKilogramMetersPerSecond.toFixed(2), result.kineticEnergyChangeJoules.toFixed(2)];
        }),
        takeaway: "The initial total momentum is +1.00 kg m/s and kinetic energy is 3.50 J. Every case conserves system momentum, but only e = 1 conserves kinetic energy. Equal and opposite impulses do not imply equal velocity changes when the masses differ.",
      };
    case "forces":
      return {
        caption: "A 4 kg block on a horizontal surface: g = 10 m/s², a 20 N pull at angle θ above horizontal, μs = 0.40",
        columns: ["θ / degrees", "Normal / N", "Maximum static friction / N", "Friction needed for rest / N", "Rest possible?"],
        rows: [0, 60, 80].map(angle => {
          const radians = angle * Math.PI / 180;
          const normal = 40 - 20 * Math.sin(radians);
          const horizontal = 20 * Math.cos(radians);
          return [String(angle), normal.toFixed(2), (0.4 * normal).toFixed(2), horizontal.toFixed(2), horizontal <= 0.4 * normal ? "Yes" : "No"];
        }),
        takeaway: "At 80°, rest is possible and the actual friction is 3.47 N, not its 8.12 N maximum. The upward pull reduces the normal reaction, so replacing it by mg silently changes the problem. These are feasibility checks for rest, not predictions of sliding acceleration.",
      };
    case "energy":
      return {
        caption: "A 2 kg body initially moves at 3 m/s: displacement 4 m horizontally, applied force 6 N at θ, prescribed opposing force 2 N",
        columns: ["θ / degrees", "Applied work / J", "Opposing work / J", "Change in K / J", "Final speed / m s⁻¹"],
        rows: [0, 60, 90].map(angle => {
          const appliedWork = 6 * 4 * Math.cos(angle * Math.PI / 180);
          const netWork = appliedWork - 8;
          const result = workEnergy({ massKilograms: 2, initialSpeedMetersPerSecond: 3, netWorkJoules: netWork });
          return [String(angle), appliedWork.toFixed(2), "−8.00", netWork.toFixed(2), result.finalSpeedMetersPerSecond.toFixed(2)];
        }),
        takeaway: "The initial kinetic energy is 9 J. A force's magnitude alone does not determine its work: its component along the displacement does. The opposing force is stipulated constant here, not inferred from μmg. Normal forces balance the vertical component, and the body keeps moving through the stated interval in all three cases.",
      };
    case "circular":
      return {
        caption: "Uniform circular motion: mass 0.25 kg, radius 0.80 m; the table shows the required inward resultant",
        columns: ["Speed / m s⁻¹", "Radial acceleration / m s⁻²", "Inward resultant / N", "Period / s"],
        rows: [2, 4, 6].map(speed => {
          const result = radialForce({ massKilograms: 0.25, radiusMeters: 0.8, speedMetersPerSecond: speed });
          return [speed.toFixed(1), result.accelerationMetersPerSecondSquared.toFixed(2), result.forceNewtons.toFixed(2), result.periodSeconds.toFixed(2)];
        }),
        takeaway: "Doubling speed quadruples the required radial resultant and halves the period. At constant speed the radial resultant is perpendicular to velocity and does no work. Identify which real interactions supply it; do not add a separate 'centripetal force' to the free-body diagram.",
      };
    case "gravitation":
      return {
        caption: "Ideal circular orbits about a spherical 6.00 × 10²⁴ kg planet; G = 6.6743 × 10⁻¹¹ SI, radius measured from its centre",
        columns: ["r / 10⁶ m", "Field / N kg⁻¹", "Potential / MJ kg⁻¹", "Speed / km s⁻¹", "Period / h"],
        rows: [8e6, 16e6, 32e6].map(radius => {
          const result = gravitationalOrbit({ centralMassKilograms: 6e24, radiusMeters: radius });
          return [(radius / 1e6).toFixed(1), result.fieldStrengthNewtonsPerKilogram.toFixed(2), (result.potentialJoulesPerKilogram / 1e6).toFixed(2), (result.orbitalSpeedMetersPerSecond / 1000).toFixed(2), (result.periodSeconds / 3600).toFixed(2)];
        }),
        takeaway: "At twice the radius, field strength is one quarter, potential is half as negative, orbital speed falls by √2 and period rises by 2√2. Larger-radius circular orbits are slower but have greater total energy. Moving between them requires a transfer; these rows are not one unpowered satellite's instantaneous path.",
      };
  }
}
