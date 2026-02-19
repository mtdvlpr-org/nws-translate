import { describe, expect, it } from "vitest";

import { capitalize } from "../../../shared/utils/general";

describe("capitalize", () => {
  it("should capitalize the first character", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("should leave already capitalized string unchanged", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it("should handle single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("should handle empty string", () => {
    expect(capitalize("")).toBe("");
  });
});
