import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, Zap } from "lucide-react";
import { formatPrice } from "../lib/format";
import { useCart } from "../context/CartContext";
import ProductVisual from "./ProductVisual";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const defaultLength = product.lengths?.[0];

  const quickAdd = () => addItem(product.id, defaultLength, 1);

  const buyNow = () => {
    addItem(product.id, defaultLength, 1);
    navigate("/cart");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group surface surface-hover flex flex-col overflow-hidden"
    >
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-ink"
        aria-label={`View ${product.name}`}
      >
        {/* The piece drifts gently in place, then leans in on hover. The drift
            and the zoom live on separate elements — sharing one would let the
            keyframes win and swallow the hover transform. Bleeding the wrapper
            past the frame keeps the bob from exposing an edge. */}
        <div
          className="absolute -inset-3 animate-floaty"
          style={{ animationDelay: `${(index % 4) * 0.5}s` }}
        >
          <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-110">
            <ProductVisual product={product} />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink shadow-lg shadow-black/30">
            {product.badge}
          </span>
        )}

        <span className="absolute right-3 top-3 rounded-full border border-cream/15 bg-ink/70 px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-cream/70 backdrop-blur-sm">
          {product.category}
        </span>

        {/* Desktop hover affordance — touch devices get the buttons below. */}
        <span className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-3 items-center justify-center gap-2 rounded-full bg-cream/95 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
          <Eye size={13} /> View piece
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-display text-base leading-snug transition-colors group-hover:text-gold md:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-cream/45 md:text-sm">
          {product.short}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="font-display text-lg text-gold md:text-xl">{formatPrice(product.price)}</p>
          {defaultLength && (
            <span className="text-[10px] uppercase tracking-[0.15em] text-cream/35">
              from {defaultLength}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 pt-1">
          <button
            onClick={quickAdd}
            className="btn btn-gold btn-sm flex-1"
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag size={13} />
            <span className="hidden sm:inline">Add to bag</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={buyNow}
            className="btn btn-outline btn-sm shrink-0 px-3"
            aria-label={`Buy ${product.name} now`}
            title="Buy now"
          >
            <Zap size={13} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
