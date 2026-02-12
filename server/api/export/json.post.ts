import { z } from "zod";

const bodySchema = z.object({
  files: z
    .array(
      z.strictObject({
        data: z.json(),
        name: z.string(),
      }),
    )
    .min(1),
});

export default defineEventHandler(async (event) => {
  const { files } = await readValidatedBody(event, bodySchema.parse);
  const zipBuffer = await createZipFile(
    files.map((f) => ({
      data: JSON.stringify(f.data, null, 2),
      path: f.name + ".json",
    })),
  );

  setHeader(event, "Content-Type", "application/zip");
  setHeader(
    event,
    "Content-Disposition",
    "attachment; filename=translations.zip",
  );

  return zipBuffer;
});
