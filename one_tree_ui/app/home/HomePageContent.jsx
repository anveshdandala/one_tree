"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// ----------------------------------------------------------------------
// CONSTANTS & COLOR PALETTE
// ----------------------------------------------------------------------
const COLOR_PALETTE = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Pink", value: "#ec4899" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Slate", value: "#475569" },
];

const INITIAL_BRANCHES = [
  {
    id: "branch-webdev",
    title: "Web Development",
    color: "#6366f1",
    objective: "Master modern full-stack web development",
    nodes: [
      {
        id: "node-html-css",
        branchId: "branch-webdev",
        title: "HTML & CSS Foundations",
        description:
          "Learn semantic HTML, CSS box model, flexbox, and grid layout.",
        content:
          "### HTML & CSS Basics\n\nFocus on layout structures, responsive design, and CSS variables.\n\n#### Recommended Resources:\n- MDN Web Docs\n- CSS Tricks",
        positionX: 50,
        positionY: 150,
        isCompleted: true,
      },
      {
        id: "node-js",
        branchId: "branch-webdev",
        title: "Modern JavaScript",
        description:
          "Understand ES6+ features, async programming, and DOM manipulation.",
        content:
          "### JavaScript Deep Dive\n\nStudy promises, async/await, array methods, and closures.\n\n#### Checklist:\n- [x] Promises\n- [ ] Event loop\n- [ ] DOM APIs",
        positionX: 320,
        positionY: 150,
        isCompleted: true,
      },
      {
        id: "node-react",
        branchId: "branch-webdev",
        title: "React Essentials",
        description:
          "Learn state management, hooks, components, and virtual DOM.",
        content:
          "### React Core\n\nBuild interactive interfaces with components, props, hooks (`useState`, `useEffect`).",
        positionX: 590,
        positionY: 150,
        isCompleted: false,
      },
      {
        id: "node-nextjs",
        branchId: "branch-webdev",
        title: "Next.js Framework",
        description: "Learn server-side rendering, routing, and api routes.",
        content:
          "### Next.js App Router\n\nUnderstand React Server Components (RSC) vs Client Components, dynamic routing, and API routes.",
        positionX: 860,
        positionY: 150,
        isCompleted: false,
      },
    ],
  },
  {
    id: "branch-ai",
    title: "Machine Learning",
    color: "#ec4899",
    objective: "Understand core ML models and neural networks",
    nodes: [
      {
        id: "node-math",
        branchId: "branch-ai",
        title: "Mathematics for ML",
        description: "Linear algebra, calculus, probability, and statistics.",
        content:
          "### Mathematical Pre-requisites\n\nReview vectors, matrices, partial derivatives, and Bayes' theorem.",
        positionX: 50,
        positionY: 350,
        isCompleted: true,
      },
      {
        id: "node-python",
        branchId: "branch-ai",
        title: "Python & Data Science",
        description:
          "Master NumPy, Pandas, and Matplotlib for data processing.",
        content:
          "### NumPy & Pandas\n\nPractise data cleaning, exploratory data analysis, and visualization.",
        positionX: 320,
        positionY: 350,
        isCompleted: false,
      },
      {
        id: "node-scikit",
        branchId: "branch-ai",
        title: "Supervised Learning",
        description:
          "Train regressions, decision trees, and SVMs using Scikit-Learn.",
        content:
          "### Scikit-Learn basics\n\nFit, predict, evaluate metrics (F1 score, ROC-AUC).",
        positionX: 590,
        positionY: 350,
        isCompleted: false,
      },
    ],
  },
];

const INITIAL_EDGES = [
  {
    id: "edge-html-js",
    sourceId: "node-html-css",
    targetId: "node-js",
    type: "PROGRESSION",
  },
  {
    id: "edge-js-react",
    sourceId: "node-js",
    targetId: "node-react",
    type: "PROGRESSION",
  },
  {
    id: "edge-react-nextjs",
    sourceId: "node-react",
    targetId: "node-nextjs",
    type: "PROGRESSION",
  },
  {
    id: "edge-math-python",
    sourceId: "node-math",
    targetId: "node-python",
    type: "PROGRESSION",
  },
  {
    id: "edge-python-scikit",
    sourceId: "node-python",
    targetId: "node-scikit",
    type: "PROGRESSION",
  },
  {
    id: "edge-js-python",
    sourceId: "node-js",
    targetId: "node-python",
    type: "RELATED",
  },
];

const CustomNode = ({ data }) => {
  const {
    title,
    description,
    isCompleted,
    color,
    branchTitle,
    onToggleComplete,
  } = data;

  return (
    <div
      className={`relative flex flex-col min-w-[220px] max-w-[280px] border bg-canvas-card p-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
        isCompleted
          ? "border-emerald-500/40 shadow-emerald-500/5 bg-emerald-500/5"
          : "border-canvas-border shadow-md"
      }`}
      style={{
        borderLeft: `5px solid ${color}`,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-canvas-border-strong !w-3 !h-3 hover:!bg-canvas-text transition-colors !border-2 !border-canvas-card"
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            {branchTitle}
          </span>
          <input
            type="checkbox"
            checked={isCompleted || false}
            onChange={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className="h-4 w-4 cursor-pointer rounded border-canvas-border text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
          />
        </div>

        <div>
          <h4 className="text-xs font-bold leading-snug text-canvas-text">
            {title}
          </h4>
          {description && (
            <p className="mt-1 text-[10px] leading-normal text-canvas-muted line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-canvas-border-strong !w-3 !h-3 hover:!bg-canvas-text transition-colors !border-2 !border-canvas-card"
      />
    </div>
  );
};

const nodeTypes = {
  customNode: CustomNode,
};

function branchesToFlow(branches, edges, onToggleCompleteNode) {
  const flowNodes = [];

  branches.forEach((branch) => {
    if (branch.nodes) {
      branch.nodes.forEach((node) => {
        flowNodes.push({
          id: node.id,
          type: "customNode",
          position: { x: node.positionX || 0, y: node.positionY || 0 },
          data: {
            id: node.id,
            title: node.title,
            description: node.description,
            content: node.content,
            isCompleted: node.isCompleted,
            branchId: branch.id,
            branchTitle: branch.title,
            color: branch.color || "#6366f1",
            onToggleComplete: () => onToggleCompleteNode(node.id),
          },
        });
      });
    }
  });

  const flowEdges = (edges || []).map((edge) => ({
    id: edge.id,
    source: edge.sourceId,
    target: edge.targetId,
    animated: edge.type !== "RELATED",
    style: {
      stroke: edge.type === "RELATED" ? "var(--border-strong)" : "#6366f1",
      strokeDasharray: edge.type === "RELATED" ? "5,5" : undefined,
      strokeWidth: 2,
    },
  }));

  return { flowNodes, flowEdges };
}

// ----------------------------------------------------------------------
// MAIN HOMEPAGE CONTENT COMPONENT
// ----------------------------------------------------------------------
export default function HomePageContent({
  branches: initialPropsBranches = [],
}) {
  // --- Core State ---
  const [branches, setBranches] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // --- Modal & Selection States ---
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [branchFormValues, setBranchFormValues] = useState({
    title: "",
    objective: "",
    color: "#6366f1",
  });

  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [selectedBranchForNode, setSelectedBranchForNode] = useState(null);
  const [nodeFormValues, setNodeFormValues] = useState({
    title: "",
    description: "",
  });

  // --- Local Storage Hydration ---
  useEffect(() => {
    setIsMounted(true);
    const localBranches = localStorage.getItem("onetree_branches");
    const localEdges = localStorage.getItem("onetree_edges");
    if (localBranches && localEdges) {
      setBranches(JSON.parse(localBranches));
      setEdges(JSON.parse(localEdges));
    } else {
      const defaultBranches =
        initialPropsBranches.length > 0
          ? initialPropsBranches
          : INITIAL_BRANCHES;
      setBranches(defaultBranches);
      setEdges(INITIAL_EDGES);
      localStorage.setItem("onetree_branches", JSON.stringify(defaultBranches));
      localStorage.setItem("onetree_edges", JSON.stringify(INITIAL_EDGES));
    }
  }, [initialPropsBranches]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("onetree_branches", JSON.stringify(branches));
      localStorage.setItem("onetree_edges", JSON.stringify(edges));
    }
  }, [branches, edges, isMounted]);

  // --- Derived Calculations ---
  const allNodes = useMemo(() => {
    return branches.flatMap((b) => b.nodes || []);
  }, [branches]);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    for (const branch of branches) {
      const node = branch.nodes?.find((n) => n.id === selectedNodeId);
      if (node) {
        return {
          ...node,
          branchColor: branch.color || "#6366f1",
          branchTitle: branch.title,
        };
      }
    }
    return null;
  }, [branches, selectedNodeId]);

  const selectedNodeEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return edges.filter(
      (e) => e.sourceId === selectedNodeId || e.targetId === selectedNodeId,
    );
  }, [edges, selectedNodeId]);

  // Statistics
  const branchCount = branches.length;
  const nodeCount = allNodes.length;
  const completedCount = allNodes.filter((n) => n.isCompleted).length;

  // --- Smart Position Calculator for New Nodes ---
  const getNewNodePosition = useCallback(
    (branchId) => {
      const branch = branches.find((b) => b.id === branchId);
      if (branch && branch.nodes && branch.nodes.length > 0) {
        const rightmost = [...branch.nodes].sort(
          (a, b) => b.positionX - a.positionX,
        )[0];
        return {
          x: rightmost.positionX + 260,
          y: rightmost.positionY,
        };
      }
      const branchIndex = branches.findIndex((b) => b.id === branchId);
      return {
        x: 50,
        y: 150 + (branchIndex >= 0 ? branchIndex : 0) * 200,
      };
    },
    [branches],
  );

  // --- Node Actions ---
  const onToggleCompleteNode = useCallback((nodeId) => {
    setBranches((currentBranches) =>
      currentBranches.map((branch) => ({
        ...branch,
        nodes:
          branch.nodes?.map((node) =>
            node.id === nodeId
              ? { ...node, isCompleted: !node.isCompleted }
              : node,
          ) || [],
      })),
    );

    // Background Mock API Request
    fetch(`/api/nodes/${nodeId}/complete`, {
      method: "PATCH",
    }).catch((err) => console.log("Background API complete:", err.message));
  }, []);

  const updateNodeField = useCallback((nodeId, field, value) => {
    setBranches((currentBranches) =>
      currentBranches.map((branch) => ({
        ...branch,
        nodes:
          branch.nodes?.map((node) =>
            node.id === nodeId ? { ...node, [field]: value } : node,
          ) || [],
      })),
    );

    // Background Mock API Request
    fetch(`/api/nodes/${nodeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    }).catch((err) =>
      console.log(`Background API update ${field}:`, err.message),
    );
  }, []);

  const deleteNode = useCallback(
    (nodeId) => {
      setBranches((currentBranches) =>
        currentBranches.map((branch) => ({
          ...branch,
          nodes: branch.nodes?.filter((node) => node.id !== nodeId) || [],
        })),
      );

      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) => edge.sourceId !== nodeId && edge.targetId !== nodeId,
        ),
      );

      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
      }

      // Background Mock API Request
      fetch(`/api/nodes/${nodeId}`, {
        method: "DELETE",
      }).catch((err) =>
        console.log("Background API delete node:", err.message),
      );
    },
    [selectedNodeId],
  );

  // --- ReactFlow Node Drag Stop handler ---
  const onNodeDragStop = useCallback((event, dragNode) => {
    const { id } = dragNode;
    const { x, y } = dragNode.position;

    setBranches((currentBranches) =>
      currentBranches.map((branch) => ({
        ...branch,
        nodes:
          branch.nodes?.map((node) =>
            node.id === id ? { ...node, positionX: x, positionY: y } : node,
          ) || [],
      })),
    );

    // Background Mock API Request
    fetch(`/api/nodes/positions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nodeId: id, positionX: x, positionY: y }),
    }).catch((err) =>
      console.log("Background API save coordinates:", err.message),
    );
  }, []);

  // --- ReactFlow Edge Connect handler ---
  const onConnect = useCallback(
    (connection) => {
      const exists = edges.some(
        (e) =>
          e.sourceId === connection.source && e.targetId === connection.target,
      );
      if (exists) return;

      const newEdgeId = `edge-${Date.now()}`;
      const newEdge = {
        id: newEdgeId,
        sourceId: connection.source,
        targetId: connection.target,
        type: "PROGRESSION",
      };

      setEdges((prevEdges) => [...prevEdges, newEdge]);

      // Background Mock API Request
      fetch(`/api/edges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: connection.source,
          targetId: connection.target,
          type: "PROGRESSION",
        }),
      }).catch((err) =>
        console.log("Background API connect edge:", err.message),
      );
    },
    [edges],
  );

  const deleteEdge = useCallback((edgeId) => {
    setEdges((prevEdges) => prevEdges.filter((e) => e.id !== edgeId));

    // Background Mock API Request
    fetch(`/api/edges/${edgeId}`, {
      method: "DELETE",
    }).catch((err) => console.log("Background API delete edge:", err.message));
  }, []);

  // --- Branch Actions ---
  const handleEditBranchClick = useCallback((branch) => {
    setBranchFormValues({
      title: branch.title,
      objective: branch.objective || "",
      color: branch.color || "#6366f1",
    });
    setEditingBranchId(branch.id);
    setIsBranchModalOpen(true);
  }, []);

  const handleBranchSubmit = (e) => {
    e.preventDefault();
    if (!branchFormValues.title.trim()) return;

    if (editingBranchId) {
      setBranches((prev) =>
        prev.map((b) =>
          b.id === editingBranchId
            ? {
                ...b,
                title: branchFormValues.title.trim(),
                objective: branchFormValues.objective.trim(),
                color: branchFormValues.color,
              }
            : b,
        ),
      );

      // Background Mock API Request
      fetch(`/api/branches/${editingBranchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: branchFormValues.title.trim(),
          objective: branchFormValues.objective.trim(),
          color: branchFormValues.color,
        }),
      }).catch((err) =>
        console.log("Background API update branch:", err.message),
      );
    } else {
      const newBranchId = `branch-${Date.now()}`;
      const newBranch = {
        id: newBranchId,
        title: branchFormValues.title.trim(),
        objective: branchFormValues.objective.trim(),
        color: branchFormValues.color,
        nodes: [],
      };
      setBranches((prev) => [...prev, newBranch]);

      // Background Mock API Request
      fetch(`/api/branches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: branchFormValues.title.trim(),
          objective: branchFormValues.objective.trim(),
          color: branchFormValues.color,
        }),
      }).catch((err) =>
        console.log("Background API create branch:", err.message),
      );
    }

    setIsBranchModalOpen(false);
    setEditingBranchId(null);
  };

  const deleteBranch = useCallback(
    (branchId) => {
      const branch = branches.find((b) => b.id === branchId);
      const nodeIds = branch?.nodes?.map((n) => n.id) || [];

      setBranches((prevBranches) =>
        prevBranches.filter((b) => b.id !== branchId),
      );
      setEdges((prevEdges) =>
        prevEdges.filter(
          (e) => !nodeIds.includes(e.sourceId) && !nodeIds.includes(e.targetId),
        ),
      );

      if (selectedNodeId && nodeIds.includes(selectedNodeId)) {
        setSelectedNodeId(null);
      }

      // Background Mock API Request
      fetch(`/api/branches/${branchId}`, {
        method: "DELETE",
      }).catch((err) =>
        console.log("Background API delete branch:", err.message),
      );
    },
    [branches, selectedNodeId],
  );

  // --- Node Modal Actions ---
  const handleNodeSubmit = (e) => {
    e.preventDefault();
    if (!nodeFormValues.title.trim() || !selectedBranchForNode) return;

    const newNodeId = `node-${Date.now()}`;
    const pos = getNewNodePosition(selectedBranchForNode);

    const newNode = {
      id: newNodeId,
      branchId: selectedBranchForNode,
      title: nodeFormValues.title.trim(),
      description: nodeFormValues.description.trim(),
      content: "",
      positionX: pos.x,
      positionY: pos.y,
      isCompleted: false,
    };

    setBranches((prev) =>
      prev.map((b) =>
        b.id === selectedBranchForNode
          ? { ...b, nodes: [...(b.nodes || []), newNode] }
          : b,
      ),
    );

    // Background Mock API Request
    fetch(`/api/branches/${selectedBranchForNode}/nodes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: nodeFormValues.title.trim(),
        description: nodeFormValues.description.trim(),
        positionX: pos.x,
        positionY: pos.y,
      }),
    }).catch((err) => console.log("Background API create node:", err.message));

    setIsNodeModalOpen(false);
    setSelectedBranchForNode(null);
    setSelectedNodeId(newNodeId); // Autofocus newly created node details
  };

  // --- Convert to ReactFlow ---
  const { flowNodes, flowEdges } = useMemo(() => {
    return branchesToFlow(branches, edges, onToggleCompleteNode);
  }, [branches, edges, onToggleCompleteNode]);

  // Render guard for Hydration match
  if (!isMounted) {
    return (
      <div className="flex h-[calc(100vh-73px)] w-full items-center justify-center bg-canvas-bg font-sans text-canvas-muted">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin border-2 border-canvas-text border-t-transparent" />
          <span className="text-xs uppercase tracking-widest font-bold">
            Configuring Canvas...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)] w-full overflow-hidden bg-canvas-bg font-sans text-canvas-text transition-colors duration-200">
      {/* LEFT SIDEBAR: BRANCH & NODE LISTS*/}
      <div className="w-80 border-r border-canvas-border bg-canvas-card flex flex-col h-full overflow-hidden shrink-0">
        <div className="flex items-center justify-between border-b border-canvas-border px-5 py-4 shrink-0">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-canvas-text flex items-center gap-2">
            <span className="h-2.5 w-2.5 rotate-45 bg-canvas-text" />
            <span>Learning Branches</span>
          </h3>
          <button
            onClick={() => {
              setBranchFormValues({
                title: "",
                objective: "",
                color: "#6366f1",
              });
              setEditingBranchId(null);
              setIsBranchModalOpen(true);
            }}
            className="inline-flex items-center gap-1 bg-canvas-inverse-bg px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-canvas-inverse-text hover:opacity-90 active:scale-95 transition-all rounded"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Branch</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {branches.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-canvas-border rounded-xl">
              <AlertCircle className="h-8 w-8 text-canvas-dim mx-auto mb-2" />
              <p className="text-xs text-canvas-muted font-medium">
                No branches created yet.
              </p>
              <button
                onClick={() => setIsBranchModalOpen(true)}
                className="mt-3 text-[10px] font-bold uppercase tracking-wider text-indigo-500 hover:underline"
              >
                Create First Branch
              </button>
            </div>
          ) : (
            branches.map((branch) => (
              <div
                key={branch.id}
                className="group relative border border-canvas-border bg-canvas-secondary/20 rounded-xl p-3.5 transition-all duration-200 hover:border-canvas-border-strong hover:bg-canvas-secondary/40"
                style={{ borderTop: `4px solid ${branch.color || "#6366f1"}` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-extrabold text-canvas-text truncate">
                      {branch.title}
                    </h4>
                    {branch.objective && (
                      <p className="text-[10px] text-canvas-muted leading-tight mt-0.5 truncate">
                        {branch.objective}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditBranchClick(branch)}
                      className="text-canvas-dim hover:text-canvas-text p-1 transition-colors"
                      title="Edit Branch"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteBranch(branch.id)}
                      className="text-canvas-dim hover:text-red-500 p-1 transition-colors"
                      title="Delete Branch"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Branch Nodes Checklist */}
                <div className="mt-3 space-y-1">
                  {branch.nodes?.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-full flex items-center justify-between text-left px-2.5 py-2 text-[10px] border rounded-lg transition-all ${
                        selectedNodeId === node.id
                          ? "bg-canvas-card border-canvas-border-strong font-bold shadow-sm"
                          : "bg-transparent border-transparent hover:bg-canvas-card hover:border-canvas-border"
                      }`}
                    >
                      <span className="truncate flex-1 pr-2">{node.title}</span>
                      {node.isCompleted ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-canvas-dim/40 shrink-0" />
                      )}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setSelectedBranchForNode(branch.id);
                      setNodeFormValues({ title: "", description: "" });
                      setIsNodeModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-canvas-border hover:border-canvas-border-strong text-[9px] font-bold uppercase tracking-wider text-canvas-muted hover:text-canvas-text transition-all rounded-lg mt-2"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Step</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CENTER VIEW: REACTFLOW CANVAS & VIEW PORT STATS*/}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-canvas-bg">
        {/* Viewport Dashboard Header */}
        <div className="border-b border-canvas-border bg-canvas-card/50 px-6 py-3 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-canvas-text">
              Roadmap Canvas
            </h2>
            <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] text-canvas-muted uppercase">
              <span>{branchCount} branches</span>
              <span className="text-canvas-border-strong">•</span>
              <span>{nodeCount} steps</span>
              <span className="text-canvas-border-strong">•</span>
              <span className="text-emerald-500 font-bold">
                {completedCount}/{nodeCount} Completed
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
            <Sparkles className="h-2.5 w-2.5" />
            <span>Interactive Sandbox</span>
          </span>
        </div>

        {/* ReactFlow Canvas container */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={flowNodes}
            edges={flowEdges}
            nodeTypes={nodeTypes}
            onNodeClick={(e, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            onNodeDragStop={onNodeDragStop}
            onConnect={onConnect}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
            panOnScroll={true}
            zoomOnDoubleClick={true}
            minZoom={0.2}
            maxZoom={1.5}
            className="w-full h-full"
          >
            <Background
              variant={BackgroundVariant.Lines}
              color="var(--border-strong)"
              gap={32}
              size={1}
            />
            <Controls
              showInteractive={false}
              className="!bg-canvas-card !border !border-canvas-border !shadow-lg [&_button]:!bg-canvas-card [&_button]:!border-b [&_button]:!border-canvas-border [&_button]:!text-canvas-muted hover:[&_button]:!text-canvas-text [&_svg]:!fill-current"
            />
            <MiniMap
              position="bottom-right"
              nodeColor={(n) => n.data?.color || "#333"}
              maskColor="rgba(0, 0, 0, 0.4)"
              className="!bg-canvas-card !border !border-canvas-border !shadow-lg"
              style={{ width: 120, height: 90 }}
            />
          </ReactFlow>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* RIGHT SIDEBAR: NODE DETAILS DRAWER                               */}
      {/* ---------------------------------------------------------------- */}
      {selectedNode && (
        <div className="w-80 border-l border-canvas-border bg-canvas-card flex flex-col h-full overflow-hidden shrink-0 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between border-b border-canvas-border px-5 py-4 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: selectedNode.branchColor }}
              />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-canvas-muted truncate">
                {selectedNode.branchTitle}
              </span>
            </div>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="text-canvas-dim hover:text-canvas-text transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div className="space-y-4">
              <label className="block space-y-1">
                <span className="block font-mono text-[8px] font-bold uppercase tracking-wider text-canvas-muted">
                  Step Title
                </span>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) =>
                    updateNodeField(selectedNode.id, "title", e.target.value)
                  }
                  className="w-full border border-canvas-border bg-canvas-secondary/50 px-3 py-2 text-xs text-canvas-text focus:border-canvas-border-strong focus:outline-none rounded-lg"
                />
              </label>

              <label className="block space-y-1">
                <span className="block font-mono text-[8px] font-bold uppercase tracking-wider text-canvas-muted">
                  Short Description
                </span>
                <input
                  type="text"
                  value={selectedNode.description || ""}
                  onChange={(e) =>
                    updateNodeField(
                      selectedNode.id,
                      "description",
                      e.target.value,
                    )
                  }
                  className="w-full border border-canvas-border bg-canvas-secondary/50 px-3 py-2 text-xs text-canvas-text focus:border-canvas-border-strong focus:outline-none rounded-lg"
                />
              </label>

              <label className="block space-y-1">
                <span className="block font-mono text-[8px] font-bold uppercase tracking-wider text-canvas-muted">
                  Notes & Details
                </span>
                <textarea
                  value={selectedNode.content || ""}
                  onChange={(e) =>
                    updateNodeField(selectedNode.id, "content", e.target.value)
                  }
                  rows={8}
                  placeholder="Notes, references, checklist, links..."
                  className="w-full border border-canvas-border bg-canvas-secondary/50 px-3 py-2 text-xs text-canvas-text font-mono focus:border-canvas-border-strong focus:outline-none rounded-lg resize-none"
                />
              </label>

              <div className="flex items-center gap-3 border-t border-b border-canvas-border py-4 mt-2">
                <input
                  type="checkbox"
                  id={`drawer-completed-${selectedNode.id}`}
                  checked={selectedNode.isCompleted || false}
                  onChange={() => onToggleCompleteNode(selectedNode.id)}
                  className="h-4.5 w-4.5 cursor-pointer rounded border-canvas-border text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                />
                <label
                  htmlFor={`drawer-completed-${selectedNode.id}`}
                  className="text-xs font-semibold text-canvas-text cursor-pointer select-none"
                >
                  Mark as Completed
                </label>
              </div>
            </div>

            {/* Node Connections */}
            <div className="space-y-3">
              <h5 className="font-mono text-[9px] font-bold uppercase tracking-widest text-canvas-muted">
                Connections
              </h5>
              <div className="space-y-1.5">
                {selectedNodeEdges.length === 0 ? (
                  <p className="text-[10px] text-canvas-dim italic leading-normal">
                    No pathways connected. Drag handles on the graph canvas to
                    link steps.
                  </p>
                ) : (
                  selectedNodeEdges.map((edge) => {
                    const isSource = edge.sourceId === selectedNode.id;
                    const partnerId = isSource ? edge.targetId : edge.sourceId;
                    const partnerNode = allNodes.find(
                      (n) => n.id === partnerId,
                    );
                    if (!partnerNode) return null;

                    return (
                      <div
                        key={edge.id}
                        className="flex items-center justify-between gap-2 border border-canvas-border bg-canvas-secondary/20 px-3 py-2 rounded-lg"
                      >
                        <span className="text-[10px] text-canvas-text truncate max-w-[190px]">
                          {isSource ? (
                            <span>
                              Leads to: <strong>{partnerNode.title}</strong>
                            </span>
                          ) : (
                            <span>
                              Prerequisite: <strong>{partnerNode.title}</strong>
                            </span>
                          )}
                        </span>
                        <button
                          onClick={() => deleteEdge(edge.id)}
                          className="text-canvas-dim hover:text-red-500 p-0.5 transition-colors shrink-0"
                          title="Disconnect"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Danger Actions */}
            <div className="pt-4 border-t border-canvas-border">
              <button
                onClick={() => deleteNode(selectedNode.id)}
                className="w-full flex items-center justify-center gap-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40 text-red-500 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Step</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* BRANCH CREATE/EDIT MODAL                                        */}
      {/* ---------------------------------------------------------------- */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-canvas-border-strong bg-canvas-card p-6 shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-canvas-border pb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-canvas-text">
                {editingBranchId ? "Edit Branch" : "Add Branch"}
              </h3>
              <button
                onClick={() => {
                  setIsBranchModalOpen(false);
                  setEditingBranchId(null);
                }}
                className="text-canvas-dim hover:text-canvas-text transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleBranchSubmit} className="mt-5 space-y-4">
              <label className="block space-y-1">
                <span className="block font-mono text-[8px] font-bold uppercase tracking-wider text-canvas-muted">
                  Branch Name
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Machine Learning"
                  value={branchFormValues.title}
                  onChange={(e) =>
                    setBranchFormValues({
                      ...branchFormValues,
                      title: e.target.value,
                    })
                  }
                  maxLength={60}
                  className="w-full border border-canvas-border bg-canvas-secondary/50 px-3 py-2.5 text-xs text-canvas-text focus:border-canvas-border-strong focus:outline-none rounded-lg"
                  autoFocus
                />
              </label>

              <label className="block space-y-1">
                <span className="block font-mono text-[8px] font-bold uppercase tracking-wider text-canvas-muted">
                  Branch Objective
                </span>
                <input
                  type="text"
                  placeholder="e.g. Understand core neural networks"
                  value={branchFormValues.objective}
                  onChange={(e) =>
                    setBranchFormValues({
                      ...branchFormValues,
                      objective: e.target.value,
                    })
                  }
                  maxLength={120}
                  className="w-full border border-canvas-border bg-canvas-secondary/50 px-3 py-2.5 text-xs text-canvas-text focus:border-canvas-border-strong focus:outline-none rounded-lg"
                />
              </label>

              <div className="space-y-2">
                <span className="block font-mono text-[8px] font-bold uppercase tracking-wider text-canvas-muted">
                  Select Accent Color
                </span>
                <div className="grid grid-cols-8 gap-2">
                  {COLOR_PALETTE.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        setBranchFormValues({
                          ...branchFormValues,
                          color: color.value,
                        })
                      }
                      className={`h-7 w-7 rounded-full border-2 transition-all cursor-pointer ${
                        branchFormValues.color === color.value
                          ? "border-canvas-text scale-110 shadow-sm"
                          : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-canvas-border pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsBranchModalOpen(false);
                    setEditingBranchId(null);
                  }}
                  className="text-[9px] font-mono uppercase tracking-widest text-canvas-muted hover:text-canvas-text transition-colors px-3 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-canvas-inverse-bg px-4.5 py-2.5 text-[9px] font-bold uppercase tracking-widest text-canvas-inverse-text hover:opacity-90 active:scale-95 transition-all rounded-lg cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                    {editingBranchId ? "Save Changes" : "Create Branch"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* NODE CREATE MODAL                                                */}
      {/* ---------------------------------------------------------------- */}
      {isNodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-canvas-border-strong bg-canvas-card p-6 shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-canvas-border pb-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-canvas-text">
                Add Learning Step
              </h3>
              <button
                onClick={() => {
                  setIsNodeModalOpen(false);
                  setSelectedBranchForNode(null);
                }}
                className="text-canvas-dim hover:text-canvas-text transition-colors p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleNodeSubmit} className="mt-5 space-y-4">
              <label className="block space-y-1">
                <span className="block font-mono text-[8px] font-bold uppercase tracking-wider text-canvas-muted">
                  Step Title
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Intro to Neural Networks"
                  value={nodeFormValues.title}
                  onChange={(e) =>
                    setNodeFormValues({
                      ...nodeFormValues,
                      title: e.target.value,
                    })
                  }
                  maxLength={60}
                  className="w-full border border-canvas-border bg-canvas-secondary/50 px-3 py-2.5 text-xs text-canvas-text focus:border-canvas-border-strong focus:outline-none rounded-lg"
                  autoFocus
                />
              </label>

              <label className="block space-y-1">
                <span className="block font-mono text-[8px] font-bold uppercase tracking-wider text-canvas-muted">
                  Short Description
                </span>
                <input
                  type="text"
                  placeholder="e.g. Basic building blocks of neural layers."
                  value={nodeFormValues.description}
                  onChange={(e) =>
                    setNodeFormValues({
                      ...nodeFormValues,
                      description: e.target.value,
                    })
                  }
                  maxLength={120}
                  className="w-full border border-canvas-border bg-canvas-secondary/50 px-3 py-2.5 text-xs text-canvas-text focus:border-canvas-border-strong focus:outline-none rounded-lg"
                />
              </label>

              <div className="flex items-center justify-end gap-3 border-t border-canvas-border pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsNodeModalOpen(false);
                    setSelectedBranchForNode(null);
                  }}
                  className="text-[9px] font-mono uppercase tracking-widest text-canvas-muted hover:text-canvas-text transition-colors px-3 py-2 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 bg-canvas-inverse-bg px-4.5 py-2.5 text-[9px] font-bold uppercase tracking-widest text-canvas-inverse-text hover:opacity-90 active:scale-95 transition-all rounded-lg cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Step</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
