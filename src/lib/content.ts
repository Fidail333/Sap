import modules from '../../content/modules.json';
import sapphire from '../../content/sapphire.json';

export const modulesData = modules;
export const sapphireData = sapphire;

export function getAllModuleItems() {
  return modulesData.categories.flatMap((category) =>
    category.items.map((item) => ({ ...item, category: category.slug, categoryName: category.name }))
  );
}

export function getModuleBySlug(slug: string) {
  return getAllModuleItems().find((item) => item.slug === slug);
}
