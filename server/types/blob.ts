// File path: server/types/blob.ts

///////////////////////////////////////////////////////////
// Functionality based on Nuxt Hub's Blob implementation //
///////////////////////////////////////////////////////////

export interface BlobEnsureOptions {
  /**
   * The maximum size of the blob (e.g. '1MB')
   */
  maxSize?: BlobSize;
  /**
   * The allowed types of the blob (e.g. ['image/png', 'application/json', "video"])
   */
  types?: BlobType[];
}
export type BlobSize = `${number}${FileSizeUnit}`;
export type BlobType =
  | "audio"
  | "blob"
  | "csv"
  | "image"
  | "pdf"
  | "text"
  | "video"
  | (Record<never, never> & string);

export interface BlobUploadOptions {
  /**
   * Options used for the ensure() method.
   */
  ensure?: BlobEnsureOptions;
  /**
   * The key to get the file/files from the request form.
   * @default 'files'
   */
  formKey?: string;
  /**
   * Whether to allow multiple files to be uploaded.
   * @default true
   */
  multiple?: boolean | number;
}

// Credits from shared utils of https://github.com/pingdotgg/uploadthing
export type FileSizeUnit = 'B' | 'GB' | 'KB' | 'MB';
