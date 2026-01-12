const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Found users:", users.length);
    users.forEach((user) => {
      console.log(
        `- Email: ${user.email}, Role: ${user.role}, ID: ${
          user.id
        }, Password (hashed): ${user.password ? "Yes" : "No"}`
      );
    });
  } catch (e) {
    console.error("Error fetching users:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
