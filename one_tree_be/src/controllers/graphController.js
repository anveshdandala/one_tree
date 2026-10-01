import { prisma } from "../config/prisma.js";

function normalizeNodeId(id) {
  if (typeof id !== "string") {
    return null;
  }

  if (id.startsWith("node-")) {
    return id.slice(5);
  }

  if (id.startsWith("branch-")) {
    return id.slice(7);
  }

  return id;
}

async function saveEdges(edges, nodeIds) {
  const normalizedEdges = edges
    .map((edge) => ({
      sourceId: normalizeNodeId(edge.source),
      targetId: normalizeNodeId(edge.target),
      label: edge.label ?? null,
      type: edge.type ?? "PROGRESSION",
    }))
    .filter((edge) => edge.sourceId && edge.targetId);

  await prisma.edge.deleteMany({
    where: {
      OR: [{ sourceId: { in: nodeIds } }, { targetId: { in: nodeIds } }],
    },
  });

  if (normalizedEdges.length === 0) {
    return 0;
  }

  await prisma.edge.createMany({
    data: normalizedEdges,
    skipDuplicates: true,
  });

  return normalizedEdges.length;
}

export async function saveGraph(req, res) {
  const graphData = req.body.graphData ?? req.body;
  const nodes = Array.isArray(graphData?.nodes) ? graphData.nodes : [];
  const edges = Array.isArray(graphData?.edges) ? graphData.edges : [];

  if (nodes.length === 0) {
    return res.status(400).json({ error: "No nodes provided." });
  }

  try {
    await Promise.all(
      nodes.map((node) =>
        prisma.node.upsert({
          where: { id: node.id },
          update: {
            title: node.title,
            description: node.description ?? null,
            content: node.content ?? null,
            positionX: Number(node.positionX) || 0,
            positionY: Number(node.positionY) || 0,
            isCompleted: Boolean(node.isCompleted),
            order: Number(node.order) || 0,
            branchId: node.branchId,
          },
          create: {
            id: node.id,
            branchId: node.branchId,
            title: node.title,
            description: node.description ?? null,
            content: node.content ?? null,
            positionX: Number(node.positionX) || 0,
            positionY: Number(node.positionY) || 0,
            isCompleted: Boolean(node.isCompleted),
            order: Number(node.order) || 0,
          },
        }),
      ),
    );

    const nodeIds = nodes
      .map((node) => normalizeNodeId(node.id))
      .filter(Boolean);
    const edgeCount = await saveEdges(edges, nodeIds);

    return res.json({
      message: "Graph data received successfully!",
      nodes: nodes.length,
      edges: edgeCount,
    });
  } catch (error) {
    console.error("Error saving graph data:", error);
    return res.status(500).json({ error: "Failed to save graph data." });
  }
}

export async function updateNodePositions(req, res) {
  const updates = Array.isArray(req.body?.updates) ? req.body.updates : [];

  if (updates.length === 0) {
    return res.status(400).json({ error: "No position updates provided." });
  }

  try {
    const results = await Promise.all(
      updates.map(async (update) => {
        const id = normalizeNodeId(update.id);
        if (!id) {
          return null;
        }

        const data = {
          positionX: Number(update.x) || 0,
          positionY: Number(update.y) || 0,
        };

        if (update.kind === "branch") {
          return prisma.branch.update({ where: { id }, data });
        }

        return prisma.node.update({ where: { id }, data });
      }),
    );

    return res.json({ updated: results.filter(Boolean).length });
  } catch (error) {
    console.error("Error updating node positions:", error);
    return res.status(500).json({ error: "Failed to update node positions." });
  }
}

export async function createEdge(req, res) {
  const rawSourceId = req.body?.sourceId;
  const rawTargetId = req.body?.targetId;

  if (
    (typeof rawSourceId === "string" && rawSourceId.startsWith("branch-")) ||
    (typeof rawTargetId === "string" && rawTargetId.startsWith("branch-"))
  ) {
    return res.status(400).json({
      error: "Branch headers cannot be connected as edges.",
    });
  }

  const sourceId = normalizeNodeId(rawSourceId);
  const targetId = normalizeNodeId(rawTargetId);
  const type = req.body?.type ?? "PROGRESSION";
  const label = req.body?.label ?? null;

  if (!sourceId || !targetId) {
    return res.status(400).json({ error: "Source and target are required." });
  }

  try {
    const [sourceNode, targetNode] = await Promise.all([
      prisma.node.findUnique({ where: { id: sourceId } }),
      prisma.node.findUnique({ where: { id: targetId } }),
    ]);

    if (!sourceNode || !targetNode) {
      return res
        .status(404)
        .json({ error: "Source or target node not found." });
    }

    const existingEdge = await prisma.edge.findFirst({
      where: { sourceId, targetId },
    });

    const edge = existingEdge
      ? await prisma.edge.update({
          where: { id: existingEdge.id },
          data: { type, label },
        })
      : await prisma.edge.create({
          data: { sourceId, targetId, type, label },
        });

    return res.status(existingEdge ? 200 : 201).json(edge);
  } catch (error) {
    console.error("Error creating edge:", error);
    return res.status(500).json({ error: "Failed to create edge." });
  }
}
