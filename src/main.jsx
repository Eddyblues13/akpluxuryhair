import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <ProductsProvider>
          <CartProvider>
            <App />
            {/* Top-center keeps toasts clear of the sticky buy bar and the
                WhatsApp button that sit along the bottom edge. */}
            <Toaster
              position="top-center"
              containerStyle={{ top: 88 }}
              toastOptions={{
                style: {
                  background: "rgba(22,18,15,0.95)",
                  color: "#f5efe6",
                  border: "1px solid rgba(201,163,74,0.4)",
                  borderRadius: "9999px",
                  padding: "10px 18px",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 18px 40px -12px rgba(0,0,0,0.6)",
                  fontFamily: "Jost, sans-serif",
                  fontSize: "14px",
                },
                iconTheme: { primary: "#c9a34a", secondary: "#0c0a09" },
              }}
            />
          </CartProvider>
        </ProductsProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
