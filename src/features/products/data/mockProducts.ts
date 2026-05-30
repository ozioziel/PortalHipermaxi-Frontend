import type { Product } from '../types/product.types';

export const mockProducts: Product[] = [
  { id: 1, description: 'PERLA CLASSIC CON CANELA 140G', supplierBar: '123456', sanitaryRegistry: 'RS-001', sanitaryRegistryDate: '2024-01-12' },
  { id: 2, description: 'DOD ACAO ALTO MIX', supplierBar: '654321', sanitaryRegistry: 'RS-002', sanitaryRegistryDate: '2024-02-05' },
  { id: 3, description: 'CEREAL NESQUIK', supplierBar: '987654', sanitaryRegistry: 'RS-003', sanitaryRegistryDate: '2023-11-20' },
  { id: 4, description: 'NESTLE CHOCOLATE', supplierBar: '246810', sanitaryRegistry: 'RS-004', sanitaryRegistryDate: '2023-09-01' },
  { id: 5, description: 'SNACK DE QUESO', supplierBar: '135791', sanitaryRegistry: 'RS-005', sanitaryRegistryDate: '2024-03-18' },
];

export default mockProducts;
