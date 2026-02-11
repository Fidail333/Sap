export interface ProductSpecs {
  pixelPitch: string;
  brightness: string;
  refreshRate: string;
  cabinetSize: string;
  ipRating: string;
  viewingAngle: string;
  power: string;
}

export interface ProductItem {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  specs: ProductSpecs;
  useCases: string[];
  gallery: string[];
  badges: string[];
}

export interface CaseItem {
  slug: string;
  title: string;
  industry: string;
  task: string;
  solution: string;
  result: string;
}
