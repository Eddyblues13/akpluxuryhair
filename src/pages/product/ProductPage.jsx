import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatPrice } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import { CatalogError, CatalogLoading } from "../../components/CatalogState";
import ProductVisual from "../../components/ProductVisual";
import ProductCard from "../../components/ProductCard";

export default function ProductPage() {
  const { id } = useParams();
  const { getProduct, getRelated, status, error, reload } = useProducts();
  const { addItem } = useCart();
  // Held as null until the shopper picks, so the default follows the product
  // once the catalog resolves.
  const [length, setLength] = useState(null);
  const [qty, setQty] = useState(1);

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
        <Link to="/shop" className="mt-6 inline-block text-sm uppercase tracking-[0.2em] text-gold">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const selectedLength = length ?? product.lengths[0];
  const related = getRelated(product);

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-8">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cream/50 transition-colors hover:text-gold"
      >
        <ArrowLeft size={14} /> Back to shop
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[4/5] overflow-hidden border border-cream/10"
        >
          <ProductVisual product={product} />
          {product.badge && (
            <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
              {product.badge}
            </span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold">{product.category}</p>
          <h1 className="mt-3 font-display text-3xl leading-tight md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl text-gold">{formatPrice(product.price)}</p>
          <p className="mt-6 leading-relaxed text-cream/60">{product.description}</p>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.25em] text-cream/50">Length</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.lengths.map((l) => (
                <button
                  key={l}
                  onClick={() => setLength(l)}
                  className={`border px-4 py-2 text-sm transition-colors ${
                    selectedLength === l
                      ? "border-gold bg-gold text-ink"
                      : "border-cream/20 text-cream/70 hover:border-gold hover:text-gold"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-cream/20">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 text-cream/60 transition-colors hover:text-gold"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="p-3 text-cream/60 transition-colors hover:text-gold"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => addItem(product.id, selectedLength, qty)}
              className="inline-flex flex-1 items-center justify-center gap-3 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light sm:flex-none"
            >
              <ShoppingBag size={16} /> Add to bag
            </button>
          </div>

          <ul className="mt-10 space-y-3 border-t border-cream/10 pt-8">
            {product.details.map((d) => (
              <li key={d} className="flex items-center gap-3 text-sm text-cream/60">
                <Check size={14} className="shrink-0 text-gold" /> {d}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="font-display text-2xl md:text-3xl">You may also love</h2>
          <div className="hairline mt-4" />
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
