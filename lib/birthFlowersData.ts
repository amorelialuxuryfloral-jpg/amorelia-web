/**
 * Birth Flowers by Month — pillar page data (PLAN-EJECUCION-DIRECTORES §7).
 *
 * Informational-sonda page. 12 H2 sections, ONE per month, ordered by REAL
 * search volume (KEYWORD-RESEARCH-REAL, top query per month):
 *   September 74.000 · November 74.000 · January 60.500 · February 60.500 ·
 *   April 60.500 · June 60.500 · October 60.500 · March 18.100 ·
 *   July 5.400 · May 5.400 · December 3.600 · August 2.900.
 *
 * The birth-flower facts are standard general knowledge (the plan's exact
 * list: Jan carnation, Feb violet, Mar daffodil, Apr daisy, May lily of the
 * valley, Jun rose, Jul larkspur, Aug gladiolus, Sep aster, Oct marigold,
 * Nov chrysanthemum, Dec narcissus).
 *
 * CORREA A PRODUCTO (obligatoria): every month links to REAL Amorelia product
 * — the matching rose color collection + the birthday collection. The copy
 * NEVER claims Amorelia sells carnations/mums/asters/etc.; it educates on the
 * birth flower and sells the rose in that month's palette.
 */

export interface BirthFlowerMonth {
  id: string;
  month: string;
  flower: string;
  h2: string;
  /** Top real query + volume (for the audit trail). */
  kw: string;
  paragraphs: string[];
  /** Product bridge — REAL Amorelia links (color collection + birthday). */
  colorLink: { label: string; href: string };
}

export const BIRTH_FLOWERS_PATH = "/birth-flowers-by-month";
export const BIRTHDAY_COLLECTION_HREF = "/collections/birthday-flowers";

export const birthFlowerMonths: BirthFlowerMonth[] = [
  {
    id: "september",
    month: "September",
    flower: "Aster",
    h2: "September Birth Flower: Aster",
    kw: "birth flower for september 74.000",
    paragraphs: [
      "The September birth flower is the aster — a star-shaped bloom whose name comes from the Greek word for 'star'. Asters carry meanings of wisdom, faith and valor, and in the Victorian language of flowers they stood for daintiness and patient love. They flower in late summer and early fall, which is exactly why they became September's signature bloom: when most gardens are winding down, asters are just getting started.",
      "Most asters bloom in cool tones — violet, lavender, purple and soft pink, usually with a golden center. That palette is the aster's signature: elegant, a little moody, and unmistakably autumnal. Purple asters in particular are tied to royalty and wisdom, which makes them the classic choice for honoring someone born this month.",
      "If you're sending birthday flowers to someone born in September, borrow the aster's palette rather than the aster itself: a hand-tied bouquet of purple or lavender-toned roses captures the same star-of-the-season feeling, with the size and drama a birthday deserves. At our Miami atelier we build them from 50 to 200 stems, delivered the same day when you order before 3PM.",
    ],
    colorLink: { label: "Purple roses for a September birthday", href: "/bouquets/purple-roses" },
  },
  {
    id: "november",
    month: "November",
    flower: "Chrysanthemum",
    h2: "November Birth Flower: Chrysanthemum",
    kw: "november birthday flowers 74.000",
    paragraphs: [
      "November's birth flower is the chrysanthemum — one of the most cultivated flowers on earth and the undisputed queen of autumn. Mums symbolize loyalty, friendship, joy and longevity; in Japan the chrysanthemum is so revered that the imperial throne itself is called the Chrysanthemum Throne, and the flower has its own national festival.",
      "Chrysanthemums bloom in nearly every warm tone — gold, bronze, deep red, burgundy and white — and their dense, layered petals are why they read as generous and abundant. In many cultures a red chrysanthemum means 'I love you', while white stands for loyalty and honesty. That warmth and abundance is the note to hit for a November birthday.",
      "To gift that feeling, go for a rose bouquet in the mum's golden-autumn palette: radiant yellow or warm orange roses, built oversized so the 'abundance' message lands. Every bouquet is hand-tied to order in Miami — same-day delivery before 3PM, or free pickup at our atelier.",
    ],
    colorLink: { label: "Yellow roses for a November birthday", href: "/bouquets/yellow-roses" },
  },
  {
    id: "january",
    month: "January",
    flower: "Carnation",
    h2: "January Birth Flower: Carnation",
    kw: "january birthday flowers 60.500",
    paragraphs: [
      "The January birth flower is the carnation — one of the oldest cultivated flowers in the world, grown for over 2,000 years since ancient Greece and Rome. Its scientific name, Dianthus, translates as 'flower of the gods'. Carnations symbolize love, fascination and distinction, and each shade adds its own nuance: pink for gratitude, red for admiration, white for pure love and good luck.",
      "It makes sense that a flower this resilient opens the year: carnations bloom through the cold months and last remarkably long once cut. In the language of flowers, giving carnations to a January-born person honors their strength through the hardest season of the year.",
      "For a January birthday, translate the carnation's message — admiration in pinks and reds — into the flower we build best: a hand-tied bouquet of premium pink roses, from a generous 50 stems to a show-stopping 200. Designed to order in our Miami atelier and delivered the same day when you order before 3PM.",
    ],
    colorLink: { label: "Pink roses for a January birthday", href: "/bouquets/pink-roses" },
  },
  {
    id: "february",
    month: "February",
    flower: "Violet",
    h2: "February Birth Flower: Violet",
    kw: "february birthday month flower 60.500",
    paragraphs: [
      "February's birth flower is the violet — a small, heart-leaved bloom that carries much bigger meanings: modesty, faithfulness and everlasting love. The ancient Greeks used violets in love potions; medieval lovers exchanged them as promises of loyalty. It's a fitting flower for the month of Valentine's Day, though the violet's love is the quiet, devoted kind rather than the grand gesture.",
      "True violets bloom in that unmistakable deep blue-purple that ended up named after them. In the Victorian language of flowers, a violet said 'I'll always be true' — which is why it became the token of anniversaries and long attachments as much as of February birthdays.",
      "To honor a February birthday (or to double up with Valentine's), take the violet's devotion and scale it up: a purple rose bouquet delivers the same faithful-love message with real presence, or go classic red if the birthday and the romance share the month. Hand-tied in Miami, 50 to 200 roses, same-day delivery before 3PM.",
    ],
    colorLink: { label: "Purple roses for a February birthday", href: "/bouquets/purple-roses" },
  },
  {
    id: "april",
    month: "April",
    flower: "Daisy",
    h2: "April Birth Flower: Daisy",
    kw: "april birthday flower 60.500",
    paragraphs: [
      "The April birth flower is the daisy — the simplest, most cheerful flower in the meadow and the emblem of innocence, purity and new beginnings. Its English name comes from 'day's eye', because the flower opens with the morning sun and closes at dusk. After winter, daisies are among the first blooms to blanket fields, which is exactly the energy April carries.",
      "A daisy is actually two flowers in one — the white outer petals and the golden center are separate blooms working together — which is why in the language of flowers it also stands for loyal love and 'I will never tell'. White is its signature color: fresh, honest and luminous.",
      "For someone born in April, capture the daisy's fresh-start whiteness with a bouquet of pure white roses — clean, luminous and anything but plain at 50 to 200 stems. Each one is hand-tied to order in our Miami atelier, with same-day delivery when you order before 3PM.",
    ],
    colorLink: { label: "White roses for an April birthday", href: "/bouquets/white-roses" },
  },
  {
    id: "june",
    month: "June",
    flower: "Rose",
    h2: "June Birth Flower: Rose",
    kw: "june birthday flower 60.500",
    paragraphs: [
      "June is the easiest month of all: its birth flower is the rose — the most storied flower in human history and the universal symbol of love, honor and beauty. June is when roses historically hit peak bloom in the northern hemisphere, and it's no coincidence the month of weddings belongs to the wedding flower par excellence.",
      "Every rose color writes a different message: red for deep love, white for new beginnings and reverence, yellow for friendship and joy, pink for gratitude and admiration, and modern painted tones — blue, black, green — for the people who don't do 'classic'. Few flowers give you this much vocabulary for one birthday.",
      "For a June birthday there's no translation needed — this is literally our flower. Send the real thing: a hand-tied bouquet of premium Ecuadorian roses in her exact color, from 50 to 200 stems, with natural, glitter or painted finish. Built to order in Miami and delivered the same day when you order before 3PM.",
    ],
    colorLink: { label: "Red roses for a June birthday", href: "/bouquets/red-roses" },
  },
  {
    id: "october",
    month: "October",
    flower: "Marigold",
    h2: "October Birth Flower: Marigold",
    kw: "october birthday flowers 60.500 · october flower of the month 22.200",
    paragraphs: [
      "October's birth flower is the marigold — a burst of orange and gold that refuses to fade as autumn sets in. Marigolds symbolize passion, creativity and the warmth of the sun; in Mexican tradition the cempasúchil marigold lights the path home for loved ones during Día de los Muertos at the start of November, making it one of the most culturally loaded flowers of the fall.",
      "Marigolds bloom in saturated fire tones — deep orange, amber and gold — and they bloom stubbornly from summer until the first frost. That persistence is the October message: vivid, warm and resilient just as the days get shorter.",
      "For an October birthday, bottle that fire in a bouquet of orange roses — the same saturated sunset palette, hand-tied at 50 to 200 stems so it glows across the room. Designed to order in our Miami atelier, with same-day delivery for orders before 3PM.",
    ],
    colorLink: { label: "Orange roses for an October birthday", href: "/bouquets/orange-roses" },
  },
  {
    id: "march",
    month: "March",
    flower: "Daffodil",
    h2: "March Birth Flower: Daffodil",
    kw: "flower month march 18.100",
    paragraphs: [
      "The March birth flower is the daffodil — the trumpet-shaped herald of spring. Daffodils push up through the last of the cold and bloom in bright, defiant yellow, which is why they symbolize rebirth, new beginnings and hope. In Wales they're worn on St. David's Day; in many cultures, a daffodil is the flower you give when a new chapter starts.",
      "Tradition adds a lovely detail: a single daffodil is said to foretell misfortune, while a bunch of them brings joy and good luck — so daffodils are always given generously, never alone. Their yellow is pure optimism, the exact color of the season turning.",
      "For someone born in March, send that optimism at full scale: a generous bouquet of yellow roses carries the daffodil's sunshine message — always in abundance, never a single stem — hand-tied from 50 to 200 roses in our Miami atelier, delivered same-day when you order before 3PM.",
    ],
    colorLink: { label: "Yellow roses for a March birthday", href: "/bouquets/yellow-roses" },
  },
  {
    id: "july",
    month: "July",
    flower: "Larkspur",
    h2: "July Birth Flower: Larkspur",
    kw: "july flower of the month 5.400",
    paragraphs: [
      "July's birth flower is the larkspur (delphinium) — tall spires of ruffled blooms that rise over the summer garden. Larkspur symbolizes an open heart, lightness and strong bonds of love; its name comes from the flower's spur, which reminded English gardeners of a lark's claw. Blooming at the height of summer, it stands for the ardent, generous side of the season.",
      "Larkspur's most celebrated color is blue — from sky-pale to deep indigo — one of the rarest colors in the flower world, with pink, purple and white close behind. In the language of flowers, blue larkspur specifically means dignity and grace.",
      "Blue is hard to find in nature, but it's a signature at our atelier: for a July birthday, a bouquet of painted blue roses delivers the larkspur's rare-blue statement with rose-level luxury. Hand-built to order in Miami, 50 to 200 stems, same-day delivery for orders before 3PM.",
    ],
    colorLink: { label: "Blue roses for a July birthday", href: "/bouquets/blue-roses" },
  },
  {
    id: "may",
    month: "May",
    flower: "Lily of the Valley",
    h2: "May Birth Flower: Lily of the Valley",
    kw: "flower for the month of may 5.400",
    paragraphs: [
      "The May birth flower is the lily of the valley — tiny white bells on a slender stem, with one of the most beloved fragrances in perfumery. It symbolizes sweetness, humility and the return of happiness. In France, sprigs of muguet are given every May 1st as tokens of good luck, and royal brides from Grace Kelly to Kate Middleton have carried it down the aisle.",
      "Everything about lily of the valley is delicate and white: purity without coldness, luxury in miniature. That's the May-born personality the tradition celebrates — quietly elegant, universally loved.",
      "To gift that refined whiteness with real presence, choose a bouquet of white roses — the same bridal-grade purity, scaled from an elegant 50 stems to a breathtaking 200. Each bouquet is hand-tied to order in our Miami atelier, with same-day delivery when you order before 3PM.",
    ],
    colorLink: { label: "White roses for a May birthday", href: "/bouquets/white-roses" },
  },
  {
    id: "december",
    month: "December",
    flower: "Narcissus",
    h2: "December Birth Flower: Narcissus",
    kw: "december birthday flowers 3.600",
    paragraphs: [
      "December's birth flower is the narcissus — specifically the paperwhite, the winter-blooming cousin of the daffodil. Its clusters of small, star-white flowers open indoors in the darkest weeks of the year, which is why the narcissus stands for hope, renewal and the promise that good things return. Giving narcissus says: 'you are exactly as you should be'.",
      "The paperwhite's snowy color and sweet fragrance made it a Christmas-season classic in homes across the world — a living counterpoint to evergreen and holly. For a December birthday, its message cuts through the holiday noise: this flower is about the person, not the season.",
      "Honor a December birthday with that crisp winter whiteness — a hand-tied bouquet of white roses, luminous against the holidays' reds and greens — or lean festive with deep red. Built to order in our Miami atelier, 50 to 200 stems, same-day delivery for orders before 3PM.",
    ],
    colorLink: { label: "White roses for a December birthday", href: "/bouquets/white-roses" },
  },
  {
    id: "august",
    month: "August",
    flower: "Gladiolus",
    h2: "August Birth Flower: Gladiolus",
    kw: "flower for august birthday 2.900",
    paragraphs: [
      "The August birth flower is the gladiolus — the 'sword lily', named from the Latin gladius for the shape of its tall, blade-like stems. Gladioli symbolize strength of character, integrity and infatuation; in Roman lore, gladiators' victories were showered with them. It's a flower that stands tall in the fiercest heat of the year, exactly like the August-born.",
      "Gladiolus spikes bloom bottom-to-top in saturated colors — hot pink, red, orange, purple and white — opening over days in a slow vertical firework. In the language of flowers, giving gladioli tells someone their character 'pierces the heart'.",
      "For an August birthday, match that bold, heat-proof energy with a bouquet of hot pink roses — saturated, dramatic and impossible to ignore at 50 to 200 stems. Hand-tied to order in our Miami atelier, with same-day delivery across Miami for orders before 3PM.",
    ],
    // No hot-pink COLOR collection exists — link the real hot pink ficha.
    colorLink: { label: "Hot pink roses for an August birthday", href: "/bouquets/hot-pink-roses-bouquet" },
  },
];
