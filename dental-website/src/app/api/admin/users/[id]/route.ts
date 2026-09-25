import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiUpdateUserSchema } from "@/lib/validations/userSchemas";
import { authorizeApi } from "@/lib/security/authorization";
import { readJsonBody, RequestBodyError } from "@/lib/security/request-body";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const idSchema = z.string().min(1).max(128);

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const access = await authorizeApi("users");
  if (!access.ok) return access.response;

  const parsedId = idSchema.safeParse((await params).id);
  if (!parsedId.success) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: parsedId.data },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
    });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    console.error("admin_user_read_failed");
    return NextResponse.json({ error: "Unable to read user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const access = await authorizeApi("users");
  if (!access.ok) return access.response;

  const parsedId = idSchema.safeParse((await params).id);
  if (!parsedId.success) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    const body = await readJsonBody<unknown>(request, 16 * 1024);
    const validation = apiUpdateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid user data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { id: parsedId.data } });
    if (!existingUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { name, email, password, role } = validation.data;
    if (email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
      if (emailExists) {
        return NextResponse.json({ error: "Unable to update user" }, { status: 409 });
      }
    }

    const updateData: { name: string; email: string; role: string; password?: string } = {
      name,
      email,
      role,
    };
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id: parsedId.data },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("admin_user_update_failed");
    return NextResponse.json({ error: "Unable to update user" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const access = await authorizeApi("users");
  if (!access.ok) return access.response;

  const parsedId = idSchema.safeParse((await params).id);
  if (!parsedId.success) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (access.user.id === parsedId.data) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 403 });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: parsedId.data }, select: { id: true } });
    if (!existingUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.user.delete({ where: { id: parsedId.data } });
    return NextResponse.json({ message: "User deleted" });
  } catch {
    console.error("admin_user_delete_failed");
    return NextResponse.json({ error: "Unable to delete user" }, { status: 500 });
  }
}
