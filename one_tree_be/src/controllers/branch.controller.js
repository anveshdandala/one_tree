import { prisma } from "../config/prisma.js";

export async function addBranch(req, res) {
  const { title, description, objective, color, icon, position } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }
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

export async function getBranches(req, res) {
  let dbUser;
  try {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: req.clerkUserId },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user." });
  }

  if (!dbUser) {
    return res.status(404).json({ error: "User not found." });
  }

  const userId = dbUser.id;
  try {
    const branches = await prisma.branch.findMany({
      where: { userId },
      include: {
        nodes: {
          include: {
            outgoingEdges: true,
            incomingEdges: true,
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: "Failed to fetch branches." });
  }
}

export async function addNode(req, res) {
  const branchId = req.params.branchId;
  const { title, description, content, order, position, completed } = req.body;

  if (!title || !branchId) {
    return res.status(400).json({ error: "Title and branchId are required." });
  }
  try {
    const node = await prisma.node.create({
      data: {
        branchId,
        title,
        description: description || null,
        content: content || null,
        order: order || 0,
        positionX: position?.x || 0,
        positionY: position?.y || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: completed ? new Date() : null,
        isCompleted: completed || false,
      },
    });
    res.status(201).json(node);
  } catch (error) {
    console.error("Error creating node:", error);
    res.status(500).json({ error: "Failed to create node." });
  }
}
