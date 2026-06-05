"use client";
import { type RefObject, useRef } from "react";
import { ThemeToggle } from "../components/themes/ToggleWrapper";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  const demoRef = useRef<HTMLDivElement | null>(null);
  const scrollToSection = (elementRef: RefObject<HTMLDivElement | null>) => {
    elementRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (

      <div className="min-h-screen bg-canvas-bg font-sans text-canvas-text selection:bg-canvas-text/10 selection:text-canvas-text transition-colors duration-250">
        <header className="border-b border-canvas-border bg-canvas-bg/90 px-4 py-4 transition-colors duration-250 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-6 w-6 items-center justify-center border border-canvas-text bg-transparent">
                <div className="h-2.5 w-2.5 rotate-45 bg-canvas-text" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-canvas-text">
                one Tree
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Show when="signed-out">
                <SignInButton mode="modal" forceRedirectUrl="/home" >
                  <button
                    type="button"
                    className="border border-canvas-border-strong px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-canvas-muted transition-colors duration-200 hover:border-canvas-text hover:bg-canvas-secondary hover:text-canvas-text"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/home">
                  <button
                    type="button"
                    className="border border-canvas-inverse-bg bg-canvas-inverse-bg px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-canvas-inverse-text transition-colors duration-200 hover:opacity-85"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                
                <UserButton />
              </Show>
              <ThemeToggle className="border border-canvas-border-strong px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-canvas-muted transition-colors duration-200 hover:border-canvas-text hover:bg-canvas-secondary hover:text-canvas-text" />
            </div>
          </div>
        </header>

        {/* BrandingHeader*/}

        <main className="relative overflow-hidden pb-12 pt-24 sm:pb-16 sm:pt-32 lg:pb-24">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-40 transition-colors duration-250" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center space-x-1.5 border border-canvas-border bg-canvas-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-canvas-muted transition-colors duration-250">
                <span className="flex h-1.5 w-1.5 animate-pulse bg-canvas-text" />
                <span>01 // Docking the Roadmaps System</span>
              </div>

              <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-canvas-text transition-colors duration-250 sm:text-7xl sm:leading-none">
                Align your ambition. <br />
                <span className="font-serif font-normal italic text-canvas-text/90">
                  Grow interconnected paths.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-canvas-muted transition-colors duration-250">
                Lists are dead. Folders isolate knowledge. Organise progress as
                branches, interactive nodes, and dependency pathways. Build custom
                work plans and preview your learning roadmaps visually with one Tree.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollToSection(demoRef)}
                  className="w-full border-2 border-canvas-inverse-bg bg-canvas-inverse-bg px-6 py-3 text-xs font-bold uppercase tracking-widest text-canvas-inverse-text transition-all duration-200 hover:opacity-85 sm:w-auto"
                >
                  Interactive Sandbox
                </button>
                <Show when="signed-out">
                  <SignUpButton mode="modal" forceRedirectUrl="/home">
                    <button
                      type="button"
                      className="w-full border border-canvas-border-strong px-6 py-3 text-xs font-bold uppercase tracking-widest text-canvas-muted transition-all duration-200 hover:border-canvas-text hover:bg-canvas-secondary hover:text-canvas-text sm:w-auto"
                    >
                      Create Account
                    </button>
                  </SignUpButton>
                </Show>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-canvas-border-strong pt-8 font-mono text-[9px] font-bold uppercase tracking-widest text-canvas-muted transition-colors duration-250">
                <span>Dynamic Paths</span>
                <span>Markdown Workspace</span>
                <span>Verifiable Planner</span>
              </div>
            </div>
          </div>
        </main>

        <div ref={demoRef} className="scroll-mt-10" />
        {/* VisualGraphDemo*/}

        {/* FeaturesGrid */}

        {/* ArchitectureView */}

        <footer className="border-t border-canvas-border bg-canvas-secondary px-4 py-12 transition-colors duration-250 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-6 w-6 items-center justify-center border border-canvas-text bg-transparent">
                <div className="h-2.5 w-2.5 rotate-45 bg-canvas-text" />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-canvas-text">
                Dento
              </span>
            </div>
            <p className="font-mono text-[9px] text-canvas-muted">
              (c) 2026 one Tree. Architectural planning mockup. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
  );
}


