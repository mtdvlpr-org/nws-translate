import type { Database } from "sql.js";

export const getOutlinesFromJWPUB = async (db: Database) => {
  const outlines = queryDatabase<{ Content: BufferSource; Title: string }>(
    db,
    "SELECT Title, Content FROM Document",
  );
  const htmlOutlines = await parseOutlines(db, outlines);
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
};
