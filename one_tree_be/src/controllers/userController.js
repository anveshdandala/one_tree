import { prisma } from "../config/prisma.js";
export async function syncUser(req, res) {
  const { clerkUserId } = req; // from middleware

  const user = await prisma.user.upsert({
    where: { clerkId: clerkUserId },
    update: { lastSeenAt: new Date() },
    create: { clerkId: clerkUserId },
    include: {
      branches: {
        include: {
          nodes: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  res.json({ id: user.id, branches: user.branches });
}
