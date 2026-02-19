import { describe, expect, it } from "vitest";

import { literatureItemMock } from "../../mocks/literature";
import { typedKeys } from "./../../../app/utils/general";

describe("typedKeys", () => {
  it("should return the keys of the object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(typedKeys(obj)).toEqual(["a", "b", "c"]);
  });

  it("should return typed keys from mock objects", () => {
    const keys = typedKeys(literatureItemMock);
    expect(keys).toContain("id");
    expect(keys).toContain("title");
    expect(keys).toContain("categoryName");
  });
});
