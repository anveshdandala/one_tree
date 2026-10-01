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

export async function getBranches(req, res) {
  try {
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: req.clerkUserId },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { clerkId: req.clerkUserId },
      });
    }

    const branches = await prisma.branch.findMany({
      where: { userId: dbUser.id },
      include: {
        nodes: {
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

export async function addNodeToBranch(req, res) {
  const { branchId } = req.params;
  const { title, description, content, order, isCompleted } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }

  try {
    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      return res.status(404).json({ error: "Branch not found." });
    }

    const node = await prisma.node.create({
      data: {
        branchId,
        title,
        description: description || null,
        content: content || null,
        order: Number(order) || 0,
        isCompleted: Boolean(isCompleted),
      },
    });

    res.status(201).json(node);
  } catch (error) {
    console.error("Error creating node:", error);
    res.status(500).json({ error: "Failed to create node." });
  }
}

export async function toggleNode(req, res) {
  const { nodeId } = req.params;

  try {
    const node = await prisma.node.findUnique({
      where: { id: nodeId },
    });

    if (!node) {
      return res.status(404).json({ error: "Node not found." });
    }

    const updated = await prisma.node.update({
      where: { id: nodeId },
      data: {
        isCompleted: !node.isCompleted,
        completedAt: !node.isCompleted ? new Date() : null,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Error toggling node:", error);
    res.status(500).json({ error: "Failed to toggle node." });
  }
}

