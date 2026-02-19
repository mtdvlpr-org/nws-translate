import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { useJsonStore } from "../../../app/stores/json";
import { literatureItemMock, literatureMock } from "../../mocks/literature";
import {
  emptyOutlineMock,
  outlineMock,
  outlinesMock,
  outlineWithNotesMock,
} from "../../mocks/outline";
import { songsMock } from "../../mocks/song";
import { tipMock, tipsMock } from "../../mocks/tip";

describe("Json Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("setInput", () => {
    it("sets input for literature, outlines, songs, and tips", () => {
      const store = useJsonStore();

      store.setInput({
        literature: literatureMock,
        outlines: outlinesMock,
        songs: songsMock,
        tips: tipsMock,
      });

      expect(store.literature.input).toEqual(literatureMock);
      expect(store.outlines.input).toEqual(outlinesMock);
      expect(store.songs.input).toEqual(songsMock);
      expect(store.tips.input).toEqual(tipsMock);
    });

    it("sets only provided groups without overwriting others when called together", () => {
      const store = useJsonStore();
      store.setInput({
        literature: literatureMock,
        outlines: outlinesMock,
      });

      expect(store.literature.input).toEqual(literatureMock);
      expect(store.outlines.input).toEqual(outlinesMock);
    });
  });

  describe("setOriginals", () => {
    it("sets originals for all groups", () => {
      const store = useJsonStore();

      store.setOriginals({
        literature: literatureMock,
        outlines: outlinesMock,
        songs: songsMock,
        tips: tipsMock,
      });

      expect(store.literature.originals).toEqual(literatureMock);
      expect(store.outlines.originals).toEqual(outlinesMock);
      expect(store.songs.originals).toEqual(songsMock);
      expect(store.tips.originals).toEqual(tipsMock);
    });
  });

  describe("setTranslations", () => {
    it("sets translations for all groups when no group specified", () => {
      const store = useJsonStore();
      store.setOriginals({
        literature: literatureMock,
        outlines: outlinesMock,
        songs: songsMock,
        tips: tipsMock,
      });

      const translatedLiterature = [
        { ...literatureMock[0], title: "Translated Title" },
        literatureMock[1],
      ];

      store.setTranslations({
        literature: translatedLiterature,
        outlines: outlinesMock,
        songs: songsMock,
        tips: tipsMock,
      });

      expect(store.literature.translations).toEqual(translatedLiterature);
      expect(store.outlines.translations).toEqual(outlinesMock);
      expect(store.songs.translations).toEqual(songsMock);
      expect(store.tips.translations).toEqual(tipsMock);
    });

    it("sets translations for a specific group when group specified", () => {
      const store = useJsonStore();
      store.setOriginals({ tips: tipsMock });

      store.setTranslations({ tips: tipsMock }, "tips");

      expect(store.tips.translations).toEqual(tipsMock);
    });
  });

  describe("fixInconsistentTips", () => {
    it("skips tips when translation is missing at index", async () => {
      const store = useJsonStore();
      store.setOriginals({ tips: [tipMock, { ...tipMock, heading: "H2" }] });
      store.setTranslations(
        { tips: [{ ...tipMock }] }, // Only index 0 has translation
        "tips",
      );

      await store.fixInconsistentTips("Unified", [{ index: 0 }, { index: 1 }]);

      expect(store.tips.translations?.[0]?.heading).toBe("Unified");
      expect(store.tips.translations?.[1]).toBeUndefined();
    });

    it("updates heading for tips at given indices", async () => {
      const store = useJsonStore();
      store.setOriginals({ tips: tipsMock });
      store.setTranslations(
        {
          tips: [
            { ...tipMock, heading: "Heading A" },
            { ...tipMock, heading: "Heading B", url: "https://other.com" },
          ],
        },
        "tips",
      );

      await store.fixInconsistentTips("Unified Heading", [
        { index: 0 },
        { index: 1 },
      ]);

      expect(store.tips.translations?.[0]?.heading).toBe("Unified Heading");
      expect(store.tips.translations?.[1]?.heading).toBe("Unified Heading");
    });
  });

  describe("getters", () => {
    describe("input", () => {
      it("returns input for all groups", () => {
        const store = useJsonStore();
        store.setInput({ literature: literatureMock, tips: tipsMock });

        expect(store.input.literature).toEqual(literatureMock);
        expect(store.input.tips).toEqual(tipsMock);
      });
    });

    describe("originals", () => {
      it("returns originals for all groups", () => {
        const store = useJsonStore();
        store.setOriginals({ songs: songsMock });

        expect(store.originals.songs).toEqual(songsMock);
      });
    });

    describe("translations", () => {
      it("returns translations for all groups", () => {
        const store = useJsonStore();
        store.setTranslations({ outlines: outlinesMock }, "outlines");

        expect(store.translations.outlines).toEqual(outlinesMock);
      });
    });

    describe("changedGroups", () => {
      it("returns groups where input differs from translations", () => {
        const store = useJsonStore();
        store.setInput({ literature: literatureMock });
        store.setOriginals({ literature: literatureMock });
        store.setTranslations(
          {
            literature: [
              { ...literatureMock[0], title: "Different" },
              literatureMock[1],
            ],
          },
          "literature",
        );

        expect(store.changedGroups).toContain("literature");
      });

      it("returns empty array when no changes", () => {
        const store = useJsonStore();
        store.setInput({ tips: tipsMock });
        store.setTranslations({ tips: tipsMock }, "tips");

        expect(store.changedGroups).not.toContain("tips");
      });
    });

    describe("missingLiterature", () => {
      it("returns originals without matching translation by id", () => {
        const store = useJsonStore();
        store.setOriginals({ literature: literatureMock });
        store.setTranslations(
          {
            literature: [literatureMock[0]], // Only first item translated
          },
          "literature",
        );

        expect(store.missingLiterature).toHaveLength(1);
        expect(store.missingLiterature[0]).toEqual(literatureMock[1]);
      });
    });

    describe("missingTips", () => {
      it("returns tips missing heading or text in translations", () => {
        const store = useJsonStore();
        store.setOriginals({
          tips: [tipMock, { ...tipMock, heading: "H2", url: "u2" }],
        });
        store.setTranslations(
          {
            tips: [
              { ...tipMock },
              { heading: "", text: "" }, // Missing both
            ],
          },
          "tips",
        );

        expect(store.missingTips).toHaveLength(1);
        expect(store.missingTips[0][0]).toBe(1);
      });
    });

    describe("missingOutlines", () => {
      it("returns outlines with title when translation has no matching title/updated", () => {
        const store = useJsonStore();
        store.setOriginals({ outlines: [outlineMock] });
        store.setTranslations(
          { outlines: [{ number: 1, updated: "mm/yy" }] }, // No title
          "outlines",
        );

        expect(store.missingOutlines).toHaveLength(1);
        expect(store.missingOutlines[0]).toEqual(outlineMock);
      });

      it("returns outlines with notes when translation lacks notes", () => {
        const store = useJsonStore();
        store.setOriginals({ outlines: [outlineWithNotesMock] });
        store.setTranslations(
          {
            outlines: [{ number: 2, title: "Title", updated: "mm/yy" }], // No notes
          },
          "outlines",
        );

        expect(store.missingOutlines).toHaveLength(1);
        expect(store.missingOutlines[0]).toEqual(outlineWithNotesMock);
      });

      it("excludes outlines without title", () => {
        const store = useJsonStore();
        store.setOriginals({ outlines: [emptyOutlineMock] });
        store.setTranslations({ outlines: [] }, "outlines");

        expect(store.missingOutlines).toHaveLength(0);
      });
    });

    describe("wrongLiterature", () => {
      it("returns literature with wrong categoryName in translation", () => {
        const store = useJsonStore();
        store.setOriginals({ literature: [literatureItemMock] });
        store.literature.translations = [
          { ...literatureItemMock, categoryName: "Wrong" },
        ];

        expect(store.wrongLiterature).toHaveLength(1);
        expect(store.wrongLiterature[0]).toEqual(literatureItemMock);
      });

      it("returns literature with wrong itemNumber in translation", () => {
        const store = useJsonStore();
        store.setOriginals({ literature: [literatureItemMock] });
        store.literature.translations = [
          { ...literatureItemMock, itemNumber: "999" },
        ];

        expect(store.wrongLiterature).toHaveLength(1);
      });

      it("returns literature with wrong symbol in translation", () => {
        const store = useJsonStore();
        store.setOriginals({ literature: [literatureItemMock] });
        store.literature.translations = [
          { ...literatureItemMock, symbol: "x" },
        ];

        expect(store.wrongLiterature).toHaveLength(1);
      });

      it("returns empty when translation matches original", () => {
        const store = useJsonStore();
        store.setOriginals({ literature: literatureMock });
        store.setTranslations({ literature: literatureMock }, "literature");

        expect(store.wrongLiterature).toHaveLength(0);
      });

      it("returns empty when translation not found for original", () => {
        const store = useJsonStore();
        store.setOriginals({ literature: [literatureItemMock] });
        store.setTranslations({ literature: [] }, "literature");

        expect(store.wrongLiterature).toHaveLength(0);
      });
    });

    describe("missingSongs", () => {
      it("returns songs without matching translation by number", () => {
        const store = useJsonStore();
        store.setOriginals({ songs: songsMock });
        store.setTranslations({ songs: [] }, "songs");

        expect(store.missingSongs).toEqual(songsMock);
      });
    });

    describe("inconsistentTips", () => {
      it("returns tips with same original heading but different translations", () => {
        const store = useJsonStore();
        store.setOriginals({
          tips: [
            { ...tipMock, heading: "Same" },
            { ...tipMock, heading: "Same", url: "https://b.com" },
          ],
        });
        store.setTranslations(
          {
            tips: [
              { ...tipMock, heading: "Vertaling A" },
              { ...tipMock, heading: "Vertaling B", url: "https://b.com" },
            ],
          },
          "tips",
        );

        expect(store.inconsistentTips).toHaveLength(1);
        expect(store.inconsistentTips[0].heading).toBe("Same");
        expect(store.inconsistentTips[0].translations).toContain("Vertaling A");
        expect(store.inconsistentTips[0].translations).toContain("Vertaling B");
      });
    });
  });
});
