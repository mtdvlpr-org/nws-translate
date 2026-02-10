import type {
  BusboyConfig,
  BusboyFileStream,
  BusboyHeaders,
} from "@fastify/busboy";
import type { H3Event } from "h3";

import Busboy from "@fastify/busboy";

export interface ProcessFileOptions<T> {
  /**
   * The name of the form field containing the file.
   * @default "file"
   */
  fieldName?: string;

  /**
   * Maximum file size in bytes.
   * If exceeded, a 413 error will be thrown.
   */
  maxSize?: number;

  /**
   * Function to process the file stream.
   * Must consume the stream to allow Busboy to finish.
   */
  processor: (stream: BusboyFileStream) => Promise<T>;
}

/**
 * Processes a file upload from multipart form data using a streaming processor.
 * This utility ensures Busboy completes properly by consuming the stream immediately
 * within the file handler.
 *
 * @param event The H3 event containing the multipart upload
 * @param options Configuration including maxSize, fieldName, and processor function
 * @returns The result from the processor function
 *
 * @example
 * ```typescript
 * const result = await processFileUpload(event, {
 *   maxSize: 100 * 1024 * 1024, // 100MB
 *   fieldName: "upload",
 *   processor: async (stream) => {
 *     // Process the stream and return a result
 *     return await someStreamProcessor(stream);
 *   }
 * });
 * ```
 */
export async function processFileUpload<T>(
  event: H3Event,
  options: ProcessFileOptions<T>,
): Promise<T> {
  const fieldName = options.fieldName ?? "file";

  return new Promise((resolve, reject) => {
    const headers = getHeaders(event);
    const contentType = headers["content-type"];

    if (!contentType?.includes("multipart/form-data")) {
      reject(
        createError({
          statusCode: 400,
          statusMessage: "Expected multipart/form-data",
        }),
      );
      return;
    }

    const busboyConfig: BusboyConfig = {
      headers: headers as BusboyHeaders,
    };

    // Set file size limit if provided
    if (options.maxSize) {
      busboyConfig.limits = {
        fileSize: options.maxSize,
      };
    }

    const busboyInstance = Busboy(busboyConfig);
    let resolved = false;
    let fileProcessed = false;

    busboyInstance.on("file", async (name, file) => {
      // Only accept the first file with the specified field name
      if (!fileProcessed && name === fieldName) {
        fileProcessed = true;

        // Handle file size limit exceeded
        file.on("limit", () => {
          if (!resolved) {
            resolved = true;
            reject(
              createError({
                statusCode: 413,
                statusMessage: `File too large. Maximum size is ${options.maxSize ? Math.floor(options.maxSize / (1024 * 1024)) : "unknown"}MB`,
              }),
            );
          }
        });

        try {
          // Process the stream immediately so Busboy can finish
          const result = await options.processor(file);
          if (!resolved) {
            resolved = true;
            resolve(result);
          }
        } catch (err) {
          if (!resolved) {
            resolved = true;
            reject(err);
          }
        }
      } else {
        // Discard files with different field names
        file.resume();
      }
    });

    busboyInstance.on("error", (err) => {
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });

    // Handle case where no matching file was uploaded
    busboyInstance.on("finish", () => {
      if (!fileProcessed) {
        resolved = true;
        reject(
          createError({
            statusCode: 400,
            statusMessage: `No file found with field name "${fieldName}"`,
          }),
        );
      }
    });

    // Get the Node.js request object and pipe it to busboy
    const nodeReq = event.node.req;
    nodeReq.pipe(busboyInstance);
  });
}
