import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Check, Loader2, Lock } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import { CatalogLoading } from "../../components/CatalogState";

export default function CheckoutPage() {
  const { items, rawItems, subtotal, clearCart, loading } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Checked before the empty-bag guard — the bag is cleared once the order lands.
  if (placedOrder) {
    return <OrderConfirmation order={placedOrder} />;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
        <CatalogLoading label="Loading your order" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 text-center md:px-8">
        <h1 className="font-display text-3xl">Nothing to check out</h1>
        <Link to="/shop" className="mt-6 inline-block text-sm uppercase tracking-[0.2em] text-gold">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFieldErrors((errors) => ({ ...errors, [name]: undefined }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFieldErrors({});

    try {
      const order = await createOrder({
        customer_name: form.name,
        customer_phone: form.phone,
        delivery_address: form.address,
        note: form.note || null,
        // Sent from the raw lines so nothing dropped by the catalog view is lost.
        items: rawItems.map((i) => ({
          product_id: i.productId,
          length: i.length,
          qty: i.qty,
        })),
      });

      setPlacedOrder(order.data);
      clearCart();
      toast.success("Order placed — we'll be in touch shortly.");
    } catch (error) {
      // Map Laravel's item-level keys back onto the form fields shoppers can see.
      setFieldErrors({
        name: error.errors?.customer_name,
        phone: error.errors?.customer_phone,
        address: error.errors?.delivery_address,
        note: error.errors?.note,
      });
      toast.error(error.message ?? "We couldn't place that order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-gold"
      >
        <ArrowLeft size={14} /> Back to bag
      </Link>
      <h1 className="mt-6 font-display text-4xl md:text-5xl">Checkout</h1>
      <div className="hairline mt-5" />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={placeOrder} noValidate className="space-y-5">
          <Field label="Full name" name="name" error={fieldErrors.name}>
            <input id="name" name="name" required value={form.name} onChange={onChange} placeholder="Adaeze Okafor" />
          </Field>
          <Field label="Phone (WhatsApp)" name="phone" error={fieldErrors.phone}>
            <input id="phone" name="phone" type="tel" required value={form.phone} onChange={onChange} placeholder="+234 800 000 0000" />
          </Field>
          <Field label="Delivery address" name="address" error={fieldErrors.address}>
            <textarea id="address" name="address" required rows={3} value={form.address} onChange={onChange} placeholder="Street, city, state" />
          </Field>
          <Field
            label={
              <>
                Order note <span className="normal-case tracking-normal text-cream/30">(optional)</span>
              </>
            }
            name="note"
            error={fieldErrors.note}
          >
            <textarea id="note" name="note" rows={2} value={form.note} onChange={onChange} placeholder="Anything we should know?" />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Placing order
              </>
            ) : (
              <>
                <Lock size={16} /> Place order
              </>
            )}
          </button>
          <p className="text-center text-xs text-cream/40">
            We'll confirm your order and arrange payment and delivery by phone.
          </p>
        </form>

        <aside className="h-fit border border-cream/10 bg-onyx p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl">Your order</h2>
          <ul className="mt-6 space-y-4 text-sm">
            {items.map((i) => (
              <li key={`${i.productId}-${i.length}`} className="flex justify-between gap-4 text-cream/60">
                <span>
                  {i.product.name} <span className="text-cream/40">({i.length}) ×{i.qty}</span>
                </span>
                <span className="shrink-0">{formatPrice(i.product.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between border-t border-cream/10 pt-4">
            <span>Total</span>
            <span className="text-gold">{formatPrice(subtotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, name, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor={name}>
        {label}
      </label>
      {children}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function OrderConfirmation({ order }) {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-40 text-center md:px-8">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold">
        <Check size={26} strokeWidth={1.5} />
      </span>
      <h1 className="mt-8 font-display text-4xl">Order received</h1>
      <p className="mt-4 text-cream/60">
        Thank you, {order.customer_name.split(" ")[0]}. We'll call {order.customer_phone} to
        confirm payment and delivery.
      </p>

      <div className="mt-10 border border-cream/10 bg-onyx p-6 text-left">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-cream/40">Order reference</p>
          <p className="font-display text-lg text-gold">{order.reference}</p>
        </div>
        <ul className="mt-6 space-y-3 text-sm">
          {order.items?.map((i) => (
            <li key={`${i.product_id}-${i.length}`} className="flex justify-between gap-4 text-cream/60">
              <span>
                {i.name} <span className="text-cream/40">({i.length}) ×{i.qty}</span>
              </span>
              <span className="shrink-0">{formatPrice(i.line_total)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-cream/10 pt-4">
          <span>Total</span>
          <span className="text-gold">{formatPrice(order.subtotal)}</span>
        </div>
      </div>

      <Link
        to="/shop"
        className="mt-10 inline-block bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
      >
        Continue shopping
      </Link>
    </div>
  );
}
