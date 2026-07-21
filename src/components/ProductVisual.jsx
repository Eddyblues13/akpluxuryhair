// Elegant placeholder visual used until real product photography is added.
// Drop an `image` field on a product in lib/products.js to replace it.
export default function ProductVisual({ product, className = "" }) {
  const [from, to] = product.tone;

  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
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
