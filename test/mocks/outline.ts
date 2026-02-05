import type { Outline, Outlines } from "../../app/utils/schemas";

export const emptyOutlineMock: Outline = {
  number: 1,
  updated: "mm/yy",
};

export const outlineMock: Outline = {
  number: 1,
  title: "Title",
  updated: "mm/yy",
};

export const outlineWithNotesMock: Outline = {
  notes: "Notes",
  number: 2,
  title: "Title",
  updated: "mm/yy",
};

export const outlinesMock: Outlines = [
  emptyOutlineMock,
  outlineMock,
  outlineWithNotesMock,
];
