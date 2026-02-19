import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FIXTURES_DIR = dirname(fileURLToPath(import.meta.url));

export const FIXTURE_PATHS = {
  email: {
    assignmentsAndDutiesEn:
      "nws/E/DefaultEmailTemplates/AssignmentsAndDuties/1_Assignments Reminder (CLM-All).txt",
    assignmentsAndDutiesNl:
      "nws/O/DefaultEmailTemplates/AssignmentsAndDuties/1_Toewijzing herinnering (LED-Alle).txt",
  },
  json: {
    literatureEn: "nws/E/Literature.json",
    literatureNl: "nws/O/Literature.json",
    outlinesEn: "nws/E/Outlines.json",
    outlinesNl: "nws/O/Outlines.json",
    songsEn: "nws/E/Songs.json",
    songsNl: "nws/O/Songs.json",
    tipsEn: "nws/E/Tips.json",
    tipsNl: "nws/O/Tips.json",
  },
  ui: {
    nwpNl: "nwp/O/ui.txt",
    nwsEn: "nws/E/ui.txt",
    nwsNl: "nws/O/ui.txt",
  },
} as const;

export async function loadEmailFixture(
  key: keyof typeof FIXTURE_PATHS.email,
): Promise<string> {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  return readFile(join(FIXTURES_DIR, FIXTURE_PATHS.email[key]), "utf-8");
}

export async function loadJsonFixture<T>(
  key: keyof typeof FIXTURE_PATHS.json,
): Promise<T> {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const content = await readFile(
    join(FIXTURES_DIR, FIXTURE_PATHS.json[key]),
    "utf-8",
  );
  return JSON.parse(content) as T;
}

export async function loadUiFixture(
  key: keyof typeof FIXTURE_PATHS.ui,
): Promise<string> {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  return readFile(join(FIXTURES_DIR, FIXTURE_PATHS.ui[key]), "utf-8");
}
