"use client";

import { useEffect, useState } from "react";
import type { Material } from "@parasnath/shared";

export function EmbeddedPdfViewer({
  material,
  onClose,
}: {
  material: Material;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewer-title"
      className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-xs p-2 sm:p-6"
    >
      <div className="flex flex-1 flex-col rounded-3xl border border-card-border bg-card shadow-2xl overflow-hidden">
        {/* Viewer Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b border-card-border bg-brand-dark px-4 py-3 text-white gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              In-App Secure Reader
            </span>
            <div>
              <h2 id="viewer-title" className="text-sm font-bold truncate max-w-md">
                {material.title}
              </h2>
              {material.is_important && (
                <span className="text-[10px] text-amber-300 font-semibold">
                  ⭐ Board High-Yield Topic
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(75, z - 15))}
              className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20"
              title="Zoom Out"
            >
              -
            </button>
            <span className="text-xs font-mono">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(150, z + 15))}
              className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20"
              title="Zoom In"
            >
              +
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white hover:bg-white/30 ml-2"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Embedded Frame */}
        <div className="flex-1 bg-neutral-900 overflow-auto flex justify-center p-2 sm:p-4">
          <div
            style={{ width: `${zoom}%`, minHeight: "100%" }}
            className="transition-all duration-200 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
          >
            <iframe
              src={`${material.file_url}#toolbar=0&navpanes=0`}
              title={material.title}
              className="w-full flex-1 border-0 min-h-[70vh]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
