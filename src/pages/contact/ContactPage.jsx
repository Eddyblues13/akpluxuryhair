import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Instagram, Loader2, Mail, MapPin, MessageCircle } from "lucide-react";
import { sendContactMessage } from "../../lib/api";
import { WHATSAPP_DISPLAY, whatsappLink } from "../../lib/whatsapp";

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: WHATSAPP_DISPLAY,
    href: whatsappLink("Hi AKP Luxury Hair 👋"),
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
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrors({});

    try {
      const { message } = await sendContactMessage(form);
      setForm({ name: "", email: "", message: "" });
      toast.success(message ?? "Message sent — we'll get back to you within 24 hours.");
    } catch (error) {
      setErrors(error.errors ?? {});
      toast.error(error.message ?? "We couldn't send that message.");
    } finally {
      setSubmitting(false);
    }
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
          noValidate
          className="space-y-5 border border-cream/10 bg-onyx p-6 md:p-8"
        >
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor="contact-name">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              required
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
            />
            {errors.name && <p className="mt-2 text-xs text-red-400">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email}</p>}
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-cream/50" htmlFor="contact-message">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={onChange}
              placeholder="How can we help?"
            />
            {errors.message && <p className="mt-2 text-xs text-red-400">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-3 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Sending" : "Send message"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
