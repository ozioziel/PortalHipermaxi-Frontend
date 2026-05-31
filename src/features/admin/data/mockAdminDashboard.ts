export const mockDashboardSummary = {
  totalUsers: 324,
  totalAiInteractions: 1460,
  totalFaqs: 82,
  formsStarted: 172,
  formsCompleted: 138,
  errorsDetected: 26,
  invoicesViewed: 58,
  visualGuidesStarted: 47,
};

export const mockFrequentQuestions = [
  {
    question: '¿Cómo cargo una factura?',
    count: 24,
    lastAsked: '2026-05-30 16:08',
    module: 'Facturas',
  },
  {
    question: '¿Dónde veo mis órdenes de compra?',
    count: 19,
    lastAsked: '2026-05-30 14:25',
    module: 'Compras',
  },
  {
    question: '¿Qué documentos necesito para registrarme?',
    count: 14,
    lastAsked: '2026-05-30 12:10',
    module: 'Proveedor',
  },
  {
    question: '¿Cómo corrijo una factura observada?',
    count: 11,
    lastAsked: '2026-05-29 18:02',
    module: 'Facturas',
  },
  {
    question: '¿Cómo contacto a soporte?',
    count: 9,
    lastAsked: '2026-05-29 10:30',
    module: 'General',
  },
];

export const mockRecentActivity = [
  { userEmail: 'maria@empresa.com', module: 'Facturas', action: 'Ver factura', createdAt: '2026-05-30T16:40:00Z' },
  { userEmail: 'juan@empresa.com', module: 'Productos', action: 'Filtrar productos', createdAt: '2026-05-30T15:12:00Z' },
  { userEmail: 'sofia@empresa.com', module: 'IA', action: 'Preguntar al asistente', createdAt: '2026-05-30T14:57:00Z' },
  { userEmail: 'admin@hipermaxi.com', module: 'Auth', action: 'Login admin', createdAt: '2026-05-30T14:20:00Z' },
];

export const mockAiInteractions = [
  {
    question: '¿Cómo actualizo el precio de un producto?',
    module: 'Productos',
    userEmail: 'luis@empresa.com',
    createdAt: '2026-05-30T15:15:00Z',
    responseSummary: 'Indicaciones sobre editar producto y guardar cambios.',
    status: 'respondido',
  },
  {
    question: '¿Dónde está el soporte?',
    module: 'General',
    userEmail: 'paola@empresa.com',
    createdAt: '2026-05-30T13:33:00Z',
    responseSummary: 'Explicación de contactos y opciones de ayuda.',
    status: 'respondido',
  },
  {
    question: 'Mi factura fue observada',
    module: 'Facturas',
    userEmail: 'carlos@empresa.com',
    createdAt: '2026-05-30T11:05:00Z',
    responseSummary: 'Sugerencias para revisar campos y volver a cargar.',
    status: 'fallback soporte',
  },
];

export const mockUsersActivity = [
  {
    userEmail: 'maria@empresa.com',
    role: 'user',
    module: 'Facturas',
    action: 'Subir factura',
    description: 'Usuario cargó una factura para revisión.',
    createdAt: '2026-05-30T16:12:00Z',
  },
  {
    userEmail: 'juan@empresa.com',
    role: 'user',
    module: 'Productos',
    action: 'Filtrar productos',
    description: 'Buscó productos por categoría y precio.',
    createdAt: '2026-05-30T15:10:00Z',
  },
  {
    userEmail: 'sofia@empresa.com',
    role: 'user',
    module: 'IA',
    action: 'Pregunta al asistente',
    description: 'Consultó sobre facturación y carga de documentos.',
    createdAt: '2026-05-30T14:59:00Z',
  },
];
