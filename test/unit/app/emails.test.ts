import { describe, expect, it } from "vitest";

import { emailGroups, stringifyEmail } from "../../../app/utils/emails";
import {
  assignmentsAndDutiesEnEmail,
  emailMock,
  emailWithCarriageReturnMock,
  emptyEmailMock,
  undefinedEmailMock,
} from "../../mocks/email";

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
    const result = stringifyEmail(emailMock);
    expect(result).toBe(
      JSON.stringify({ text: emailMock.text, title: emailMock.title }, null, 2),
    );
  });

  it("should strip \\r from text and title", () => {
    const result = stringifyEmail(emailWithCarriageReturnMock);
    expect(result).toContain('"text": "Line1\\nLine2"');
    expect(result).toContain('"title": "Subject"');
  });

  it("should handle missing text and title", () => {
    const result = stringifyEmail(undefinedEmailMock);
    expect(result).toBe(JSON.stringify({}, null, 2));
  });

  it("should handle empty strings", () => {
    const result = stringifyEmail(emptyEmailMock);
    expect(result).toBe(JSON.stringify({ text: "", title: "" }, null, 2));
  });

  it("should stringify real-world Assignments Reminder email", () => {
    const result = stringifyEmail(assignmentsAndDutiesEnEmail);
    expect(result).toContain("[TO_GENDER_TITLE]");
    expect(result).toContain("[CLM_ASSIGNMENTS_ALL]");
    expect(result).toContain("Assignments Reminder (CLM-All)");
  });
});
