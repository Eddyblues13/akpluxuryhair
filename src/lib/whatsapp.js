import { formatPrice } from "./format";

// Single source of truth for the shop's WhatsApp line. Set VITE_WHATSAPP_NUMBER
// in .env (digits only, with country code) — the placeholder below is a stub.
const RAW_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "2348000000000";

/** Digits only — what wa.me expects. */
export const WHATSAPP_NUMBER = String(RAW_NUMBER).replace(/\D/g, "");

/** Pretty form for display: 2348101234567 → +234 810 123 4567 */
export const WHATSAPP_DISPLAY =
  WHATSAPP_NUMBER.length === 13
    ? `+${WHATSAPP_NUMBER.slice(0, 3)} ${WHATSAPP_NUMBER.slice(3, 6)} ${WHATSAPP_NUMBER.slice(
        6,
        9
      )} ${WHATSAPP_NUMBER.slice(9)}`
    : `+${WHATSAPP_NUMBER}`;

export const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/**
 * Opens WhatsApp in a new tab. Popup blockers reject `window.open` when the
 * call is no longer tied to a user gesture (iOS Safari, after an awaited
 * request) — `redirectIfBlocked` decides whether to fall back to a same-tab
 * navigation. Turn it off where leaving the page would lose state, and offer
 * the shopper a button to press instead. Returns whether the tab opened.
 */
export function openWhatsApp(text, { redirectIfBlocked = true } = {}) {
  const url = whatsappLink(text);
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) return true;

  if (redirectIfBlocked) window.location.href = url;
  return false;
}

/** Message a shopper sends when asking about one piece. */
export const productEnquiry = (product, length) =>
  [
    `Hi AKP Luxury Hair 👋`,
    ``,
    `I'd love to know more about *${product.name}*${length ? ` (${length})` : ""}.`,
    `Price: ${formatPrice(product.price)}`,
    ``,
    `Is it available?`,
  ].join("\n");

/** Full order hand-off — what the checkout sends. */
export function orderMessage({ reference, name, phone, address, note, items, subtotal }) {
  const lines = [
    `*NEW ORDER — AKP Luxury Hair*`,
    reference ? `Ref: *${reference}*` : null,
    ``,
    `*Items*`,
    ...items.map(
      (i, n) =>
        `${n + 1}. ${i.name} — ${i.length} × ${i.qty} — ${formatPrice(i.unitPrice * i.qty)}`
    ),
    ``,
    `*Total: ${formatPrice(subtotal)}*`,
    ``,
    `*Name:* ${name}`,
    `*Phone:* ${phone}`,
    `*Deliver to:* ${address}`,
    note ? `*Note:* ${note}` : null,
    ``,
    `Please confirm availability, delivery fee and payment details. Thank you!`,
  ];

  return lines.filter((l) => l !== null).join("\n");
}

/** Sends the whole bag over without the checkout form. */
export const cartEnquiry = (items, subtotal) =>
  [
    `Hi AKP Luxury Hair 👋`,
    ``,
    `I'd like to order:`,
    ...items.map(
      (i, n) =>
        `${n + 1}. ${i.product.name} — ${i.length} × ${i.qty} — ${formatPrice(
          i.product.price * i.qty
        )}`
    ),
    ``,
    `*Total: ${formatPrice(subtotal)}*`,
  ].join("\n");
