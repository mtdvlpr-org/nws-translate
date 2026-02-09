import { type KeepAlive, withKeepAlive } from "../utils/keepalive";

export default defineEventHandler(async (event) => {
  return withKeepAlive(
    event,
    async (keepalive: KeepAlive) => {
      keepalive.progress("Starting file upload processing...");

      const database = await processFileUpload(event, {
        maxSize: 256 * 1024 * 1024,
        processor: async (fileStream) => {
          keepalive.progress("Extracting database from JWPUB file...");
          return await getJWPUBDatabase(fileStream);
        },
      });

      keepalive.progress("Database extracted, querying documents...");
      const outlines = queryDatabase<{ Title: string }>(
        database,
        "SELECT Title FROM Document",
      );

      keepalive.progress("Parsing JWPUB content...");
      const htmlOutlines = await parseJWPUB(database);

      keepalive.progress("Processing outlines...");
      const parsedOutlines = outlines
        .map((outline) => {
          const [number, ...title] = outline.Title.split(". ");
          return {
            number: parseInt(number?.trim() ?? "0"),
            title: title.join(". "),
          };
        })
        .filter((outline) => outline.number > 0);

      const match =
        htmlOutlines.length === parsedOutlines.length &&
        htmlOutlines.every(
          (htmlOutline, index) =>
            htmlOutline.number === parsedOutlines[index]?.number &&
            htmlOutline.title === parsedOutlines[index]?.title,
        );

      keepalive.progress("Outlines processed successfully");
      return match ? htmlOutlines : parsedOutlines;
    },
    "Processing JWPUB file upload...",
  );
});
