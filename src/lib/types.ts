export type ProductEnvironment = 'indoor' | 'outdoor';
export type ProductAvailability = 'in_stock' | 'preorder' | null;

export interface ModuleProductItem {
  catalog_type: 'modules';
  id: string;
  brand: string;
  name: string;
  pitch_mm: number;
  environment: ProductEnvironment;
  is_flexible: boolean;
  tech: string[];
  refresh_hz: number | null;
  size_mm: string | null;
  scan: string | null;
  thickness_mm: number | null;
  chipset: string | null;
  price_rub: number | null;
  availability: ProductAvailability;
  badges: string[];
  image: string;
  short_description: string;
}

export type DisplayProductType = 'cabinet' | 'all-in-one';

export interface DisplayProductItem {
  catalog_type: 'displays';
  id: string;
  brand: 'SAPPHIRE';
  line: string;
  series: string;
  model: string;
  name: string;
  product_type: DisplayProductType;
  pitch_mm: number;
  pixel_type: 'COB' | 'COB Flip Chip';
  cabinet_size_mm: string;
  module_size_mm: string | null;
  module_resolution: string | null;
  cabinet_resolution: string | null;
  screen_resolution?: 'UHD' | 'FHD';
  colors_bit: string | null;
  contrast: string | null;
  brightness_nits: string | null;
  refresh_hz: string | null;
  view_angle_h: '175°' | '160°';
  view_angle_v: '175°' | '160°';
  ip_rating: string;
  scan: string | null;
  power_avg: string | null;
  power_max: string | null;
  weight_kg: string | null;
  availability: 'preorder';
  price_rub: null;
  image: string;
  highlights: string[];
  description: string;
}

export type CatalogProductItem = ModuleProductItem | DisplayProductItem;

export interface CatalogCollection {
  modules: Omit<ModuleProductItem, 'catalog_type'>[];
  displays: Omit<DisplayProductItem, 'catalog_type'>[];
}

export interface CaseItem {
  slug: string;
  title: string;
  industry: string;
  task: string;
  solution: string;
  result: string;
}
