import { MarkerType } from "@xyflow/react";
const fallbackBranches = [
  {
    id: "current-path",
    title: "Current Node",
    description: "The selected place in your learning tree",
    objective: "Keep the next action visible",
    color: "#2563eb",
  },
  {
    id: "practice",
    title: "Practice",
    description: "Work through a small task",
    objective: "Build confidence",
    color: "#16a34a",
  },
  {
    id: "review",
    title: "Review",
    description: "Check what changed",
    objective: "Lock in the lesson",
    color: "#9333ea",
  },
];
export default function buildPreviewGraph(branches) {
  const sourceBranches = branches.length > 0 ? branches : fallbackBranches;
  const centerY = 180;

  const nodes = sourceBranches.slice(0, 8).map((branch, index) => {
    const isCurrent = index === 0;
    const color = branch.color || (isCurrent ? "#2563eb" : "#525252");
    const x = index === 0 ? 0 : 260 + (index % 3) * 230;
    const y = index === 0 ? centerY : 60 + Math.floor((index - 1) / 3) * 170;

    return {
      id: String(branch.id ?? `branch-${index}`),
      type: "default",
      position: {
        x: branch.positionX || x,
        y: branch.positionY || y,
      },
      data: {
        label: (
          <div className="min-w-48 text-left">
            <div className="mb-2 flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rotate-45"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-canvas-muted">
                {isCurrent ? "Current Node" : "Branch"}
              </span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wide text-canvas-text">
              {branch.title || "Untitled Branch"}
            </div>
            <div className="mt-1 line-clamp-2 text-[10px] leading-4 text-canvas-muted">
              {branch.description || branch.objective || "No notes yet"}
            </div>
          </div>
        ),
        color,
        raw: branch,
      },
      selectable: false,
      draggable: false,
      className: [
        "!rounded-none !border !bg-canvas-card !px-4 !py-3 !shadow-sm",
        isCurrent ? "!border-canvas-text" : "!border-canvas-border-strong",
      ].join(" "),
      style: {
        borderLeft: `4px solid ${color}`,
      },
    };
  });

  const edges = nodes.slice(1).map((node, index) => ({
    id: `edge-${nodes[0].id}-${node.id}`,
    source: nodes[0].id,
    target: node.id,
    type: "smoothstep",
    label: index === 0 ? "next" : undefined,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 14,
      height: 14,
    },
    style: {
      stroke: "var(--text-dim)",
      strokeWidth: 1.5,
    },
    labelStyle: {
      fill: "var(--text-muted)",
      fontSize: 9,
      fontWeight: 700,
      textTransform: "uppercase",
    },
  }));

  return { nodes, edges, currentNode: sourceBranches[0] };
}
