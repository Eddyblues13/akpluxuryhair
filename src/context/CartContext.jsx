import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getProduct } from "../lib/products";

const CartContext = createContext(null);

const STORAGE_KEY = "akp-cart";

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (productId, length, qty = 1) => {
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
  };

  const removeItem = (productId, length) =>
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.length === length)));

  const updateQty = (productId, length, qty) => {
    if (qty < 1) return removeItem(productId, length);
    setItems((prev) =>
      prev.map((i) => (i.productId === productId && i.length === length ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const { detailed, subtotal, count } = useMemo(() => {
    const detailed = items
      .map((i) => ({ ...i, product: getProduct(i.productId) }))
      .filter((i) => i.product);
    const subtotal = detailed.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    const count = detailed.reduce((sum, i) => sum + i.qty, 0);
    return { detailed, subtotal, count };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items: detailed, subtotal, count, addItem, removeItem, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
