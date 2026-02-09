import type { z } from "zod";

import JSZip from "jszip";

/**
 * Extracts the files from a zip file.
 * @param data The data to extract the files from.
 * @returns The zip file contents.
 */
export const extractZipFiles = async (
  data: ArrayBuffer | Blob | Buffer | string | Uint8Array<ArrayBufferLike>,
) => {
  try {
    const appZip = new JSZip();
    return await appZip.loadAsync(data);
  } catch (e) {
    console.error(e);
    throw createError({ cause: e, message: "Failed to extract zip files" });
  }
};

export const createZipFile = async (
  files: { data: z.core.util.JSONType; name: string }[],
) => {
  try {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.name, JSON.stringify(file.data, null, 2));
    });
    return await zip.generateAsync({ type: "nodebuffer" });
  } catch (e) {
    console.error(e);
    throw createError({ cause: e, message: "Failed to create zip file" });
  }
};
