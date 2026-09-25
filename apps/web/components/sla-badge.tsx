export function SlaBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-emerald-700/20 bg-emerald-50/90 px-3 py-1 text-xs font-semibold text-emerald-900 shadow-xs"
      title="Our sub-second interaction commitment"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-700"></span>
      </span>
      <span>⚡ Responsive Time Promise: &lt;100ms UI latency · Instant NCERT navigation</span>
    </div>
  );
}
