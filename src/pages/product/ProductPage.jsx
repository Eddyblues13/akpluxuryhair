import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import { formatPrice } from "../../lib/format";
import { openWhatsApp, productEnquiry } from "../../lib/whatsapp";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import { CatalogError, CatalogLoading } from "../../components/CatalogState";
import ProductVisual from "../../components/ProductVisual";
import ProductCard from "../../components/ProductCard";

const ASSURANCES = [
  { icon: Truck, label: "Nationwide delivery" },
  { icon: ShieldCheck, label: "100% raw human hair" },
  { icon: RotateCcw, label: "Hand-inspected before dispatch" },
];

export default function ProductPage() {
  const { id } = useParams();
  const { getProduct, getRelated, status, error, reload } = useProducts();
  const { addItem, count } = useCart();
  const navigate = useNavigate();
  // Held as null until the shopper picks, so the default follows the product
  // once the catalog resolves.
  const [length, setLength] = useState(null);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // The confirmation on the button is a flash, not a mode — it has to clear or
  // it lies about the next length/quantity the shopper picks.
  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const product = getProduct(id);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
        <CatalogLoading label="Loading this piece" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
        <CatalogError message={error} onRetry={reload} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-40 text-center md:px-8">
        <h1 className="font-display text-3xl">Piece not found</h1>
        <Link to="/shop" className="btn btn-gold mt-8">
          Back to shop
        </Link>
      </div>
    );
  }

  const selectedLength = length ?? product.lengths[0];
  const related = getRelated(product);
  const lineTotal = product.price * qty;

  const add = () => {
    addItem(product.id, selectedLength, qty);
    setJustAdded(true);
  };

  const buyNow = () => {
    addItem(product.id, selectedLength, qty);
    navigate("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-32 pt-28 md:px-8 md:pb-24">
      <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/40">
        <Link to="/shop" className="inline-flex items-center gap-2 transition-colors hover:text-gold">
          <ArrowLeft size={14} /> Shop
        </Link>
        <span className="text-cream/20">/</span>
        <span className="text-gold">{product.category}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:sticky lg:top-28 lg:h-fit"
        >
          <div className="relative overflow-hidden rounded-3xl border border-cream/10 bg-onyx p-3 shadow-2xl shadow-black/40">
            <motion.div
              // Kept under the frame's 12px padding so the bob never clips.
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <ProductVisual
                product={product}
                sizes="(min-width: 1024px) 45vw, 100vw"
                width={1200}
                priority
              />
            </motion.div>

            {product.badge && (
              <span className="absolute left-6 top-6 rounded-full bg-gold px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink shadow-lg shadow-black/30">
                {product.badge}
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {ASSURANCES.map((a) => (
              <div
                key={a.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-cream/10 bg-onyx/60 px-2 py-4 text-center"
              >
                <a.icon size={17} strokeWidth={1.5} className="text-gold" />
                <span className="text-[10px] leading-tight text-cream/45">{a.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Detail */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{product.category}</p>
          <h1 className="display-tight mt-3 font-display text-3xl leading-tight md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="font-display text-3xl text-gold md:text-4xl">
              {formatPrice(product.price)}
            </p>
            <span className="rounded-full border border-whatsapp/30 bg-whatsapp/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-whatsapp">
              In stock
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-cream/60">{product.description}</p>

          {/* Length */}
          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-cream/50">Length</p>
              <p className="text-xs text-cream/35">{product.lengths.length} options</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.lengths.map((l) => (
                <button
                  key={l}
                  onClick={() => setLength(l)}
                  className={`chip ${selectedLength === l ? "chip-active" : "chip-idle"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + running total */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cream/10 bg-onyx/60 p-4">
            <div className="flex items-center gap-4">
              <p className="text-xs uppercase tracking-[0.25em] text-cream/50">Qty</p>
              <div className="stepper">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-9 text-center text-sm tabular-nums">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  <Plus size={15} />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">Total</p>
              <p className="font-display text-xl text-gold">{formatPrice(lineTotal)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={add} className="btn btn-gold flex-1">
                {justAdded ? (
                  <>
                    <Check size={16} /> Added to bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to bag
                  </>
                )}
              </button>
              <button onClick={buyNow} className="btn btn-outline flex-1">
                <Zap size={16} /> Buy now
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => openWhatsApp(productEnquiry(product, selectedLength))}
                className="btn btn-whatsapp flex-1"
              >
                <MessageCircle size={16} /> Ask on WhatsApp
              </button>
              {count > 0 && (
                <Link to="/cart" className="btn btn-outline flex-1">
                  <ShoppingBag size={16} /> View cart ({count})
                </Link>
              )}
            </div>
          </div>

          {/* Details */}
          <ul className="mt-10 space-y-3 border-t border-cream/10 pt-8">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-3 text-sm text-cream/60">
                <Check size={14} className="mt-1 shrink-0 text-gold" /> {d}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="mt-20 md:mt-28">
          <h2 className="font-display text-2xl md:text-3xl">You may also love</h2>
          <div className="hairline mt-4" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky buy bar — phones only, where the CTA scrolls out of reach. */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-ink/95 px-4 pt-3 backdrop-blur-lg md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] uppercase tracking-[0.2em] text-cream/40">
              {selectedLength} · Qty {qty}
            </p>
            <p className="font-display text-lg text-gold">{formatPrice(lineTotal)}</p>
          </div>
          <button onClick={add} className="btn btn-gold btn-sm shrink-0 px-5 py-3">
            <ShoppingBag size={14} /> Add
          </button>
          <button onClick={buyNow} className="btn btn-whatsapp btn-sm shrink-0 px-5 py-3">
            <Zap size={14} /> Buy
          </button>
        </div>
      </div>
    </div>
  );
}
