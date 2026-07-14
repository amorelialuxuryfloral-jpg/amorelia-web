import { pricingTable } from '@/lib/productData';

export interface ProductSize {
  label: string;
  price: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  sizes: ProductSize[];
}

export interface CustomSize {
  roses: number;
  price: number;
  label?: string;
}

export interface BouquetProduct {
  id: string;
  name: string;
  shopifyHandle: string;
  description: string;
  descriptionEs?: string;
  image: string;
  image2?: string;
  color: string;
  type: 'round' | 'heart';
  pricingTier: import('@/lib/productData').PricingTier;
  customSizes?: CustomSize[];
}

export interface CategoryInfo {
  slug: string;
  title: string;
  description: string;
}

export const categories: CategoryInfo[] = [
  { slug: 'arreglos', title: 'Arrangements', description: 'Unique floral arrangements for every occasion' },
  { slug: 'cajas', title: 'Boxes', description: 'Fresh roses presented in special boxes' },
  { slug: 'cestas', title: 'Baskets', description: 'Handmade baskets with fresh flowers' },
  { slug: 'jarrones', title: 'Vases', description: 'Arrangements in crystal vases' },
  { slug: 'osos', title: 'Bears', description: 'Adorable bears made entirely of roses' },
];

export const categoryProducts: Record<string, CatalogProduct[]> = {
  arreglos: [
    { id: 'arr-1', name: 'Spring Arrangement – Small', description: 'Fresh arrangement with roses and green foliage', image: '', sizes: [{ label: 'One size', price: 45 }] },
    { id: 'arr-2', name: 'Spring Arrangement – Medium', description: 'Fresh arrangement with roses and green foliage', image: '', sizes: [{ label: 'One size', price: 75 }] },
    { id: 'arr-3', name: 'Spring Arrangement – Large', description: 'Fresh arrangement with roses and green foliage', image: '', sizes: [{ label: 'One size', price: 110 }] },
    { id: 'arr-4', name: 'Elegant Arrangement – Small', description: 'Sophisticated composition in pastel tones', image: '', sizes: [{ label: 'One size', price: 55 }] },
    { id: 'arr-5', name: 'Elegant Arrangement – Medium', description: 'Sophisticated composition in pastel tones', image: '', sizes: [{ label: 'One size', price: 85 }] },
    { id: 'arr-6', name: 'Elegant Arrangement – Large', description: 'Sophisticated composition in pastel tones', image: '', sizes: [{ label: 'One size', price: 130 }] },
    { id: 'arr-7', name: 'Romantic Arrangement – Small', description: 'Red and white roses in perfect harmony', image: '', sizes: [{ label: 'One size', price: 50 }] },
    { id: 'arr-8', name: 'Romantic Arrangement – Medium', description: 'Red and white roses in perfect harmony', image: '', sizes: [{ label: 'One size', price: 80 }] },
    { id: 'arr-9', name: 'Romantic Arrangement – Large', description: 'Red and white roses in perfect harmony', image: '', sizes: [{ label: 'One size', price: 120 }] },
  ],
  cajas: [
    { id: 'caj-1', name: 'Classic Box – 50 Roses', description: 'Fresh roses in a black box', image: '', sizes: [{ label: 'One size', price: 65 }] },
    { id: 'caj-2', name: 'Classic Box – 75 Roses', description: 'Fresh roses in a black box', image: '', sizes: [{ label: 'One size', price: 95 }] },
    { id: 'caj-3', name: 'Classic Box – 100 Roses', description: 'Fresh roses in a black box', image: '', sizes: [{ label: 'One size', price: 140 }] },
    { id: 'caj-4', name: 'Heart Box – 50 Roses', description: 'Heart-shaped box with roses', image: '', sizes: [{ label: 'One size', price: 75 }] },
    { id: 'caj-5', name: 'Heart Box – 75 Roses', description: 'Heart-shaped box with roses', image: '', sizes: [{ label: 'One size', price: 110 }] },
    { id: 'caj-6', name: 'Heart Box – 100 Roses', description: 'Heart-shaped box with roses', image: '', sizes: [{ label: 'One size', price: 160 }] },
    { id: 'caj-7', name: 'Special Box – 50 Roses', description: 'Fresh roses in a special box', image: '', sizes: [{ label: 'One size', price: 85 }] },
    { id: 'caj-8', name: 'Special Box – 75 Roses', description: 'Fresh roses in a special box', image: '', sizes: [{ label: 'One size', price: 125 }] },
    { id: 'caj-9', name: 'Special Box – 100 Roses', description: 'Fresh roses in a special box', image: '', sizes: [{ label: 'One size', price: 180 }] },
  ],
  cestas: [
    { id: 'ces-1', name: 'Country Basket – Small', description: 'Rustic basket with wildflowers', image: '', sizes: [{ label: 'One size', price: 55 }] },
    { id: 'ces-2', name: 'Country Basket – Medium', description: 'Rustic basket with wildflowers', image: '', sizes: [{ label: 'One size', price: 85 }] },
    { id: 'ces-3', name: 'Country Basket – Large', description: 'Rustic basket with wildflowers', image: '', sizes: [{ label: 'One size', price: 125 }] },
    { id: 'ces-4', name: 'Rose & Lily Basket – Small', description: 'Basket with fresh roses and lilies', image: '', sizes: [{ label: 'One size', price: 70 }] },
    { id: 'ces-5', name: 'Rose & Lily Basket – Medium', description: 'Basket with fresh roses and lilies', image: '', sizes: [{ label: 'One size', price: 100 }] },
    { id: 'ces-6', name: 'Rose & Lily Basket – Large', description: 'Basket with fresh roses and lilies', image: '', sizes: [{ label: 'One size', price: 150 }] },
    { id: 'ces-7', name: 'Fruit Basket – Small', description: 'Basket with flowers and seasonal fruits', image: '', sizes: [{ label: 'One size', price: 60 }] },
    { id: 'ces-8', name: 'Fruit Basket – Medium', description: 'Basket with flowers and seasonal fruits', image: '', sizes: [{ label: 'One size', price: 90 }] },
    { id: 'ces-9', name: 'Fruit Basket – Large', description: 'Basket with flowers and seasonal fruits', image: '', sizes: [{ label: 'One size', price: 135 }] },
  ],
  jarrones: [
    { id: 'jar-1', name: 'Crystal Vase – Small', description: 'Roses in a transparent crystal vase', image: '', sizes: [{ label: 'One size', price: 70 }] },
    { id: 'jar-2', name: 'Crystal Vase – Medium', description: 'Roses in a transparent crystal vase', image: '', sizes: [{ label: 'One size', price: 105 }] },
    { id: 'jar-3', name: 'Crystal Vase – Large', description: 'Roses in a transparent crystal vase', image: '', sizes: [{ label: 'One size', price: 155 }] },
    { id: 'jar-4', name: 'Gold Vase – Small', description: 'Beautiful arrangement in a gold vase', image: '', sizes: [{ label: 'One size', price: 85 }] },
    { id: 'jar-5', name: 'Gold Vase – Medium', description: 'Beautiful arrangement in a gold vase', image: '', sizes: [{ label: 'One size', price: 120 }] },
    { id: 'jar-6', name: 'Gold Vase – Large', description: 'Beautiful arrangement in a gold vase', image: '', sizes: [{ label: 'One size', price: 175 }] },
    { id: 'jar-7', name: 'Vintage Vase – Small', description: 'Fresh flowers in a ceramic vase', image: '', sizes: [{ label: 'One size', price: 75 }] },
    { id: 'jar-8', name: 'Vintage Vase – Medium', description: 'Fresh flowers in a ceramic vase', image: '', sizes: [{ label: 'One size', price: 110 }] },
    { id: 'jar-9', name: 'Vintage Vase – Large', description: 'Fresh flowers in a ceramic vase', image: '', sizes: [{ label: 'One size', price: 160 }] },
  ],
  osos: [
    { id: 'oso-1', name: 'Red Rose Bear', description: 'Bear completely covered in red roses', image: '', sizes: [{ label: 'Small', price: 90 }, { label: 'Medium', price: 150 }, { label: 'Large', price: 220 }] },
    { id: 'oso-2', name: 'Pink Rose Bear', description: 'Adorable bear in pink roses', image: '', sizes: [{ label: 'Small', price: 90 }, { label: 'Medium', price: 150 }, { label: 'Large', price: 220 }] },
    { id: 'oso-3', name: 'White Rose Bear', description: 'Elegant bear in white roses', image: '', sizes: [{ label: 'Small', price: 90 }, { label: 'Medium', price: 150 }, { label: 'Large', price: 220 }] },
  ],
};

// Shopify CDN base
// CDN de Charls ELIMINADO — las fotos de Amorelia se leen LIVE de su Shopify
// (fetchCatalogSummaries); mientras no haya, se usa el placeholder local.
const CDN = '';

export const bouquetProducts: BouquetProduct[] = [
  // === Shuffled mix of single-color + multi-color bouquets ===

  // Mix 2 colors - Natural + Red
  { id: 'bq-round-37', name: 'Crimson & Ivory', shopifyHandle: 'crimson-and-ivory', description: 'The bouquet shown contains 100 roses.\nColors: White and red roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $91.', descriptionEs: 'Colores: Rosas blancas y rojas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $91.', image: '', image2: '', color: 'Rojo y Blanco', type: 'round', pricingTier: 'mix2' },

  // Single - Natural
  { id: 'bq-round-8', name: 'Blush Petals', shopifyHandle: 'blush-petals', description: 'The bouquet shown contains 100 roses.\nColors: Pink roses.\nPaper: White.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas pink.\nPapel: Blanco.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Pink', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Painted
  { id: 'bq-round-31', name: 'Bold Contrast', shopifyHandle: 'bold-contrast', description: 'The bouquet shown contains 100 roses.\nColors: White, hot pink, and black painted roses.\nPaper: Pink.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $146.', descriptionEs: 'Colores: Rosas blancas, hot pink y negras pintadas.\nPapel: Rosa.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $146.', image: '', image2: '', color: 'Negro, Hot Pink y Blanco', type: 'round', pricingTier: 'mix2painted', customSizes: [{ roses: 75, price: 131 }, { roses: 100, price: 166 }, { roses: 125, price: 231 }, { roses: 150, price: 286 }, { roses: 175, price: 311 }, { roses: 200, price: 361 }] },

  // Single - Natural
  { id: 'bq-round-20', name: 'Golden Sunshine', shopifyHandle: 'golden-sunshine', description: 'The bouquet shown contains 100 roses.\nColors: Yellow roses.\nPaper: Beige.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas amarillas.\nPapel: Beige.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Amarillo', type: 'round', pricingTier: 'standard' },

  // Mix 3 - Natural without red
  { id: 'bq-round-23', name: 'Pastel Reverie', shopifyHandle: 'pastel-reverie', description: 'The bouquet shown contains 100 roses.\nColors: White, pink, and purple roses.\nPaper: Purple.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $101.', descriptionEs: 'Colores: Rosas blancas, pink y moradas.\nPapel: Morado.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: '', image2: '', color: 'Morado, Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Painted
  { id: 'bq-round-10', name: 'Sapphire Dream', shopifyHandle: 'sapphire-dream', description: 'The bouquet shown contains 100 roses.\nColors: Blue painted roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $136.', descriptionEs: 'Colores: Rosas azules pintadas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $136.', image: '', image2: '', color: 'Azul', type: 'round', pricingTier: 'painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-15', name: 'Sunlit Meadow', shopifyHandle: 'sunlit-meadow', description: 'The bouquet shown contains 100 roses.\nColors: White and yellow roses.\nPaper: White.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas blancas y amarillas.\nPapel: Blanco.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Amarillo y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Red
  { id: 'bq-round-5', name: 'Scarlet Devotion', shopifyHandle: 'scarlet-devotion', description: 'The bouquet shown contains 100 roses.\nColors: Red roses.\nPaper: Pink.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $106.', descriptionEs: 'Colores: Rosas rojas.\nPapel: Rosa.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $106.', image: '', image2: '', color: 'Rojo', type: 'round', pricingTier: 'red' },

  // 3 colors - With Red
  { id: 'bq-round-26', name: 'Fire & Gold', shopifyHandle: 'fire-and-gold', description: 'The bouquet shown contains 100 roses.\nColors: Yellow, red, and purple roses.\nPaper: Peach.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $146.', descriptionEs: 'Colores: Rosas amarillas, rojas y moradas.\nPapel: Melocotón.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $146.', image: '', image2: '', color: 'Rojo, Amarillo y Pink', type: 'round', pricingTier: 'mix3red' },

  // Single - Painted
  { id: 'bq-round-22', name: 'Emerald Whisper', shopifyHandle: 'emerald-whisper', description: 'The bouquet shown contains 100 roses.\nColors: Green painted roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $136.', descriptionEs: 'Colores: Rosas verdes pintadas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $136.', image: '', image2: '', color: 'Verde', type: 'round', pricingTier: 'painted' },

  // Mix 2 - Natural + Painted
  { id: 'bq-round-30', name: 'Monochrome', shopifyHandle: 'monochrome', description: 'The bouquet shown contains 100 roses.\nColors: White and black painted roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas blancas y negras pintadas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: '', image2: '', color: 'Negro y Blanco', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-35', name: 'Sunkissed', shopifyHandle: 'sunkissed', description: 'The bouquet shown contains 100 roses.\nColors: White and orange roses.\nPaper: Peach.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas blancas y naranjas.\nPapel: Melocotón.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Naranja y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Natural
  { id: 'bq-round-7', name: 'Fuchsia Glow', shopifyHandle: 'fuchsia-glow', description: 'The bouquet shown contains 100 roses.\nColors: Hot pink roses.\nPaper: Pink.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas hot pink.\nPapel: Rosa.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Hot Pink', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Red
  { id: 'bq-round-18', name: 'Timeless Romance', shopifyHandle: 'timeless-romance', description: 'The bouquet shown contains 100 roses.\nColors: Light pink and red roses.\nPaper: Peach.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $116.', descriptionEs: 'Colores: Rosas rosa claro y rojas.\nPapel: Melocotón.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $116.', image: '', image2: '', color: 'Rojo y Light Pink', type: 'round', pricingTier: 'mix3red' },

  // Mix 2 - With Red
  { id: 'bq-round-34', name: 'Rosé Affair', shopifyHandle: 'ros-affair', description: 'The bouquet shown contains 100 roses.\nColors: Light pink and hot pink roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas rosa claro y hot pink.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Light Pink y Hot Pink', type: 'round', pricingTier: 'mix2' },

  // Single - Painted
  { id: 'bq-round-11', name: 'Onyx Rose', shopifyHandle: 'onyx-rose', description: 'The bouquet shown contains 100 roses.\nColors: Black painted roses.\nPaper: White.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $136.', descriptionEs: 'Colores: Rosas negras pintadas.\nPapel: Blanco.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $136.', image: '', image2: '', color: 'Negro', type: 'round', pricingTier: 'painted' },

  // 3 colors - Natural without red
  { id: 'bq-round-24', name: 'Autumn Glow', shopifyHandle: 'autumn-glow', description: 'The bouquet shown contains 100 roses.\nColors: White, orange, and purple roses.\nPaper: Brown.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $101.', descriptionEs: 'Colores: Rosas blancas, naranjas y moradas.\nNota: Las rosas moradas pueden sustituirse por hot pink según disponibilidad.\nPapel: Marrón.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: '', image2: '', color: 'Naranja, Hot Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Natural
  { id: 'bq-round-19', name: 'Amber Radiance', shopifyHandle: 'amber-radiance', description: 'The bouquet shown contains 100 roses.\nColors: Orange roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas naranjas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Naranja', type: 'round', pricingTier: 'standard' },

  // Mix 2 - With Red
  { id: 'bq-round-40', name: 'Midnight Amour', shopifyHandle: 'midnight-amour', description: 'The bouquet shown contains 100 roses.\nColors: Hot pink and red roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas hot pink y rojas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: '', image2: '', color: 'Rojo y Hot Pink', type: 'round', pricingTier: 'mix2' },

  // 3 colors - Natural without red
  { id: 'bq-round-39', name: 'Spring Whisper', shopifyHandle: 'spring-whisper', description: 'The bouquet shown contains 100 roses.\nColors: White, light pink, and yellow roses.\nPaper: Light Pink.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $101.', descriptionEs: 'Colores: Rosas blancas, rosa claro y amarillas.\nPapel: Rosa claro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: '', image2: '', color: 'Amarillo, Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Natural
  { id: 'bq-round-6', name: 'Ivory Elegance', shopifyHandle: 'ivory-elegance', description: 'The bouquet shown contains 100 roses.\nColors: White roses.\nPaper: White.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas blancas.\nPapel: Blanco.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Blanco', type: 'round', pricingTier: 'standard' },

  // Mix 2 - Natural + Painted
  { id: 'bq-round-38', name: 'Azure Tide', shopifyHandle: 'azure-tide', description: 'The bouquet shown contains 100 roses.\nColors: Blue painted and white roses.\nPaper: Blue.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas azules pintadas y blancas.\nPapel: Azul.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: '', image2: '', color: 'Azul y Blanco', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - With Red
  { id: 'bq-round-27', name: 'Golden Ardor', shopifyHandle: 'golden-ardor', description: 'The bouquet shown contains 100 roses.\nColors: Yellow and red roses.\nPaper: Beige.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $91.', descriptionEs: 'Colores: Rosas amarillas y rojas.\nPapel: Beige.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $91.', image: '', image2: '', color: 'Rojo y Amarillo', type: 'round', pricingTier: 'mix2' },

  // Single - Natural
  { id: 'bq-round-12', name: 'Violet Majesty', shopifyHandle: 'violet-majesty', description: 'The bouquet shown contains 100 roses.\nColors: Purple roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas moradas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Morado', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Painted
  { id: 'bq-round-36', name: 'Imperial Trio', shopifyHandle: 'imperial-trio', description: 'The bouquet shown contains 100 roses.\nColors: White, yellow, and black painted roses.\nPaper: Light Purple.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $161.', descriptionEs: 'Colores: Rosas blancas, amarillas y negras pintadas.\nPapel: Lila.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $161.', image: '', image2: '', color: 'Amarillo, Negro y Blanco', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-13', name: 'Aurora Blush', shopifyHandle: 'aurora-blush', description: 'The bouquet shown contains 100 roses.\nColors: Light pink, hot pink, and white roses.\nPaper: Pink.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas rosa claro, hot pink y blancas.\nPapel: Rosa.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Hot Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Red
  { id: 'bq-round-25', name: 'Regal Romance', shopifyHandle: 'regal-romance', description: 'The bouquet shown contains 100 roses.\nColors: Red, white, and purple roses.\nPaper: Light Pink.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $101.', descriptionEs: 'Colores: Rosas blancas, rojas y moradas.\nPapel: Rosa claro.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: '', image2: '', color: 'Rojo, Morado y Blanco', type: 'round', pricingTier: 'mix3red' },

  // Mix 2 - Natural + Painted
  { id: 'bq-round-42', name: 'Rosé Noir', shopifyHandle: 'ros-noir', description: 'The bouquet shown contains 100 roses.\nColors: Pink and black painted roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas pink y negras pintadas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: '', image2: '', color: 'Pink y Negro', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-32', name: 'Citrus Bloom', shopifyHandle: 'citrus-bloom', description: 'The bouquet shown contains 100 roses.\nColors: White, yellow, and Moab roses.\nPaper: Brown.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $101.', descriptionEs: 'Colores: Rosas blancas, amarillas y naranjas.\nPapel: Marrón.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $106.', image: '', image2: '', color: 'Naranja y Amarillo', type: 'round', pricingTier: 'standard' },

  // 3 colors - Natural without red
  { id: 'bq-round-33', name: 'Sunburst Duo', shopifyHandle: 'sunburst-duo', description: 'The bouquet shown contains 100 roses.\nColors: Yellow and orange roses.\nPaper: Brown.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas amarillas y naranjas.\nPapel: Marrón.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Naranja, Amarillo y Blanco', type: 'round', pricingTier: 'standard' },

  // Mix 2 - With Red
  { id: 'bq-round-43', name: 'Velvet Ardor', shopifyHandle: 'velvet-ardor', description: 'The bouquet shown contains 100 roses.\nColors: Red and purple roses.\nPaper: Pink.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas rojas y moradas.\nPapel: Rosa.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: '', image2: '', color: 'Rojo y Pink', type: 'round', pricingTier: 'mix2' },

  // Mix 2 - Natural without red
  { id: 'bq-round-44', name: 'Eternal Grace', shopifyHandle: 'eternal-grace', description: 'The bouquet shown contains 100 roses.\nColors: Light pink and Mondial roses.\nPaper: Pink.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas rosa claro y blancas.\nPapel: Rosa.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: '', image2: '', color: 'Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Red
  { id: 'bq-round-46', name: 'Amore Trio', shopifyHandle: 'amore-trio', description: 'The bouquet shown contains 100 roses.\nColors: Red, white, and light pink roses.\nPaper: Pink.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $116.', descriptionEs: 'Colores: Rosas rojas, blancas y rosa claro.\nPapel: Rosa.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $116.', image: '', image2: '', color: 'Rojo, Pink y Blanco', type: 'round', pricingTier: 'mix3red' },

  // 3 colors - Natural without red
  { id: 'bq-round-47', name: 'Rose Harmony', shopifyHandle: 'rose-harmony', description: 'The bouquet shown contains 100 roses.\nColors: Pink, white, and red roses.\nPaper: Pink.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $116.', descriptionEs: 'Colores: Rosas pink, blancas y rojas.\nPapel: Rosa.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $116.', image: '', image2: '', color: 'Hot Pink, Light Pink, Blanco y Rojo', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Painted
  { id: 'bq-round-45', name: 'Noir Romance', shopifyHandle: 'noir-romance', description: 'The bouquet shown contains 100 roses.\nColors: White and red roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $91.', descriptionEs: 'Colores: Rosas blancas y rojas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $91.', image: '', image2: '', color: 'Rojo y Blanco', type: 'round', pricingTier: 'mix2' },

  // === Zodiac Bouquets (from Shopify) ===
];

export const bouquetSizeOptions = pricingTable;
