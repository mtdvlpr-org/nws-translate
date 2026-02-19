import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePageStore } from "../../../app/stores/page";

vi.hoisted(async () => {
  vi.stubGlobal("defineStore", (await import("pinia")).defineStore);
});

describe("Page Store", () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("sets page links", () => {
    const page = usePageStore();
    expect(page.pageLinks).toStrictEqual([]);
    page.pageLinks = [{ label: "Home", to: "/" }];
    expect(page.pageLinks).toStrictEqual([{ label: "Home", to: "/" }]);
  });
});
