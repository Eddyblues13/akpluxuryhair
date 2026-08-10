import { Link } from "react-router-dom";
import { Instagram, Lock, MessageCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { whatsappLink } from "../lib/whatsapp";

export default function Footer() {
  const subscribe = (e) => {
    e.preventDefault();
    e.target.reset();
    toast.success("You're on the list. Welcome to the inner circle.");
  };

  return (
    <footer className="border-t border-cream/10 bg-onyx">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-2xl">
            AKP <span className="gold-text italic">Luxury Hair</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/50">
            Some turn heads, ours leave a mark. Raw luxury hair for women who
            refuse to blend in.
          </p>
          <div className="mt-5 flex gap-4 text-cream/60">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-gold">
              <Instagram size={20} strokeWidth={1.5} />
            </a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="transition-colors hover:text-gold">
              <MessageCircle size={20} strokeWidth={1.5} />
            </a>
            <a href="mailto:hello@akpluxuryhair.com" aria-label="Email" className="transition-colors hover:text-gold">
              <Mail size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/60">
            <li><Link className="transition-colors hover:text-cream" to="/shop">Shop All</Link></li>
            <li><Link className="transition-colors hover:text-cream" to="/shop?category=Wigs">Wigs</Link></li>
            <li><Link className="transition-colors hover:text-cream" to="/shop?category=Bundles">Bundles</Link></li>
            <li><Link className="transition-colors hover:text-cream" to="/shop?category=Frontals">Frontals</Link></li>
            <li><Link className="transition-colors hover:text-cream" to="/about">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Stay in the loop</p>
          <p className="mt-4 text-sm text-cream/50">
            New drops, restocks and private sales — straight to your inbox.
          </p>
          <form onSubmit={subscribe} className="mt-4 flex">
            <input type="email" required placeholder="Email address" className="flex-1" />
            <button
              type="submit"
              className="border border-gold bg-gold px-5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-transparent hover:text-gold"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-cream/10 px-5 py-5 text-xs tracking-wide text-cream/40 sm:flex-row md:px-8">
        <p>© {new Date().getFullYear()} AKP Luxury Hair. All rights reserved.</p>
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-gold"
        >
          <Lock size={11} /> Staff login
        </Link>
      </div>
    </footer>
  );
}
