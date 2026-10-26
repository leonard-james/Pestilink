export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 rounded-xl bg-gray-900/90 px-5 py-4 text-white shadow-xl">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-emerald-400" />
        <span className="text-sm font-medium">Loading page...</span>
      </div>
    </div>
  );
}
