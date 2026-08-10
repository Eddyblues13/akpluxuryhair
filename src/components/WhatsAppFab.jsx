import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../lib/whatsapp";

const GREETING = "Hi AKP Luxury Hair 👋 I'd like to ask about a piece.";

/**
 * Always-available line to the shop. Sits above the product page's sticky buy
 * bar on phones so the two never overlap.
 */
export default function WhatsAppFab() {
  const { pathname } = useLocation();

  // The checkout already leads to WhatsApp — a second entry point there is noise.
  if (pathname.startsWith("/checkout")) return null;

  return (
    <motion.a
      href={whatsappLink(GREETING)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="group fixed bottom-24 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-whatsapp text-ink shadow-xl shadow-black/40 md:bottom-6 md:right-6 md:h-14 md:w-14"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.5s]" />
      <MessageCircle size={24} strokeWidth={2} className="relative" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
        Chat with us
      </span>
    </motion.a>
  );
}
