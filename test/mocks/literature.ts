import type { Literature, LiteratureItem } from "../../app/utils/schemas";

export const literatureItemMock: LiteratureItem = {
  categoryName: "CategoryName",
  id: 1,
  itemNumber: "1",
  symbol: "s",
  title: "Title",
};

export const emptyLiteratureItemMock: LiteratureItem = {
  categoryName: "Other",
  id: 2,
  itemNumber: "",
  symbol: "",
  title: "Title",
};

export const literatureMock: Literature = [
  literatureItemMock,
  emptyLiteratureItemMock,
];
