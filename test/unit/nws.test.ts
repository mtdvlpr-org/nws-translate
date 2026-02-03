import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

import {
  isNWPProgramUIFile,
  isNWPTranslationFile,
  parseTranslationFile,
  serializeTranslationFile,
} from "./../../app/utils/nws";
import {
  NWPProgramUIFileMock,
  NWPTranslationFileMock,
  NWSProgramUIFileMock,
  NWSTranslationFileMock,
} from "./../mocks/nws";

describe("isNWPProgramUIFile", () => {
  it("should return true if the file is a NWP program UI file", () => {
    expect(isNWPProgramUIFile(NWPProgramUIFileMock)).toBe(true);
  });

  it("should return false if the file is a NWS program UI file", () => {
    expect(isNWPProgramUIFile(NWSProgramUIFileMock)).toBe(false);
  });
});

describe("isNWPTranslationFile", () => {
  it("should return true if the file is a NWP translation file", () => {
    expect(isNWPTranslationFile(NWPTranslationFileMock)).toBe(true);
  });

  it("should return false if the file is a NWS translation file", () => {
    expect(isNWPTranslationFile(NWSTranslationFileMock)).toBe(false);
  });
});

describe("parseTranslationFile", () => {
  it("should parse NWS translation file correctly", () => {
    expect(parseTranslationFile(NWSTranslationFileMock)).toEqual(
      NWSProgramUIFileMock,
    );
  });

  it("should parse NWP translation file correctly", () => {
    expect(parseTranslationFile(NWPTranslationFileMock)).toEqual(
      NWPProgramUIFileMock,
    );
  });
});

describe("serializeTranslationFile", () => {
  it("should serialize NWS translation file correctly", () => {
    expect(serializeTranslationFile(NWSProgramUIFileMock)).toEqual(
      NWSTranslationFileMock,
    );
  });

  it("should serialize NWP translation file correctly", () => {
    expect(serializeTranslationFile(NWPProgramUIFileMock)).toEqual(
      NWPTranslationFileMock,
    );
  });
});

describe("parse and serialize", () => {
  it("should return the same string for English NWS file", async () => {
    const text = await readFile("./test/fixtures/nws/E.txt", "utf-8");

    expect(serializeTranslationFile(parseTranslationFile(text))).toBe(
      text.trim().replaceAll("\r", ""),
    );
  });

  it("should return the same string for Dutch NWS file", async () => {
    const text = await readFile("./test/fixtures/nws/O.txt", "utf-8");

    expect(serializeTranslationFile(parseTranslationFile(text))).toBe(
      text.trim().replaceAll("\r", ""),
    );
  });

  it("should return the same string for Dutch NWP file", async () => {
    const text = await readFile("./test/fixtures/nwp/O.txt", "utf-8");

    expect(serializeTranslationFile(parseTranslationFile(text))).toBe(
      text.trim().replaceAll("\r", ""),
    );
  });
});
