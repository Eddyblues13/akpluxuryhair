import { Suspense, lazy, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Gem, ShieldCheck, Truck } from "lucide-react";
import { featuredProducts } from "../../lib/products";
import { useProducts } from "../../context/ProductsContext";
import { CatalogError, CatalogLoading } from "../../components/CatalogState";
import ProductCard from "../../components/ProductCard";
import SectionHeading from "../../components/SectionHeading";

const Hero3D = lazy(() => import("../../components/Hero3D"));

const PROMISES = [
  {
    icon: Gem,
    title: "Raw, single-donor hair",
    text: "Every piece is cut from one donor — no mixing, no synthetic blends, no shortcuts.",
  },
  {
    icon: ShieldCheck,
    title: "Quality you can trace",
    text: "Steam-set textures and HD lace inspected by hand before anything leaves our studio.",
  },
  {
    icon: Truck,
    title: "Nationwide delivery",
    text: "Fast, insured delivery across Nigeria — and worldwide shipping on request.",
  },
];

const CATEGORY_TILES = [
  { label: "Wigs", to: "/shop?category=Wigs", tone: ["#2a1c10", "#54381c"] },
  { label: "Bundles", to: "/shop?category=Bundles", tone: ["#181210", "#33241a"] },
  { label: "Frontals", to: "/shop?category=Frontals", tone: ["#221a12", "#463019"] },
  { label: "Closures", to: "/shop?category=Closures", tone: ["#201812", "#3e2d1c"] },
];

const GALLERY_IMAGES = [
  { src: "/img1.jpeg", alt: "Balayage waves lace-front install", label: "Balayage waves" },
  { src: "/img2.jpeg", alt: "Sleek bob lace-front install", label: "Sleek bob" },
  { src: "/img3.jpeg", alt: "Burgundy fringe lace-front install", label: "Burgundy fringe" },
];

export default function HomePage() {
  const { products, status, error, reload } = useProducts();
  const featured = useMemo(() => featuredProducts(products), [products]);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-svh items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-onyx to-ink" />
        <Suspense fallback={null}>
          <Hero3D />
        </Suspense>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[11px] uppercase tracking-[0.4em] text-gold md:text-xs"
          >
            Premium luxury wigs
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="display-tight mt-5 max-w-3xl font-display text-[2.6rem] font-normal leading-[1.08] sm:text-6xl md:text-7xl"
          >
            Some turn heads, <br />
            <span className="gold-text italic">ours leave a mark.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-cream/60 md:text-lg"
          >
            Luxury wigs made with exceptional craftsmanship for the woman who
            deserves nothing but the best.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 bg-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
            >
              Shop the collection
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-3 border border-cream/25 px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-cream transition-colors hover:border-gold hover:text-gold"
            >
              Our story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative overflow-hidden bg-onyx py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="From the studio" title="Every install, a signature" />
            <p className="max-w-xs text-sm leading-relaxed text-cream/40">
              A closer look at the texture, color and finish that leaves the studio.
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-3 md:gap-6">
            {GALLERY_IMAGES.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-[35%] transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-0 border border-cream/10 transition-colors duration-500 group-hover:border-gold/40" />
                <p className="absolute left-5 top-5 text-[11px] uppercase tracking-[0.3em] text-cream/50 transition-colors duration-500 group-hover:text-gold">
                  0{i + 1}
                </p>
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-display text-lg italic text-cream md:text-xl">{img.label}</p>
                  <div className="mt-2 h-px w-8 bg-gold transition-all duration-500 group-hover:w-14" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading eyebrow="The collection" title="Shop by category" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {CATEGORY_TILES.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to={c.to}
                className="group relative block aspect-[3/4] overflow-hidden border border-cream/10"
                style={{ background: `linear-gradient(160deg, ${c.tone[0]}, ${c.tone[1]})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-xl transition-colors group-hover:text-gold md:text-2xl">
                    {c.label}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-cream/50">
                    Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="border-y border-cream/10 bg-onyx">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Curated for you" title="Featured pieces" />
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold"
            >
              View all
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {status === "loading" && <CatalogLoading />}
          {status === "error" && <CatalogError message={error} onRetry={reload} />}

          {status === "ready" && (
            <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
              {featured.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promises */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading eyebrow="The AKP standard" title="Why women swear by us" center />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {PROMISES.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="border border-cream/10 bg-onyx p-8 text-center"
            >
              <p.icon size={28} strokeWidth={1.25} className="mx-auto text-gold" />
              <h3 className="mt-5 font-display text-xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/50">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-cream/10 bg-gradient-to-b from-onyx to-ink">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center md:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-3xl leading-tight md:text-5xl"
          >
            Your signature look is <span className="gold-text italic">one order away.</span>
          </motion.h2>
          <Link
            to="/shop"
            className="mt-10 inline-flex items-center gap-3 bg-gold px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            Shop now <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
