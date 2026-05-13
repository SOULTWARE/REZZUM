import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run the REZZUM seed.");
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const owner = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!owner) {
    console.log("No users found. Workspace defaults will be created on first authenticated access.");
    return;
  }

  await prisma.workspaceSettings.upsert({
    where: { userId: owner.id },
    update: {},
    create: {
      userId: owner.id,
      defaultLanguage: "English",
      defaultFeel: "Professional",
      defaultStyle: "",
      defaultAutoPublishIntervalMinutes: null,
    },
  });

  console.log("Seeded REZZUM workspace defaults.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
