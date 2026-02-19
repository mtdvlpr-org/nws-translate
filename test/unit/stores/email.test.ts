import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import type { Email } from "../../../app/stores/email";

import { useEmailStore } from "../../../app/stores/email";

describe("Email Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("setInputs", () => {
    it("sets inputs for a group and number", () => {
      const store = useEmailStore();
      const input: Email = { text: "Hello", title: "Greeting" };

      store.setInputs({
        assignmentsAndDuties: { 1: input },
      });

      expect(store.assignmentsAndDuties?.[1]).toEqual({
        input,
        originals: {},
        translations: {},
      });
    });

    it("merges new inputs with existing group data", () => {
      const store = useEmailStore();
      store.setInputs({
        persons: { 1: { text: "Original" } },
      });
      store.setOriginals({ persons: { 1: { text: "Original EN" } } });
      store.setTranslations({ persons: { 1: { text: "Translated" } } });

      store.setInputs({ persons: { 1: { text: "Updated input" } } });

      expect(store.persons?.[1]).toEqual({
        input: { text: "Updated input" },
        originals: { text: "Original EN" },
        translations: { text: "Translated" },
      });
    });
  });

  describe("setOriginals", () => {
    it("sets originals for a group and number", () => {
      const store = useEmailStore();
      const original: Email = {
        text: "Original text",
        title: "Original title",
      };

      store.setOriginals({
        territory: { 1: original },
      });

      expect(store.territory?.[1]).toEqual({
        input: {},
        originals: { text: "Original text", title: "Original title" },
        translations: {},
      });
    });
  });

  describe("setTranslation", () => {
    it("sets translation for a specific group and number", () => {
      const store = useEmailStore();
      store.setInputs({ schedules: { 1: { text: "Input" } } });
      store.setOriginals({ schedules: { 1: { text: "Original" } } });

      store.setTranslation("schedules", 1, {
        text: "Vertaling",
        title: "Titel",
      });

      expect(store.schedules?.[1]).toEqual({
        input: { text: "Input" },
        originals: { text: "Original" },
        translations: { text: "Vertaling", title: "Titel" },
      });
    });
  });

  describe("setTranslations", () => {
    it("sets translations for multiple groups", () => {
      const store = useEmailStore();
      const translations = { text: "Translated", title: "Subject" };

      store.setTranslations({
        other: { 2: { text: "Other translated" } },
        publicTalks: { 1: translations },
      });

      expect(store.publicTalks?.[1]?.translations).toEqual(translations);
      expect(store.other?.[2]?.translations).toEqual({
        text: "Other translated",
      });
    });
  });

  describe("getters", () => {
    describe("inputs", () => {
      it("returns input data per group", () => {
        const store = useEmailStore();
        store.setInputs({ fieldServiceReports: { 1: { text: "Report" } } });

        expect(store.inputs.fieldServiceReports?.["1"]).toEqual({
          text: "Report",
        });
      });

      it("returns undefined for groups with no data", () => {
        const store = useEmailStore();

        expect(store.inputs.lifeAndMinistryMeeting).toBeUndefined();
        expect(store.inputs.other).toBeUndefined();
      });
    });

    describe("originals", () => {
      it("returns originals data per group", () => {
        const store = useEmailStore();
        store.setOriginals({
          lifeAndMinistryMeeting: { 1: { text: "Original" } },
        });

        expect(store.originals.lifeAndMinistryMeeting?.["1"]).toEqual({
          text: "Original",
        });
      });

      it("returns undefined for groups with no data", () => {
        const store = useEmailStore();

        expect(store.originals.publicTalks).toBeUndefined();
        expect(store.originals.schedules).toBeUndefined();
      });
    });

    describe("translations", () => {
      it("returns translations data per group", () => {
        const store = useEmailStore();
        store.setTranslations({ schedules: { 1: { text: "Translated" } } });

        expect(store.translations.schedules?.["1"]).toEqual({
          text: "Translated",
        });
      });

      it("returns undefined for groups with no data", () => {
        const store = useEmailStore();

        expect(store.translations.assignmentsAndDuties).toBeUndefined();
        expect(store.translations.persons).toBeUndefined();
      });
    });

    describe("inconsistencies", () => {
      it("returns no entries when variable placeholders match", () => {
        const store = useEmailStore();
        store.setOriginals({
          assignmentsAndDuties: {
            1: { text: "Hello [NAME], welcome!" },
          },
        });
        store.setTranslations({
          assignmentsAndDuties: {
            1: { text: "Hallo [NAME], welkom!" }, // Same variable
          },
        });

        expect(store.inconsistencies.assignmentsAndDuties).toEqual({});
      });

      it("returns entries where translation has different variables", () => {
        const store = useEmailStore();
        store.setOriginals({
          assignmentsAndDuties: {
            1: { text: "Hello [NAME], welcome!" },
          },
        });
        store.setTranslations({
          assignmentsAndDuties: {
            1: { text: "Hallo [OTHER], welkom!" }, // Different variable
          },
        });

        expect(store.inconsistencies.assignmentsAndDuties?.["1"]).toEqual({
          text: "Hello [NAME], welcome!",
        });
      });

      it("returns undefined for groups with no data", () => {
        const store = useEmailStore();

        expect(store.inconsistencies.fieldServiceReports).toBeUndefined();
        expect(store.inconsistencies.territory).toBeUndefined();
      });

      it("returns inconsistencies for fieldServiceReports and territory", () => {
        const store = useEmailStore();
        store.setOriginals({
          fieldServiceReports: { 1: { text: "Report [DATE]" } },
          territory: { 1: { text: "Territory [ID]" } },
        });
        store.setTranslations({
          fieldServiceReports: { 1: { text: "Rapport [OTHER]" } },
          territory: { 1: { text: "Territorium [ID]" } },
        });

        expect(store.inconsistencies.fieldServiceReports?.["1"]).toEqual({
          text: "Report [DATE]",
        });
        expect(store.inconsistencies.territory).toEqual({});
      });

      it("exercises all group branches in getters", () => {
        const store = useEmailStore();
        const email = { text: "Body", title: "Subject" };
        store.setInputs({
          assignmentsAndDuties: { 1: email },
          fieldServiceReports: { 1: email },
          lifeAndMinistryMeeting: { 1: email },
          other: { 1: email },
          persons: { 1: email },
          publicTalks: { 1: email },
          schedules: { 1: email },
          territory: { 1: email },
        });
        store.setOriginals({
          assignmentsAndDuties: { 1: email },
          fieldServiceReports: { 1: email },
          lifeAndMinistryMeeting: { 1: email },
          other: { 1: email },
          persons: { 1: email },
          publicTalks: { 1: email },
          schedules: { 1: email },
          territory: { 1: email },
        });
        store.setTranslations({
          assignmentsAndDuties: { 1: email },
          fieldServiceReports: { 1: email },
          lifeAndMinistryMeeting: { 1: email },
          other: { 1: email },
          persons: { 1: email },
          publicTalks: { 1: email },
          schedules: { 1: email },
          territory: { 1: email },
        });

        expect(store.inputs.assignmentsAndDuties?.["1"]).toEqual(email);
        expect(store.inputs.fieldServiceReports?.["1"]).toEqual(email);
        expect(store.inputs.lifeAndMinistryMeeting?.["1"]).toEqual(email);
        expect(store.inputs.other?.["1"]).toEqual(email);
        expect(store.inputs.persons?.["1"]).toEqual(email);
        expect(store.inputs.publicTalks?.["1"]).toEqual(email);
        expect(store.inputs.schedules?.["1"]).toEqual(email);
        expect(store.inputs.territory?.["1"]).toEqual(email);

        expect(store.originals.assignmentsAndDuties?.["1"]).toEqual(email);
        expect(store.originals.fieldServiceReports?.["1"]).toEqual(email);
        expect(store.originals.lifeAndMinistryMeeting?.["1"]).toEqual(email);
        expect(store.originals.other?.["1"]).toEqual(email);
        expect(store.originals.persons?.["1"]).toEqual(email);
        expect(store.originals.publicTalks?.["1"]).toEqual(email);
        expect(store.originals.schedules?.["1"]).toEqual(email);
        expect(store.originals.territory?.["1"]).toEqual(email);

        expect(store.translations.assignmentsAndDuties?.["1"]).toEqual(email);
        expect(store.translations.fieldServiceReports?.["1"]).toEqual(email);
        expect(store.translations.lifeAndMinistryMeeting?.["1"]).toEqual(email);
        expect(store.translations.other?.["1"]).toEqual(email);
        expect(store.translations.persons?.["1"]).toEqual(email);
        expect(store.translations.publicTalks?.["1"]).toEqual(email);
        expect(store.translations.schedules?.["1"]).toEqual(email);
        expect(store.translations.territory?.["1"]).toEqual(email);

        expect(store.inconsistencies.assignmentsAndDuties).toEqual({});
        expect(store.inconsistencies.fieldServiceReports).toEqual({});
        expect(store.inconsistencies.lifeAndMinistryMeeting).toEqual({});
        expect(store.inconsistencies.other).toEqual({});
        expect(store.inconsistencies.persons).toEqual({});
        expect(store.inconsistencies.publicTalks).toEqual({});
        expect(store.inconsistencies.schedules).toEqual({});
        expect(store.inconsistencies.territory).toEqual({});
      });
    });
  });
});
