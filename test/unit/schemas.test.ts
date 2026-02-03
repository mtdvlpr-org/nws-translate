import { describe, expect, it } from "vitest";

import {
  programUISchema,
  translationFileSchema,
} from "../../app/utils/schemas";
import {
  NWPProgramUIFileMock,
  NWPTranslationFileMock,
  NWSProgramUIFileMock,
  NWSTranslationFileMock,
} from "./../mocks/nws";

describe("programUISchema", () => {
  it("should validate a NWS program UI file correctly", () => {
    const result = programUISchema.safeParse(NWSProgramUIFileMock);
    expect(result.success).toBe(true);
  });

  it("should validate a NWP program UI file correctly", () => {
    const result = programUISchema.safeParse(NWPProgramUIFileMock);
    expect(result.success).toBe(true);
  });
});

describe("translationFileSchema", () => {
  it("should validate a NWS translation file correctly", () => {
    const result = translationFileSchema.safeParse(NWSTranslationFileMock);
    expect(result.success).toBe(true);
  });

  it("should validate a NWP translation file correctly", () => {
    const result = translationFileSchema.safeParse(NWPTranslationFileMock);
    expect(result.success).toBe(true);
  });
});
