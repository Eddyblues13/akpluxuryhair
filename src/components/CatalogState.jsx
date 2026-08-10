import { Loader2, WifiOff } from "lucide-react";

export function CatalogLoading({ label = "Loading the collection" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-cream/50">
      <Loader2 size={28} strokeWidth={1.5} className="animate-spin text-gold" />
      <p className="text-xs uppercase tracking-[0.3em]">{label}</p>
    </div>
  );
}

/** Grid placeholder that holds the same shape as the cards it stands in for. */
export function CatalogSkeleton({ count = 8, className = "" }) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface overflow-hidden">
          <div className="skeleton aspect-[4/5] rounded-none" />
          <div className="space-y-3 p-4">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-9 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CatalogError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <WifiOff size={28} strokeWidth={1.5} className="text-gold" />
      <p className="max-w-sm text-cream/60">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline mt-2">
          Try again
        </button>
      )}
    </div>
  );
}
