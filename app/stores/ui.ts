type State = {
  consistentNWS: Record<string, string[]>;
  nwpString: TranslationFile | undefined;
  nwpTranslations: ProgramUIFile | undefined;
  originalsString: TranslationFile;
  translations: ProgramUIFile;
  translationsString: TranslationFile;
};

export const useUIStore = defineStore("ui", {
  actions: {
    markNWSConsistent(key: string, otherKey: string) {
      this.consistentNWS = {
        ...this.consistentNWS,
        [key]: [...(this.consistentNWS[key] || []), otherKey],
      };
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
          translation: state.translations[key] ?? "",
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
        .filter((key) => this.keys.includes(key))
        .map((key) => ({
          key,
          nwp: state.nwpTranslations?.[key] ?? "",
          nws: state.translations[key] ?? "",
        }))
        .filter(({ nwp, nws }) => nwp !== nws);
    },
  },
  persist: true,
  state: (): State => ({
    consistentNWS: {},
    nwpString: undefined,
    nwpTranslations: undefined,
    originalsString: "",
    translations: {},
    translationsString: "",
  }),
});
