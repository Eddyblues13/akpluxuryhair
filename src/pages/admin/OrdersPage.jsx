import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ReceiptText } from "lucide-react";
import { fetchAdminOrders } from "../../lib/adminApi";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatPrice } from "../../lib/format";
import {
  EmptyState,
  ErrorState,
  Pagination,
  Panel,
  Spinner,
  StatusBadge,
  TableWrap,
  Td,
  Th,
} from "../../components/admin/ui";

const dateTime = (iso) =>
  new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrdersPage() {
  const [filters, setFilters] = useState({ search: "", status: "", page: 1 });

  const fetcher = useCallback(
    (signal) =>
      fetchAdminOrders(
        { search: filters.search, status: filters.status, page: filters.page },
        signal
      ),
    [filters]
  );

  const { data, status, error, reload } = useAsyncData(fetcher);
  const counts = data?.meta?.counts ?? {};
  const statuses = data?.meta?.statuses ?? [];

  const setStatus = (value) => setFilters((f) => ({ ...f, status: value, page: 1 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">Orders</h1>
        <div className="hairline mt-4" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatus("")}
          className={`border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
            filters.status === ""
              ? "border-gold bg-gold text-ink"
              : "border-cream/20 text-cream/60 hover:border-gold hover:text-gold"
          }`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
              filters.status === s
                ? "border-gold bg-gold text-ink"
                : "border-cream/20 text-cream/60 hover:border-gold hover:text-gold"
            }`}
          >
            {s} {counts[s] > 0 && <span className="opacity-60">({counts[s]})</span>}
          </button>
        ))}
      </div>

      <input
        value={filters.search}
        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
        placeholder="Search reference, customer or phone"
        className="max-w-sm"
      />

      <Panel>
        {status === "loading" && <Spinner label="Loading orders" />}
        {status === "error" && <ErrorState message={error} onRetry={reload} />}

        {status === "ready" && data.data.length === 0 && (
          <EmptyState
            icon={ReceiptText}
            title="No orders here"
            hint="Orders placed on the storefront land in this list."
          />
        )}

        {status === "ready" && data.data.length > 0 && (
          <>
            <TableWrap>
              <thead className="border-b border-cream/10">
                <tr>
                  <Th>Reference</Th>
                  <Th>Customer</Th>
                  <Th>Items</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Total</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5">
                {data.data.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-cream/5">
                    <Td>
                      <Link to={`/admin/orders/${order.id}`} className="text-gold hover:underline">
                        {order.reference}
                      </Link>
                      <p className="mt-1 text-xs text-cream/30">{dateTime(order.created_at)}</p>
                    </Td>
                    <Td>
                      <p className="text-cream/70">{order.customer_name}</p>
                      <p className="mt-1 text-xs text-cream/30">{order.customer_phone}</p>
                    </Td>
                    <Td className="text-cream/60">{order.items_count}</Td>
                    <Td>
                      <StatusBadge status={order.status} />
                    </Td>
                    <Td className="text-right text-gold">{formatPrice(order.subtotal)}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
            <Pagination meta={data.meta} onPage={(page) => setFilters((f) => ({ ...f, page }))} />
          </>
        )}
      </Panel>
    </div>
  );
}
