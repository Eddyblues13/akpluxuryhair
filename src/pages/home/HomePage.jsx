import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Gem, ShieldCheck, Truck } from "lucide-react";
import { PRODUCTS } from "../../lib/products";
import ProductCard from "../../components/ProductCard";
import SectionHeading from "../../components/SectionHeading";

const Hero3D = lazy(() => import("../../components/Hero3D"));

const featured = PRODUCTS.filter((p) => p.badge).concat(PRODUCTS).slice(0, 4);

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

export default function HomePage() {
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
            className="text-xs uppercase tracking-[0.35em] text-gold"
          >
            Premium raw luxury hair
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-5 max-w-3xl font-display text-4xl leading-[1.1] sm:text-6xl md:text-7xl"
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
            Wigs, bundles and frontals crafted from raw single-donor hair — for
            women who don't do ordinary.
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
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
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
