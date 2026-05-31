import type { Product } from '../types/product.types';
import { mockProducts } from '../data/mockProducts';

const storageKey = 'hiperflow.products.mock';

const read = (): Product[] => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) as Product[] : mockProducts;
  } catch {
    return mockProducts;
  }
};

const write = (products: Product[]) => {
  window.localStorage.setItem(storageKey, JSON.stringify(products));
};

export const ProductStorage = {
  list() {
    return read();
  },

  add(product: Omit<Product, 'id'>) {
    const products = read();
    const nextProduct = {
      id: Math.max(0, ...products.map((item) => item.id)) + 1,
      ...product,
    };
    const nextProducts = [nextProduct, ...products];
    write(nextProducts);
    return nextProducts;
  },
};
