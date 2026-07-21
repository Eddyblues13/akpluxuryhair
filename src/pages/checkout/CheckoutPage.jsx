import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/format";

// Update to the store's real WhatsApp number (international format, no "+").
const WHATSAPP_NUMBER = "2340000000000";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });

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

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const placeOrder = (e) => {
    e.preventDefault();

    const lines = [
      "*New order — AKP Luxury Hair*",
      "",
      ...items.map(
        (i) => `• ${i.product.name} (${i.length}) x${i.qty} — ${formatPrice(i.product.price * i.qty)}`
      ),
      "",
      `*Total: ${formatPrice(subtotal)}*`,
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Delivery address: ${form.address}`,
      form.note ? `Note: ${form.note}` : null,
    ].filter(Boolean);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");

    clearCart();
    toast.success("Order sent! We'll confirm on WhatsApp shortly.");
    navigate("/");
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
        <form onSubmit={placeOrder} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor="name">
              Full name
            </label>
            <input id="name" name="name" required value={form.name} onChange={onChange} placeholder="Adaeze Okafor" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor="phone">
              Phone (WhatsApp)
            </label>
            <input id="phone" name="phone" type="tel" required value={form.phone} onChange={onChange} placeholder="+234 800 000 0000" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor="address">
              Delivery address
            </label>
            <textarea id="address" name="address" required rows={3} value={form.address} onChange={onChange} placeholder="Street, city, state" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor="note">
              Order note <span className="normal-case tracking-normal text-cream/30">(optional)</span>
            </label>
            <textarea id="note" name="note" rows={2} value={form.note} onChange={onChange} placeholder="Anything we should know?" />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            <MessageCircle size={16} /> Place order via WhatsApp
          </button>
          <p className="text-center text-xs text-cream/40">
            Your order opens in WhatsApp for confirmation — payment and delivery
            are arranged there.
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
