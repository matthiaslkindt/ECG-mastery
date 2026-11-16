import type { Lesson, Module } from "../types";
import { MODULE_FOUNDATIONS } from "./m01-foundations";
import { MODULE_RATE_RHYTHM } from "./m02-rate-rhythm";
import { MODULE_CONDUCTION } from "./m03-conduction";
import { MODULE_HYPERTROPHY } from "./m04-hypertrophy";
import { MODULE_ACUTE_ISCHAEMIA } from "./m05-acute-ischaemia";
import { MODULE_CHRONIC_ISCHAEMIA } from "./m06-chronic-ischaemia";
import { MODULE_NARROW_TACHY } from "./m07-narrow-tachy";
import { MODULE_WIDE_TACHY } from "./m08-wide-tachy";
import { MODULE_BRADY_PACING } from "./m09-brady-pacing";
import { MODULE_INHERITED_SYSTEMIC } from "./m10-inherited-systemic";

export const CURRICULUM: Module[] = [
  MODULE_FOUNDATIONS,
  MODULE_RATE_RHYTHM,
  MODULE_CONDUCTION,
  MODULE_HYPERTROPHY,
  MODULE_ACUTE_ISCHAEMIA,
  MODULE_CHRONIC_ISCHAEMIA,
  MODULE_NARROW_TACHY,
  MODULE_WIDE_TACHY,
  MODULE_BRADY_PACING,
  MODULE_INHERITED_SYSTEMIC,
].sort((a, b) => a.order - b.order);

export function getModule(slug: string): Module | undefined {
  return CURRICULUM.find((m) => m.slug === slug);
}

export function getLesson(moduleSlug: string, lessonSlug: string): { module: Module; lesson: Lesson; index: number } | undefined {
  const mod = getModule(moduleSlug);
  if (!mod) return undefined;
  const index = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index < 0) return undefined;
  return { module: mod, lesson: mod.lessons[index]!, index };
}

export const ALL_LESSONS: Array<{ module: Module; lesson: Lesson }> = CURRICULUM.flatMap((module) =>
  module.lessons.map((lesson) => ({ module, lesson })),
);
