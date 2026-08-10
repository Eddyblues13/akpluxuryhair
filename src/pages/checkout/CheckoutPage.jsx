import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Check, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../lib/api";
import { formatPrice } from "../../lib/format";
import { orderMessage, openWhatsApp, WHATSAPP_DISPLAY } from "../../lib/whatsapp";
import { CatalogLoading } from "../../components/CatalogState";

/** Used only when the API can't be reached — the shopper still gets a ref. */
const localReference = () => `AKP-${Date.now().toString(36).toUpperCase().slice(-6)}`;

const validate = ({ name, phone, address }) => {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Please enter your full name.";
  if (phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a reachable WhatsApp number.";
  if (address.trim().length < 8) errors.address = "Enter a delivery address we can find.";
  return errors;
};

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
        <Link to="/shop" className="btn btn-gold mt-8">
          Back to shop
        </Link>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFieldErrors((errors) => ({ ...errors, [name]: undefined }));
  };

  // Snapshot the lines before clearCart empties them out from under the message.
  const snapshot = () =>
    items.map((i) => ({
      name: i.product.name,
      length: i.length,
      qty: i.qty,
      unitPrice: i.product.price,
    }));

  const handOff = (reference, lines) => {
    const message = orderMessage({
      reference,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      note: form.note.trim(),
      items: lines,
      subtotal,
    });

    setPlacedOrder({
      reference,
      items: lines,
      subtotal,
      message,
      name: form.name.trim(),
    });
    clearCart();
    // Kept in this tab if the popup is blocked — the confirmation screen carries
    // an "Open WhatsApp" button, and that click is a gesture blockers allow.
    openWhatsApp(message, { redirectIfBlocked: false });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length) {
      setFieldErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    const lines = snapshot();

    try {
      const order = await createOrder({
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        delivery_address: form.address.trim(),
        note: form.note.trim() || null,
        // Sent from the raw lines so nothing dropped by the catalog view is lost.
        items: rawItems.map((i) => ({
          product_id: i.productId,
          length: i.length,
          qty: i.qty,
        })),
      });

      handOff(order.data.reference, lines);
    } catch (error) {
      // Map Laravel's item-level keys back onto the form fields shoppers can see.
      const mapped = {
        name: error.errors?.customer_name,
        phone: error.errors?.customer_phone,
        address: error.errors?.delivery_address,
        note: error.errors?.note,
      };

      if (Object.values(mapped).some(Boolean)) {
        setFieldErrors(mapped);
        toast.error(error.message ?? "Please check the details above.");
        return;
      }

      // The store is unreachable or erroring — don't lose the sale over it.
      // The order goes to WhatsApp with a locally generated reference instead.
      toast("Taking your order straight to WhatsApp.", { icon: "💬" });
      handOff(localReference(), lines);
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
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-cream/50">
        Fill in your details and we'll open WhatsApp with your order ready to send. Payment and
        delivery are confirmed there with our team.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <form onSubmit={placeOrder} noValidate className="surface space-y-5 p-6 md:p-8">
          <Field label="Full name" name="name" error={fieldErrors.name}>
            <input
              id="name"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={onChange}
              placeholder="Adaeze Okafor"
            />
          </Field>
          <Field label="Phone (WhatsApp)" name="phone" error={fieldErrors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={onChange}
              placeholder="+234 800 000 0000"
            />
          </Field>
          <Field label="Delivery address" name="address" error={fieldErrors.address}>
            <textarea
              id="address"
              name="address"
              rows={3}
              autoComplete="street-address"
              value={form.address}
              onChange={onChange}
              placeholder="Street, city, state"
            />
          </Field>
          <Field
            label={
              <>
                Order note{" "}
                <span className="normal-case tracking-normal text-cream/30">(optional)</span>
              </>
            }
            name="note"
            error={fieldErrors.note}
          >
            <textarea
              id="note"
              name="note"
              rows={2}
              value={form.note}
              onChange={onChange}
              placeholder="Anything we should know?"
            />
          </Field>

          <button type="submit" disabled={submitting} className="btn btn-whatsapp w-full">
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Placing order
              </>
            ) : (
              <>
                <MessageCircle size={16} /> Complete order on WhatsApp
              </>
            )}
          </button>

          <p className="flex items-center justify-center gap-2 text-center text-xs text-cream/40">
            <ShieldCheck size={14} className="text-gold" /> No card details needed — we confirm
            everything on {WHATSAPP_DISPLAY}.
          </p>
        </form>

        <aside className="surface h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl">Your order</h2>
          <ul className="mt-6 space-y-4 text-sm">
            {items.map((i) => (
              <li
                key={`${i.productId}-${i.length}`}
                className="flex justify-between gap-4 text-cream/60"
              >
                <span>
                  {i.product.name}{" "}
                  <span className="text-cream/40">
                    ({i.length}) ×{i.qty}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums">
                  {formatPrice(i.product.price * i.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-baseline justify-between border-t border-cream/10 pt-4">
            <span>Total</span>
            <span className="font-display text-2xl text-gold">{formatPrice(subtotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, name, error, children }) {
  return (
    <div>
      <label
        className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50"
        htmlFor={name}
      >
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
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold bg-gold/10 text-gold">
        <Check size={28} strokeWidth={1.5} />
      </span>
      <h1 className="mt-8 font-display text-4xl">Order received</h1>
      <p className="mt-4 leading-relaxed text-cream/60">
        Thank you, {order.name.split(" ")[0]}. We've opened WhatsApp with your order — just hit
        send and our team will confirm payment and delivery.
      </p>

      <button
        onClick={() => openWhatsApp(order.message)}
        className="btn btn-whatsapp mt-8 w-full sm:w-auto"
      >
        <MessageCircle size={16} /> Open WhatsApp
      </button>
      <p className="mt-3 text-xs text-cream/35">Didn't open automatically? Tap the button above.</p>

      <div className="surface mt-10 p-6 text-left">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-cream/40">Order reference</p>
          <p className="font-display text-lg text-gold">{order.reference}</p>
        </div>
        <ul className="mt-6 space-y-3 text-sm">
          {order.items.map((i) => (
            <li key={`${i.name}-${i.length}`} className="flex justify-between gap-4 text-cream/60">
              <span>
                {i.name}{" "}
                <span className="text-cream/40">
                  ({i.length}) ×{i.qty}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">{formatPrice(i.unitPrice * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-baseline justify-between border-t border-cream/10 pt-4">
          <span>Total</span>
          <span className="font-display text-xl text-gold">{formatPrice(order.subtotal)}</span>
        </div>
      </div>

      <Link to="/shop" className="btn btn-outline mt-10">
        Continue shopping
      </Link>
    </div>
  );
}
