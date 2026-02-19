import { describe, expect, it } from "vitest";

import {
  emailGroups,
  stringifyEmail,
} from "../../app/utils/emails";

describe("emailGroups", () => {
  it("should have 8 groups", () => {
    expect(emailGroups).toHaveLength(8);
  });

  it("each group should have count, key, and label", () => {
    const keys = [
      "assignmentsAndDuties",
      "fieldServiceReports",
      "lifeAndMinistryMeeting",
      "other",
      "persons",
      "publicTalks",
      "schedules",
      "territory",
    ];
    expect(emailGroups.map((g) => g.key)).toEqual(keys);
    for (const group of emailGroups) {
      expect(group).toHaveProperty("count");
      expect(typeof group.count).toBe("number");
      expect(group).toHaveProperty("label");
      expect(typeof group.label).toBe("string");
    }
  });
});

describe("stringifyEmail", () => {
  it("should stringify email with text and title", () => {
    const email = { text: "Body", title: "Subject" };
    const result = stringifyEmail(email);
    expect(result).toBe(
      JSON.stringify(
        { text: "Body", title: "Subject" },
        null,
        2,
      ),
    );
  });

  it("should strip \\r from text and title", () => {
    const email = { text: "Line1\r\nLine2\r", title: "Subject\r" };
    const result = stringifyEmail(email);
    expect(result).toContain('"text": "Line1\\nLine2"');
    expect(result).toContain('"title": "Subject"');
  });

  it("should handle missing text and title", () => {
    const email = {};
    const result = stringifyEmail(email);
    expect(result).toBe(JSON.stringify({}, null, 2));
  });

  it("should handle empty strings", () => {
    const email = { text: "", title: "" };
    const result = stringifyEmail(email);
    expect(result).toBe(
      JSON.stringify(
        { text: "", title: "" },
        null,
        2,
      ),
    );
  });
});
