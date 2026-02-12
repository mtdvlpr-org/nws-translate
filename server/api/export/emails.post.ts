import { z } from "zod";

const bodySchema = z.object({
  files: z
    .array(
      z.strictObject({
        group: z.string().nonempty(),
        nr: z.coerce.number<number | string>().int().positive(),
        text: z.string().nonempty(),
        title: z.string().nonempty(),
      }),
    )
    .min(1),
});

const rootFolder = "DefaultEmailTemplates";

export default defineEventHandler(async (event) => {
  const { files } = await readValidatedBody(event, bodySchema.parse);
  const zipBuffer = await createZipFile(
    files.map((file) => ({
      data: file.text,
      path: `${rootFolder}/${capitalize(file.group)}/${file.nr}_${file.title}.txt`,
    })),
  );

  setHeader(event, "Content-Type", "application/zip");
  setHeader(
    event,
    "Content-Disposition",
    `attachment; filename=${rootFolder}.zip`,
  );

  return zipBuffer;
});
