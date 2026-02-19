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

export const emailGroupMock: EmailGroup = {
  input: emailMock,
  originals: emailMock,
  translations: emailTranslationMock,
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
