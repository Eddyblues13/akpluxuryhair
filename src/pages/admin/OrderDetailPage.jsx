import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Trash2 } from "lucide-react";
import { deleteOrder, fetchAdminOrder, updateOrderStatus } from "../../lib/adminApi";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatPrice } from "../../lib/format";
import {
  ErrorState,
  GhostButton,
  Panel,
  Spinner,
  StatusBadge,
  TableWrap,
  Td,
  Th,
} from "../../components/admin/ui";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const dateTime = (iso) =>
  new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const fetcher = useCallback((signal) => fetchAdminOrder(id, signal), [id]);
  const { data, status, error, reload, setData } = useAsyncData(fetcher);

  if (status === "loading") return <Spinner label="Loading order" />;
  if (status === "error") return <ErrorState message={error} onRetry={reload} />;

  const order = data.data;

  const changeStatus = async (next) => {
    if (next === order.status) return;

    setBusy(true);
    try {
      const updated = await updateOrderStatus(id, next);
      setData(updated);
      toast.success(`Order marked ${next}.`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete order ${order.reference}? This cannot be undone.`)) return;

    setBusy(true);
    try {
      const result = await deleteOrder(id);
      toast.success(result.message);
      navigate("/admin/orders");
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-gold"
      >
        <ArrowLeft size={14} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl">{order.reference}</h1>
          <p className="mt-2 text-sm text-cream/40">Placed {dateTime(order.created_at)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Panel title="Items">
            <TableWrap>
              <thead className="border-b border-cream/10">
                <tr>
                  <Th>Product</Th>
                  <Th>Length</Th>
                  <Th>Qty</Th>
                  <Th className="text-right">Line total</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream/5">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <Td>
                      <p>{item.name}</p>
                      <p className="mt-1 text-xs text-cream/30">
                        {formatPrice(item.unit_price)} each
                      </p>
                    </Td>
                    <Td className="text-cream/60">{item.length}</Td>
                    <Td className="text-cream/60">{item.qty}</Td>
                    <Td className="text-right text-gold">{formatPrice(item.line_total)}</Td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-cream/10">
                  <Td className="text-cream/50" />
                  <Td />
                  <Td className="text-xs uppercase tracking-[0.2em] text-cream/50">Total</Td>
                  <Td className="text-right font-display text-xl text-gold">
                    {formatPrice(order.subtotal)}
                  </Td>
                </tr>
              </tfoot>
            </TableWrap>
          </Panel>

          <Panel title="Update status" bodyClass="p-5">
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={busy}
                  onClick={() => changeStatus(s)}
                  className={`border px-4 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-40 ${
                    order.status === s
                      ? "border-gold bg-gold text-ink"
                      : "border-cream/20 text-cream/60 hover:border-gold hover:text-gold"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-cream/30">
              Cancelled orders are excluded from revenue totals on the dashboard.
            </p>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel title="Customer" bodyClass="p-5">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Name</dt>
                <dd className="mt-1">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:${order.customer_phone}`} className="text-gold hover:underline">
                    {order.customer_phone}
                  </a>
                </dd>
              </div>
              {order.customer_email && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Email</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${order.customer_email}`} className="text-gold hover:underline">
                      {order.customer_email}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40">
                  Delivery address
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-cream/70">{order.delivery_address}</dd>
              </div>
              {order.note && (
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Note</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-cream/70">{order.note}</dd>
                </div>
              )}
            </dl>
          </Panel>

          <Panel title="Danger zone" bodyClass="p-5">
            <GhostButton
              onClick={remove}
              disabled={busy}
              className="w-full hover:border-red-400/60 hover:text-red-400"
            >
              <Trash2 size={15} /> Delete order
            </GhostButton>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
