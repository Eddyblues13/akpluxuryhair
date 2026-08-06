// The catalog now lives in the backend (see context/ProductsContext.jsx).
// These are the pure helpers that shape an already-loaded catalog.

export const FALLBACK_CATEGORIES = ["All", "Wigs", "Bundles", "Frontals", "Closures"];

export const findProduct = (products, id) => products.find((p) => p.id === id);

export const relatedProducts = (products, product, count = 3) =>
  products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(products.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);

export const featuredProducts = (products, count = 4) =>
  products.filter((p) => p.badge).concat(products).slice(0, count);
