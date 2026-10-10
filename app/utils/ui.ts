const LINE_SEPARATOR = "\n";
const KEY_VALUE_SEPARATOR = ": ";
const NWP_KEY = "____GENERAL____";

/**
 * Translation file string structure.
 * @example
 * '"key": "Value 1",\n"key2": "Value 2",'
 */
export type NWPTranslationFile = string;

/**
 * NWP translation line string structure.
 * @example
 * '"key": "Value 1",'
 */
export type NWPTranslationLine = `"${string}": "${string}",`;

/**
 * Translation file string structure.
 * @example
 * 'key: Value 1\nkey2: Value 2'
 */
export type NWSTranslationFile = string;

/**
 * NWS translation line string structure.
 * @example
 * 'key: Value 1'
 */
export type NWSTranslationLine = `${string}: ${string}`;

export type TranslationFile = NWPTranslationFile | NWSTranslationFile;

export type TranslationLine = NWPTranslationLine | NWSTranslationLine;

export const isNWPTranslationFile = (
  file: TranslationFile,
): file is NWPTranslationFile => {
  return file.includes(`"${NWP_KEY}"`);
};

export const isNWPProgramUIFile = (file: ProgramUIFile): boolean => {
  return Object.keys(file).some((key) => key === NWP_KEY);
};

const isNWPTranslationLine = (
  line: TranslationLine,
): line is NWPTranslationLine => {
  return line.startsWith('"');
};

// const normalizeTranslationLine = (
//   line: TranslationLine,
// ): NWSTranslationLine => {
//   if (isNWPTranslationLine(line)) {
//     const key = line.match(/^"([^"]+)"/)?.[1];
//     const value = line.match(/: "([^"]+)"/)?.[1];
//     return `${key}: ${value || "<empty>"}`;
//   }

//   return (line.endsWith("\r") ? line.slice(0, -1) : line) as NWSTranslationLine;
// };

export const parseTranslationFile = (text: TranslationFile): ProgramUIFile => {
  const record: ProgramUIFile = Object.create(null);
  const length = text.length;
  let pos = 0;
  let keyStart = 0;
  let currentKey: string | null = null;
  let valueStart = 0;
  let valueEnd = 0;

  function saveValue(): void {
    if (currentKey !== null) {
      record[currentKey] = text.slice(valueStart, valueEnd).trim();
    }
  }

  while (pos < length) {
    const lineStart = pos;

    // Find the end of the current line.
    while (pos < length) {
      const code = text.charCodeAt(pos);
      if (code === 10 || code === 13) break;
      pos++;
    }

    const lineEnd = pos;

    // Skip the line ending (LF or CRLF).
    if (pos < length && text.charCodeAt(pos) === 13) pos++;
    if (pos < length && text.charCodeAt(pos) === 10) pos++;

    // Check whether this line begins with a valid key.
    let i = lineStart;

    while (i < lineEnd) {
      const c = text.charCodeAt(i);
      if (
        (c >= 65 && c <= 90) ||
        (c >= 97 && c <= 122) ||
        c === 95 ||
        (c >= 48 && c <= 57)
      ) {
        i++;
      } else {
        break;
      }
    }

    const isKey = i > lineStart && i < lineEnd && text.charCodeAt(i) === 58; // :

    if (isKey) {
      saveValue();

      currentKey = text.slice(lineStart, i);
      i++; // Skip colon.

      // Skip spaces and tabs after the colon.
      while (i < lineEnd) {
        const c = text.charCodeAt(i);
        if (c !== 32 && c !== 9) break;
        i++;
      }

      valueStart = i;
      valueEnd = lineEnd;
    } else if (currentKey !== null) {
      valueEnd = lineEnd;
    }
  }

  saveValue();
  return record;
};

export const serializeTranslationFile = (
  record: ProgramUIFile,
): TranslationFile => {
  const isNWP = isNWPProgramUIFile(record);
  return Object.entries(record)
    .map(
      ([key, value], i): TranslationLine =>
        isNWP
          ? `"${key}"${KEY_VALUE_SEPARATOR}"${value}"${i < Object.keys(record).length - 1 ? "," : ""}`
          : `${key}: ${value}`,
    )
    .join(LINE_SEPARATOR);
};
