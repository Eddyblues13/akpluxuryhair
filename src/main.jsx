import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#16120f",
              color: "#f5efe6",
              border: "1px solid rgba(201,163,74,0.4)",
              borderRadius: 0,
              fontFamily: "Jost, sans-serif",
              fontSize: "14px",
            },
            iconTheme: { primary: "#c9a34a", secondary: "#0c0a09" },
          }}
        />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
