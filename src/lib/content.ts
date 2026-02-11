import productsCollection from '../../content/custom/products.json';
import casesList from '../../content/cases.json';
import type { CaseItem, ProductCollection, ProductItem } from './types';

export const productsData = (productsCollection as ProductCollection).products;
export const casesData = casesList as CaseItem[];

export function getProductBySlug(slug: string) {
  return productsData.find((item) => item.id === slug);
}

export function getProductCategories() {
  return Array.from(new Set(productsData.map((item) => `${item.environment} • P${item.pitch_mm}`)));
}
