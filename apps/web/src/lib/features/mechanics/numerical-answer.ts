export interface NumericalPart {
  id: string;
  prompt: string;
  unit: string;
  expected: number;
  tolerance: number;
  hint: string;
  working: string;
  mistakes?: readonly { value: number; explanation: string }[];
}

export function checkNumericalAnswer(part: NumericalPart, response: string) {
  if (!response.trim() || !Number.isFinite(Number(response))) {
    return { correct: false, message: "Enter a finite numerical value in the unit shown. A blank is not zero." };
  }
  const value = Number(response);
  // Preserve inclusive decimal boundaries despite binary floating-point rounding.
  const roundingSlack = 4 * Number.EPSILON * Math.max(Math.abs(value), Math.abs(part.expected), part.tolerance);
  if (Math.abs(value - part.expected) <= part.tolerance + roundingSlack) {
    return { correct: true, message: `Numerical result consistent. ${part.working}` };
  }
  const mistake = part.mistakes?.find(candidate => Math.abs(value - candidate.value) <= part.tolerance);
  return { correct: false, message: mistake?.explanation ?? "Not consistent yet. Check the system boundary, sign convention, assumptions and units. Use the hint to revisit the method, then try again." };
}
