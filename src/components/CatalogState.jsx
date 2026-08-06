import { Loader2, WifiOff } from "lucide-react";

export function CatalogLoading({ label = "Loading the collection" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-cream/50">
      <Loader2 size={28} strokeWidth={1.5} className="animate-spin text-gold" />
      <p className="text-xs uppercase tracking-[0.3em]">{label}</p>
    </div>
  );
}

export function CatalogError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <WifiOff size={28} strokeWidth={1.5} className="text-gold" />
      <p className="max-w-sm text-cream/60">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 border border-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-ink"
        >
          Try again
        </button>
      )}
    </div>
  );
}
