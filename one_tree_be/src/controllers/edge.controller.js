import { prisma } from "../config/prisma.js";

export async function getEdges(req, res) {
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
    const edges = await prisma.edge.findMany({
      where: { source: { branch: { userId } } },
    });
    res.json(edges);
  } catch (error) {
    console.error("Error fetching edges:", error);
    res.status(500).json({ error: "Failed to fetch edges." });
  }
}

export async function addEdge(req, res) {
  const { sourceId, targetId, type, label } = req.body;
  if (!sourceId || !targetId) {
    return res
      .status(400)
      .json({ error: "Source and target IDs are required." });
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
    const edge = await prisma.edge.create({
      data: {
        label: label || null,
        targetId,
        sourceId,
        type: type || "PROGRESSION",
      },
    });
    res.status(201).json(edge);
  } catch (error) {
    console.error("Error creating edge:", error);
    res.status(500).json({ error: "Failed to create edge." });
  }
}
