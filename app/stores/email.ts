export type Email = {
  text?: string;
  title?: string;
};

export type EmailGroup = {
  input: Email;
  originals: Email;
  translations: Email;
};

export type EmailKey = Prettify<keyof EmailState>;

export type EmailState = {
  assignmentsAndDuties: Partial<Record<number, EmailGroup>> | undefined;
  fieldServiceReports: Partial<Record<number, EmailGroup>> | undefined;
  lifeAndMinistryMeeting: Partial<Record<number, EmailGroup>> | undefined;
  other: Partial<Record<number, EmailGroup>> | undefined;
  persons: Partial<Record<number, EmailGroup>> | undefined;
  publicTalks: Partial<Record<number, EmailGroup>> | undefined;
  schedules: Partial<Record<number, EmailGroup>> | undefined;
  territory: Partial<Record<number, EmailGroup>> | undefined;
};

const VARIABLE_REGEX = /\[([A-Z0-9_]+)\]/g;

function extractVariables(template: string): string[] {
  const matches = template.matchAll(VARIABLE_REGEX);
  return [...matches].map((m) => m[1] ?? "").filter(Boolean);
}

function variablesMatch(original: string, translated: string): boolean {
  const origVars = extractVariables(original);
  const transVars = extractVariables(translated);

  if (origVars.length !== transVars.length) return false;

  const origSet = new Set(origVars);
  const transSet = new Set(transVars);

  for (const v of origSet) {
    if (!transSet.has(v)) return false;
  }
  return true;
}

export const useEmailStore = defineStore("email", {
  actions: {
    setInputs(
      inputs: Partial<
        Record<EmailKey, Partial<Record<number, Email>> | undefined>
      >,
    ) {
      typedKeys(inputs).forEach((g) => {
        if (!this[g]) this[g] = {};
        Object.keys(inputs[g]!).forEach((nr) => {
          if (!this[g]![Number(nr)])
            this[g]![Number(nr)] = {
              input: {},
              originals: {},
              translations: {},
            };
          const input = inputs[g]![Number(nr)] ?? {};

          this[g]! = {
            ...this[g]!,
            [Number(nr)]: {
              input,
              originals: this[g]![Number(nr)]?.originals ?? {},
              translations: this[g]![Number(nr)]?.translations ?? {},
            },
          };
        });
      });
    },
    setOriginals(
      originals: Partial<
        Record<EmailKey, Partial<Record<number, Email>> | undefined>
      >,
    ) {
      typedKeys(originals).forEach((g) => {
        if (!this[g]) this[g] = {};
        Object.keys(originals[g]!).forEach((nr) => {
          if (!this[g]![Number(nr)])
            this[g]![Number(nr)] = {
              input: {},
              originals: {},
              translations: {},
            };
          const newOriginals = originals[g]![Number(nr)] ?? {};

          this[g]! = {
            ...this[g]!,
            [Number(nr)]: {
              input: this[g]![Number(nr)]?.input ?? {},
              originals: newOriginals,
              translations: this[g]![Number(nr)]?.translations ?? {},
            },
          };
        });
      });
    },
    setTranslation(group: EmailKey, nr: number, translations: Email) {
      if (!this[group]) this[group] = {};
      this[group]![nr] = {
        input: this[group]![nr]?.input ?? {},
        originals: this[group]![nr]?.originals ?? {},
        translations,
      };
    },
    setTranslations(
      translations: Partial<
        Record<EmailKey, Partial<Record<number, Email>> | undefined>
      >,
      group?: EmailKey,
    ) {
      typedKeys(translations).forEach((g) => {
        if (group && g !== group) return;
        if (!this[g]) this[g] = {};
        Object.keys(translations[g]!).forEach((nr) => {
          if (!this[g]![Number(nr)])
            this[g]![Number(nr)] = {
              input: {},
              originals: {},
              translations: {},
            };
          const newTranslations = translations[g]![Number(nr)] ?? {};

          this[g]! = {
            ...this[g]!,
            [Number(nr)]: {
              input: this[g]![Number(nr)]?.input ?? {},
              originals: this[g]![Number(nr)]?.originals ?? {},
              translations: newTranslations,
            },
          };
        });
      });
    },
  },
  getters: {
    inconsistencies(
      state,
    ): Record<EmailKey, Partial<Record<number, Email>> | undefined> {
      return {
        assignmentsAndDuties: state.assignmentsAndDuties
          ? Object.fromEntries(
              Object.entries(state.assignmentsAndDuties)
                .map(([key, group]): [string, Email | undefined] => [
                  key,
                  group?.originals,
                ])
                .filter(
                  ([key, mail]) =>
                    !variablesMatch(
                      mail?.text ?? "",
                      state.assignmentsAndDuties?.[+key]?.translations?.text ??
                        "",
                    ),
                ),
            )
          : undefined,
        fieldServiceReports: state.fieldServiceReports
          ? Object.fromEntries(
              Object.entries(state.fieldServiceReports)
                .map(([key, group]): [string, Email | undefined] => [
                  key,
                  group?.originals,
                ])
                .filter(
                  ([key, mail]) =>
                    !variablesMatch(
                      mail?.text ?? "",
                      state.fieldServiceReports?.[+key]?.translations?.text ??
                        "",
                    ),
                ),
            )
          : undefined,
        lifeAndMinistryMeeting: state.lifeAndMinistryMeeting
          ? Object.fromEntries(
              Object.entries(state.lifeAndMinistryMeeting)
                .map(([key, group]): [string, Email | undefined] => [
                  key,
                  group?.originals,
                ])
                .filter(
                  ([key, mail]) =>
                    !variablesMatch(
                      mail?.text ?? "",
                      state.lifeAndMinistryMeeting?.[+key]?.translations
                        ?.text ?? "",
                    ),
                ),
            )
          : undefined,
        other: state.other
          ? Object.fromEntries(
              Object.entries(state.other)
                .map(([key, group]): [string, Email | undefined] => [
                  key,
                  group?.originals,
                ])
                .filter(
                  ([key, mail]) =>
                    !variablesMatch(
                      mail?.text ?? "",
                      state.other?.[+key]?.translations?.text ?? "",
                    ),
                ),
            )
          : undefined,
        persons: state.persons
          ? Object.fromEntries(
              Object.entries(state.persons)
                .map(([key, group]): [string, Email | undefined] => [
                  key,
                  group?.originals,
                ])
                .filter(
                  ([key, mail]) =>
                    !variablesMatch(
                      mail?.text ?? "",
                      state.persons?.[+key]?.translations?.text ?? "",
                    ),
                ),
            )
          : undefined,
        publicTalks: state.publicTalks
          ? Object.fromEntries(
              Object.entries(state.publicTalks)
                .map(([key, group]): [string, Email | undefined] => [
                  key,
                  group?.originals,
                ])
                .filter(
                  ([key, mail]) =>
                    !variablesMatch(
                      mail?.text ?? "",
                      state.publicTalks?.[+key]?.translations?.text ?? "",
                    ),
                ),
            )
          : undefined,
        schedules: state.schedules
          ? Object.fromEntries(
              Object.entries(state.schedules)
                .map(([key, group]): [string, Email | undefined] => [
                  key,
                  group?.originals,
                ])
                .filter(
                  ([key, mail]) =>
                    !variablesMatch(
                      mail?.text ?? "",
                      state.schedules?.[+key]?.translations?.text ?? "",
                    ),
                ),
            )
          : undefined,
        territory: state.territory
          ? Object.fromEntries(
              Object.entries(state.territory)
                .map(([key, group]): [string, Email | undefined] => [
                  key,
                  group?.originals,
                ])
                .filter(
                  ([key, mail]) =>
                    !variablesMatch(
                      mail?.text ?? "",
                      state.territory?.[+key]?.translations?.text ?? "",
                    ),
                ),
            )
          : undefined,
      };
    },
    inputs(
      state,
    ): Record<EmailKey, Partial<Record<number, Email>> | undefined> {
      return {
        assignmentsAndDuties: state.assignmentsAndDuties
          ? Object.fromEntries(
              Object.entries(state.assignmentsAndDuties).map(([key, group]) => [
                key,
                group?.input,
              ]),
            )
          : undefined,
        fieldServiceReports: state.fieldServiceReports
          ? Object.fromEntries(
              Object.entries(state.fieldServiceReports).map(([key, group]) => [
                key,
                group?.input,
              ]),
            )
          : undefined,
        lifeAndMinistryMeeting: state.lifeAndMinistryMeeting
          ? Object.fromEntries(
              Object.entries(state.lifeAndMinistryMeeting).map(
                ([key, group]) => [key, group?.input],
              ),
            )
          : undefined,
        other: state.other
          ? Object.fromEntries(
              Object.entries(state.other).map(([key, group]) => [
                key,
                group?.input,
              ]),
            )
          : undefined,
        persons: state.persons
          ? Object.fromEntries(
              Object.entries(state.persons).map(([key, group]) => [
                key,
                group?.input,
              ]),
            )
          : undefined,
        publicTalks: state.publicTalks
          ? Object.fromEntries(
              Object.entries(state.publicTalks).map(([key, group]) => [
                key,
                group?.input,
              ]),
            )
          : undefined,
        schedules: state.schedules
          ? Object.fromEntries(
              Object.entries(state.schedules).map(([key, group]) => [
                key,
                group?.input,
              ]),
            )
          : undefined,
        territory: state.territory
          ? Object.fromEntries(
              Object.entries(state.territory).map(([key, group]) => [
                key,
                group?.input,
              ]),
            )
          : undefined,
      };
    },
    originals(
      state,
    ): Record<EmailKey, Partial<Record<number, Email>> | undefined> {
      return {
        assignmentsAndDuties: state.assignmentsAndDuties
          ? Object.fromEntries(
              Object.entries(state.assignmentsAndDuties).map(([key, group]) => [
                key,
                group?.originals,
              ]),
            )
          : undefined,
        fieldServiceReports: state.fieldServiceReports
          ? Object.fromEntries(
              Object.entries(state.fieldServiceReports).map(([key, group]) => [
                key,
                group?.originals,
              ]),
            )
          : undefined,
        lifeAndMinistryMeeting: state.lifeAndMinistryMeeting
          ? Object.fromEntries(
              Object.entries(state.lifeAndMinistryMeeting).map(
                ([key, group]) => [key, group?.originals],
              ),
            )
          : undefined,
        other: state.other
          ? Object.fromEntries(
              Object.entries(state.other).map(([key, group]) => [
                key,
                group?.originals,
              ]),
            )
          : undefined,
        persons: state.persons
          ? Object.fromEntries(
              Object.entries(state.persons).map(([key, group]) => [
                key,
                group?.originals,
              ]),
            )
          : undefined,
        publicTalks: state.publicTalks
          ? Object.fromEntries(
              Object.entries(state.publicTalks).map(([key, group]) => [
                key,
                group?.originals,
              ]),
            )
          : undefined,
        schedules: state.schedules
          ? Object.fromEntries(
              Object.entries(state.schedules).map(([key, group]) => [
                key,
                group?.originals,
              ]),
            )
          : undefined,
        territory: state.territory
          ? Object.fromEntries(
              Object.entries(state.territory).map(([key, group]) => [
                key,
                group?.originals,
              ]),
            )
          : undefined,
      };
    },
    translations(
      state,
    ): Record<EmailKey, Partial<Record<number, Email>> | undefined> {
      return {
        assignmentsAndDuties: state.assignmentsAndDuties
          ? Object.fromEntries(
              Object.entries(state.assignmentsAndDuties).map(([key, group]) => [
                key,
                group?.translations,
              ]),
            )
          : undefined,
        fieldServiceReports: state.fieldServiceReports
          ? Object.fromEntries(
              Object.entries(state.fieldServiceReports).map(([key, group]) => [
                key,
                group?.translations,
              ]),
            )
          : undefined,
        lifeAndMinistryMeeting: state.lifeAndMinistryMeeting
          ? Object.fromEntries(
              Object.entries(state.lifeAndMinistryMeeting).map(
                ([key, group]) => [key, group?.translations],
              ),
            )
          : undefined,
        other: state.other
          ? Object.fromEntries(
              Object.entries(state.other).map(([key, group]) => [
                key,
                group?.translations,
              ]),
            )
          : undefined,
        persons: state.persons
          ? Object.fromEntries(
              Object.entries(state.persons).map(([key, group]) => [
                key,
                group?.translations,
              ]),
            )
          : undefined,
        publicTalks: state.publicTalks
          ? Object.fromEntries(
              Object.entries(state.publicTalks).map(([key, group]) => [
                key,
                group?.translations,
              ]),
            )
          : undefined,
        schedules: state.schedules
          ? Object.fromEntries(
              Object.entries(state.schedules).map(([key, group]) => [
                key,
                group?.translations,
              ]),
            )
          : undefined,
        territory: state.territory
          ? Object.fromEntries(
              Object.entries(state.territory).map(([key, group]) => [
                key,
                group?.translations,
              ]),
            )
          : undefined,
      };
    },
  },
  persist: true,
  state: (): EmailState => ({
    assignmentsAndDuties: undefined,
    fieldServiceReports: undefined,
    lifeAndMinistryMeeting: undefined,
    other: undefined,
    persons: undefined,
    publicTalks: undefined,
    schedules: undefined,
    territory: undefined,
  }),
});
