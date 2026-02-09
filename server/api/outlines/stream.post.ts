export default defineEventHandler(async (event) => {
  console.log("Getting outlines...");
  const database = await processFileUpload(event, {
    maxSize: 256 * 1024 * 1024,
    processor: getJWPUBDatabaseFromStream,
  });

  return await getOutlinesFromJWPUB(database);
});
