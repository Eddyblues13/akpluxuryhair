import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+234 800 000 0000",
    href: "https://wa.me/2340000000000",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@akpluxuryhair",
    href: "https://instagram.com",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@akpluxuryhair.com",
    href: "mailto:hello@akpluxuryhair.com",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Lagos, Nigeria",
  },
];

export default function ContactPage() {
  const submit = (e) => {
    e.preventDefault();
    e.target.reset();
    toast.success("Message sent — we'll get back to you within 24 hours.");
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Get in touch</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Contact us</h1>
      <div className="hairline mt-5" />

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="max-w-md leading-relaxed text-cream/60">
            Questions about a piece, your order, or which texture blends best
            with your hair? Talk to us — real answers, no scripts.
          </p>
          <div className="mt-10 space-y-6">
            {CHANNELS.map((c) => (
              <div key={c.label} className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center border border-cream/15 text-gold">
                  <c.icon size={18} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-cream/40">{c.label}</p>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="text-sm transition-colors hover:text-gold"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-sm">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={submit}
          className="space-y-5 border border-cream/10 bg-onyx p-6 md:p-8"
        >
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor="contact-name">
              Name
            </label>
            <input id="contact-name" required placeholder="Your name" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor="contact-email">
              Email
            </label>
            <input id="contact-email" type="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor="contact-message">
              Message
            </label>
            <textarea id="contact-message" required rows={5} placeholder="How can we help?" />
          </div>
          <button
            type="submit"
            className="w-full bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            Send message
          </button>
        </motion.form>
      </div>
    </div>
  );
}
