import { z } from "zod";

export const jsonCodec = <T extends z.core.$ZodType>(schema: T) =>
  z.codec(z.string(), schema, {
    decode: (jsonString, ctx) => {
      try {
        return JSON.parse(jsonString);
      } catch (err: unknown) {
        ctx.issues.push({
          code: "invalid_format",
          format: "json",
          input: jsonString,
          message: (err as Error).message,
        });
        return z.NEVER;
      }
    },
    encode: (value) => JSON.stringify(value),
  });

export const literatureItemSchema = z.strictObject({
  id: z.number(),
  // eslint-disable-next-line perfectionist/sort-objects
  categoryName: z.string().nonempty(),
  itemNumber: z.string(),
  symbol: z.string(),
  title: z.string().nonempty(),
});

export const literatureSchema = z.array(literatureItemSchema);

/**
 * Literature interface.
 * @example
 * {
 *   [
 *     {
 *       "id": 100001,
 *       "categoryName": "AnnualItems",
 *       "itemNumber": "6922",
 *       "symbol": "es",
 *       "title": "Examining the Scriptures Daily"
 *     },
 *     {
 *       "id": 100002,
 *       "categoryName": "other",
 *       "itemNumber": "",
 *       "symbol": "",
 *       "title": "Examining the Scriptures Daily"
 *     }
 *   ]
 * }
 */
export type Literature = z.infer<typeof literatureSchema>;

/**
 * Literature item.
 * @example
 * {
 *   "id": 100001,
 *   "categoryName": "AnnualItems",
 *   "itemNumber": "6922",
 *   "symbol": "es",
 *   "title": "Examining the Scriptures Daily"
 * }
 */
export type LiteratureItem = z.infer<typeof literatureItemSchema>;

export const outlineSchema = z.strictObject({
  number: z.number().int().positive(),
  title: z.string().optional(),
  updated: z.string(),
  // eslint-disable-next-line perfectionist/sort-objects
  notes: z.string().optional(),
});

export const outlinesSchema = z.array(outlineSchema);

/**
 * Outline interface.
 * @example
 * {
 *   "number": 1,
 *   "title": "Outline 1",
 *   "updated": "mm/yy",
 *   "notes": "Update Note (yyyy-mm-dd): Some note."
 * }
 */
export type Outline = z.infer<typeof outlineSchema>;

/**
 * Outlines interface.
 * @example
 * {
 *   [
 *     {
 *       "number": 1,
 *       "title": "Outline 1",
 *       "updated": "mm/yy"
 *     },
 *     {
 *       "number": 2,
 *       "title": "Outline 2",
 *       "updated": "mm/yy",
 *       "notes": "Update Note (yyyy-mm-dd): Some note."
 *     }
 *   ]
 * }
 */
export type Outlines = z.infer<typeof outlinesSchema>;

export const programUIFileSchema = z.record(z.string(), z.string());

/**
 * ProgramUI.json file structure.
 * @example
 * {
 *   "key": "Value 1",
 *   "key2": "Value 2"
 * }
 */
export type ProgramUIFile = z.infer<typeof programUIFileSchema>;

export const songSchema = z.strictObject({
  number: z.string().nonempty(),
  title: z.string().nonempty(),
});

export const songsSchema = z.array(songSchema);

/**
 * Song interface.
 * @example
 * {
 *   "number": "1",
 *   "title": "Song 1"
 * }
 */
export type Song = z.infer<typeof songSchema>;

/**
 * Songs interface.
 * @example
 * {
 *   [
 *     {
 *       "number": "1",
 *       "title": "Song 1"
 *     },
 *     {
 *       "number": "2",
 *       "title": "Song 2"
 *     }
 *   ]
 * }
 */
export type Songs = z.infer<typeof songsSchema>;

export const tipSchema = z.strictObject({
  heading: z.string().nonempty(),
  text: z.string().nonempty(),
  url: z.httpUrl(),
});

export const tipsSchema = z.array(tipSchema);

/**
 * Tip interface.
 * @example
 * {
 *   "heading": "Heading 1",
 *   "text": "Text 1",
 *   "url": "https://www.example.com"
 * }
 */
export type Tip = z.infer<typeof tipSchema>;

/**
 * Tips interface.
 * @example
 * {
 *   [
 *     {
 *       "heading": "Heading 1",
 *       "text": "Text 1",
 *       "url": "https://www.example.com"
 *     },
 *     {
 *       "heading": "Heading 2",
 *       "text": "Text 2",
 *       "url": "https://www.example.com"
 *     }
 *   ]
 * }
 */
export type Tips = z.infer<typeof tipsSchema>;

export const translationFileSchema = z.custom<TranslationFile>(
  (val) =>
    typeof val === "string" &&
    // eslint-disable-next-line security/detect-unsafe-regex
    /^("?[a-zA-Z_\d]+"?: "?.*?"?,?\n)+("?[a-zA-Z_\d]+"?: "?.*?"?,?\n*)$/.test(
      val,
    ),
  "Kan waarde niet valideren.",
);
