export type AppRole = "admin" | "editor" | "viewer";

export type AdminArea =
  | "dashboard"
  | "leads"
  | "analytics"
  | "users"
  | "content";

const ROLE_AREAS: Record<AppRole, readonly AdminArea[]> = {
  admin: ["dashboard", "leads", "analytics", "users", "content"],
  editor: ["content"],
  // Viewer access stays disabled until the owner approves specific read areas.
  viewer: [],
};

export function isAppRole(role: unknown): role is AppRole {
  return role === "admin" || role === "editor" || role === "viewer";
}

export function canAccessArea(role: unknown, area: AdminArea): boolean {
  return isAppRole(role) && ROLE_AREAS[role].includes(area);
}

export function getAccessFailureStatus(role: unknown, area: AdminArea): 401 | 403 | null {
  if (role === null || role === undefined) return 401;
  return canAccessArea(role, area) ? null : 403;
}
