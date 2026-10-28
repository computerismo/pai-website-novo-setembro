
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'sergio@oespdental.com.br';
  const password = 'jpgkl1'; 
  const name = 'Dr. Sérgio';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        name,
        role: 'admin',
      },
      create: {
        email,
        name,
        password: hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      },
    });

console.log(`
✅ Admin user upserted successfully:
-----------------------------------
Email:    ${email}
Role:     admin
-----------------------------------
You can now log in at /admin
    `);

  } catch (e) {
    console.error('Error creating admin user:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
