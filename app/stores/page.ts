export type PageLink = {
  exactHash?: boolean;
  label: string;
  to: string;
};

type PageState = {
  pageLinks: PageLink[];
};

export const usePageStore = defineStore("page", {
  state: (): PageState => ({
    pageLinks: [],
  }),
});
