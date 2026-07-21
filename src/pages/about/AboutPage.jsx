import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "../../components/SectionHeading";

const VALUES = [
  {
    title: "Uncompromising sourcing",
    text: "We buy raw hair from single donors and verify every batch ourselves. If we wouldn't wear it, we won't sell it.",
  },
  {
    title: "Craft over volume",
    text: "Small batches, steam-set textures, hand-inspected lace. We'd rather sell out than cut corners.",
  },
  {
    title: "Women first",
    text: "Every piece is built for real life — installs that last, hair that survives wash days, and honest advice before you buy.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-32">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Our story</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
            Born from the belief that luxury hair
            <span className="gold-text italic"> shouldn't be a gamble.</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl leading-relaxed text-cream/60"
        >
          AKP Luxury Hair started with one frustration: paying premium prices
          for hair that shed, tangled, and disappointed. So we went to the
          source ourselves — building direct relationships with donors and
          factories, and holding every bundle to a standard we'd stake our name
          on. Today, AKP is the quiet confidence behind some of the best
          installs you've ever seen.
        </motion.p>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <SectionHeading eyebrow="What we stand for" title="The AKP standard" center />
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="border border-cream/10 bg-onyx p-8"
            >
              <span className="font-display text-3xl italic text-gold">0{i + 1}</span>
              <h3 className="mt-4 font-display text-xl">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/50">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-cream/10 bg-onyx">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center md:px-8">
          <h2 className="font-display text-3xl md:text-4xl">
            Ready to <span className="gold-text italic">leave a mark?</span>
          </h2>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-3 bg-gold px-10 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-light"
          >
            Shop the collection <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
