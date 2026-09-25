import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiCreateUserSchema } from "@/lib/validations/userSchemas";
import { authorizeApi } from "@/lib/security/authorization";
import { readJsonBody, RequestBodyError } from "@/lib/security/request-body";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const access = await authorizeApi("users");
    if (!access.ok) return access.response;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json(users);
  } catch {
    console.error("admin_user_list_failed");
    return NextResponse.json({ error: "Unable to list users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const access = await authorizeApi("users");
    if (!access.ok) return access.response;

    const body = await readJsonBody<unknown>(request, 16 * 1024);
    const validation = apiCreateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid user data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, role } = validation.data;
    const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existingUser) {
      return NextResponse.json({ error: "Unable to create user" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, emailVerified: new Date() },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("admin_user_create_failed");
    return NextResponse.json({ error: "Unable to create user" }, { status: 500 });
  }
}
