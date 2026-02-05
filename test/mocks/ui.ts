import type { ProgramUIFile } from "../../app/utils/schemas";
import type {
  NWPTranslationFile,
  NWSTranslationFile,
} from "../../app/utils/ui";

export const NWSProgramUIFileMock: ProgramUIFile = {
  empty: "",
  key: "Value",
  key2: "Value 2",
};

export const NWSTranslationFileMock: NWSTranslationFile = `empty: \nkey: Value\nkey2: Value 2`;

export const NWPProgramUIFileMock: ProgramUIFile = {
  ____GENERAL____: "",
  key: "Value",
  key2: "Value 2",
};

export const NWPTranslationFileMock: NWPTranslationFile = `"____GENERAL____": "",\n"key": "Value",\n"key2": "Value 2"`;
