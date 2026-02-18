export const roles = ["ADMIN", "LIBRARIAN", "MEMBER"] as const;
export type Role = (typeof roles)[number];

