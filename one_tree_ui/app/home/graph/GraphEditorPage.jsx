"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Handle,
  Position,
} from "@xyflow/react";
import { Plus, X } from "lucide-react";
import "@xyflow/react/dist/style.css";

const ACCENT_COLORS = [
  { name: "Sky Blue", hex: "#3b82f6" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Amethyst", hex: "#a855f7" },
  { name: "Amber Orange", hex: "#f59e0b" },
  { name: "Crimson Rose", hex: "#f43f5e" },
];

function branchesToFlow(branches, edges) {
  const flowNodes = [];
  const flowEdges = [];

  if (!branches || !Array.isArray(branches)) return { flowNodes, flowEdges };

  branches.forEach((branch, branchIndex) => {
    const branchX = branchIndex * 420;
    const branchY = 0;
    const branchNodes = [...(branch.nodes || [])];

    const hasPersistedEdges = edges.some(
      (edge) =>
        edge.sourceId.includes(branch.id) ||
        branchNodes.some((n) => n.id === edge.sourceId),
    );

    flowNodes.push({
      id: `branch-${branch.id}`,
      type: "branchHeader",
      position: { x: branchX, y: branchY },
      draggable: true,
      data: {
        branch,
        onAddNode: null,
      },
    });

    branchNodes.forEach((node, nodeIndex) => {
      const nodeId = `node-${node.id}`;
      flowNodes.push({
        id: nodeId,
        position: {
          x: branchX,
          y: branchY + 110 + nodeIndex * 130,
        },
        data: {
          node,
          branch,
        },
        type: "stepNode",
      });

      const matchingEdges = edges.filter((e) => e.sourceId === node.id);
      matchingEdges.forEach((edge) => {
        const isAnimated = node.isCompleted;
        flowEdges.push({
          id: `e-${edge.id}`,
          source: `node-${edge.sourceId}`,
          target: edge.targetId.startsWith("node-")
            ? edge.targetId
            : `node-${edge.targetId}`,
          type: "smoothstep",
          animated: isAnimated,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: {
            stroke: isAnimated
              ? branch.color || "#3b82f6"
              : "rgba(255, 255, 255, 0.15)",
            strokeWidth: isAnimated ? 2 : 1.2,
          },
        });
      });

      if (!hasPersistedEdges) {
        if (nodeIndex === 0) {
          flowEdges.push({
            id: `e-branch-${branch.id}-${node.id}`,
            source: `branch-${branch.id}`,
            target: nodeId,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "rgba(255, 255, 255, 0.15)", strokeWidth: 1.2 },
          });
        } else {
          const prevNodeId = `node-${branchNodes[nodeIndex - 1].id}`;
          const isPrevCompleted = branchNodes[nodeIndex - 1].isCompleted;
          flowEdges.push({
            id: `e-${prevNodeId}-${nodeId}`,
            source: prevNodeId,
            target: nodeId,
            type: "smoothstep",
            animated: isPrevCompleted,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: {
              stroke: isPrevCompleted
                ? branch.color || "#3b82f6"
                : "rgba(255, 255, 255, 0.15)",
              strokeWidth: isPrevCompleted ? 2 : 1.2,
            },
          });
        }
      }
    });
  });

  return { flowNodes, flowEdges };
}

function BranchHeaderNode({ data }) {
  const { branch, onAddNode } = data;
  return (
    <div
      className="min-w-64 border-2 bg-canvas-card px-4 py-3 shadow-lg select-none text-left"
      style={{ borderColor: branch.color || "#3b82f6" }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-zinc-500 !rounded-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-canvas-text truncate max-w-[180px]">
          {branch.title}
        </span>
        <button
          type="button"
          onClick={() => onAddNode?.(branch.id)}
          className="flex h-5 w-5 items-center justify-center border border-canvas-border hover:border-canvas-text text-canvas-muted hover:text-canvas-text font-bold text-xs bg-canvas-secondary transition-all active:scale-95 cursor-pointer"
          title="Add step node to branch"
        >
          <span>+</span>
        </button>
      </div>
      <p className="mt-1.5 font-mono text-[8px] uppercase tracking-wider text-canvas-muted">
        {branch.objective || "Pathway Branch Headquarters"}
      </p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-zinc-500 !rounded-none"
      />
    </div>
  );
}

function StepNode({ data }) {
  const { node, branch, onToggle, onClick } = data;
  return (
    <div
      onClick={() => onClick?.(node.id)}
      className="min-w-60 border border-canvas-border bg-canvas-card px-4 py-3 shadow-md hover:border-canvas-border-strong transition-all cursor-pointer select-none text-left"
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-zinc-600 !rounded-none"
      />
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rotate-45"
          style={{ background: branch.color || "#3b82f6" }}
        />
        <span className="text-[11px] font-bold uppercase tracking-wide text-canvas-text flex-1 truncate">
          {node.title}
        </span>
      </div>
      {node.description && (
        <p className="mt-1.5 text-[10px] leading-relaxed text-canvas-muted line-clamp-2">
          {node.description}
        </p>
      )}
      <div
        className="mt-3 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={!!node.isCompleted}
            onChange={() => onToggle?.(node.id)}
            className="h-3.5 w-3.5 border border-canvas-border rounded bg-canvas-secondary text-purple-500 focus:ring-purple-400 cursor-pointer"
          />
          <span className="font-mono text-[8.5px] uppercase tracking-wide text-canvas-muted font-bold">
            {node.isCompleted ? "completed" : "pending"}
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-zinc-600 !rounded-none"
      />
    </div>
  );
}

const nodeTypes = {
  branchHeader: BranchHeaderNode,
  stepNode: StepNode,
};

export default function HomeGraph({
  branches = [],
  edges = [],
  onToggleNode,
  onSelectNode,
  onAddBranch,
  onAddNodeToBranch,
  onConnectEdges,
  onNodesDragStop,
}) {
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [newBranchTitle, setNewBranchTitle] = useState("");
  const [newBranchColor, setNewBranchColor] = useState(ACCENT_COLORS[0].hex);
  const [firstNodeTitle, setFirstNodeTitle] = useState("");

  const [nodeDraft, setNodeDraft] = useState({
    branchId: null,
    title: "",
    description: "",
    content: "",
  });

  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [nodeCreateError, setNodeCreateError] = useState("");

  const { flowNodes: initialFlowNodes, flowEdges: initialFlowEdges } = useMemo(
    () => branchesToFlow(branches, edges),
    [branches, edges],
  );

  const [nodes, setNodes] = useState(initialFlowNodes);
  const [flowEdges, setFlowEdges] = useState(initialFlowEdges);

  useEffect(() => {
    setNodes(initialFlowNodes);
    setFlowEdges(initialFlowEdges);
  }, [initialFlowNodes, initialFlowEdges]);

  const handleNodesDragStop = useCallback(
    (updates) => {
      if (onNodesDragStop) {
        onNodesDragStop(updates);
      }

      fetch("/api/nodes/positions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      }).catch(() => {
        console.log("Drag coordinates updated");
      });
    },
    [onNodesDragStop],
  );

  const handleConnectEdges = useCallback(
    (sourceId, targetId) => {
      const sourceClean = sourceId.startsWith("node-")
        ? sourceId.replace("node-", "")
        : sourceId;
      const targetClean = targetId.startsWith("node-")
        ? targetId.replace("node-", "")
        : targetId;

      if (
        edges.some(
          (edge) =>
            edge.sourceId === sourceClean && edge.targetId === targetClean,
        )
      ) {
        return;
      }

      if (onConnectEdges) {
        onConnectEdges(sourceClean, targetClean);
      }

      fetch("/api/edges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: sourceClean,
          targetId: targetClean,
          type: "PROGRESSION",
        }),
      }).catch(() => {
        console.log("Created connection route");
      });
    },
    [edges, onConnectEdges],
  );

  const handleNodeDragStop = useCallback(
    (event, draggedNode, draggedNodes) => {
      const nodesToUpdate = Array.isArray(draggedNodes)
        ? draggedNodes
        : draggedNode
          ? [draggedNode]
          : [];

      const updates = nodesToUpdate.map((n) => ({
        id: n.id,
        x: n.position.x,
        y: n.position.y,
      }));

      handleNodesDragStop(updates);
    },
    [handleNodesDragStop],
  );

  const onEdgeConnect = useCallback(
    (connection) => {
      const source = connection.source;
      const target = connection.target;
      if (!source || !target) return;

      setFlowEdges((cur) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          cur,
        ),
      );

      handleConnectEdges(source, target);
    },
    [handleConnectEdges],
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((cur) => applyNodeChanges(changes, cur)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setFlowEdges((cur) => applyEdgeChanges(changes, cur)),
    [],
  );

  const handleAddNodeTrigger = useCallback((branchId) => {
    setNodeDraft({ branchId, title: "", description: "", content: "" });
    setNodeCreateError("");
  }, []);

  const closeAddNodeModal = useCallback(() => {
    if (isCreatingNode) return;
    setNodeDraft({ branchId: null, title: "", description: "", content: "" });
    setNodeCreateError("");
  }, [isCreatingNode]);

  const submitAddNode = useCallback(async () => {
    const title = nodeDraft.title.trim();
    if (!nodeDraft.branchId || !title) return;

    setIsCreatingNode(true);
    setNodeCreateError("");

    try {
      const res = await fetch(`/api/branches/${nodeDraft.branchId}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: nodeDraft.description,
          content: nodeDraft.content,
          order: nodes.filter(
            (n) =>
              n.type === "stepNode" && n.data.branch.id === nodeDraft.branchId,
          ).length,
          completed: false,
        }),
      });

      if (!res.ok) throw new Error("Failed to create node");

      const createdNode = await res.json();
      const branchNode = nodes.find(
        (n) => n.id === `branch-${nodeDraft.branchId}`,
      );
      const branchStepNodes = nodes.filter(
        (n) => n.type === "stepNode" && n.data.branch.id === nodeDraft.branchId,
      );
      const prevNode = branchStepNodes[branchStepNodes.length - 1];
      const newFlowNodeId = `node-${createdNode.id}`;

      setNodes((cur) => [
        ...cur,
        {
          id: newFlowNodeId,
          type: "stepNode",
          position: {
            x: branchNode.position.x,
            y: branchNode.position.y + 110 + branchStepNodes.length * 130,
          },
          data: { node: createdNode, branch: branchNode.data.branch },
        },
      ]);

      setFlowEdges((cur) => [
        ...cur,
        {
          id: prevNode
            ? `e-${prevNode.id}-${newFlowNodeId}`
            : `e-branch-${nodeDraft.branchId}-${createdNode.id}`,
          source: prevNode?.id || `branch-${nodeDraft.branchId}`,
          target: newFlowNodeId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: "rgba(255,255,255,0.15)", strokeWidth: 1.2 },
        },
      ]);

      setNodeDraft({ branchId: null, title: "", description: "", content: "" });
    } catch (error) {
      console.error(error);
      setNodeCreateError("Failed to create node.");
    } finally {
      setIsCreatingNode(false);
    }
  }, [nodeDraft, nodes]);

  const customFlowNodes = useMemo(
    () =>
      nodes.map((n) =>
        n.type === "branchHeader"
          ? { ...n, data: { ...n.data, onAddNode: handleAddNodeTrigger } }
          : n.type === "stepNode"
            ? {
                ...n,
                data: {
                  ...n.data,
                  onToggle: onToggleNode,
                  onClick: onSelectNode,
                },
              }
            : n,
      ),
    [nodes, handleAddNodeTrigger, onToggleNode, onSelectNode],
  );

  const handleBranchSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newBranchTitle.trim() || !firstNodeTitle.trim()) return;

      try {
        await fetch("/api/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newBranchTitle.trim(),
            color: newBranchColor,
          }),
        });

        if (onAddBranch) {
          onAddBranch({
            title: newBranchTitle.trim(),
            color: newBranchColor,
            firstNodeTitle: firstNodeTitle.trim(),
          });
        }

        setNewBranchTitle("");
        setFirstNodeTitle("");
        setNewBranchColor(ACCENT_COLORS[0].hex);
        setIsAddBranchOpen(false);
      } catch (error) {
        console.error("Failed to create branch", error);
      }
    },
    [newBranchTitle, newBranchColor, firstNodeTitle, onAddBranch],
  );
  console.log("branches", branches.length);
  console.log("nodes", nodes.length);
  console.log("flowEdges", flowEdges.length);

  return (
    <div className="w-full h-full bg-canvas-bg flex flex-col">
      <div
        className="relative"
        style={{
          width: "100%",
          height: "calc(100vh - 64px)",
        }}
      >
        <ReactFlow
          nodes={customFlowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={handleNodeDragStop}
          onNodeClick={(_, node) => {
            if (node.type === "stepNode") {
              onSelectNode?.(node.id.replace("node-", ""));
            }
          }}
          onConnect={onEdgeConnect}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
        >
          <Background
            variant={BackgroundVariant.Lines}
            color="var(--border-strong)"
            gap={32}
          />
          <Controls
            showInteractive={false}
            className="!bg-canvas-card !border !border-canvas-border !text-canvas-text"
          />
          <MiniMap
            position="bottom-right"
            style={{ width: 130, height: 96 }}
            className="!bg-canvas-card !border !border-canvas-border"
          />
        </ReactFlow>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsAddBranchOpen(true)}
          className="inline-flex items-center space-x-2 px-3 py-2 bg-canvas-inverse-bg text-canvas-inverse-text hover:opacity-90 font-mono text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm border border-canvas-border cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Branch</span>
        </button>
      </div>

      {isAddBranchOpen && (
        <div className="absolute inset-0 backdrop-blur-sm bg-canvas-bg/60 z-50 flex items-center justify-center p-4">
          <div className="bg-canvas-card border border-canvas-border w-full max-w-sm overflow-hidden p-6 relative shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-canvas-text">
                Add Pathways Branch
              </h3>
              <button
                onClick={() => setIsAddBranchOpen(false)}
                className="text-canvas-dim hover:text-canvas-text transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBranchSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-mono text-[8.5px] uppercase font-bold text-canvas-muted tracking-wider">
                  Branch Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Core Network Operations"
                  value={newBranchTitle}
                  onChange={(e) => setNewBranchTitle(e.target.value)}
                  className="w-full bg-canvas-secondary border border-canvas-border px-3 py-2 text-xs text-canvas-text placeholder-canvas-dim focus:outline-none focus:border-canvas-border-strong transition-colors"
                  maxLength={40}
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[8.5px] uppercase font-bold text-canvas-muted tracking-wider">
                  First Step Node Checkpoint
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master IPC socket connections"
                  value={firstNodeTitle}
                  onChange={(e) => setFirstNodeTitle(e.target.value)}
                  className="w-full bg-canvas-secondary border border-canvas-border px-3 py-2 text-xs text-canvas-text placeholder-canvas-dim focus:outline-none focus:border-canvas-border-strong transition-colors"
                  maxLength={50}
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[8.5px] uppercase font-bold text-canvas-muted tracking-wider">
                  Colors Accent Hex
                </label>
                <div className="flex items-center space-x-2 pt-1">
                  {ACCENT_COLORS.map((color) => {
                    const isSelected = newBranchColor === color.hex;
                    return (
                      <button
                        type="button"
                        key={color.hex}
                        onClick={() => setNewBranchColor(color.hex)}
                        className={`w-5 h-5 rounded-none transition-all relative cursor-pointer ${
                          isSelected
                            ? "scale-110 border-2 border-canvas-text"
                            : "opacity-60 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-canvas-border">
                <button
                  type="button"
                  onClick={() => setIsAddBranchOpen(false)}
                  className="text-[9px] font-mono uppercase tracking-widest text-canvas-muted hover:text-canvas-text transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-canvas-inverse-bg text-canvas-inverse-text text-[9px] font-mono font-bold tracking-widest uppercase transition-all hover:opacity-90 cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {nodeDraft.branchId && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <form
            className="w-full max-w-sm border border-canvas-border bg-canvas-card p-5 shadow-2xl"
            onSubmit={(event) => {
              event.preventDefault();
              submitAddNode();
            }}
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-canvas-text mb-4">
              Add Step Checkpoint Node
            </h2>
            <label className="mt-4 block text-left">
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-canvas-muted font-bold">
                Title
              </span>
              <input
                autoFocus
                required
                value={nodeDraft.title}
                onChange={(event) =>
                  setNodeDraft((draft) => ({
                    ...draft,
                    title: event.target.value,
                  }))
                }
                className="mt-1 w-full border border-canvas-border bg-canvas-secondary px-3 py-2 text-xs outline-none focus:border-canvas-border-strong text-canvas-text placeholder-canvas-dim"
                placeholder="Checkpoint dynamic name"
              />
            </label>
            <label className="mt-4 block text-left">
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-canvas-muted font-bold">
                Description
              </span>
              <textarea
                value={nodeDraft.description}
                onChange={(event) =>
                  setNodeDraft((draft) => ({
                    ...draft,
                    description: event.target.value,
                  }))
                }
                className="mt-1 w-full border border-canvas-border bg-canvas-secondary px-3 py-2 text-xs outline-none focus:border-canvas-border-strong text-canvas-text placeholder-canvas-dim h-20 resize-none"
                placeholder="Brief summary objective"
              />
            </label>
            <label className="mt-4 block text-left">
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-canvas-muted font-bold">
                Notes & Content
              </span>
              <textarea
                value={nodeDraft.content}
                onChange={(event) =>
                  setNodeDraft((draft) => ({
                    ...draft,
                    content: event.target.value,
                  }))
                }
                className="mt-1 w-full border border-canvas-border bg-canvas-secondary px-3 py-2 text-xs outline-none focus:border-canvas-border-strong text-canvas-text placeholder-canvas-dim h-24"
                placeholder="Content, markdown guidelines, resources"
              />
            </label>

            {nodeCreateError && (
              <p className="mt-2 text-[10px] text-red-500 font-medium">
                {nodeCreateError}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-3 border-t border-canvas-border pt-4">
              <button
                type="button"
                onClick={closeAddNodeModal}
                disabled={isCreatingNode}
                className="border border-canvas-border px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-canvas-muted hover:border-canvas-text hover:text-canvas-text disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingNode || !nodeDraft.title.trim()}
                className="border border-canvas-text bg-canvas-text px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-canvas-bg hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {isCreatingNode ? "Creating..." : "Create Node"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
