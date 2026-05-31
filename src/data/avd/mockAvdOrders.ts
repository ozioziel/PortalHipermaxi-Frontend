export type AvdStatus = 'Sin Aviso de Despacho' | 'Confirmado';

export interface AvdOrderItem {
  item: number;
  barra: string;
  proveedor: string;
  barraHipermaxi: string;
  producto: string;
  moneda: string;
  cantidadOC: number;
  precioUnitario: number;
  subTotal: number;
  cantidadDespachada: number | '';
}

export interface AvdOrder {
  id: string;
  nroOrden: string;
  fecha: string;
  unidadNegocio: string;
  codigoProveedor: string;
  importeTotalOC: number;
  importeTotalAVD: number;
  moneda: string;
  estado: AvdStatus;
  confirmed: boolean;
  items: AvdOrderItem[];
}

export const mockAvdOrders: AvdOrder[] = [
  {
    id: 'avd-001',
    nroOrden: 'OC-1082271',
    fecha: '24/03/26',
    unidadNegocio: 'U.N. SOPOCACHI',
    codigoProveedor: '2978',
    importeTotalOC: 316.8,
    importeTotalAVD: 0,
    moneda: 'Bs',
    estado: 'Sin Aviso de Despacho',
    confirmed: false,
    items: [
      {
        item: 1,
        barra: '789100001',
        proveedor: 'Proveedor Demo',
        barraHipermaxi: 'HMX-001',
        producto: 'Producto de prueba',
        moneda: 'Bs',
        cantidadOC: 16,
        precioUnitario: 19.8,
        subTotal: 316.8,
        cantidadDespachada: '',
      },
      {
        item: 2,
        barra: '789100002',
        proveedor: 'Proveedor Demo',
        barraHipermaxi: 'HMX-003',
        producto: 'Producto auxiliar',
        moneda: 'Bs',
        cantidadOC: 8,
        precioUnitario: 11.25,
        subTotal: 90,
        cantidadDespachada: '',
      },
    ],
  },
  {
    id: 'avd-002',
    nroOrden: 'OC-1082272',
    fecha: '25/04/26',
    unidadNegocio: 'U.N. FARMACIA',
    codigoProveedor: '2978',
    importeTotalOC: 250,
    importeTotalAVD: 250,
    moneda: 'Bs',
    estado: 'Confirmado',
    confirmed: true,
    items: [
      {
        item: 1,
        barra: '789200001',
        proveedor: 'Proveedor Demo',
        barraHipermaxi: 'HMX-002',
        producto: 'Producto confirmado',
        moneda: 'Bs',
        cantidadOC: 10,
        precioUnitario: 25,
        subTotal: 250,
        cantidadDespachada: 10,
      },
    ],
  },
];
