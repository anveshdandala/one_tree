import "dotenv/config";

console.log("DB URL exists:", !!process.env.DATABASE_URL);

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT 1`;
  console.log(result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
