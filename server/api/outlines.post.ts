export default defineEventHandler(async (event) => {
  const database = await processFileUpload(event, {
    maxSize: 256 * 1024 * 1024,
    processor: async (fileStream) => {
      console.log("Processing file stream...");
      return await getJWPUBDatabase(fileStream);
    },
  });

  const outlines = queryDatabase<{ Title: string }>(
    database,
    "SELECT Title FROM Document",
  );
  const htmlOutlines = await parseJWPUB(database);
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

  return match ? htmlOutlines : parsedOutlines;
});
