import JSZip from "jszip";

/**
 * Extracts the files from a zip file.
 * @param data The data to extract the files from.
 * @returns The zip file contents.
 */
export const extractZipFiles = async (
  data: ArrayBuffer | Blob | Buffer | string | Uint8Array<ArrayBufferLike>,
) => {
  console.debug(`Extracting zip files from data...`);
  try {
    const appZip = new JSZip();
    return await appZip.loadAsync(data);
  } catch (e) {
    throw new Error(
      `Failed to extract zip files: ${e instanceof Error ? e.message : String(e)}`,
      {
        cause: e,
      },
    );
  }
};
