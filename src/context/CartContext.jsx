import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useProducts } from "./ProductsContext";

const CartContext = createContext(null);

const STORAGE_KEY = "akp-cart";

const loadCart = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const { getProduct, status } = useProducts();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((productId, length, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId && i.length === length);
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { productId, length, qty }];
    });
    toast.success("Added to bag");
  }, []);

  const removeItem = useCallback(
    (productId, length) =>
      setItems((prev) => prev.filter((i) => !(i.productId === productId && i.length === length))),
    []
  );

  const updateQty = useCallback(
    (productId, length, qty) => {
      if (qty < 1) return removeItem(productId, length);
      setItems((prev) =>
        prev.map((i) => (i.productId === productId && i.length === length ? { ...i, qty } : i))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  // Lines whose product no longer exists in the catalog are dropped from the
  // view, but only once the catalog has actually loaded.
  const { detailed, subtotal } = useMemo(() => {
    if (status !== "ready") return { detailed: [], subtotal: 0 };

    const detailed = items
      .map((i) => ({ ...i, product: getProduct(i.productId) }))
      .filter((i) => i.product);
    const subtotal = detailed.reduce((sum, i) => sum + i.product.price * i.qty, 0);

    return { detailed, subtotal };
  }, [items, getProduct, status]);

  // Counted from the raw lines so the navbar badge is right before the
  // catalog request resolves.
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = useMemo(
    () => ({
      items: detailed,
      rawItems: items,
      subtotal,
      count,
      loading: status === "loading",
      addItem,
      removeItem,
      updateQty,
      clearCart,
    }),
    [detailed, items, subtotal, count, status, addItem, removeItem, updateQty, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
