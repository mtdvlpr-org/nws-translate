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

  const database = await getJWPUBDatabaseFromBuffer(await file.arrayBuffer());

  return await getOutlinesFromJWPUB(database);
});
