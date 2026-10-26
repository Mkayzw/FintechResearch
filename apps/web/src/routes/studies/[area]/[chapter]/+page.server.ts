import { error } from "@sveltejs/kit";
import { courses, courseSummaries } from "$lib/features/curriculum/courses";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () => courseSummaries.flatMap(area =>
  area.chapters.map(chapter => ({ area: area.id, chapter: chapter.id })),
);

export const load: PageServerLoad = ({ params }) => {
  const area = courseSummaries.find(item => item.id === params.area);
  if (!area) error(404, "Study area not found");
  const chapter = courses[area.id].find(item => item.id === params.chapter);
  if (!chapter) error(404, "Study chapter not found");
  return { area, chapter };
};
