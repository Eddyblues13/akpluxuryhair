
import { Suspense, lazy, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Gem, ShieldCheck, Star, Truck } from "lucide-react";
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
  { src: "/img1.PNG", alt: "Chocolate balayage curls lace-front install" },
  { src: "/img2.PNG", alt: "Side-swept waves at a black-tie event" },
  { src: "/img3.PNG", alt: "Wine bob with fringe lace-front install" },
  { src: "/img4.PNG", alt: "Chocolate balayage curls lace-front install" },
  { src: "/img5.jpg", alt: "Jet black bone-straight lace-front install" },
  { src: "/img6.jpg", alt: "Copper ginger sleek lace-front install" },
];

const REVIEWS = [
  {
    image: "/test6.jpeg",
    name: "Cee",
    location: "United States",
    rating: 5,
    text: "Inlove with the texture & highlight.",
  },
  {
    image: "/test1.jpg",
    name: "Elohor",
    location: "Lagos, NG",
    rating: 5,
    text: "Bouncy is very lovely and hardly drops.",
  },
  {
    image: "/test2.jpeg",
    name: "Temi",
    location: "Port Harcourt, NG",
    rating: 5,
    text: "Curly raw texture is very nice.",
  },
  {
    image: "/test3.jpeg",
    name: "Mercy",
    location: "Port Harcourt, NG",
    rating: 5,
    text: "Glueless curly wig is so perfect, it matches with my skin.",
  },
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
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="From the collection" title="Every strand, a signature." />
            <p className="max-w-xs text-sm leading-relaxed text-cream/40">
              A closer look at the texture, colour and finish that define AKP Luxury Hair.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:gap-6">
            {GALLERY_IMAGES.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative aspect-square overflow-hidden shadow-lg shadow-black/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_60px_-15px_rgba(201,163,74,0.35)] sm:aspect-[3/4]"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-[35%] transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-0" />
                <div className="absolute inset-0 border border-cream/10 transition-colors duration-500 group-hover:border-gold/30" />
                <span className="pointer-events-none absolute left-2.5 top-2.5 h-5 w-5 border-l border-t border-gold opacity-0 transition-all duration-500 group-hover:left-3 group-hover:top-3 group-hover:opacity-100" />
                <span className="pointer-events-none absolute right-2.5 top-2.5 h-5 w-5 border-r border-t border-gold opacity-0 transition-all duration-500 group-hover:right-3 group-hover:top-3 group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-5 w-5 border-b border-l border-gold opacity-0 transition-all duration-500 group-hover:bottom-3 group-hover:left-3 group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-5 w-5 border-b border-r border-gold opacity-0 transition-all duration-500 group-hover:bottom-3 group-hover:right-3 group-hover:opacity-100" />
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

      {/* Reviews */}
      <section className="relative overflow-hidden border-y border-cream/10 bg-onyx py-20 md:py-28">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Real women, real results" title="Loved by our clients" />
            <div className="flex items-center gap-3">
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-sm text-cream/50">
                <span className="font-semibold text-cream">4.9/5</span> from numerous reviews
              </p>
            </div>
          </div>

          <div className="mt-14 -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="group relative w-[78%] flex-none snap-start border border-cream/10 bg-ink/50 p-6 transition-colors duration-500 hover:border-gold/40 sm:w-[46%] md:w-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/30">
                    <img
                      src={r.image}
                      alt={`${r.name}, verified customer`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-cream">
                      <span className="truncate">{r.name}</span>
                      <BadgeCheck size={14} className="shrink-0 text-gold" />
                    </p>
                    <p className="text-xs text-cream/40">{r.location}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5 text-gold">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-cream/60">&ldquo;{r.text}&rdquo;</p>
              </motion.div>
            ))}
          </div>
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
