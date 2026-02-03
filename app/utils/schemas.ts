import { z } from "zod";

export const translationFileSchema = z.custom<TranslationFile>(
  (val) =>
    typeof val === "string" &&
    // eslint-disable-next-line security/detect-unsafe-regex
    /^("?[a-zA-Z_\d]+"?: "?.*?"?,?\n)+("?[a-zA-Z_\d]+"?: "?.*?"?,?\n*)$/.test(
      val,
    ),
  "Kan waarde niet parseren.",
);

export const programUISchema = z.record(z.string(), z.string());
