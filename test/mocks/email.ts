import type { Email, EmailGroup } from "../../app/stores/email";

export const emailMock: Email = {
  text: "Hello, [NAME]",
  title: "Greeting",
};

export const emailTranslationMock: Email = {
  text: "Hallo, [NAME]",
  title: "Begroeting",
};

export const emptyEmailMock: Email = {
  text: "",
  title: "",
};

export const undefinedEmailMock: Email = {};

/** Real-world style: Assignments Reminder (CLM-All) - English */
export const assignmentsAndDutiesEnEmail: Email = {
  text: `Dear [TO_GENDER_TITLE] [TO_LAST_NAME],

This is a friendly reminder that you have the following Life and Ministry Meeting Assignments:

[CLM_ASSIGNMENTS_ALL]

If you have any questions or problems regarding these assignments, please reply to this email.

Kind Regards,
[SENDER_NAME]`,
  title: "Assignments Reminder (CLM-All)",
};

/** Real-world style: Toewijzing herinnering (LED-Alle) - Dutch, same variables */
export const assignmentsAndDutiesNlEmail: Email = {
  text: `Beste [TO_GENDER_TITLE] [TO_LAST_NAME],

Dit is een vriendelijke herinnering dat je de volgende toewijzing(en) voor de leven-en-dienenvergadering hebt:

[CLM_ASSIGNMENTS_ALL]

Als je hierover vragen hebt kun je contact met mij opnemen.

Met vriendelijke groet,
[SENDER_NAME]`,
  title: "Toewijzing herinnering (LED-Alle)",
};

/** Same variables as original but wrong translation variable */
export const emailWithWrongVariableMock: Email = {
  text: "Hallo [OTHER], welkom!",
  title: "Begroeting",
};

export const emailGroupMock: EmailGroup = {
  input: emailTranslationMock,
  originals: emailMock,
  translations: emailTranslationMock,
};

export const assignmentsAndDutiesGroupMock: EmailGroup = {
  input: assignmentsAndDutiesNlEmail,
  originals: assignmentsAndDutiesEnEmail,
  translations: assignmentsAndDutiesNlEmail,
};

export const emptyEmailGroupMock: EmailGroup = {
  input: emptyEmailMock,
  originals: emailMock,
  translations: emptyEmailMock,
};

export const undefinedEmailGroupMock: EmailGroup = {
  input: undefinedEmailMock,
  originals: emailMock,
  translations: undefinedEmailMock,
};
