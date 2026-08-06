import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Check, Inbox, RotateCcw, Trash2 } from "lucide-react";
import { deleteMessage, fetchMessages, toggleMessageHandled } from "../../lib/adminApi";
import { useAsyncData } from "../../hooks/useAsyncData";
import {
  EmptyState,
  ErrorState,
  GhostButton,
  Pagination,
  Panel,
  Spinner,
  StatusBadge,
} from "../../components/admin/ui";

const dateTime = (iso) =>
  new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function MessagesPage() {
  const [filters, setFilters] = useState({ search: "", status: "", page: 1 });
  const [busyId, setBusyId] = useState(null);

  const fetcher = useCallback(
    (signal) =>
      fetchMessages({ search: filters.search, status: filters.status, page: filters.page }, signal),
    [filters]
  );

  const { data, status, error, reload } = useAsyncData(fetcher);

  const onToggle = async (message) => {
    setBusyId(message.id);
    try {
      const updated = await toggleMessageHandled(message.id);
      toast.success(updated.data.is_handled ? "Marked as handled." : "Reopened.");
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (message) => {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;

    setBusyId(message.id);
    try {
      await deleteMessage(message.id);
      toast.success("Message deleted.");
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl">Messages</h1>
          <div className="hairline mt-4" />
        </div>
        {data?.meta?.unhandled_count > 0 && (
          <p className="text-sm text-amber-300">{data.meta.unhandled_count} awaiting a reply</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          placeholder="Search name, email or text"
          className="max-w-xs"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
          className="max-w-[200px]"
        >
          <option value="">All messages</option>
          <option value="unhandled">Awaiting reply</option>
          <option value="handled">Handled</option>
        </select>
      </div>

      <Panel>
        {status === "loading" && <Spinner label="Loading messages" />}
        {status === "error" && <ErrorState message={error} onRetry={reload} />}

        {status === "ready" && data.data.length === 0 && (
          <EmptyState
            icon={Inbox}
            title="Nothing here"
            hint="Messages sent from the contact page arrive in this inbox."
          />
        )}

        {status === "ready" && data.data.length > 0 && (
          <>
            <ul className="divide-y divide-cream/5">
              {data.data.map((message) => (
                <li key={message.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-3">
                        <span>{message.name}</span>
                        {!message.is_handled ? (
                          <StatusBadge status="pending" />
                        ) : (
                          <StatusBadge status="delivered" />
                        )}
                      </p>
                      <a
                        href={`mailto:${message.email}`}
                        className="mt-1 block text-xs text-gold hover:underline"
                      >
                        {message.email}
                      </a>
                      <p className="mt-1 text-xs text-cream/30">{dateTime(message.created_at)}</p>
                    </div>
                    <div className="flex gap-2">
                      <GhostButton onClick={() => onToggle(message)} disabled={busyId === message.id}>
                        {message.is_handled ? <RotateCcw size={14} /> : <Check size={14} />}
                        {message.is_handled ? "Reopen" : "Handled"}
                      </GhostButton>
                      <GhostButton
                        onClick={() => onDelete(message)}
                        disabled={busyId === message.id}
                        className="hover:border-red-400/60 hover:text-red-400"
                        aria-label="Delete message"
                      >
                        <Trash2 size={14} />
                      </GhostButton>
                    </div>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-cream/60">
                    {message.message}
                  </p>
                </li>
              ))}
            </ul>
            <Pagination meta={data.meta} onPage={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Panel>
    </div>
  );
}
