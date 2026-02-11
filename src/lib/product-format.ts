import type { CatalogProductItem, ProductAvailability } from './types';
import { availabilityLabelMap } from './ui-labels';

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export function formatPrice(price: number | null) {
  if (price === null) return 'Цена по запросу';
  return `${priceFormatter.format(price)} ₽/шт`;
}

export function formatAvailabilityLabel(status: ProductAvailability) {
  if (!status) return 'Уточняйте';
  return availabilityLabelMap[status];
}

export function productTechLabel(product: CatalogProductItem) {
  if (product.catalog_type === 'modules') return product.tech.join(' / ');
  return product.pixel_type;
}
