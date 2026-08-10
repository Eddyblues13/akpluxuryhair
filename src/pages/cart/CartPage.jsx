import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/format";
import { cartEnquiry, openWhatsApp } from "../../lib/whatsapp";
import { CatalogLoading } from "../../components/CatalogState";
import ProductVisual from "../../components/ProductVisual";

export default function CartPage() {
  const { items, subtotal, count, updateQty, removeItem, loading } = useCart();

  // Lines resolve against the catalog, so wait for it before calling the bag empty.
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
        <CatalogLoading label="Loading your bag" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 text-center md:px-8">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cream/10 bg-onyx">
          <ShoppingBag size={32} strokeWidth={1} className="text-cream/30" />
        </span>
        <h1 className="mt-8 font-display text-3xl">Your bag is empty</h1>
        <p className="mt-3 text-cream/50">Your signature look is waiting in the collection.</p>
        <Link to="/shop" className="btn btn-gold mt-8">
          Shop the collection <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Your bag</h1>
          <div className="hairline mt-5" />
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-cream/40">
          {count} {count === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.length}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
                className="surface surface-hover flex gap-4 p-3 sm:gap-5 sm:p-4"
              >
                <Link
                  to={`/product/${item.productId}`}
                  className="block h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-cream/10 sm:h-32 sm:w-28"
                >
                  <div className="h-full w-full transition-transform duration-500 hover:scale-105">
                    <ProductVisual product={item.product} sizes="120px" width={240} />
                  </div>
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-display text-base leading-snug transition-colors hover:text-gold sm:text-lg"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cream/40">
                        <span className="rounded-full border border-cream/10 px-2.5 py-1">
                          {item.length}
                        </span>
                        <span>{formatPrice(item.product.price)} each</span>
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.length)}
                      className="rounded-full p-2 text-cream/35 transition-colors hover:bg-red-400/10 hover:text-red-400"
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="stepper">
                      <button
                        onClick={() => updateQty(item.productId, item.length, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.length, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-display text-lg text-gold">
                      {formatPrice(item.product.price * item.qty)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 pt-2 text-xs uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-gold"
          >
            <ArrowRight size={14} className="rotate-180" /> Continue shopping
          </Link>
        </div>

        <aside className="surface h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-cream/60">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-cream/60">
              <span>Delivery</span>
              <span>Confirmed on WhatsApp</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-cream/10 pt-4 text-base">
              <span>Total</span>
              <span className="font-display text-2xl text-gold">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <Link to="/checkout" className="btn btn-gold mt-7 w-full">
            Checkout <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => openWhatsApp(cartEnquiry(items, subtotal))}
            className="btn btn-whatsapp mt-3 w-full"
          >
            <MessageCircle size={16} /> Order on WhatsApp
          </button>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-cream/35">
            Payment and delivery are arranged with you directly on WhatsApp after checkout.
          </p>
        </aside>
      </div>
    </div>
  );
}
