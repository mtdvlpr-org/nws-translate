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

/**
 * ProgramUI.json file structure.
 * @example
 * {
 *   "key": "Value 1",
 *   "key2": "Value 2"
 * }
 */
export type ProgramUIFile = Record<string, string>;

export type TranslationFile = NWPTranslationFile | NWSTranslationFile;

export type TranslationLine = NWPTranslationLine | NWSTranslationLine;

export const isNWPTranslationFile = (file: TranslationFile): boolean => {
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

const normalizeTranslationLine = (
  line: TranslationLine,
): NWSTranslationLine => {
  if (isNWPTranslationLine(line)) {
    const key = line.match(/^"([^"]+)"/)?.[1];
    const value = line.match(/:"([^"]+)"/)?.[1];
    return `${key}: ${value}`;
  }

  return line;
};

export const parseTranslationFile = (file: TranslationFile): ProgramUIFile => {
  const lines = (file.trim().split(LINE_SEPARATOR) as TranslationLine[]).map(
    normalizeTranslationLine,
  );

  const programUI: ProgramUIFile = {};

  lines.forEach((line) => {
    const [key, ...rest] = line.trim().split(KEY_VALUE_SEPARATOR);
    const value = rest.join(KEY_VALUE_SEPARATOR);

    if (key) programUI[key] = value ?? ""; // Value can be empty in NWP translation file
  });

  return programUI;
};

export const serializeTranslationFile = (
  record: ProgramUIFile,
): TranslationFile => {
  const isNWP = isNWPProgramUIFile(record);
  return Object.entries(record)
    .map(
      ([key, value]): TranslationLine =>
        isNWP
          ? `"${key}"${KEY_VALUE_SEPARATOR}"${value}",`
          : `${key}: ${value}`,
    )
    .join(LINE_SEPARATOR);
};
