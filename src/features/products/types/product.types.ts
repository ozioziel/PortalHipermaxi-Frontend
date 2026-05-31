export interface Product {
  id: number;
  description: string;
  supplierBar: string;
  sanitaryRegistry: string;
  sanitaryRegistryDate: string;
  price?: string;
}

// Note: only export the type/interface; do not export a runtime value.
