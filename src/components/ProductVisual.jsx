import { optimizedUrl, srcSetFor } from "../lib/cloudinary";

/**
 * Renders product photography when there is any, and an elegant tone-gradient
 * placeholder when there isn't. Cloudinary-hosted images are served through
 * `f_auto,q_auto` at a width the browser picks; anything else is passed
 * through untouched.
 *
 * `sizes` should describe the slot the image occupies — the default matches
 * the shop grid (two-up on phones, four-up on desktop).
 */
export default function ProductVisual({
  product,
  className = "",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  width = 900,
  priority = false,
}) {
  const [from, to] = product.tone;

  if (product.image) {
    return (
      <img
        src={optimizedUrl(product.image, { width })}
        srcSet={srcSetFor(product.image)}
        sizes={sizes}
        alt={product.name}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(150deg, ${from} 0%, ${to} 60%, ${from} 100%)` }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(230,200,125,0.25) 0%, transparent 55%)",
        }}
      />
      <span className="font-display text-6xl italic text-cream/20 select-none">
        {product.name.charAt(0)}
      </span>
      <span className="absolute bottom-4 left-0 right-0 text-center text-[10px] uppercase tracking-[0.35em] text-cream/30">
        {product.category}
      </span>
    </div>
  );
}
