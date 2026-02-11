export type Direction = 'SAPPHIRE' | 'MODULES';

export interface CatalogItem {
  name: string;
  slug: string;
  description: string;
  specs: Record<string, string>;
  images: string[];
  source_url: string;
}

export interface Category {
  name: string;
  slug: string;
  source_url: string;
  items: CatalogItem[];
}
