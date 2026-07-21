import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../lib/format";
import ProductVisual from "../../components/ProductVisual";

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 text-center md:px-8">
        <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-cream/30" />
        <h1 className="mt-6 font-display text-3xl">Your bag is empty</h1>
        <p className="mt-3 text-cream/50">Your signature look is waiting in the collection.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-3 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
        >
          Shop the collection <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
      <h1 className="font-display text-4xl md:text-5xl">Your bag</h1>
      <div className="hairline mt-5" />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <motion.div
              key={`${item.productId}-${item.length}`}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-5 border border-cream/10 bg-onyx p-4"
            >
              <Link
                to={`/product/${item.productId}`}
                className="block h-28 w-24 shrink-0 overflow-hidden border border-cream/10"
              >
                <ProductVisual product={item.product} />
              </Link>
              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      to={`/product/${item.productId}`}
                      className="font-display text-lg leading-snug transition-colors hover:text-gold"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/40">
                      Length {item.length}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.length)}
                    className="p-1 text-cream/40 transition-colors hover:text-red-400"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-cream/20">
                    <button
                      onClick={() => updateQty(item.productId, item.length, item.qty - 1)}
                      className="p-2 text-cream/60 hover:text-gold"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.length, item.qty + 1)}
                      className="p-2 text-cream/60 hover:text-gold"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-gold">{formatPrice(item.product.price * item.qty)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <aside className="h-fit border border-cream/10 bg-onyx p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl">Order summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-cream/60">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-cream/60">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between border-t border-cream/10 pt-4 text-base">
              <span>Total</span>
              <span className="text-gold">{formatPrice(subtotal)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-8 flex items-center justify-center gap-3 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            Checkout <ArrowRight size={16} />
          </Link>
          <Link
            to="/shop"
            className="mt-3 block text-center text-xs uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-gold"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
