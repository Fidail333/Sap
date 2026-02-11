import products from '../../content/products.json';
import casesList from '../../content/cases.json';
import type { CaseItem, ProductItem } from './types';

export const productsData = products as ProductItem[];
export const casesData = casesList as CaseItem[];

export function getProductBySlug(slug: string) {
  return productsData.find((item) => item.slug === slug);
}

export function getProductCategories() {
  return Array.from(new Set(productsData.map((item) => item.category)));
}
