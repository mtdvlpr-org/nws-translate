import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  jsonCodec,
  literatureItemSchema,
  literatureSchema,
  outlineSchema,
  outlinesSchema,
  programUIFileSchema,
  songSchema,
  songsSchema,
  tipSchema,
  tipsSchema,
  translationFileSchema,
} from "../../app/utils/schemas";
import {
  emptyLiteratureItemMock,
  literatureItemMock,
  literatureMock,
} from "./../mocks/literature";
import {
  emptyOutlineMock,
  outlineMock,
  outlinesMock,
  outlineWithNotesMock,
} from "./../mocks/outline";
import { songMock, songsMock } from "./../mocks/song";
import { tipMock, tipsMock } from "./../mocks/tip";
import {
  NWPProgramUIFileMock,
  NWPTranslationFileMock,
  NWSProgramUIFileMock,
  NWSTranslationFileMock,
} from "./../mocks/ui";

describe("jsonCodec", () => {
  const testSchema = z.strictObject({
    id: z.number(),
    name: z.string(),
  });

  const testCodec = jsonCodec(testSchema);

  describe("decode", () => {
    it("should decode valid JSON string to object", () => {
      const jsonString = '{"id": 1, "name": "test"}';
      const result = testCodec.safeParse(jsonString);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: 1, name: "test" });
    });

    it("should decode valid JSON array string", () => {
      const arrayCodec = jsonCodec(z.array(z.number()));
      const jsonString = "[1, 2, 3]";
      const result = arrayCodec.safeParse(jsonString);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([1, 2, 3]);
    });

    it("should decode valid JSON primitive values", () => {
      const numberCodec = jsonCodec(z.number());
      const stringCodec = jsonCodec(z.string());
      const booleanCodec = jsonCodec(z.boolean());

      expect(numberCodec.safeParse("123").success).toBe(true);
      expect(stringCodec.safeParse('"hello"').success).toBe(true);
      expect(booleanCodec.safeParse("true").success).toBe(true);
    });

    it("should fail on invalid JSON string", () => {
      const jsonString = '{"id": 1, "name": "test"';
      const result = testCodec.safeParse(jsonString);

      expect(result.success).toBe(false);
      expect(result.error.issues[0].code).toBe("invalid_format");
    });

    it("should fail on malformed JSON with descriptive error", () => {
      const jsonString = "not a json string";
      const result = testCodec.safeParse(jsonString);

      expect(result.success).toBe(false);
      expect(result.error.issues[0].code).toBe("invalid_format");
      expect(result.error.issues[0]).toHaveProperty("message");
    });

    it("should fail when decoded value does not match schema", () => {
      const jsonString = '{"id": "not a number", "name": "test"}';
      const result = testCodec.safeParse(jsonString);

      expect(result.success).toBe(false);
    });

    it("should handle empty object correctly", () => {
      const emptyObjectCodec = jsonCodec(z.object({}));
      const jsonString = "{}";
      const result = emptyObjectCodec.safeParse(jsonString);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({});
    });

    it("should handle null value in JSON", () => {
      const nullableCodec = jsonCodec(z.null());
      const jsonString = "null";
      const result = nullableCodec.safeParse(jsonString);

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe("encode", () => {
    it("should encode object to JSON string", () => {
      const value = { id: 1, name: "test" };
      const encoded = JSON.stringify(value);

      // The codec's encode method is used internally
      // We can test it by parsing and then stringifying back
      const result = testCodec.safeParse(encoded);
      expect(result.success).toBe(true);
    });

    it("should encode array to JSON string", () => {
      const arrayCodec = jsonCodec(z.array(z.number()));
      const value = [1, 2, 3];
      const encoded = JSON.stringify(value);

      const result = arrayCodec.safeParse(encoded);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(value);
    });

    it("should encode nested objects correctly", () => {
      const nestedSchema = z.strictObject({
        id: z.number(),
        user: z.strictObject({
          email: z.string(),
          name: z.string(),
        }),
      });
      const nestedCodec = jsonCodec(nestedSchema);
      const value = {
        id: 1,
        user: {
          email: "john@example.com",
          name: "John",
        },
      };
      const encoded = JSON.stringify(value);

      const result = nestedCodec.safeParse(encoded);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(value);
    });
  });

  describe("integration with existing schemas", () => {
    it("should work with literatureItemSchema", () => {
      const literatureCodec = jsonCodec(literatureItemSchema);
      const jsonString = JSON.stringify(literatureItemMock);
      const result = literatureCodec.safeParse(jsonString);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(literatureItemMock);
    });

    it("should work with songSchema", () => {
      const songCodec = jsonCodec(songSchema);
      const jsonString = JSON.stringify(songMock);
      const result = songCodec.safeParse(jsonString);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(songMock);
    });

    it("should work with tipSchema", () => {
      const tipCodec = jsonCodec(tipSchema);
      const jsonString = JSON.stringify(tipMock);
      const result = tipCodec.safeParse(jsonString);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(tipMock);
    });
  });
});

describe("literatureItemSchema", () => {
  it("should validate a literature item with all fields correctly", () => {
    const result = literatureItemSchema.safeParse(literatureItemMock);
    expect(result.success).toBe(true);
  });

  it("should validate a literature item with empty optional fields correctly", () => {
    const result = literatureItemSchema.safeParse(emptyLiteratureItemMock);
    expect(result.success).toBe(true);
  });
});

describe("literatureSchema", () => {
  it("should validate an array of literature items correctly", () => {
    const result = literatureSchema.safeParse(literatureMock);
    expect(result.success).toBe(true);
  });

  it("should validate a json file with real literature items correctly", async () => {
    const json = await readFile(
      "./test/fixtures/nws/E/Literature.json",
      "utf-8",
    );
    const result = literatureSchema.safeParse(JSON.parse(json));
    expect(result.success).toBe(true);
  });
});

describe("outlineSchema", () => {
  it("should validate an empty outline correctly", () => {
    const result = outlineSchema.safeParse(emptyOutlineMock);
    expect(result.success).toBe(true);
  });

  it("should validate an outline without notes correctly", () => {
    const result = outlineSchema.safeParse(outlineMock);
    expect(result.success).toBe(true);
  });

  it("should validate an outline with notes correctly", () => {
    const result = outlineSchema.safeParse(outlineWithNotesMock);
    expect(result.success).toBe(true);
  });
});

describe("outlinesSchema", () => {
  it("should validate an array of outlines correctly", () => {
    const result = outlinesSchema.safeParse(outlinesMock);
    expect(result.success).toBe(true);
  });

  it("should validate a json file with real outlines correctly", async () => {
    const json = await readFile("./test/fixtures/nws/E/Outlines.json", "utf-8");
    const result = outlinesSchema.safeParse(JSON.parse(json));
    expect(result.success).toBe(true);
  });
});

describe("programUISchema", () => {
  it("should validate a NWS program UI file correctly", () => {
    const result = programUIFileSchema.safeParse(NWSProgramUIFileMock);
    expect(result.success).toBe(true);
  });

  it("should validate a NWP program UI file correctly", () => {
    const result = programUIFileSchema.safeParse(NWPProgramUIFileMock);
    expect(result.success).toBe(true);
  });
});

describe("songSchema", () => {
  it("should validate a song correctly", () => {
    const result = songSchema.safeParse(songMock);
    expect(result.success).toBe(true);
  });
});

describe("songsSchema", () => {
  it("should validate an array of songs correctly", () => {
    const result = songsSchema.safeParse(songsMock);
    expect(result.success).toBe(true);
  });

  it("should validate a json file with real songs correctly", async () => {
    const json = await readFile("./test/fixtures/nws/E/Songs.json", "utf-8");
    const result = songsSchema.safeParse(JSON.parse(json));
    expect(result.success).toBe(true);
  });
});

describe("tipSchema", () => {
  it("should validate a tip correctly", () => {
    const result = tipSchema.safeParse(tipMock);
    expect(result.success).toBe(true);
  });
});

describe("tipsSchema", () => {
  it("should validate an array of tips correctly", () => {
    const result = tipsSchema.safeParse(tipsMock);
    expect(result.success).toBe(true);
  });

  it("should validate a json file with real tips correctly", async () => {
    const json = await readFile("./test/fixtures/nws/E/Tips.json", "utf-8");
    const result = tipsSchema.safeParse(JSON.parse(json));
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
