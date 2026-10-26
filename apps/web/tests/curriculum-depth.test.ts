import { expect, test } from "bun:test";
import { courses } from "../src/lib/features/curriculum/courses";
import { checkNumericalAnswer } from "../src/lib/features/mechanics/numerical-answer";

test("workshop feedback distinguishes the competing physical interpretations across study areas", () => {
  // Independent results: squared-diameter uncertainty; restoring sign; zero field
  // but nonzero potential; loaded divider; thermal losses; photon escape cost;
  // mid-rise rather than endpoint-level quantisation.
  const cases = [
    ["g1", "relative", "6.8333", "4.3333"],
    ["w1", "w1h-d", "-3", "3"],
    ["e3", "e3-ma", "0", "400"],
    ["e3", "e3-mb", "120", "0"],
    ["a1", "a1d-b", "3", "3.6"],
    ["m2", "m2a-d", "12.8571", "15"],
    ["q2", "q2a-b", "0.695256", "2.895256"],
    ["c2", "c2q-c", "1.016", "1.008"],
  ] as const;
  const chapters = Object.values(courses).flat();
  for (const [chapterId, partId, correct, incorrect] of cases) {
    const chapter = chapters.find(item => item.id === chapterId)!;
    const part = chapter.problems.flatMap(problem => problem.parts).find(item => item.id === partId)!;
    expect(checkNumericalAnswer(part, correct).correct).toBe(true);
    expect(checkNumericalAnswer(part, incorrect).correct).toBe(false);
  }
});
