export default defineEventHandler(async (event) => {
  console.log("Getting outlines...");
  const [file] = await receiveFiles(event, {
    ensure: {
      maxSize: "128MB",
      types: ["application/octet-stream"],
    },
    formKey: "file",
    multiple: false,
  });

  if (!file) {
    throw createError({
      statusCode: 400,
      statusMessage: "No file received",
    });
  }

  console.log("File received");

  const database = await getJWPUBDatabase(await file.arrayBuffer());
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
