import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, center = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className={center ? "text-center" : ""}
    >
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      )}
      <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">{title}</h2>
      <div className={`hairline mt-5 ${center ? "mx-auto" : ""}`} />
    </motion.div>
  );
}
