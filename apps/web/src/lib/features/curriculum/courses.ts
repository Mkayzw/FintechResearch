import type { DepthChapter } from "../../components/depth";
import { studyAreas } from "./areas";
import { generalChapters } from "./general-depth";
import { wavesChapters } from "./waves-depth";
import { electricityChapters } from "./electricity-depth";
import { matterChapters } from "./matter-depth";
import { modernChapters } from "./modern-depth";
import { electronicsChapters, communicationChapters } from "./electronics-communication-depth";

export const courses: Record<(typeof studyAreas)[number]["id"], readonly DepthChapter[]> = {
  general: generalChapters,
  waves: wavesChapters,
  electricity: electricityChapters,
  electronics: electronicsChapters,
  matter: matterChapters,
  modern: modernChapters,
  communication: communicationChapters,
};

export const courseSummaries = studyAreas.map(area => ({
  ...area,
  chapters: courses[area.id].map(({ id, title }) => ({ id, title })),
}));
