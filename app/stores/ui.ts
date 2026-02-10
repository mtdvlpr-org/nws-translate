export type UIKey = "nwp" | "ui";

type State = {
  consistentNWS: Record<string, string[]>;
  consistentUI: string[];
  nwpString: TranslationFile | undefined;
  nwpTranslations: ProgramUIFile | undefined;
  originalsString: TranslationFile;
  translations: ProgramUIFile;
  translationsString: TranslationFile;
};

export const useUIStore = defineStore("ui", {
  actions: {
    clearConsistentKeys(keys?: string[]) {
      if (!keys) {
        this.consistentNWS = {};
        this.consistentUI = [];
        return;
      }

      this.consistentNWS = Object.fromEntries(
        Object.entries(this.consistentNWS).map(([key, values]) => {
          if (keys.includes(key)) {
            return [key, []];
          } else {
            return [key, values.filter((value) => !keys.includes(value))];
          }
        }),
      );

      this.consistentUI = this.consistentUI.filter(
        (key) => !keys.includes(key),
      );
    },
    markNWSConsistent(key: string, otherKey: string) {
      this.consistentNWS = {
        ...this.consistentNWS,
        [key]: [...(this.consistentNWS[key] || []), otherKey],
      };
    },
    markUIConsistent(key: string) {
      this.consistentUI.push(key);
    },
  },
  getters: {
    inconsistentNWS(state): {
      key: string;
      original: string;
      others: { key: string; value: string }[];
      translation: string;
    }[] {
      if (!state.nwpString?.length) return [];

      const terms = Object.entries(this.references).filter(
        ([, val]) => val.split(" ").length === 2,
      );

      return terms
        .map(([key, val]) => ({
          key,
          original: val,
          others: Object.entries(this.references)
            .filter(
              ([k, v]) =>
                k !== key &&
                !state.consistentNWS[key]?.includes(k) &&
                (v.endsWith(val) || v.includes(val + " ")),
            )
            .map(([k]) => ({
              key: k,
              value: state.translations[k] ?? "",
            }))
            .filter(
              ({ value }) =>
                !value
                  .toLowerCase()
                  .includes(state.translations[key]?.toLowerCase() ?? ""),
            ),
          translation: state.translations[key] || "<LEGE VERTALING>",
        }))
        .filter(({ others }) => others.length > 0);
    },
    keys(state): string[] {
      return [
        ...new Set(
          Object.keys(state.translations).concat(Object.keys(this.references)),
        ),
      ];
    },
    missingNWP(state): string[] {
      return this.nwpKeys.filter((key) => !state.nwpTranslations?.[key]);
    },
    missingNWS(state): string[] {
      return this.keys.filter((key) => !state.translations[key]);
    },
    nwpKeys(state): string[] {
      return Object.keys(state.nwpTranslations ?? {}).filter(
        (key) => !key.startsWith("____"),
      );
    },
    references(state): ProgramUIFile {
      return state.originalsString
        ? parseTranslationFile(state.originalsString)
        : {};
    },
    remoteNWP(state): ProgramUIFile {
      return state.nwpString ? parseTranslationFile(state.nwpString) : {};
    },
    remoteTranslations(state): ProgramUIFile {
      return state.translationsString
        ? parseTranslationFile(state.translationsString)
        : {};
    },
    uiInconsistencies(state): { key: string; nwp: string; nws: string }[] {
      return this.nwpKeys
        .filter(
          (key) => this.keys.includes(key) && !state.consistentUI.includes(key),
        )
        .map((key) => ({
          key,
          nwp: state.nwpTranslations?.[key] || "<LEGE VERTALING>",
          nws: state.translations[key] || "<LEGE VERTALING>",
        }))
        .filter(({ nwp, nws }) => nwp !== nws);
    },
  },
  persist: true,
  state: (): State => ({
    consistentNWS: {},
    consistentUI: [],
    nwpString: undefined,
    nwpTranslations: undefined,
    originalsString: "",
    translations: {},
    translationsString: "",
  }),
});
