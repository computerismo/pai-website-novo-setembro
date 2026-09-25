import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

class BootstrapError extends Error {}

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || 'Administrator';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BootstrapError('Set a valid BOOTSTRAP_ADMIN_EMAIL for this one-time operation.');
  }
  if (
    !password ||
    password.length < 16 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    throw new BootstrapError('Set a 16-character BOOTSTRAP_ADMIN_PASSWORD with mixed character types.');
  }

  const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existingUser) {
    throw new BootstrapError('An account already exists for this address. No account was changed.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    },
    select: { id: true },
  });

  console.log('Bootstrap administrator created. Clear the one-time credentials from the environment.');
}

main()
  .catch((error: unknown) => {
    if (error instanceof BootstrapError) {
      console.error(error.message);
    } else {
      console.error('bootstrap_admin_failed');
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
