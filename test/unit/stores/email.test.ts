import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { useEmailStore } from "../../../app/stores/email";
import { loadEmailFixture } from "../../fixtures/loaders";
import {
  assignmentsAndDutiesEnEmail,
  assignmentsAndDutiesNlEmail,
  emailMock,
  emailTranslationMock,
  emailWithWrongVariableMock,
} from "../../mocks/email";

describe("Email Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("setInputs", () => {
    it("sets inputs for a group and number", () => {
      const store = useEmailStore();

      store.setInputs({
        assignmentsAndDuties: { 1: emailMock },
      });

      expect(store.assignmentsAndDuties?.[1]).toEqual({
        input: emailMock,
        originals: {},
        translations: {},
      });
    });

    it("merges new inputs with existing group data", () => {
      const store = useEmailStore();
      store.setInputs({ persons: { 1: emailTranslationMock } });
      store.setOriginals({ persons: { 1: emailMock } });
      store.setTranslations({ persons: { 1: emailTranslationMock } });

      store.setInputs({ persons: { 1: { text: "Updated input" } } });

      expect(store.persons?.[1]).toEqual({
        input: { text: "Updated input" },
        originals: emailMock,
        translations: emailTranslationMock,
      });
    });
  });

  describe("setOriginals", () => {
    it("sets originals for a group and number", () => {
      const store = useEmailStore();

      store.setOriginals({
        territory: { 1: assignmentsAndDutiesEnEmail },
      });

      expect(store.territory?.[1]).toEqual({
        input: {},
        originals: assignmentsAndDutiesEnEmail,
        translations: {},
      });
    });
  });

  describe("setTranslation", () => {
    it("sets translation for a specific group and number", () => {
      const store = useEmailStore();
      store.setInputs({ schedules: { 1: emailTranslationMock } });
      store.setOriginals({ schedules: { 1: emailMock } });

      store.setTranslation("schedules", 1, emailTranslationMock);

      expect(store.schedules?.[1]).toEqual({
        input: emailTranslationMock,
        originals: emailMock,
        translations: emailTranslationMock,
      });
    });
  });

  describe("setTranslations", () => {
    it("sets translations for multiple groups", () => {
      const store = useEmailStore();

      store.setTranslations({
        other: { 2: { text: "Other translated" } },
        publicTalks: { 1: emailTranslationMock },
      });

      expect(store.publicTalks?.[1]?.translations).toEqual(
        emailTranslationMock,
      );
      expect(store.other?.[2]?.translations).toEqual({
        text: "Other translated",
      });
    });
  });

  describe("getters", () => {
    describe("inputs", () => {
      it("returns input data per group", () => {
        const store = useEmailStore();
        store.setInputs({ fieldServiceReports: { 1: emailMock } });

        expect(store.inputs.fieldServiceReports?.["1"]).toEqual(emailMock);
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
          lifeAndMinistryMeeting: { 1: emailMock },
        });

        expect(store.originals.lifeAndMinistryMeeting?.["1"]).toEqual(
          emailMock,
        );
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
        store.setTranslations({ schedules: { 1: emailTranslationMock } });

        expect(store.translations.schedules?.["1"]).toEqual(
          emailTranslationMock,
        );
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
          assignmentsAndDuties: { 1: emailMock },
        });
        store.setTranslations({
          assignmentsAndDuties: { 1: emailTranslationMock },
        });

        expect(store.inconsistencies.assignmentsAndDuties).toEqual({});
      });

      it("returns no entries for real-world Assignments Reminder EN/NL with matching variables", () => {
        const store = useEmailStore();
        store.setOriginals({
          assignmentsAndDuties: { 1: assignmentsAndDutiesEnEmail },
        });
        store.setTranslations({
          assignmentsAndDuties: { 1: assignmentsAndDutiesNlEmail },
        });

        expect(store.inconsistencies.assignmentsAndDuties).toEqual({});
      });

      it("uses fixture content consistent with actual fixture files", async () => {
        const enText = await loadEmailFixture("assignmentsAndDutiesEn");
        const nlText = await loadEmailFixture("assignmentsAndDutiesNl");

        expect(assignmentsAndDutiesEnEmail.text?.replace(/\r/g, "")).toBe(
          enText.replace(/\r/g, ""),
        );
        expect(assignmentsAndDutiesNlEmail.text?.replace(/\r/g, "")).toBe(
          nlText.replace(/\r/g, ""),
        );
      });

      it("returns entries where translation has different variables", () => {
        const store = useEmailStore();
        store.setOriginals({
          assignmentsAndDuties: { 1: emailMock },
        });
        store.setTranslations({
          assignmentsAndDuties: { 1: emailWithWrongVariableMock },
        });

        expect(store.inconsistencies.assignmentsAndDuties?.["1"]).toEqual(
          emailMock,
        );
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
        store.setInputs({
          assignmentsAndDuties: { 1: emailTranslationMock },
          fieldServiceReports: { 1: emailTranslationMock },
          lifeAndMinistryMeeting: { 1: emailTranslationMock },
          other: { 1: emailTranslationMock },
          persons: { 1: emailTranslationMock },
          publicTalks: { 1: emailTranslationMock },
          schedules: { 1: emailTranslationMock },
          territory: { 1: emailTranslationMock },
        });
        store.setOriginals({
          assignmentsAndDuties: { 1: emailMock },
          fieldServiceReports: { 1: emailMock },
          lifeAndMinistryMeeting: { 1: emailMock },
          other: { 1: emailMock },
          persons: { 1: emailMock },
          publicTalks: { 1: emailMock },
          schedules: { 1: emailMock },
          territory: { 1: emailMock },
        });
        store.setTranslations({
          assignmentsAndDuties: { 1: emailTranslationMock },
          fieldServiceReports: { 1: emailTranslationMock },
          lifeAndMinistryMeeting: { 1: emailTranslationMock },
          other: { 1: emailTranslationMock },
          persons: { 1: emailTranslationMock },
          publicTalks: { 1: emailTranslationMock },
          schedules: { 1: emailTranslationMock },
          territory: { 1: emailTranslationMock },
        });

        expect(store.inputs.assignmentsAndDuties?.["1"]).toEqual(
          emailTranslationMock,
        );
        expect(store.inputs.fieldServiceReports?.["1"]).toEqual(
          emailTranslationMock,
        );
        expect(store.inputs.lifeAndMinistryMeeting?.["1"]).toEqual(
          emailTranslationMock,
        );
        expect(store.inputs.other?.["1"]).toEqual(emailTranslationMock);
        expect(store.inputs.persons?.["1"]).toEqual(emailTranslationMock);
        expect(store.inputs.publicTalks?.["1"]).toEqual(emailTranslationMock);
        expect(store.inputs.schedules?.["1"]).toEqual(emailTranslationMock);
        expect(store.inputs.territory?.["1"]).toEqual(emailTranslationMock);

        expect(store.originals.assignmentsAndDuties?.["1"]).toEqual(emailMock);
        expect(store.originals.fieldServiceReports?.["1"]).toEqual(emailMock);
        expect(store.originals.lifeAndMinistryMeeting?.["1"]).toEqual(
          emailMock,
        );
        expect(store.originals.other?.["1"]).toEqual(emailMock);
        expect(store.originals.persons?.["1"]).toEqual(emailMock);
        expect(store.originals.publicTalks?.["1"]).toEqual(emailMock);
        expect(store.originals.schedules?.["1"]).toEqual(emailMock);
        expect(store.originals.territory?.["1"]).toEqual(emailMock);

        expect(store.translations.assignmentsAndDuties?.["1"]).toEqual(
          emailTranslationMock,
        );
        expect(store.translations.fieldServiceReports?.["1"]).toEqual(
          emailTranslationMock,
        );
        expect(store.translations.lifeAndMinistryMeeting?.["1"]).toEqual(
          emailTranslationMock,
        );
        expect(store.translations.other?.["1"]).toEqual(emailTranslationMock);
        expect(store.translations.persons?.["1"]).toEqual(emailTranslationMock);
        expect(store.translations.publicTalks?.["1"]).toEqual(
          emailTranslationMock,
        );
        expect(store.translations.schedules?.["1"]).toEqual(
          emailTranslationMock,
        );
        expect(store.translations.territory?.["1"]).toEqual(
          emailTranslationMock,
        );

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
