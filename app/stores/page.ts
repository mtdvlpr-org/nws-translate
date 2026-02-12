export type PageLink = {
  exactHash?: boolean;
  label: string;
  to: string;
};

type State = {
  pageLinks: PageLink[];
};

export const usePageStore = defineStore("page", {
  persist: false,
  state: (): State => ({
    pageLinks: [],
  }),
});
