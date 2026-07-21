import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../lib/format";
import ProductVisual from "./ProductVisual";

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden border border-cream/10 bg-onyx">
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
            <ProductVisual product={product} />
          </div>
          {product.badge && (
            <span className="absolute left-3 top-3 bg-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">
              {product.badge}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-cream py-3 text-center text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-transform duration-300 group-hover:translate-y-0">
            View piece
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg leading-snug transition-colors group-hover:text-gold">
            {product.name}
          </h3>
          <p className="shrink-0 text-sm text-gold">{formatPrice(product.price)}</p>
        </div>
        <p className="mt-1 text-sm text-cream/50 line-clamp-1">{product.short}</p>
      </Link>
    </motion.article>
  );
}
