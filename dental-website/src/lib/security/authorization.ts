import "server-only";

import { notFound, redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessArea, getAccessFailureStatus, type AdminArea } from "./role-policy";

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function authorizeApi(area: AdminArea) {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (getAccessFailureStatus(user.role, area) === 403) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true as const, user };
}

export async function requirePageAccess(area: AdminArea): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!canAccessArea(user.role, area)) notFound();
  return user;
}

export async function authorizeServerAction(area: AdminArea) {
  const user = await getCurrentUser();
  return user && canAccessArea(user.role, area) ? user : null;
}
