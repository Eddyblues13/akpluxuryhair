import { useCallback } from "react";
import { Link } from "react-router-dom";
import { Inbox, ReceiptText, TrendingDown, TrendingUp } from "lucide-react";
import { fetchDashboard } from "../../lib/adminApi";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatPrice } from "../../lib/format";
import {
  EmptyState,
  ErrorState,
  Panel,
  Spinner,
  StatCard,
  StatusBadge,
  TableWrap,
  Td,
  Th,
} from "../../components/admin/ui";

const shortDate = (iso) =>
  new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });

export default function DashboardPage() {
  const fetcher = useCallback((signal) => fetchDashboard(signal), []);
  const { data, status, error, reload } = useAsyncData(fetcher);

  if (status === "loading") return <Spinner label="Loading dashboard" />;
  if (status === "error") return <ErrorState message={error} onRetry={reload} />;

  const stats = data.data;
  const change = stats.revenue_change;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">Dashboard</h1>
        <div className="hairline mt-4" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue this month"
          value={formatPrice(stats.revenue_this_month)}
          tone="gold"
          hint={
            change === null
              ? "No sales last month to compare"
              : `${change >= 0 ? "+" : ""}${change}% vs last month`
          }
        />
        <StatCard label="Revenue all time" value={formatPrice(stats.revenue_total)} />
        <StatCard
          label="Pending orders"
          value={stats.orders_pending}
          tone={stats.orders_pending > 0 ? "warn" : "default"}
          hint={`${stats.orders_total} orders all time`}
        />
        <StatCard
          label="Unread messages"
          value={stats.messages_unhandled}
          tone={stats.messages_unhandled > 0 ? "warn" : "default"}
          hint={`${stats.products_total} products, ${stats.products_inactive} hidden`}
        />
      </div>

      {change !== null && (
        <p className="flex items-center gap-2 text-sm text-cream/50">
          {change >= 0 ? (
            <TrendingUp size={16} className="text-emerald-400" />
          ) : (
            <TrendingDown size={16} className="text-red-400" />
          )}
          Last month brought in {formatPrice(stats.revenue_last_month)}.
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Recent orders"
          action={
            <Link to="/admin/orders" className="text-xs uppercase tracking-[0.2em] text-gold">
              View all
            </Link>
          }
        >
          {stats.recent_orders.length === 0 ? (
            <EmptyState icon={ReceiptText} title="No orders yet" hint="New orders will appear here." />
          ) : (
            <TableWrap>
              <thead className="border-b border-cream/10">
                <tr>
                  <Th>Reference</Th>
                  <Th>Customer</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Total</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5">
                {stats.recent_orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-cream/5">
                    <Td>
                      <Link to={`/admin/orders/${order.id}`} className="text-gold hover:underline">
                        {order.reference}
                      </Link>
                      <p className="mt-1 text-xs text-cream/30">{shortDate(order.created_at)}</p>
                    </Td>
                    <Td className="text-cream/70">{order.customer_name}</Td>
                    <Td>
                      <StatusBadge status={order.status} />
                    </Td>
                    <Td className="text-right text-gold">{formatPrice(order.subtotal)}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </Panel>

        <Panel title="Best sellers">
          {stats.best_sellers.length === 0 ? (
            <EmptyState title="Nothing sold yet" hint="Units sold are counted across all orders." />
          ) : (
            <TableWrap>
              <thead className="border-b border-cream/10">
                <tr>
                  <Th>Product</Th>
                  <Th>Price</Th>
                  <Th className="text-right">Units sold</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5">
                {stats.best_sellers.map((product) => (
                  <tr key={product.id}>
                    <Td>
                      <p>{product.name}</p>
                      <p className="mt-1 text-xs text-cream/30">{product.category}</p>
                    </Td>
                    <Td className="text-cream/60">{formatPrice(product.price)}</Td>
                    <Td className="text-right font-display text-lg text-gold">{product.units_sold}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Orders by status">
          <div className="grid grid-cols-2 gap-px bg-cream/10 sm:grid-cols-5">
            {Object.entries(stats.order_status_counts).map(([label, count]) => (
              <div key={label} className="bg-onyx p-4 text-center">
                <p className="font-display text-2xl">{count}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cream/40">{label}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Recent messages"
          action={
            <Link to="/admin/messages" className="text-xs uppercase tracking-[0.2em] text-gold">
              View all
            </Link>
          }
        >
          {stats.recent_messages.length === 0 ? (
            <EmptyState icon={Inbox} title="No messages yet" />
          ) : (
            <ul className="divide-y divide-cream/5">
              {stats.recent_messages.map((message) => (
                <li key={message.id} className="px-5 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm">
                      {message.name}{" "}
                      <span className="text-xs text-cream/30">{message.email}</span>
                    </p>
                    {!message.is_handled && <StatusBadge status="pending" />}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-cream/50">{message.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
