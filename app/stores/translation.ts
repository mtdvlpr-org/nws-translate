export type TranslationKey = keyof State;

type State = {
  literature: { originals?: Literature; translations?: Literature };
  outlines: { originals?: Outlines; translations?: Outlines };
  songs: { originals?: Songs; translations?: Songs };
  tips: { originals?: Tips; translations?: Tips };
};

export const useTranslationStore = defineStore("translation", {
  actions: {
    encodeOriginals() {
      return {
        literature: this.literature.originals
          ? JSON.stringify(this.literature.originals, null, 2)
          : undefined,
        outlines: this.outlines.originals
          ? JSON.stringify(this.outlines.originals, null, 2)
          : undefined,
        songs: this.songs.originals
          ? JSON.stringify(this.songs.originals, null, 2)
          : undefined,
        tips: this.tips.originals
          ? JSON.stringify(this.tips.originals, null, 2)
          : undefined,
      };
    },
    encodeTranslations() {
      return {
        literature: this.literature.translations
          ? JSON.stringify(this.literature.translations, null, 2)
          : undefined,
        outlines: this.outlines.translations
          ? JSON.stringify(this.outlines.translations, null, 2)
          : undefined,
        songs: this.songs.translations
          ? JSON.stringify(this.songs.translations, null, 2)
          : undefined,
        tips: this.tips.translations
          ? JSON.stringify(this.tips.translations, null, 2)
          : undefined,
      };
    },
    setOriginals({
      literature,
      outlines,
      songs,
      tips,
    }: {
      literature?: Literature;
      outlines?: Outlines;
      songs?: Songs;
      tips?: Tips;
    }) {
      this.literature = { ...this.literature, originals: literature };
      this.outlines = { ...this.outlines, originals: outlines };
      this.songs = { ...this.songs, originals: songs };
      this.tips = { ...this.tips, originals: tips };
    },
    setTranslations(
      {
        literature,
        outlines,
        songs,
        tips,
      }: {
        literature?: Literature;
        outlines?: Outlines;
        songs?: Songs;
        tips?: Tips;
      },
      group?: keyof State,
    ) {
      if (!group || group === "literature") {
        this.literature = { ...this.literature, translations: literature };
      }
      if (!group || group === "outlines") {
        this.outlines = { ...this.outlines, translations: outlines };
      }
      if (!group || group === "songs") {
        this.songs = { ...this.songs, translations: songs };
      }
      if (!group || group === "tips") {
        this.tips = { ...this.tips, translations: tips };
      }
    },
  },
  getters: {
    originals(state) {
      return {
        literature: state.literature.originals,
        outlines: state.outlines.originals,
        songs: state.songs.originals,
        tips: state.tips.originals,
      };
    },
    translations(state) {
      return {
        literature: state.literature.translations,
        outlines: state.outlines.translations,
        songs: state.songs.translations,
        tips: state.tips.translations,
      };
    },
  },
  persist: true,
  state: (): State => ({
    literature: { originals: undefined, translations: undefined },
    outlines: { originals: undefined, translations: undefined },
    songs: { originals: undefined, translations: undefined },
    tips: { originals: undefined, translations: undefined },
  }),
});
