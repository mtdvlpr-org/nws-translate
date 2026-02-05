type State = {
  nwpString: TranslationFile | undefined;
  nwpTranslations: ProgramUIFile | undefined;
  originalsString: TranslationFile;
  translations: ProgramUIFile;
  translationsString: TranslationFile;
};

export const useUIStore = defineStore("ui", {
  actions: {},
  getters: {
    keys(): string[] {
      const store = useUIStore();
      return [
        ...new Set(
          Object.keys(store.translations).concat(Object.keys(store.references)),
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
  },
  persist: true,
  state: (): State => ({
    nwpString: undefined,
    nwpTranslations: undefined,
    originalsString: "",
    translations: {},
    translationsString: "",
  }),
});
