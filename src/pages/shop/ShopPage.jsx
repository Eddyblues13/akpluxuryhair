import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useProducts } from "../../context/ProductsContext";
import { CatalogError, CatalogSkeleton } from "../../components/CatalogState";
import { openWhatsApp } from "../../lib/whatsapp";
import ProductCard from "../../components/ProductCard";

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const { products: allProducts, categories, status, error, reload } = useProducts();
  const active = params.get("category") ?? "All";

  const products = useMemo(
    () => (active === "All" ? allProducts : allProducts.filter((p) => p.category === active)),
    [active, allProducts]
  );

  const setCategory = (cat) =>
    setParams(cat === "All" ? {} : { category: cat }, { replace: true });

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">The collection</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Shop</h1>
          <div className="hairline mt-5" />
        </div>
        {status === "ready" && (
          <p className="text-xs uppercase tracking-[0.2em] text-cream/40">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        )}
      </div>

      {status === "loading" && <CatalogSkeleton className="mt-12" />}
      {status === "error" && <CatalogError message={error} onRetry={reload} />}

      {status === "ready" && (
        <>
          {/* Scrolls horizontally on phones rather than wrapping into a wall of chips. */}
          <div className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`chip shrink-0 uppercase ${active === cat ? "chip-active" : "chip-idle"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-cream/50">Nothing here yet — check back soon.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link to="/shop" className="btn btn-outline btn-sm">
                  View all pieces
                </Link>
                <button
                  onClick={() => openWhatsApp("Hi AKP Luxury Hair 👋 I'm looking for a piece — can you help?")}
                  className="btn btn-whatsapp btn-sm"
                >
                  <MessageCircle size={14} /> Ask us
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
