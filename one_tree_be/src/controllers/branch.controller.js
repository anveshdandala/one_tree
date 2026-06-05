import { prisma } from "../config/prisma.js";

export async function addBranch(req, res) {
  const { title, description, objective, color, icon, position } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }
  console.log("Creating branch with data:", req.body);
  console.log("Authenticated user ID:", req.clerkUserId);
  let dbUser;
  try {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: req.clerkUserId },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user." });
  }

  if (!dbUser)
    return res.status(404).json({ error: "User not found. Call /sync first." });

  const userId = dbUser.id;
  console.log("Creating branch for local user ID:", userId);
  try {
    const branch = await prisma.branch.create({
      data: {
        userId,
        title,
        description: description || null,
        objective: objective || null,
        color: color || null,
        icon: icon || null,
        positionX: position?.x || 0,
        positionY: position?.y || 0,
      },
    });

    res.status(201).json(branch);
  } catch (error) {
    console.error("Error creating branch:", error);
    res.status(500).json({ error: "Failed to create branch." });
  }
}
