import { vi } from "vitest";

/** Stub Nuxt auto-imports for store unit tests that run in node environment. */
const { defineStore } = await import("pinia");
const { typedKeys } = await import("../../../app/utils/general");
const { parseTranslationFile } = await import("../../../app/utils/ui");

vi.stubGlobal("defineStore", defineStore);
vi.stubGlobal("typedKeys", typedKeys);
vi.stubGlobal("parseTranslationFile", parseTranslationFile);
