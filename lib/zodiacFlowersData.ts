/**
 * Flowers by Zodiac Sign — informational guide data (CORRECCIONES punto 32).
 *
 * Real data (Google Ads, 2026-07-11): "zodiac bouquet" = 0 searches, but
 * "zodiac flowers" = 2,400/mo (MEDIUM comp) + "aries flowers" 1,900 (LOW) and
 * per-sign variants. The 12 zodiac PDPs therefore stay as products (noindex,
 * plan §1) and the SEO play is THIS informational guide — same pattern as
 * /birth-flowers-by-month — with the mandatory correa a producto: every sign
 * bridges to the REAL Amorelia zodiac bouquet for that sign (color/glyph facts
 * from the real Shopify product copy, seoData.ts) + the matching indexable
 * rose color collection.
 *
 * The "traditional flower" of each sign is standard flower-lore general
 * knowledge (same criterion as the birth-flower list in birthFlowersData.ts),
 * always phrased as tradition/association — never as a Amorelia stock claim.
 */

export interface ZodiacFlowerSign {
  id: string;
  sign: string;
  dates: string;
  flower: string;
  h2: string;
  paragraphs: string[];
  /** REAL Amorelia zodiac bouquet ficha for this sign. */
  bouquetLink: { label: string; href: string };
  /** Matching indexable rose color collection (real product color per sign). */
  colorLink: { label: string; href: string };
}

export const ZODIAC_FLOWERS_PATH = "/flowers-by-zodiac-sign";

export const zodiacFlowerSigns: ZodiacFlowerSign[] = [
  {
    id: "aries",
    sign: "Aries",
    dates: "March 21 – April 19",
    flower: "Honeysuckle",
    h2: "Aries Flowers (March 21 – April 19): Honeysuckle",
    paragraphs: [
      "Aries, the first sign of the zodiac, is traditionally paired with honeysuckle — a bloom that opens early and boldly, just like the ram charges first into everything. Flower lore reads honeysuckle as sweetness with an impulsive streak: fitting for the most energetic fire sign.",
      "For a real-world Aries gift, our Aries Zodiac Bouquet is built with fresh green-toned flowers, the Aries glyph and baby's breath, wrapped in black paper — available from 50 to 200 roses with natural, glitter or painted finish, same-day in Miami before 3PM.",
    ],
    bouquetLink: { label: "Aries Zodiac Bouquet", href: "/bouquets/aries-zodiac-bouquet" },
    colorLink: { label: "Green roses collection", href: "/bouquets/green-roses" },
  },
  {
    id: "taurus",
    sign: "Taurus",
    dates: "April 20 – May 20",
    flower: "Poppy",
    h2: "Taurus Flowers (April 20 – May 20): Poppy",
    paragraphs: [
      "Taurus, the earth sign ruled by Venus, is traditionally associated with the poppy — lush, sensual and unhurried, like the bull itself. In the language of flowers the poppy stands for pleasure and imagination, two very Taurus ideas.",
      "Our Taurus Zodiac Bouquet interprets the sign with dramatic black-toned flowers, the Taurus glyph and baby's breath wrapped in white paper — a statement piece for a statement sign, from 50 to 200 roses.",
    ],
    bouquetLink: { label: "Taurus Zodiac Bouquet", href: "/bouquets/taurus-zodiac-bouquet" },
    colorLink: { label: "Black roses collection", href: "/bouquets/black-roses" },
  },
  {
    id: "gemini",
    sign: "Gemini",
    dates: "May 21 – June 20",
    flower: "Lavender",
    h2: "Gemini Flowers (May 21 – June 20): Lavender",
    paragraphs: [
      "Gemini's traditional flower is lavender — light, airy and impossible to pin down to a single mood, like the twins. Lavender's associations with communication and curiosity mirror the most social air sign in the zodiac.",
      "The Amorelia Gemini Zodiac Bouquet plays the sign's bright side: orange-toned flowers with the Gemini glyph and baby's breath in black paper — vivid, playful and made to order in Miami.",
    ],
    bouquetLink: { label: "Gemini Zodiac Bouquet", href: "/bouquets/gemini-zodiac-bouquet" },
    colorLink: { label: "Orange roses collection", href: "/bouquets/orange-roses" },
  },
  {
    id: "cancer",
    sign: "Cancer",
    dates: "June 21 – July 22",
    flower: "White rose",
    h2: "Cancer Flowers (June 21 – July 22): White Rose",
    paragraphs: [
      "Cancer, the moon-ruled water sign, is traditionally linked to the white rose — tenderness, loyalty and quiet devotion, everything the crab protects under its shell. Of all the zodiac flowers, this is the one we can hand you literally: white roses are a Amorelia signature.",
      "For a Cancer birthday, choose between the Cancer Zodiac Bouquet — blue-toned flowers with the Cancer glyph in black paper — or a classic hand-tied white roses bouquet, both same-day in Miami before 3PM.",
    ],
    bouquetLink: { label: "Cancer Zodiac Bouquet", href: "/bouquets/cancer-zodiac-bouquet" },
    colorLink: { label: "White roses collection", href: "/bouquets/white-roses" },
  },
  {
    id: "leo",
    sign: "Leo",
    dates: "July 23 – August 22",
    flower: "Sunflower",
    h2: "Leo Flowers (July 23 – August 22): Sunflower",
    paragraphs: [
      "No surprise here: Leo's traditional flower is the sunflower — sun-ruled, impossible to ignore, always turning toward the light. Sunflowers stand for loyalty, warmth and adoration, the exact register of a Leo in a good mood.",
      "Our Leo Zodiac Bouquet channels that solar energy with yellow-toned flowers, the Leo glyph and baby's breath in black paper. Prefer literal sunflowers? Our Sunflowers & Passion bouquet mixes real sunflowers with red roses.",
    ],
    bouquetLink: { label: "Leo Zodiac Bouquet", href: "/bouquets/leo-zodiac-bouquet" },
    colorLink: { label: "Yellow roses collection", href: "/bouquets/yellow-roses" },
  },
  {
    id: "virgo",
    sign: "Virgo",
    dates: "August 23 – September 22",
    flower: "Buttercup",
    h2: "Virgo Flowers (August 23 – September 22): Buttercup",
    paragraphs: [
      "Virgo's traditional bloom is the buttercup — small, precise and quietly radiant, a flower that rewards attention to detail the way Virgo does. Flower lore gives it meanings of neatness, humility and cheerfulness.",
      "The Amorelia Virgo Zodiac Bouquet dresses the sign in purple-toned flowers with the Virgo glyph and baby's breath in black paper — refined and exact, from 50 to 200 roses with the finish you choose.",
    ],
    bouquetLink: { label: "Virgo Zodiac Bouquet", href: "/bouquets/virgo-zodiac-bouquet" },
    colorLink: { label: "Purple roses collection", href: "/bouquets/purple-roses" },
  },
  {
    id: "libra",
    sign: "Libra",
    dates: "September 23 – October 22",
    flower: "Rose",
    h2: "Libra Flowers (September 23 – October 22): Rose",
    paragraphs: [
      "Libra — ruled by Venus, obsessed with beauty and balance — gets the rose itself as its traditional flower. Harmony, love and aesthetics in one stem: there is no more Libra flower in existence.",
      "Our Libra Zodiac Bouquet leans into Venus with hot pink-toned flowers, the Libra glyph and baby's breath in pink paper. Or go full classic and pick any shade from our pink roses collection.",
    ],
    bouquetLink: { label: "Libra Zodiac Bouquet", href: "/bouquets/libra-zodiac-bouquet" },
    colorLink: { label: "Pink roses collection", href: "/bouquets/pink-roses" },
  },
  {
    id: "scorpio",
    sign: "Scorpio",
    dates: "October 23 – November 21",
    flower: "Geranium",
    h2: "Scorpio Flowers (October 23 – November 21): Geranium",
    paragraphs: [
      "Scorpio's traditional flower is the geranium — layered, intense and more complex than it first appears, like the sign itself. Its dense clusters of petals read as depth and quiet power.",
      "The Amorelia Scorpio Zodiac Bouquet softens the sign's edge with light pink-toned flowers, the Scorpio glyph and baby's breath wrapped in white paper — the contrast Scorpios secretly love.",
    ],
    bouquetLink: { label: "Scorpio Zodiac Bouquet", href: "/bouquets/scorpio-zodiac-bouquet" },
    colorLink: { label: "Pink roses collection", href: "/bouquets/pink-roses" },
  },
  {
    id: "sagittarius",
    sign: "Sagittarius",
    dates: "November 22 – December 21",
    flower: "Carnation",
    h2: "Sagittarius Flowers (November 22 – December 21): Carnation",
    paragraphs: [
      "Sagittarius is traditionally paired with the carnation — a resilient, long-lasting traveler of a flower for the zodiac's great traveler. Carnations carry meanings of fascination and boundless love.",
      "Our Sagittarius Zodiac Bouquet fires it up with red-toned flowers, the Sagittarius glyph and baby's breath in black paper — bold, warm and adventure-ready, hand-tied in Miami.",
    ],
    bouquetLink: { label: "Sagittarius Zodiac Bouquet", href: "/bouquets/sagittarius-zodiac-bouquet" },
    colorLink: { label: "Red roses collection", href: "/bouquets/red-roses" },
  },
  {
    id: "capricorn",
    sign: "Capricorn",
    dates: "December 22 – January 19",
    flower: "Pansy",
    h2: "Capricorn Flowers (December 22 – January 19): Pansy",
    paragraphs: [
      "Capricorn's traditional flower is the pansy — a bloom tough enough to flower in winter, which is the most Capricorn thing a flower can do. Pansies stand for thoughtfulness and steady affection.",
      "The Amorelia Capricorn Zodiac Bouquet honors the sea-goat with deep red-toned flowers, the Capricorn glyph and baby's breath in black paper — serious, elegant and built to impress.",
    ],
    bouquetLink: { label: "Capricorn Zodiac Bouquet", href: "/bouquets/capricorn-zodiac-bouquet" },
    colorLink: { label: "Red roses collection", href: "/bouquets/red-roses" },
  },
  {
    id: "aquarius",
    sign: "Aquarius",
    dates: "January 20 – February 18",
    flower: "Orchid",
    h2: "Aquarius Flowers (January 20 – February 18): Orchid",
    paragraphs: [
      "Aquarius, the zodiac's original nonconformist, is traditionally matched with the orchid — exotic, architectural and never quite like anything else in the room. Orchids read as rare beauty and independent thinking.",
      "Our Aquarius Zodiac Bouquet gives the water-bearer a striking red-toned arrangement with the Aquarius glyph and baby's breath in black paper — unconventional by design, like its recipient.",
    ],
    bouquetLink: { label: "Aquarius Zodiac Bouquet", href: "/bouquets/aquarius-zodiac-bouquet" },
    colorLink: { label: "Red roses collection", href: "/bouquets/red-roses" },
  },
  {
    id: "pisces",
    sign: "Pisces",
    dates: "February 19 – March 20",
    flower: "Water lily",
    h2: "Pisces Flowers (February 19 – March 20): Water Lily",
    paragraphs: [
      "Pisces, the dreamer of the zodiac, is traditionally paired with the water lily — a flower that literally lives between two worlds, floating on the surface with roots in the deep. Purity, imagination and emotional depth in one bloom.",
      "The Amorelia Pisces Zodiac Bouquet swims in the sign's element with blue-toned flowers, the Pisces glyph and baby's breath in black paper — oceanic, romantic and made to order in Miami.",
    ],
    bouquetLink: { label: "Pisces Zodiac Bouquet", href: "/bouquets/pisces-zodiac-bouquet" },
    colorLink: { label: "Blue roses collection", href: "/bouquets/blue-roses" },
  },
];
