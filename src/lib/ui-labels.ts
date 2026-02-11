import type { ProductEnvironment } from './types';

export const environmentLabelMap: Record<ProductEnvironment, string> = {
  indoor: 'Для помещений',
  outdoor: 'Уличный'
};

export const flexibleLabelMap: Record<'yes' | 'no', string> = {
  yes: 'Гибкий',
  no: 'Жёсткий'
};

export const availabilityLabelMap: Record<'in_stock' | 'preorder', string> = {
  in_stock: 'В наличии',
  preorder: 'Под заказ'
};

export function formatEnvironmentLabel(value: ProductEnvironment) {
  return environmentLabelMap[value] ?? value;
}

export function formatFlexibleLabel(value: boolean) {
  return flexibleLabelMap[value ? 'yes' : 'no'];
}
