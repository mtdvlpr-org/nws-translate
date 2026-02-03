type State = {
  originalsString: TranslationFile | undefined;
  translations: ProgramUIFile;
  translationsString: TranslationFile;
};

export const useImportStore = defineStore("import", {
  actions: {},
  getters: {
    keys(): string[] {
      const store = useImportStore();
      return [
        ...new Set(
          Object.keys(store.translations).concat(Object.keys(store.references)),
        ),
      ];
    },
    references(state): ProgramUIFile {
      return state.originalsString
        ? parseTranslationFile(state.originalsString)
        : {};
    },
    remoteTranslations(state): ProgramUIFile {
      return state.translationsString
        ? parseTranslationFile(state.translationsString)
        : {};
    },
  },
  persist: true,
  state: (): State => ({
    originalsString: undefined,
    translations: {},
    translationsString: "",
  }),
});
