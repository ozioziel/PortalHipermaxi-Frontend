export type InvoiceWorkflowState = 'pending' | 'observed' | 'uploaded';

export interface UploadedInvoice {
  id: string;
  fileName: string;
  status: string;
  amount: number;
  invoiceDate: string;
  uploadedAt: string;
  fileUrl?: string;
}

export interface PurchaseOrder {
  id: string;
  unidadNegocio: string;
  codigoProveedor: string;
  nroOrden: string;
  fechaOrden: string;
  nroRecepcion: string;
  fechaRecepcion: string;
  importeTotalRecepcion: number;
  importeTotalFactura: number;
  estadoRecepcion: string;
  estadoFactura: InvoiceWorkflowState;
  observed: boolean;
  observations: string[];
  fechaFacturaValidado: string;
  uploadedInvoices: UploadedInvoice[];
}

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'oc-001',
    unidadNegocio: 'U.N. SOPOCACHI',
    codigoProveedor: '2978',
    nroOrden: 'OC-1082271',
    fechaOrden: '24/03/26',
    nroRecepcion: 'REC-0001',
    fechaRecepcion: '24/03/26',
    importeTotalRecepcion: 1420.5,
    importeTotalFactura: 0,
    estadoRecepcion: 'Carga Factura Pendiente',
    estadoFactura: 'pending',
    observed: false,
    observations: [],
    fechaFacturaValidado: 'Pendiente',
    uploadedInvoices: [],
  },
  {
    id: 'oc-002',
    unidadNegocio: 'FARMACIA',
    codigoProveedor: '2978',
    nroOrden: 'OC-1082272',
    fechaOrden: '25/04/26',
    nroRecepcion: 'REC-0002',
    fechaRecepcion: '25/04/26',
    importeTotalRecepcion: 3175,
    importeTotalFactura: 2890.75,
    estadoRecepcion: 'Observado',
    estadoFactura: 'observed',
    observed: true,
    observations: [
      'Diferencia de cantidades entre los productos recepcionados y facturado',
      'Mal ingreso de cantidad por producto',
      'Diferencia de precio',
      'La factura está vencida',
      'Factura duplicada',
    ],
    fechaFacturaValidado: '26/04/26',
    uploadedInvoices: [],
  },
];

export default mockPurchaseOrders;
