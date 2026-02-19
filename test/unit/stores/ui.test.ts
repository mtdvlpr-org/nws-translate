import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { useUIStore } from "../../../app/stores/ui";
import {
  NWPTranslationFileMock,
  NWSProgramUIFileMock,
  NWSTranslationFileMock,
} from "../../mocks/ui";

describe("UI Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("markNWSConsistent", () => {
    it("adds otherKey to consistentNWS for the given key", () => {
      const store = useUIStore();

      store.markNWSConsistent("key", "key2");
      expect(store.consistentNWS).toEqual({ key: ["key2"] });

      store.markNWSConsistent("key", "key3");
      expect(store.consistentNWS).toEqual({ key: ["key2", "key3"] });
    });
  });

  describe("markUIConsistent", () => {
    it("adds key to consistentUI", () => {
      const store = useUIStore();

      store.markUIConsistent("myKey");
      expect(store.consistentUI).toContain("myKey");

      store.markUIConsistent("otherKey");
      expect(store.consistentUI).toEqual(["myKey", "otherKey"]);
    });
  });

  describe("clearConsistentKeys", () => {
    it("clears all consistent keys when no keys provided", () => {
      const store = useUIStore();
      store.markNWSConsistent("key", "key2");
      store.markUIConsistent("key");

      store.clearConsistentKeys();

      expect(store.consistentNWS).toEqual({});
      expect(store.consistentUI).toEqual([]);
    });

    it("clears values for keys in list and filters values for other keys", () => {
      const store = useUIStore();
      store.markNWSConsistent("key1", "key2");
      store.markNWSConsistent("key1", "key3");
      store.markUIConsistent("key1");

      store.clearConsistentKeys(["key1", "key2"]);

      // key1 is in the list, so its values are cleared to []
      expect(store.consistentNWS).toEqual({ key1: [] });
      expect(store.consistentUI).toEqual([]);
    });

    it("filters value from key when value is in keys list but key is not", () => {
      const store = useUIStore();
      store.markNWSConsistent("key1", "key2");
      store.markNWSConsistent("key1", "key3");

      store.clearConsistentKeys(["key2"]); // key2 is a value, not a key

      expect(store.consistentNWS).toEqual({ key1: ["key3"] });
    });
  });

  describe("getters", () => {
    describe("references", () => {
      it("parses originalsString into ProgramUIFile", () => {
        const store = useUIStore();
        store.originalsString = NWSTranslationFileMock;

        expect(store.references).toEqual(NWSProgramUIFileMock);
      });
    });

    describe("keys", () => {
      it("returns union of translation keys and reference keys", () => {
        const store = useUIStore();
        store.originalsString = NWSTranslationFileMock;
        store.translations = { extraKey: "Extra", key: "Val" };

        const keys = store.keys;
        expect(keys).toContain("empty");
        expect(keys).toContain("key");
        expect(keys).toContain("key2");
        expect(keys).toContain("extraKey");
      });
    });

    describe("missingNWS", () => {
      it("returns keys that have no translation", () => {
        const store = useUIStore();
        store.originalsString = NWSTranslationFileMock;
        store.translations = { key: "Val" }; // key2 and empty missing

        const missing = store.missingNWS;
        expect(missing).toContain("key2");
        expect(missing).toContain("empty");
        expect(missing).not.toContain("key");
      });
    });

    describe("nwpKeys", () => {
      it("returns keys from nwpTranslations excluding ____ prefix", () => {
        const store = useUIStore();
        store.nwpTranslations = {
          ____GENERAL____: "",
          key: "Value",
          key2: "Value 2",
        };

        expect(store.nwpKeys).toEqual(["key", "key2"]);
      });

      it("returns empty array when nwpTranslations undefined", () => {
        const store = useUIStore();

        expect(store.nwpKeys).toEqual([]);
      });
    });

    describe("missingNWP", () => {
      it("returns nwp keys with empty or falsy values", () => {
        const store = useUIStore();
        store.nwpTranslations = {
          emptyKey: "",
          key: "Has value",
        };

        const missing = store.missingNWP;
        expect(missing).toContain("emptyKey");
        expect(missing).not.toContain("key");
      });
    });

    describe("uiInconsistencies", () => {
      it("returns keys where nwp and nws translations differ", () => {
        const store = useUIStore();
        store.nwpTranslations = { key: "NWP Value", key2: "Same" };
        store.translations = { key: "NWS Value", key2: "Same" };
        store.originalsString = NWSTranslationFileMock;

        const inconsistencies = store.uiInconsistencies;
        expect(inconsistencies).toHaveLength(1);
        expect(inconsistencies[0]).toEqual({
          key: "key",
          nwp: "NWP Value",
          nws: "NWS Value",
        });
      });

      it("excludes keys marked as consistent in consistentUI", () => {
        const store = useUIStore();
        store.nwpTranslations = { key: "NWP", key2: "NWS" };
        store.translations = { key: "Different", key2: "NWS" };
        store.markUIConsistent("key");

        const inconsistencies = store.uiInconsistencies;
        expect(inconsistencies).toHaveLength(0);
      });
    });

    describe("inconsistentNWS", () => {
      it("returns empty when nwpString is empty", () => {
        const store = useUIStore();
        store.originalsString = NWSTranslationFileMock;
        store.translations = NWSProgramUIFileMock;

        expect(store.inconsistentNWS).toEqual([]);
      });

      it("returns inconsistencies for two-word terms with mismatched translations", () => {
        const store = useUIStore();
        store.nwpString = "x"; // Non-empty to pass guard
        store.originalsString = "termA: Value 2\ntermB: Other Value 2"; // termB ends with termA
        store.translations = { termA: "A", termB: "B" }; // B does not include A

        const result = store.inconsistentNWS;
        expect(result).toHaveLength(1);
        expect(result[0].key).toBe("termA");
        expect(result[0].original).toBe("Value 2");
        expect(result[0].translation).toBe("A");
        expect(result[0].others).toContainEqual({
          key: "termB",
          value: "B",
        });
      });
    });

    describe("remoteNWP", () => {
      it("parses nwpString when set", () => {
        const store = useUIStore();
        store.nwpString = NWPTranslationFileMock;

        expect(store.remoteNWP).toEqual(
          expect.objectContaining({
            key: "Value",
            key2: "Value 2",
          }),
        );
      });

      it("returns empty object when nwpString is undefined", () => {
        const store = useUIStore();

        expect(store.remoteNWP).toEqual({});
      });
    });

    describe("remoteTranslations", () => {
      it("parses translationsString when set", () => {
        const store = useUIStore();
        store.translationsString = NWSTranslationFileMock;

        expect(store.remoteTranslations).toEqual(NWSProgramUIFileMock);
      });

      it("returns empty object when translationsString is empty", () => {
        const store = useUIStore();

        expect(store.remoteTranslations).toEqual({});
      });
    });
  });
});
