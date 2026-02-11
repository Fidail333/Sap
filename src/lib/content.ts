import catalogCollection from '../../content/custom/catalog.json';
import casesList from '../../content/cases.json';
import type { CaseItem, CatalogCollection, CatalogProductItem, DisplayProductItem, ModuleProductItem } from './types';

const catalog = catalogCollection as CatalogCollection;

export const moduleProductsData: ModuleProductItem[] = catalog.modules.map((item) => ({
  ...item,
  catalog_type: 'modules'
}));

export const displayProductsData: DisplayProductItem[] = catalog.displays.map((item) => ({
  ...item,
  catalog_type: 'displays'
}));

export const productsData: CatalogProductItem[] = [...moduleProductsData, ...displayProductsData];
export const casesData = casesList as CaseItem[];

export function getProductBySlug(slug: string) {
  return productsData.find((item) => item.id === slug);
}

export function getProductCategories() {
  return Array.from(new Set(moduleProductsData.map((item) => `${item.environment} • P${item.pitch_mm}`)));
}
