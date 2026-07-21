import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES, PRODUCTS } from "../../lib/products";
import ProductCard from "../../components/ProductCard";

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const active = params.get("category") ?? "All";

  const products = useMemo(
    () => (active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );

  const setCategory = (cat) =>
    setParams(cat === "All" ? {} : { category: cat }, { replace: true });

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">The collection</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Shop</h1>
      <div className="hairline mt-5" />

      <div className="mt-10 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
              active === cat
                ? "border-gold bg-gold text-ink"
                : "border-cream/20 text-cream/60 hover:border-gold hover:text-gold"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 md:gap-8">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="mt-16 text-center text-cream/50">Nothing here yet — check back soon.</p>
      )}
    </div>
  );
}
