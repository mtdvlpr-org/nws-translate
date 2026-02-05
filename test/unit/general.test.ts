import { describe, expect, it } from "vitest";

import { typedKeys } from "./../../app/utils/general";

describe("typedKeys", () => {
  it("should return the keys of the object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(typedKeys(obj)).toEqual(["a", "b", "c"]);
  });
});
