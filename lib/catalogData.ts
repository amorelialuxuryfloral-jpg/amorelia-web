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
const CDN = 'https://cdn.shopify.com/s/files/1/0979/1671/5140/files';

export const bouquetProducts: BouquetProduct[] = [
  // === Shuffled mix of single-color + multi-color bouquets ===

  // Mix 2 colors - Natural + Red
  { id: 'bq-round-37', name: 'Crimson & Ivory', shopifyHandle: 'crimson-and-ivory', description: 'The bouquet shown contains 100 roses.\nColors: White and red roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $91.', descriptionEs: 'Colores: Rosas blancas y rojas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $91.', image: `${CDN}/hf_20260521_142009_858d33d4-2436-4735-892f-feb3bc3a5cf8.png?v=1779392518`, image2: `${CDN}/24_0314d01a-12b4-4e70-926b-75eadccc1a74.png?v=1774611351`, color: 'Rojo y Blanco', type: 'round', pricingTier: 'mix2' },

  // Single - Natural
  { id: 'bq-round-8', name: 'Blush Petals', shopifyHandle: 'blush-petals', description: 'The bouquet shown contains 100 roses.\nColors: Pink roses.\nPaper: White.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas pink.\nPapel: Blanco.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/5_e69dee54-c820-4910-95cb-130b55626cda.png?v=1774610955`, image2: `${CDN}/5_61493d6c-53c5-46a7-9862-3022e5b409c3.png?v=1774611351`, color: 'Pink', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Painted
  { id: 'bq-round-31', name: 'Bold Contrast', shopifyHandle: 'bold-contrast', description: 'The bouquet shown contains 100 roses.\nColors: White, hot pink, and black painted roses.\nPaper: Pink.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $146.', descriptionEs: 'Colores: Rosas blancas, hot pink y negras pintadas.\nPapel: Rosa.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $146.', image: `${CDN}/9.png?v=1774610789`, image2: `${CDN}/13_1452edb3-b294-46be-8540-95fb0ba38405.png?v=1774611351`, color: 'Negro, Hot Pink y Blanco', type: 'round', pricingTier: 'mix2painted', customSizes: [{ roses: 75, price: 131 }, { roses: 100, price: 166 }, { roses: 125, price: 231 }, { roses: 150, price: 286 }, { roses: 175, price: 311 }, { roses: 200, price: 361 }] },

  // Single - Natural
  { id: 'bq-round-20', name: 'Golden Sunshine', shopifyHandle: 'golden-sunshine', description: 'The bouquet shown contains 100 roses.\nColors: Yellow roses.\nPaper: Beige.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas amarillas.\nPapel: Beige.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/4_64454122-543f-42d2-b5dd-0c63e33d023e.png?v=1774610954`, image2: `${CDN}/25_c6ba3fcb-bc77-4481-bea0-f51b6fb3b42b.png?v=1774611351`, color: 'Amarillo', type: 'round', pricingTier: 'standard' },

  // Mix 3 - Natural without red
  { id: 'bq-round-23', name: 'Pastel Reverie', shopifyHandle: 'pastel-reverie', description: 'The bouquet shown contains 100 roses.\nColors: White, pink, and purple roses.\nPaper: Purple.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $101.', descriptionEs: 'Colores: Rosas blancas, pink y moradas.\nPapel: Morado.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/1.png?v=1774610789`, image2: `${CDN}/1_308eef44-e8df-4e4b-b905-091e2cc21003.png?v=1774611351`, color: 'Morado, Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Painted
  { id: 'bq-round-10', name: 'Sapphire Dream', shopifyHandle: 'sapphire-dream', description: 'The bouquet shown contains 100 roses.\nColors: Blue painted roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $136.', descriptionEs: 'Colores: Rosas azules pintadas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $136.', image: `${CDN}/1_8735cef8-ff63-47f8-86ef-d71c1bb57986.png?v=1774610955`, image2: `${CDN}/21_00027305-010a-484f-a712-ad6f561e59ed.png?v=1774611351`, color: 'Azul', type: 'round', pricingTier: 'painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-15', name: 'Sunlit Meadow', shopifyHandle: 'sunlit-meadow', description: 'The bouquet shown contains 100 roses.\nColors: White and yellow roses.\nPaper: White.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas blancas y amarillas.\nPapel: Blanco.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/3.png?v=1774610789`, image2: `${CDN}/7_a7912f37-4803-40b4-ac33-deaa7d4192c6.png?v=1774611352`, color: 'Amarillo y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Red
  { id: 'bq-round-5', name: 'Scarlet Devotion', shopifyHandle: 'scarlet-devotion', description: 'The bouquet shown contains 100 roses.\nColors: Red roses.\nPaper: Pink.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $106.', descriptionEs: 'Colores: Rosas rojas.\nPapel: Rosa.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $106.', image: `${CDN}/9_f5ae14ce-39a8-46e7-be8f-e549dd07f043.png?v=1774610955`, image2: `${CDN}/2_0b0317c5-cc6b-4b13-95ef-586bb809ce71.png?v=1774611351`, color: 'Rojo', type: 'round', pricingTier: 'red' },

  // 3 colors - With Red
  { id: 'bq-round-26', name: 'Fire & Gold', shopifyHandle: 'fire-and-gold', description: 'The bouquet shown contains 100 roses.\nColors: Yellow, red, and purple roses.\nPaper: Peach.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $146.', descriptionEs: 'Colores: Rosas amarillas, rojas y moradas.\nPapel: Melocotón.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $146.', image: `${CDN}/5.png?v=1774610789`, image2: `${CDN}/9_4391728c-de10-4bae-89de-584176527a72.png?v=1774611351`, color: 'Rojo, Amarillo y Pink', type: 'round', pricingTier: 'mix3red' },

  // Single - Painted
  { id: 'bq-round-22', name: 'Emerald Whisper', shopifyHandle: 'emerald-whisper', description: 'The bouquet shown contains 100 roses.\nColors: Green painted roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $136.', descriptionEs: 'Colores: Rosas verdes pintadas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $136.', image: `${CDN}/3_2cfe7583-0904-4673-9dd4-110546c46a33.png?v=1774610955`, image2: `${CDN}/16_4021ad91-0660-4856-9903-913ef4e7731e.png?v=1774611351`, color: 'Verde', type: 'round', pricingTier: 'painted' },

  // Mix 2 - Natural + Painted
  { id: 'bq-round-30', name: 'Monochrome', shopifyHandle: 'monochrome', description: 'The bouquet shown contains 100 roses.\nColors: White and black painted roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas blancas y negras pintadas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: `${CDN}/8.png?v=1774610789`, image2: `${CDN}/12_613d3488-6368-4edc-a249-630c90337b1c.png?v=1774611351`, color: 'Negro y Blanco', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-35', name: 'Sunkissed', shopifyHandle: 'sunkissed', description: 'The bouquet shown contains 100 roses.\nColors: White and orange roses.\nPaper: Peach.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas blancas y naranjas.\nPapel: Melocotón.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/14.png?v=1774610789`, image2: `${CDN}/22_203bcb9c-de86-467e-99f8-abf99e5a034e.png?v=1774611351`, color: 'Naranja y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Natural
  { id: 'bq-round-7', name: 'Fuchsia Glow', shopifyHandle: 'fuchsia-glow', description: 'The bouquet shown contains 100 roses.\nColors: Hot pink roses.\nPaper: Pink.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas hot pink.\nPapel: Rosa.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/10_13e615d2-0e75-4583-a1bf-5b44f823ed23.png?v=1774610956`, image2: `${CDN}/3_813160a1-5301-4924-8104-0d68526cc63b.png?v=1774611351`, color: 'Hot Pink', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Red
  { id: 'bq-round-18', name: 'Timeless Romance', shopifyHandle: 'timeless-romance', description: 'The bouquet shown contains 100 roses.\nColors: Light pink and red roses.\nPaper: Peach.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $116.', descriptionEs: 'Colores: Rosas rosa claro y rojas.\nPapel: Melocotón.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $116.', image: `${CDN}/13.png?v=1774610789`, image2: `${CDN}/19_a318d086-2c87-4b5e-ba78-50141e236d77.png?v=1774611351`, color: 'Rojo y Light Pink', type: 'round', pricingTier: 'mix3red' },

  // Mix 2 - With Red
  { id: 'bq-round-34', name: 'Rosé Affair', shopifyHandle: 'ros-affair', description: 'The bouquet shown contains 100 roses.\nColors: Light pink and hot pink roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas rosa claro y hot pink.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/12.png?v=1774610789`, image2: `${CDN}/17_d1f6e6d4-4408-4ba7-a0c5-df047c76ef58.png?v=1774611351`, color: 'Light Pink y Hot Pink', type: 'round', pricingTier: 'mix2' },

  // Single - Painted
  { id: 'bq-round-11', name: 'Onyx Rose', shopifyHandle: 'onyx-rose', description: 'The bouquet shown contains 100 roses.\nColors: Black painted roses.\nPaper: White.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $136.', descriptionEs: 'Colores: Rosas negras pintadas.\nPapel: Blanco.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $136.', image: `${CDN}/8_e5f14e13-bc9d-4cbb-bf31-8bd4994ba36c.png?v=1774610954`, image2: `${CDN}/20_f4c1ec83-306f-4c5c-92d7-db282bb6706c.png?v=1774611351`, color: 'Negro', type: 'round', pricingTier: 'painted' },

  // 3 colors - Natural without red
  { id: 'bq-round-24', name: 'Autumn Glow', shopifyHandle: 'autumn-glow', description: 'The bouquet shown contains 100 roses.\nColors: White, orange, and purple roses.\nPaper: Brown.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $101.', descriptionEs: 'Colores: Rosas blancas, naranjas y moradas.\nNota: Las rosas moradas pueden sustituirse por hot pink según disponibilidad.\nPapel: Marrón.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/2.png?v=1774610789`, image2: `${CDN}/6_1a90e2f1-617c-4ddc-81e4-d251ffc2d02b.png?v=1774611351`, color: 'Naranja, Hot Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // Mix 2 - Girasoles
  { id: 'bq-round-28', name: 'Sunflower Romance', shopifyHandle: 'sunflower-romance', description: 'The bouquet shown contains 100 roses.\nColors: Sunflowers and red roses.\nPaper: Black.\nSizes: 50, 100, and 150 roses with sunflowers.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $146.', descriptionEs: 'Colores: Girasoles y rosas rojas.\nPapel: Negro.\nTamaños: 50, 100 y 150 rosas con girasoles.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $146.', image: `${CDN}/7.png?v=1774610789`, image2: `${CDN}/11_ef3d6f5c-0e8d-483d-8a57-8e431f98e364.png?v=1774611351`, color: 'Girasoles y Rojo', type: 'round', pricingTier: 'mix2', customSizes: [{ roses: 50, price: 146, label: '50 red roses + 8 sunflowers' }, { roses: 100, price: 306, label: '100 red roses + 22 sunflowers' }, { roses: 150, price: 426, label: '150 red roses + 22 sunflowers' }] },

  // Single - Natural
  { id: 'bq-round-19', name: 'Amber Radiance', shopifyHandle: 'amber-radiance', description: 'The bouquet shown contains 100 roses.\nColors: Orange roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas naranjas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/2_4ce938e3-ed17-43ba-93c8-4bb90bd8f839.png?v=1774610955`, image2: `${CDN}/4_049f315b-d1dc-4503-8cd9-eb4892b00e4f.png?v=1774611351`, color: 'Naranja', type: 'round', pricingTier: 'standard' },

  // Mix 2 - With Red
  { id: 'bq-round-40', name: 'Midnight Amour', shopifyHandle: 'midnight-amour', description: 'The bouquet shown contains 100 roses.\nColors: Hot pink and red roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas hot pink y rojas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: `${CDN}/20.png?v=1774610789`, image2: `${CDN}/29.png?v=1774611351`, color: 'Rojo y Hot Pink', type: 'round', pricingTier: 'mix2' },

  // 3 colors - Natural without red
  { id: 'bq-round-39', name: 'Spring Whisper', shopifyHandle: 'spring-whisper', description: 'The bouquet shown contains 100 roses.\nColors: White, light pink, and yellow roses.\nPaper: Light Pink.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $101.', descriptionEs: 'Colores: Rosas blancas, rosa claro y amarillas.\nPapel: Rosa claro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/19.png?v=1774610789`, image2: `${CDN}/28.png?v=1774611352`, color: 'Amarillo, Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // Single - Natural
  { id: 'bq-round-6', name: 'Ivory Elegance', shopifyHandle: 'ivory-elegance', description: 'The bouquet shown contains 100 roses.\nColors: White roses.\nPaper: White.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas blancas.\nPapel: Blanco.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/7_66d51745-8450-43cc-9f6d-acf138fc2d81.png?v=1774610955`, image2: `${CDN}/18_9f989947-5cb9-41ab-bd2c-4f4ce0338ed3.png?v=1774611351`, color: 'Blanco', type: 'round', pricingTier: 'standard' },

  // Mix 2 - Natural + Painted
  { id: 'bq-round-38', name: 'Azure Tide', shopifyHandle: 'azure-tide', description: 'The bouquet shown contains 100 roses.\nColors: Blue painted and white roses.\nPaper: Blue.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas azules pintadas y blancas.\nPapel: Azul.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: `${CDN}/17.png?v=1774610789`, image2: `${CDN}/26_89f6f108-2ce7-418a-90da-46eac59f98fc.png?v=1774611352`, color: 'Azul y Blanco', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - With Red
  { id: 'bq-round-27', name: 'Golden Ardor', shopifyHandle: 'golden-ardor', description: 'The bouquet shown contains 100 roses.\nColors: Yellow and red roses.\nPaper: Beige.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $91.', descriptionEs: 'Colores: Rosas amarillas y rojas.\nPapel: Beige.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $91.', image: `${CDN}/6.png?v=1774610789`, image2: `${CDN}/10_edf36aaa-454f-4f98-8b86-7218143de468.png?v=1774611352`, color: 'Rojo y Amarillo', type: 'round', pricingTier: 'mix2' },

  // Single - Natural
  { id: 'bq-round-12', name: 'Violet Majesty', shopifyHandle: 'violet-majesty', description: 'The bouquet shown contains 100 roses.\nColors: Purple roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas moradas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/6_76f89215-f151-4ae3-858e-7b39b5aeb37f.png?v=1774610954`, image2: `${CDN}/33.png?v=1774611352`, color: 'Morado', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Painted
  { id: 'bq-round-36', name: 'Imperial Trio', shopifyHandle: 'imperial-trio', description: 'The bouquet shown contains 100 roses.\nColors: White, yellow, and black painted roses.\nPaper: Light Purple.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $161.', descriptionEs: 'Colores: Rosas blancas, amarillas y negras pintadas.\nPapel: Lila.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $161.', image: `${CDN}/15.png?v=1774610789`, image2: `${CDN}/23_69e8f416-037f-4416-9f9a-15a4b4ab64dd.png?v=1774611351`, color: 'Amarillo, Negro y Blanco', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-13', name: 'Aurora Blush', shopifyHandle: 'aurora-blush', description: 'The bouquet shown contains 100 roses.\nColors: Light pink, hot pink, and white roses.\nPaper: Pink.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas rosa claro, hot pink y blancas.\nPapel: Rosa.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/10.png?v=1774610789`, image2: `${CDN}/14_c088f644-9fa6-4fc6-99ba-6c3655554f7e.png?v=1774611351`, color: 'Hot Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Red
  { id: 'bq-round-25', name: 'Regal Romance', shopifyHandle: 'regal-romance', description: 'The bouquet shown contains 100 roses.\nColors: Red, white, and purple roses.\nPaper: Light Pink.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $101.', descriptionEs: 'Colores: Rosas blancas, rojas y moradas.\nPapel: Rosa claro.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $131.', image: `${CDN}/4.png?v=1774610789`, image2: `${CDN}/8_6cc51f79-f007-4876-9a7a-a4def98a68e3.png?v=1774611351`, color: 'Rojo, Morado y Blanco', type: 'round', pricingTier: 'mix3red' },

  // Mix 2 - Natural + Painted
  { id: 'bq-round-42', name: 'Rosé Noir', shopifyHandle: 'ros-noir', description: 'The bouquet shown contains 100 roses.\nColors: Pink and black painted roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas pink y negras pintadas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: `${CDN}/21.png?v=1774610789`, image2: `${CDN}/30.png?v=1774611351`, color: 'Pink y Negro', type: 'round', pricingTier: 'mix2painted' },

  // Mix 2 - Natural without red
  { id: 'bq-round-32', name: 'Citrus Bloom', shopifyHandle: 'citrus-bloom', description: 'The bouquet shown contains 100 roses.\nColors: White, yellow, and Moab roses.\nPaper: Brown.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $101.', descriptionEs: 'Colores: Rosas blancas, amarillas y naranjas.\nPapel: Marrón.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $106.', image: `${CDN}/11.png?v=1774610789`, image2: `${CDN}/15_1d277f4a-67ae-432e-a58e-a0a278ee8732.png?v=1774611351`, color: 'Naranja y Amarillo', type: 'round', pricingTier: 'standard' },

  // 3 colors - Natural without red
  { id: 'bq-round-33', name: 'Sunburst Duo', shopifyHandle: 'sunburst-duo', description: 'The bouquet shown contains 100 roses.\nColors: Yellow and orange roses.\nPaper: Brown.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas amarillas y naranjas.\nPapel: Marrón.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/18.png?v=1774610789`, image2: `${CDN}/27.png?v=1774611352`, color: 'Naranja, Amarillo y Blanco', type: 'round', pricingTier: 'standard' },

  // Mix 2 - With Red
  { id: 'bq-round-43', name: 'Velvet Ardor', shopifyHandle: 'velvet-ardor', description: 'The bouquet shown contains 100 roses.\nColors: Red and purple roses.\nPaper: Pink.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $121.', descriptionEs: 'Colores: Rosas rojas y moradas.\nPapel: Rosa.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $121.', image: `${CDN}/22.png?v=1774610789`, image2: `${CDN}/31.png?v=1774611351`, color: 'Rojo y Pink', type: 'round', pricingTier: 'mix2' },

  // Mix 2 - Natural without red
  { id: 'bq-round-44', name: 'Eternal Grace', shopifyHandle: 'eternal-grace', description: 'The bouquet shown contains 100 roses.\nColors: Light pink and Mondial roses.\nPaper: Pink.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $76.', descriptionEs: 'Colores: Rosas rosa claro y blancas.\nPapel: Rosa.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $76.', image: `${CDN}/25.png?v=1774610789`, image2: `${CDN}/35.png?v=1774611351`, color: 'Pink y Blanco', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Red
  { id: 'bq-round-46', name: 'Amore Trio', shopifyHandle: 'amore-trio', description: 'The bouquet shown contains 100 roses.\nColors: Red, white, and light pink roses.\nPaper: Pink.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $116.', descriptionEs: 'Colores: Rosas rojas, blancas y rosa claro.\nPapel: Rosa.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $116.', image: `${CDN}/24.png?v=1774610789`, image2: `${CDN}/34.png?v=1774611351`, color: 'Rojo, Pink y Blanco', type: 'round', pricingTier: 'mix3red' },

  // 3 colors - Natural without red
  { id: 'bq-round-47', name: 'Rose Harmony', shopifyHandle: 'rose-harmony', description: 'The bouquet shown contains 100 roses.\nColors: Pink, white, and red roses.\nPaper: Pink.\nSizes: 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $116.', descriptionEs: 'Colores: Rosas pink, blancas y rojas.\nPapel: Rosa.\nTamaños: 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $116.', image: `${CDN}/23.png?v=1774610789`, image2: `${CDN}/32.png?v=1774611351`, color: 'Hot Pink, Light Pink, Blanco y Rojo', type: 'round', pricingTier: 'standard' },

  // 3 colors - With Painted
  { id: 'bq-round-45', name: 'Noir Romance', shopifyHandle: 'noir-romance', description: 'The bouquet shown contains 100 roses.\nColors: White and red roses.\nPaper: Black.\nSizes: 50, 75, 100, 125, 150, 175, and 200 roses.\nDelivery: Same-day up to 90 miles. Free pickup in Miami, FL.\nFrom $91.', descriptionEs: 'Colores: Rosas blancas y rojas.\nPapel: Negro.\nTamaños: 50, 75, 100, 125, 150, 175 y 200 rosas.\nAcabado: Natural, glitter o pintado.\nEnvío: Mismo día hasta 90 millas. Recogida gratis en Miami, FL.\nDesde $91.', image: `${CDN}/26.png?v=1774610789`, image2: `${CDN}/36.png?v=1774611351`, color: 'Rojo y Blanco', type: 'round', pricingTier: 'mix2' },

  // === Zodiac Bouquets (from Shopify) ===
];

export const bouquetSizeOptions = pricingTable;
