import type {
  BlobEnsureOptions,
  BlobSize,
  BlobUploadOptions,
  FileSizeUnit,
} from "#server/types/blob";
import type { H3Event } from "h3";

import { defu } from "defu";

// Credits from shared utils of https://github.com/pingdotgg/uploadthing
const FILESIZE_UNITS = ["B", "KB", "MB", "GB"];

/**
 * Utility to receive a file or files from body's FormData without storing it.
 *
 * @throws
 * If the files are invalid or don't meet the ensure conditions.
 */
export async function receiveFiles(
  event: H3Event,
  options: BlobUploadOptions = {},
) {
  options = defu(options, {
    formKey: "files",
    multiple: true,
  } satisfies BlobUploadOptions);

  try {
    const form = await readFormData(event);
    const files = form.getAll(options.formKey!) as File[];

    if (!files?.length)
      throw createError({ message: "No files received", status: 400 });

    if (!options.multiple && files.length > 1)
      throw createError({
        message: "Multiple files are not allowed",
        status: 400,
      });

    if (typeof options.multiple === "number" && files.length > options.multiple)
      throw createError({
        message: `Number of files exceeded. Maximum allowed: ${options.multiple}`,
        status: 400,
      });

    if (options.ensure?.maxSize || options.ensure?.types?.length) {
      for (const file of files) {
        ensureBlob(file, options.ensure);
      }
    }
    return files;
  } catch (e) {
    console.error(e);
    throw createError({
      cause: e,
      message: "Error receiving files",
      statusCode: 500,
    });
  }
}

/**
 * Ensure the blob is valid and meets the specified requirements.
 *
 * @param blob The blob to check
 * @param options The options to check against
 * @param options.maxSize The maximum size of the blob (e.g. '1MB')
 * @param options.types The allowed types of the blob (e.g. ['image/png', 'application/json', 'video'])
 *
 * @throws If the blob does not meet the requirements
 */
function ensureBlob(blob: Blob, options: BlobEnsureOptions = {}) {
  if (!(blob instanceof Blob)) {
    throw createError({
      message: "Received invalid file",
      statusCode: 400,
    });
  }

  if (options.maxSize) {
    const maxFileSizeBytes = fileSizeToBytes(options.maxSize);

    if (blob.size > maxFileSizeBytes) {
      throw createError({
        message: `File too heavy. Max size is: ${options.maxSize}`,
        statusCode: 400,
      });
    }
  }

  const [blobType, blobSubtype] = blob.type.split("/");

  if (
    options.types?.length &&
    !options.types?.includes(blob.type) &&
    !options.types?.includes(blobType ?? "") &&
    !options.types?.includes(blobSubtype ?? "")
  ) {
    throw createError({
      message: `Invalid file type: ${blob.type}. Only allowed: ${options.types.join(", ")}`,
      statusCode: 400,
    });
  }
}

/**
 * Helper function that converts any valid BlobSize into numeric bytes value
 *
 * @example "1MB", "1500B", "1.2GB"
 *
 * @throws If the input is not a valid BlobSize
 */
function fileSizeToBytes(input: BlobSize) {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regex = new RegExp(
    `^(\\d+)(\\.\\d+)?\\s*(${FILESIZE_UNITS.join("|")})$`,
    "i",
  );
  const match = input.match(regex);

  if (!match) {
    throw createError({
      message: `Invalid file size format: ${input}`,
      statusCode: 500,
    });
  }

  const sizeValue = Number.parseFloat(match[1]!);
  const sizeUnit = match[3]!.toUpperCase() as FileSizeUnit;

  if (!FILESIZE_UNITS.includes(sizeUnit)) {
    throw createError({
      message: `Invalid file size unit: ${sizeUnit}`,
      statusCode: 500,
    });
  }

  const bytes = sizeValue * Math.pow(1024, FILESIZE_UNITS.indexOf(sizeUnit));
  return Math.floor(bytes);
}
