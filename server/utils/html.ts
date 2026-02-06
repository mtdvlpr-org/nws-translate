import type { HTMLElement } from "node-html-parser";

import { parse } from "node-html-parser";

export const parseHTML = (htmlString: string): HTMLElement => {
  const htmlDoc = parse(htmlString);

  return htmlDoc;
};
