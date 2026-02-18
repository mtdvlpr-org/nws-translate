export const emailGroups: { count: number; key: EmailKey; label: string }[] = [
  { count: 9, key: "assignmentsAndDuties", label: "Toewijzingen en taken" },
  { count: 6, key: "fieldServiceReports", label: "Velddienstrapporten" },
  { count: 3, key: "lifeAndMinistryMeeting", label: "LED-vergadering" },
  { count: 3, key: "other", label: "Overig" },
  { count: 6, key: "persons", label: "Personen" },
  { count: 11, key: "publicTalks", label: "Openbare lezingen" },
  { count: 2, key: "schedules", label: "Schema's" },
  { count: 3, key: "territory", label: "Gebied" },
] as const;

export const stringifyEmail = (email: Email): string => {
  return JSON.stringify(
    {
      text: email.text?.replace(/\r/g, ""),
      title: email.title?.replace(/\r/g, ""),
    },
    null,
    2,
  );
};
