export const supplierRegions = [
  'La Paz',
  'Cochabamba',
  'Santa Cruz',
  'Oruro',
  'Potosi',
  'Tarija',
  'Chuquisaca',
  'Beni',
  'Pando',
  'Nacional',
] as const;

export type SupplierRegion = (typeof supplierRegions)[number];
