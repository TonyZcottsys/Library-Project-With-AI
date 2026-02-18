import type { Role } from "@/lib/auth/roles";

export type Permission =
  | "BOOK_ADD"
  | "BOOK_EDIT"
  | "BOOK_DELETE"
  | "BOOK_CHECKOUT"
  | "BOOK_CHECKIN"
  | "ADMIN_ANALYTICS";

const rolePermissions: Record<Role, Set<Permission>> = {
  ADMIN: new Set([
    "BOOK_ADD",
    "BOOK_EDIT",
    "BOOK_DELETE",
    "BOOK_CHECKOUT",
    "BOOK_CHECKIN",
    "ADMIN_ANALYTICS"
  ]),
  LIBRARIAN: new Set([
    "BOOK_ADD",
    "BOOK_CHECKOUT",
    "BOOK_CHECKIN"
  ]),
  MEMBER: new Set(["BOOK_CHECKOUT"])
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].has(permission);
}

export function canAccessRoute(role: Role, route: string): boolean {
  if (route.startsWith("/admin")) return hasPermission(role, "ADMIN_ANALYTICS");
  return true;
}

