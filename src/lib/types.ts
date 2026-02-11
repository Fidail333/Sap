export type ProductEnvironment = 'indoor' | 'outdoor';
export type ProductAvailability = 'in_stock' | 'preorder' | null;

export interface ProductItem {
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

export interface ProductCollection {
  products: ProductItem[];
}

export interface CaseItem {
  slug: string;
  title: string;
  industry: string;
  task: string;
  solution: string;
  result: string;
}
