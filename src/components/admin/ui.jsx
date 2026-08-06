import { Loader2 } from "lucide-react";
import { formatPrice } from "../../lib/format";

/**
 * `bodyClass` pads the content only — tables pass nothing and manage their own
 * cell padding, forms pass p-5.
 */
export function Panel({ title, action, children, className = "", bodyClass = "" }) {
  return (
    <section className={`border border-cream/10 bg-onyx ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-cream/10 px-5 py-4">
          <h2 className="font-display text-lg">{title}</h2>
          {action}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

export function StatCard({ label, value, hint, tone = "default" }) {
  const toneClass = { default: "text-cream", gold: "text-gold", warn: "text-amber-400" }[tone];

  return (
    <div className="border border-cream/10 bg-onyx p-5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-cream/40">{label}</p>
      <p className={`mt-3 font-display text-2xl md:text-3xl ${toneClass}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-cream/40">{hint}</p>}
    </div>
  );
}

const STATUS_STYLES = {
  pending: "border-amber-400/40 text-amber-300",
  confirmed: "border-sky-400/40 text-sky-300",
  shipped: "border-violet-400/40 text-violet-300",
  delivered: "border-emerald-400/40 text-emerald-300",
  cancelled: "border-red-400/40 text-red-300",
  active: "border-emerald-400/40 text-emerald-300",
  inactive: "border-cream/25 text-cream/40",
  owner: "border-gold/50 text-gold",
  manager: "border-cream/25 text-cream/60",
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${
        STATUS_STYLES[status] ?? "border-cream/25 text-cream/60"
      }`}
    >
      {status}
    </span>
  );
}

export function Spinner({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-cream/50">
      <Loader2 size={24} className="animate-spin text-gold" />
      <p className="text-xs uppercase tracking-[0.25em]">{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {Icon && <Icon size={26} strokeWidth={1.5} className="text-cream/25" />}
      <p className="font-display text-lg">{title}</p>
      {hint && <p className="max-w-sm text-sm text-cream/40">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="max-w-md text-sm text-red-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="border border-gold px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-ink"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/**
 * Horizontal scroll lives on the wrapper so wide tables never push the page
 * sideways on a phone.
 */
export function TableWrap({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = "" }) {
  return (
    <th className={`px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }) {
  return <td className={`px-5 py-4 align-middle ${className}`}>{children}</td>;
}

export function Pagination({ meta, onPage }) {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-cream/10 px-5 py-4 text-xs">
      <p className="text-cream/40">
        {meta.from}–{meta.to} of {meta.total}
      </p>
      <div className="flex gap-2">
        <button
          disabled={meta.current_page <= 1}
          onClick={() => onPage(meta.current_page - 1)}
          className="border border-cream/20 px-4 py-2 uppercase tracking-[0.2em] text-cream/60 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          Prev
        </button>
        <button
          disabled={meta.current_page >= meta.last_page}
          onClick={() => onPage(meta.current_page + 1)}
          className="border border-cream/20 px-4 py-2 uppercase tracking-[0.2em] text-cream/60 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function PrimaryButton({ children, loading, className = "", ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 border border-cream/20 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-cream/60 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function Field({ label, error, hint, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50">{label}</label>
      {children}
      {hint && !error && <p className="mt-2 text-xs text-cream/30">{hint}</p>}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export const Money = ({ amount }) => <>{formatPrice(amount)}</>;
