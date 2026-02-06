export type TranslationKey = keyof State;

type State = {
  literature: {
    input?: Literature;
    originals?: Literature;
    translations?: Literature;
  };
  outlines: { input?: Outlines; originals?: Outlines; translations?: Outlines };
  songs: { input?: Songs; originals?: Songs; translations?: Songs };
  tips: { input?: Tips; originals?: Tips; translations?: Tips };
};

export const useJsonStore = defineStore("json", {
  actions: {
    async fixInconsistentTips(heading: string, tips: { index: number }[]) {
      tips.forEach((t) => {
        if (!this.tips.translations?.[t.index]) return;
        this.tips.translations![t.index]!.heading = heading;
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
    },
    setInput({
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
      this.literature = { ...this.literature, input: literature };
      this.outlines = { ...this.outlines, input: outlines };
      this.songs = { ...this.songs, input: songs };
      this.tips = { ...this.tips, input: tips };
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
    changedGroups(state) {
      const groups: (keyof State)[] = [];
      typedKeys(state).forEach((group) => {
        if (
          state[group] &&
          JSON.stringify(state[group].input) !==
            JSON.stringify(state[group].translations)
        ) {
          groups.push(group);
        }
      });
      return groups;
    },
    inconsistentTips(state) {
      if (!state.tips.originals?.length) return [];
      const headings: Record<string, { index: number; translation: string }[]> =
        {};

      state.tips.originals.forEach((tip, index) => {
        // If the translation is missing, skip it
        if (!state.tips.translations?.[index]?.heading) return;

        if (headings[tip.heading]) {
          headings[tip.heading]!.push({
            index,
            translation: state.tips.translations[index].heading,
          });
        } else {
          headings[tip.heading] = [
            {
              index,
              translation: state.tips.translations[index].heading,
            },
          ];
        }
      });

      return Object.entries(headings)
        .filter(
          ([, tips]) =>
            tips.length > 1 &&
            tips.some((t) => t.translation !== tips[0]?.translation),
        )
        .map(([heading, tips]) => ({
          heading,
          tips: tips,
          translations: [...new Set(tips.map((t) => t.translation))],
        }));
    },
    input(state) {
      return {
        literature: state.literature.input,
        outlines: state.outlines.input,
        songs: state.songs.input,
        tips: state.tips.input,
      };
    },
    missingLiterature(state) {
      return (
        state.literature.originals?.filter(
          (o) => !state.literature.translations?.some((t) => t.id === o.id),
        ) ?? []
      );
    },
    missingOutlines(state) {
      return (
        state.outlines.originals?.filter(
          (o) =>
            !!o.title &&
            !state.outlines.translations?.some(
              (t) => t.number === o.number && !!t.title && !!t.updated,
            ),
        ) ?? []
      );
    },
    missingSongs(state) {
      return (
        state.songs.originals?.filter(
          (o) => !state.songs.translations?.some((t) => t.number === o.number),
        ) ?? []
      );
    },
    missingTips(state) {
      return (
        state.tips.originals?.filter(
          (t, i) => !state.tips.translations?.[i]?.heading,
        ) ?? []
      );
    },
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
    literature: {
      input: undefined,
      originals: undefined,
      translations: undefined,
    },
    outlines: {
      input: undefined,
      originals: undefined,
      translations: undefined,
    },
    songs: { input: undefined, originals: undefined, translations: undefined },
    tips: { input: undefined, originals: undefined, translations: undefined },
  }),
});
