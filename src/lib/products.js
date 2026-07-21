export const CATEGORIES = ["All", "Wigs", "Bundles", "Frontals", "Closures"];

export const PRODUCTS = [
  {
    id: "aurora-body-wave-wig",
    name: "Aurora Body Wave Wig",
    category: "Wigs",
    price: 385000,
    lengths: ['18"', '20"', '22"', '24"'],
    badge: "Bestseller",
    tone: ["#2a1c10", "#54381c"],
    short: "Full-density 13x4 HD lace body wave, pre-plucked and ready to wear.",
    description:
      "The Aurora is our signature statement wig — 100% raw human hair on undetectable HD lace, with a pre-plucked hairline and bleached knots. Steam-set body wave pattern that survives washes and heat styling.",
    details: ["13x4 HD transparent lace", "200% density", "Raw Vietnamese hair", "Pre-plucked & bleached knots"],
  },
  {
    id: "empress-straight-wig",
    name: "Empress Bone Straight Wig",
    category: "Wigs",
    price: 420000,
    lengths: ['20"', '22"', '24"', '26"'],
    badge: "New",
    tone: ["#1c1410", "#3c2c1e"],
    short: "Silk-pressed bone straight glass hair on 13x6 HD lace.",
    description:
      "Glass-finish bone straight strands that fall like silk. The Empress is built on a 13x6 HD lace frontal for a deep, versatile parting space and an invisible melt.",
    details: ["13x6 HD lace frontal", "180% density", "Double-drawn strands", "Glass silk finish"],
  },
  {
    id: "sahara-curly-wig",
    name: "Sahara Deep Curl Wig",
    category: "Wigs",
    price: 365000,
    lengths: ['16"', '18"', '20"', '22"'],
    tone: ["#301e12", "#5c3a1e"],
    short: "Bouncy defined deep curls with a natural crown.",
    description:
      "Defined, springy deep curls that hold their pattern from morning to midnight. Lightweight cap construction with adjustable straps and combs for an all-day secure fit.",
    details: ["5x5 HD closure cap", "200% density", "Curl-set raw hair", "Adjustable band + combs"],
  },
  {
    id: "velvet-body-wave-bundles",
    name: "Velvet Body Wave Bundles",
    category: "Bundles",
    price: 95000,
    lengths: ['14"', '16"', '18"', '20"', '22"', '24"'],
    badge: "Bestseller",
    tone: ["#241810", "#4a331c"],
    short: "Double-drawn body wave bundles, full from root to tip.",
    description:
      "Our Velvet bundles are cut from a single donor and double-drawn, so every strand runs full from weft to tip. Holds a curl, returns to its wave, and never sheds past normal.",
    details: ["Price per bundle", "Single-donor raw hair", "Double-drawn wefts", "Minimal shedding, no tangling"],
  },
  {
    id: "noir-straight-bundles",
    name: "Noir Straight Bundles",
    category: "Bundles",
    price: 88000,
    lengths: ['14"', '16"', '18"', '20"', '22"', '24"', '26"'],
    tone: ["#181210", "#33241a"],
    short: "Jet-luxe straight bundles with a mirror sheen.",
    description:
      "Clean, heavy, and mirror-sheened. Noir straight bundles blend seamlessly with silk-pressed natural hair and take color beautifully — lifts to 613 without compromise.",
    details: ["Price per bundle", "Machine double wefts", "Lifts to 613", "Heat-safe to 200°C"],
  },
  {
    id: "oasis-curly-bundles",
    name: "Oasis Kinky Curl Bundles",
    category: "Bundles",
    price: 92000,
    lengths: ['12"', '14"', '16"', '18"', '20"'],
    tone: ["#2c1c12", "#573a20"],
    short: "Textured kinky curls that mimic type-4 blowouts.",
    description:
      "A textured curl made to disappear into natural type-4 hair. The Oasis pattern is steam-set, not chemically processed, so the curl survives wash days for years.",
    details: ["Price per bundle", "Steam-set texture", "Blends with 4a–4c", "Chemical-free processing"],
  },
  {
    id: "halo-13x4-frontal",
    name: "Halo 13x4 HD Frontal",
    category: "Frontals",
    price: 78000,
    lengths: ['14"', '16"', '18"', '20"'],
    badge: "New",
    tone: ["#221a12", "#463019"],
    short: "Ear-to-ear HD lace frontal with a pre-plucked hairline.",
    description:
      "Ear-to-ear coverage on film-thin HD lace. The Halo frontal ships pre-plucked with bleached knots, ready to melt straight out of the box.",
    details: ["13x4 HD transparent lace", "Pre-plucked hairline", "Bleached knots", "Available in all textures"],
  },
  {
    id: "iris-360-frontal",
    name: "Iris 360 Lace Frontal",
    category: "Frontals",
    price: 110000,
    lengths: ['14"', '16"', '18"'],
    tone: ["#261c14", "#503620"],
    short: "Full-perimeter 360 lace for ponytails and updos.",
    description:
      "Lace around the entire perimeter means high ponytails, buns, and half-up styles with no tracks in sight. The Iris is the frontal for women who wear their hair up.",
    details: ["360° lace perimeter", "Adjustable interior straps", "HD transparent lace", "Updo-friendly"],
  },
  {
    id: "pearl-5x5-closure",
    name: "Pearl 5x5 HD Closure",
    category: "Closures",
    price: 58000,
    lengths: ['12"', '14"', '16"', '18"'],
    tone: ["#201812", "#3e2d1c"],
    short: "Invisible 5x5 HD closure for effortless installs.",
    description:
      "The everyday workhorse. A 5x5 HD closure that melts flat, parts anywhere within its space, and makes glueless installs genuinely glueless.",
    details: ["5x5 HD lace", "Free parting space", "Bleached knots", "Glueless-friendly"],
  },
  {
    id: "luna-6x6-closure",
    name: "Luna 6x6 HD Closure",
    category: "Closures",
    price: 66000,
    lengths: ['12"', '14"', '16"', '18"', '20"'],
    tone: ["#241a10", "#48321a"],
    short: "Extra-wide 6x6 parting space, closest thing to a frontal.",
    description:
      "An extra inch in every direction buys you deeper side parts and a more natural fall. The Luna 6x6 is the closure for women who want frontal versatility with closure maintenance.",
    details: ["6x6 HD lace", "Deep parting space", "Pre-plucked edges", "Low-maintenance melt"],
  },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const relatedProducts = (product, count = 3) =>
  PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category)
    .concat(PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
