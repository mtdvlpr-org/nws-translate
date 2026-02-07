import { z } from "zod";

const bodySchema = z.object({
  files: z.array(
    z.object({
      data: z.json(),
      name: z.string(),
    }),
  ),
});

export default defineEventHandler(async (event) => {
  console.log("Exporting translations...");
  const { files } = await readValidatedBody(event, bodySchema.parse);
  const zipBuffer = await createZipFile(files);

  setHeader(event, "Content-Type", "application/zip");
  setHeader(
    event,
    "Content-Disposition",
    "attachment; filename=translations.zip",
  );

  return zipBuffer;
});
