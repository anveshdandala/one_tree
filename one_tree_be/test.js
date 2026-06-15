import "dotenv/config";
import { prisma } from "./src/config/prisma.js";

async function main() {
  try {
    const result = await prisma.user.findMany();
    console.log("Database model query successful:", result);
  } catch (error) {
    console.error("Database query failed:", error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());


