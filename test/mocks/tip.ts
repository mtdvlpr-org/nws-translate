import type { Tip, Tips } from "../../app/utils/schemas";

export const tipMock: Tip = {
  heading: "Heading",
  text: "Text",
  url: "https://example.com/1",
};

export const tipMock2: Tip = {
  heading: "Heading 2",
  text: "Text 2",
  url: "https://example.com/2",
};

export const tipsMock: Tips = [tipMock, tipMock2];
