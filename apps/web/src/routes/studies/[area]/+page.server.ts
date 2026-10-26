import { error } from "@sveltejs/kit";
import { courseSummaries } from "$lib/features/curriculum/courses";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () => courseSummaries.map(area => ({ area: area.id }));

export const load: PageServerLoad = ({ params }) => {
  const area = courseSummaries.find(item => item.id === params.area);
  if (!area) error(404, "Study area not found");
  return { area };
};
