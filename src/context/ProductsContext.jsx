import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../lib/api";
import { FALLBACK_CATEGORIES, findProduct, relatedProducts } from "../lib/products";

const ProductsContext = createContext(null);

/**
 * The catalog is small, so it is fetched once and held in memory. Cart lines
 * store only a product id, and resolve against this list.
 */
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => {
    setStatus("loading");
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal)
      .then((payload) => {
        setProducts(payload?.data ?? []);
        setCategories(payload?.meta?.categories ?? FALLBACK_CATEGORIES);
        setStatus("ready");
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [attempt]);

  const value = useMemo(
    () => ({
      products,
      categories,
      status,
      error,
      loading: status === "loading",
      reload,
      getProduct: (id) => findProduct(products, id),
      getRelated: (product, count) => relatedProducts(products, product, count),
    }),
    [products, categories, status, error, reload]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
};
