"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const fieldDefinitions = [
  {
    key: "title",
    label: "Branch Name",
    placeholder: "e.g. Machine Learning",
    maxLength: 60,
  },
  {
    key: "description",
    label: "Description",
    placeholder: "e.g. Learning path for core ML concepts",
    maxLength: 120,
  },
  {
    key: "objective",
    label: "Objective",
    placeholder: "e.g. Build a real-time ML model",
    maxLength: 120,
  },
];

export default function HomePageContent({ branches = [] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branchList, setBranchList] = useState(branches);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    objective: "",
    color: "",
    icon: "",
  });

  const branchCount = branchList.length;

  const updateField = (field) => (event) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: event.target.value,
    }));
  };

  const openForm = () => setIsAddOpen(true);
  const closeForm = () => setIsAddOpen(false);

  const resetForm = () => {
    setFormValues({
      title: "",
      description: "",
      objective: "",
      color: "",
      icon: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formValues.title.trim();
    const description = formValues.description.trim();
    const objective = formValues.objective.trim();

    if (!title) {
      return;
    }

    const apidata = {
      title,
      description,
      objective,
    };

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/branches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apidata),
      });

      if (!res.ok) {
        throw new Error("Failed to create branch.");
      }

      const createdBranch = await res.json();
      setBranchList((currentBranches) => [createdBranch, ...currentBranches]);
      resetForm();
      setIsAddOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col bg-canvas-bg font-sans text-canvas-text transition-colors duration-200">
      <div className="relative z-10 border-b border-canvas-border bg-canvas-secondary/90 px-6 py-3.5 backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-2.5 w-2.5 rotate-45 rounded-none bg-canvas-text" />
            <div>
              <h1 className="text-sm font-extrabold uppercase tracking-tight text-canvas-text">
                OneTree Home
              </h1>
              <p className="mt-0.5 block font-mono text-[8px] uppercase tracking-wider text-canvas-muted">
                {branchCount} branches
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openForm}
              className="inline-flex items-center gap-2 border border-canvas-inverse-bg bg-canvas-inverse-bg px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-canvas-inverse-text transition-all hover:opacity-90 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Branch</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <section className="flex min-h-[calc(100vh-168px)] flex-1 flex-col border border-canvas-border bg-canvas-card shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-canvas-border px-4 py-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-canvas-text">
              Viewing Window
            </h2>
            <span className="font-mono text-[9px] uppercase tracking-wider text-canvas-muted">
              {branchCount} branches
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center bg-canvas-bg p-6">
            <div className="text-center bg-secondary">
              {/* React Flow Component Workspace */}
              <ReactFlow
                nodes={reactFlowNodes}
                edges={reactFlowEdges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                panOnScroll={true}
                zoomOnDoubleClick={true}
                minZoom={0.2}
                maxZoom={1.5}
                className="w-full h-full"
                style={{ width: "100%", height: "100%", minHeight: "600px" }}
              >
                {/* Abstract grids layer background */}
                <Background
                  variant={BackgroundVariant.Lines}
                  color="var(--border-strong)"
                  gap={32}
                  size={1}
                />

                {/* Minimalist interactive viewport manipulation panels */}
                <Controls
                  showInteractive={false}
                  className="!bg-canvas-card !border !border-canvas-border !shadow-md [&_button]:!bg-canvas-card [&_button]:!border-b [&_button]:!border-canvas-border [&_button]:!text-canvas-muted hover:[&_button]:!text-canvas-text [&_svg]:!fill-current"
                />

                <MiniMap
                  position="bottom-right"
                  onClick={() => {}}
                  nodeColor={(n) => n.data?.color || "#333"}
                  maskColor="rgba(0, 0, 0, 0.45)"
                  className="!bg-canvas-card !border !border-canvas-border"
                  style={{ width: 120, height: 90 }}
                />
              </ReactFlow>
            </div>
          </div>
        </section>
      </div>

      {isAddOpen ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-canvas-bg/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg border border-canvas-border-strong bg-canvas-card p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-canvas-border pb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-canvas-text">
                  Add Branch
                </h3>
                <p className="mt-1 text-xs text-canvas-muted">
                  Create a branch now. Details can be added later.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="text-canvas-dim transition-colors hover:text-canvas-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {fieldDefinitions.map((field) => (
                <label key={field.key} className="block space-y-1">
                  <span className="block font-mono text-[8px] font-bold uppercase tracking-wider text-canvas-muted">
                    {field.label}
                  </span>
                  <input
                    type="text"
                    required={field.key === "title"}
                    placeholder={field.placeholder}
                    value={formValues[field.key]}
                    onChange={updateField(field.key)}
                    maxLength={field.maxLength}
                    className="w-full border border-canvas-border bg-canvas-secondary px-3 py-2 text-xs text-canvas-text placeholder-canvas-dim focus:border-canvas-border-strong focus:outline-none"
                    autoFocus={field.key === "title"}
                  />
                </label>
              ))}

              <div className="flex items-center justify-end gap-3 border-t border-canvas-border pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-[9px] font-mono uppercase tracking-widest text-canvas-muted transition-colors hover:text-canvas-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-canvas-inverse-bg px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-canvas-inverse-text transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? "Saving" : "Add Branch"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
