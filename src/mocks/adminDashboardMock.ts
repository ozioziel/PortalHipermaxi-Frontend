import type {
  AdminFilters,
  AdminModule,
  AdminUserOption,
  AiInteractionRecord,
  CountByLabel,
  CountByModule,
  FormStats,
  FrequentQuestionItem,
  InteractionsByDatePoint,
  MetricDefinition,
  TraceabilityEvent,
  UserActivityRecord,
} from '../features/admin/types';
import { ADMIN_EVENT_TYPE_OPTIONS, ADMIN_MODULE_OPTIONS } from '../features/admin/types';

const startOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date: Date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const buildRelativeDate = (daysAgo: number, hour: number, minute: number) => {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const formatDateLabel = (value: string) =>
  new Date(value).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' });

const formatDateTimeLabel = (value: string) =>
  new Date(value).toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const includesInsensitive = (value: string, query: string) =>
  value.toLowerCase().includes(query.trim().toLowerCase());

const dashboardUsers = [
  { name: 'María Salazar', email: 'maria@proveedores.com', role: 'cliente' },
  { name: 'Juan Ortega', email: 'juan@proveedores.com', role: 'cliente' },
  { name: 'Sofía Rojas', email: 'sofia@proveedores.com', role: 'cliente' },
  { name: 'Carlos Vega', email: 'carlos@proveedores.com', role: 'cliente' },
  { name: 'Paola Méndez', email: 'paola@proveedores.com', role: 'cliente' },
  { name: 'Luis Camacho', email: 'luis@proveedores.com', role: 'cliente' },
  { name: 'Andrea Núñez', email: 'andrea@proveedores.com', role: 'cliente' },
  { name: 'Diego Flores', email: 'diego@proveedores.com', role: 'cliente' },
  { name: 'Camila Suárez', email: 'camila@proveedores.com', role: 'cliente' },
  { name: 'Admin Hipermaxi', email: 'admin@hipermaxi.com', role: 'admin' },
];

export const traceabilityEvents: TraceabilityEvent[] = [
  {
    id: 'ev-001',
    createdAt: buildRelativeDate(0, 9, 12),
    userName: 'Admin Hipermaxi',
    userEmail: 'admin@hipermaxi.com',
    role: 'admin',
    module: 'Login',
    eventType: 'Login',
    action: 'Ingreso exitoso al panel admin',
    description: 'Acceso al dashboard de trazabilidad.',
    status: 'success',
  },
  {
    id: 'ev-002',
    createdAt: buildRelativeDate(0, 9, 34),
    userName: 'María Salazar',
    userEmail: 'maria@proveedores.com',
    role: 'cliente',
    module: 'Facturas',
    eventType: 'Factura',
    action: 'Consultar factura pendiente',
    description: 'Revisó el detalle de una factura observada.',
    status: 'info',
  },
  {
    id: 'ev-003',
    createdAt: buildRelativeDate(0, 10, 5),
    userName: 'Juan Ortega',
    userEmail: 'juan@proveedores.com',
    role: 'cliente',
    module: 'Productos',
    eventType: 'Producto',
    action: 'Filtrar productos por categoría',
    description: 'Aplicó filtros por perecederos y marca propia.',
    status: 'info',
  },
  {
    id: 'ev-004',
    createdAt: buildRelativeDate(0, 10, 16),
    userName: 'Sofía Rojas',
    userEmail: 'sofia@proveedores.com',
    role: 'cliente',
    module: 'Soy Nuevo',
    eventType: 'Formulario',
    action: 'Iniciar solicitud proveedor',
    description: 'Abrió el formulario de registro por primera vez.',
    status: 'info',
  },
  {
    id: 'ev-005',
    createdAt: buildRelativeDate(0, 10, 27),
    userName: 'Carlos Vega',
    userEmail: 'carlos@proveedores.com',
    role: 'cliente',
    module: 'Chat IA',
    eventType: 'Pregunta IA',
    action: 'Consulta sobre factura observada',
    description: 'Preguntó cómo corregir una factura observada.',
    status: 'success',
  },
  {
    id: 'ev-006',
    createdAt: buildRelativeDate(0, 10, 41),
    userName: 'Paola Méndez',
    userEmail: 'paola@proveedores.com',
    role: 'cliente',
    module: 'Soporte',
    eventType: 'Soporte',
    action: 'Click WhatsApp soporte',
    description: 'Usó el fallback de soporte por WhatsApp.',
    status: 'warning',
  },
  {
    id: 'ev-007',
    createdAt: buildRelativeDate(0, 11, 8),
    userName: 'Luis Camacho',
    userEmail: 'luis@proveedores.com',
    role: 'cliente',
    module: 'Guía Visual',
    eventType: 'Click',
    action: 'Iniciar guía visual de productos',
    description: 'Abrió la guía paso a paso para registro de producto.',
    status: 'success',
  },
  {
    id: 'ev-008',
    createdAt: buildRelativeDate(0, 11, 24),
    userName: 'Andrea Núñez',
    userEmail: 'andrea@proveedores.com',
    role: 'cliente',
    module: 'Chat IA',
    eventType: 'Error',
    action: 'Error en respuesta del asistente',
    description: 'La consulta de IA devolvió fallback por timeout.',
    status: 'error',
  },
  {
    id: 'ev-009',
    createdAt: buildRelativeDate(1, 8, 15),
    userName: 'Camila Suárez',
    userEmail: 'camila@proveedores.com',
    role: 'cliente',
    module: 'Productos',
    eventType: 'Click',
    action: 'Abrir modal nuevo producto',
    description: 'Inició el flujo de creación de producto.',
    status: 'info',
  },
  {
    id: 'ev-010',
    createdAt: buildRelativeDate(1, 8, 44),
    userName: 'Diego Flores',
    userEmail: 'diego@proveedores.com',
    role: 'cliente',
    module: 'Facturas',
    eventType: 'Factura',
    action: 'Descargar historial de facturas',
    description: 'Exportó el historial del mes actual.',
    status: 'success',
  },
  {
    id: 'ev-011',
    createdAt: buildRelativeDate(1, 9, 18),
    userName: 'Sofía Rojas',
    userEmail: 'sofia@proveedores.com',
    role: 'cliente',
    module: 'Soy Nuevo',
    eventType: 'Formulario',
    action: 'Guardar datos generales proveedor',
    description: 'Completó la primera sección del formulario.',
    status: 'success',
  },
  {
    id: 'ev-012',
    createdAt: buildRelativeDate(1, 9, 57),
    userName: 'Juan Ortega',
    userEmail: 'juan@proveedores.com',
    role: 'cliente',
    module: 'Chat IA',
    eventType: 'Pregunta IA',
    action: 'Consulta sobre filtros de producto',
    description: 'Pidió ayuda para localizar filtros avanzados.',
    status: 'success',
  },
  {
    id: 'ev-013',
    createdAt: buildRelativeDate(1, 10, 22),
    userName: 'María Salazar',
    userEmail: 'maria@proveedores.com',
    role: 'cliente',
    module: 'Soporte',
    eventType: 'Soporte',
    action: 'Click Correo soporte',
    description: 'Escaló un incidente usando correo.',
    status: 'warning',
  },
  {
    id: 'ev-014',
    createdAt: buildRelativeDate(2, 8, 11),
    userName: 'Admin Hipermaxi',
    userEmail: 'admin@hipermaxi.com',
    role: 'admin',
    module: 'Login',
    eventType: 'Login',
    action: 'Ingreso exitoso al panel admin',
    description: 'Validación de métricas del portal.',
    status: 'success',
  },
  {
    id: 'ev-015',
    createdAt: buildRelativeDate(2, 8, 50),
    userName: 'Paola Méndez',
    userEmail: 'paola@proveedores.com',
    role: 'cliente',
    module: 'Facturas',
    eventType: 'Factura',
    action: 'Consultar factura aprobada',
    description: 'Revisó una factura ya pagada.',
    status: 'success',
  },
  {
    id: 'ev-016',
    createdAt: buildRelativeDate(2, 9, 33),
    userName: 'Carlos Vega',
    userEmail: 'carlos@proveedores.com',
    role: 'cliente',
    module: 'Productos',
    eventType: 'Producto',
    action: 'Filtrar productos por proveedor',
    description: 'Aplicó búsqueda por nombre comercial.',
    status: 'info',
  },
  {
    id: 'ev-017',
    createdAt: buildRelativeDate(2, 10, 12),
    userName: 'Camila Suárez',
    userEmail: 'camila@proveedores.com',
    role: 'cliente',
    module: 'Soy Nuevo',
    eventType: 'Formulario',
    action: 'Enviar solicitud proveedor',
    description: 'Terminó y envió su solicitud de alta.',
    status: 'success',
  },
  {
    id: 'ev-018',
    createdAt: buildRelativeDate(3, 9, 4),
    userName: 'Luis Camacho',
    userEmail: 'luis@proveedores.com',
    role: 'cliente',
    module: 'Guía Visual',
    eventType: 'Click',
    action: 'Iniciar guía visual de proveedor',
    description: 'Abrió la guía del formulario Soy Nuevo.',
    status: 'success',
  },
  {
    id: 'ev-019',
    createdAt: buildRelativeDate(3, 9, 35),
    userName: 'Andrea Núñez',
    userEmail: 'andrea@proveedores.com',
    role: 'cliente',
    module: 'Soporte',
    eventType: 'Soporte',
    action: 'Click Llamada soporte',
    description: 'Solicitó apoyo telefónico.',
    status: 'warning',
  },
  {
    id: 'ev-020',
    createdAt: buildRelativeDate(3, 10, 48),
    userName: 'Diego Flores',
    userEmail: 'diego@proveedores.com',
    role: 'cliente',
    module: 'Chat IA',
    eventType: 'Pregunta IA',
    action: 'Consulta sobre documentos requeridos',
    description: 'Preguntó por requisitos del registro.',
    status: 'success',
  },
  {
    id: 'ev-021',
    createdAt: buildRelativeDate(4, 8, 28),
    userName: 'María Salazar',
    userEmail: 'maria@proveedores.com',
    role: 'cliente',
    module: 'Facturas',
    eventType: 'Factura',
    action: 'Consultar factura pendiente',
    description: 'Buscó el detalle y estado de observación.',
    status: 'warning',
  },
  {
    id: 'ev-022',
    createdAt: buildRelativeDate(4, 11, 2),
    userName: 'Juan Ortega',
    userEmail: 'juan@proveedores.com',
    role: 'cliente',
    module: 'Productos',
    eventType: 'Producto',
    action: 'Filtrar productos por registro sanitario',
    description: 'Usó filtros de texto y fecha.',
    status: 'info',
  },
  {
    id: 'ev-023',
    createdAt: buildRelativeDate(5, 7, 48),
    userName: 'Paola Méndez',
    userEmail: 'paola@proveedores.com',
    role: 'cliente',
    module: 'Soy Nuevo',
    eventType: 'Formulario',
    action: 'Iniciar solicitud proveedor',
    description: 'Ingresó al formulario desde home.',
    status: 'info',
  },
  {
    id: 'ev-024',
    createdAt: buildRelativeDate(5, 9, 25),
    userName: 'Sofía Rojas',
    userEmail: 'sofia@proveedores.com',
    role: 'cliente',
    module: 'Chat IA',
    eventType: 'Error',
    action: 'Error en respuesta del asistente',
    description: 'Se registró una caída transitoria del chat.',
    status: 'error',
  },
  {
    id: 'ev-025',
    createdAt: buildRelativeDate(6, 8, 39),
    userName: 'Carlos Vega',
    userEmail: 'carlos@proveedores.com',
    role: 'cliente',
    module: 'Facturas',
    eventType: 'Factura',
    action: 'Consultar factura pendiente',
    description: 'Revisó una factura con observación comercial.',
    status: 'warning',
  },
  {
    id: 'ev-026',
    createdAt: buildRelativeDate(6, 10, 41),
    userName: 'Andrea Núñez',
    userEmail: 'andrea@proveedores.com',
    role: 'cliente',
    module: 'Soporte',
    eventType: 'Soporte',
    action: 'Click WhatsApp soporte',
    description: 'Escaló una duda de login.',
    status: 'warning',
  },
  {
    id: 'ev-027',
    createdAt: buildRelativeDate(7, 8, 5),
    userName: 'Admin Hipermaxi',
    userEmail: 'admin@hipermaxi.com',
    role: 'admin',
    module: 'Login',
    eventType: 'Login',
    action: 'Intento fallido de acceso admin',
    description: 'Credenciales inválidas en el panel admin.',
    status: 'error',
  },
  {
    id: 'ev-028',
    createdAt: buildRelativeDate(7, 8, 58),
    userName: 'Camila Suárez',
    userEmail: 'camila@proveedores.com',
    role: 'cliente',
    module: 'Productos',
    eventType: 'Click',
    action: 'Exportar listado de productos',
    description: 'Descargó el catálogo filtrado en CSV.',
    status: 'success',
  },
  {
    id: 'ev-029',
    createdAt: buildRelativeDate(10, 9, 22),
    userName: 'Luis Camacho',
    userEmail: 'luis@proveedores.com',
    role: 'cliente',
    module: 'Soy Nuevo',
    eventType: 'Formulario',
    action: 'Enviar solicitud proveedor',
    description: 'Completó todos los pasos del alta.',
    status: 'success',
  },
  {
    id: 'ev-030',
    createdAt: buildRelativeDate(12, 10, 54),
    userName: 'Diego Flores',
    userEmail: 'diego@proveedores.com',
    role: 'cliente',
    module: 'Chat IA',
    eventType: 'Pregunta IA',
    action: 'Consulta sobre alta de producto',
    description: 'Preguntó qué campos son obligatorios.',
    status: 'success',
  },
  {
    id: 'ev-031',
    createdAt: buildRelativeDate(14, 11, 17),
    userName: 'María Salazar',
    userEmail: 'maria@proveedores.com',
    role: 'cliente',
    module: 'Facturas',
    eventType: 'Click',
    action: 'Abrir guía de carga de facturas',
    description: 'Activó la asistencia visual para facturas.',
    status: 'success',
  },
  {
    id: 'ev-032',
    createdAt: buildRelativeDate(18, 8, 8),
    userName: 'Juan Ortega',
    userEmail: 'juan@proveedores.com',
    role: 'cliente',
    module: 'Productos',
    eventType: 'Producto',
    action: 'Filtrar productos por proveedor',
    description: 'Refinó la búsqueda del catálogo.',
    status: 'info',
  },
  {
    id: 'ev-033',
    createdAt: buildRelativeDate(22, 10, 14),
    userName: 'Paola Méndez',
    userEmail: 'paola@proveedores.com',
    role: 'cliente',
    module: 'Soporte',
    eventType: 'Soporte',
    action: 'Click Correo soporte',
    description: 'Solicitó acompañamiento sobre facturación.',
    status: 'warning',
  },
  {
    id: 'ev-034',
    createdAt: buildRelativeDate(25, 9, 7),
    userName: 'Carlos Vega',
    userEmail: 'carlos@proveedores.com',
    role: 'cliente',
    module: 'Soy Nuevo',
    eventType: 'Formulario',
    action: 'Iniciar solicitud proveedor',
    description: 'Empezó el registro desde landing.',
    status: 'info',
  },
  {
    id: 'ev-035',
    createdAt: buildRelativeDate(27, 11, 42),
    userName: 'Andrea Núñez',
    userEmail: 'andrea@proveedores.com',
    role: 'cliente',
    module: 'Guía Visual',
    eventType: 'Click',
    action: 'Iniciar guía visual de facturas',
    description: 'Usó la guía interactiva para cargar documentos.',
    status: 'success',
  },
  {
    id: 'ev-036',
    createdAt: buildRelativeDate(29, 15, 6),
    userName: 'Camila Suárez',
    userEmail: 'camila@proveedores.com',
    role: 'cliente',
    module: 'Chat IA',
    eventType: 'Pregunta IA',
    action: 'Consulta sobre contacto de soporte',
    description: 'Preguntó por canales alternativos de ayuda.',
    status: 'success',
  },
];

export const aiInteractionsSource: AiInteractionRecord[] = [
  {
    id: 'ai-001',
    createdAt: buildRelativeDate(0, 10, 28),
    userName: 'Carlos Vega',
    userEmail: 'carlos@proveedores.com',
    question: '¿Cómo corrijo una factura observada?',
    responseSummary: 'Indicó revisar motivo de observación y volver a cargar el PDF.',
    module: 'Facturas',
    status: 'respondido',
  },
  {
    id: 'ai-002',
    createdAt: buildRelativeDate(1, 9, 14),
    userName: 'Juan Ortega',
    userEmail: 'juan@proveedores.com',
    question: '¿Dónde veo mis productos aprobados?',
    responseSummary: 'Explicó el filtro de estado dentro de productos.',
    module: 'Productos',
    status: 'respondido',
  },
  {
    id: 'ai-003',
    createdAt: buildRelativeDate(1, 11, 35),
    userName: 'María Salazar',
    userEmail: 'maria@proveedores.com',
    question: '¿Cómo cargo una factura?',
    responseSummary: 'Detalló el flujo desde el módulo Facturas.',
    module: 'Facturas',
    status: 'respondido',
  },
  {
    id: 'ai-004',
    createdAt: buildRelativeDate(2, 10, 8),
    userName: 'Diego Flores',
    userEmail: 'diego@proveedores.com',
    question: '¿Qué documentos necesito para registrarme?',
    responseSummary: 'Listó documentos del proceso Soy Nuevo.',
    module: 'Soy Nuevo',
    status: 'respondido',
  },
  {
    id: 'ai-005',
    createdAt: buildRelativeDate(3, 10, 56),
    userName: 'Andrea Núñez',
    userEmail: 'andrea@proveedores.com',
    question: '¿Cómo contacto a soporte?',
    responseSummary: 'Mostró canales y activó fallback de soporte.',
    module: 'Soporte',
    status: 'fallback soporte',
  },
  {
    id: 'ai-006',
    createdAt: buildRelativeDate(4, 9, 40),
    userName: 'Sofía Rojas',
    userEmail: 'sofia@proveedores.com',
    question: '¿Cómo cargo una factura?',
    responseSummary: 'El servicio tardó demasiado y fue necesario reintentar.',
    module: 'Facturas',
    status: 'error',
  },
  {
    id: 'ai-007',
    createdAt: buildRelativeDate(5, 8, 51),
    userName: 'Paola Méndez',
    userEmail: 'paola@proveedores.com',
    question: '¿Qué documentos necesito para registrarme?',
    responseSummary: 'Presentó el checklist del alta de proveedor.',
    module: 'Soy Nuevo',
    status: 'respondido',
  },
  {
    id: 'ai-008',
    createdAt: buildRelativeDate(6, 11, 9),
    userName: 'Carlos Vega',
    userEmail: 'carlos@proveedores.com',
    question: '¿Cómo corrijo una factura observada?',
    responseSummary: 'Sugirió revisar XML y adjuntos antes de reenviar.',
    module: 'Facturas',
    status: 'respondido',
  },
  {
    id: 'ai-009',
    createdAt: buildRelativeDate(7, 10, 19),
    userName: 'Camila Suárez',
    userEmail: 'camila@proveedores.com',
    question: '¿Dónde veo mis productos aprobados?',
    responseSummary: 'Detalló cómo usar filtros por estado y fecha.',
    module: 'Productos',
    status: 'respondido',
  },
  {
    id: 'ai-010',
    createdAt: buildRelativeDate(10, 11, 43),
    userName: 'Luis Camacho',
    userEmail: 'luis@proveedores.com',
    question: '¿Cómo contacto a soporte?',
    responseSummary: 'Redirigió a correo y llamada de soporte.',
    module: 'Soporte',
    status: 'fallback soporte',
  },
  {
    id: 'ai-011',
    createdAt: buildRelativeDate(13, 9, 12),
    userName: 'María Salazar',
    userEmail: 'maria@proveedores.com',
    question: '¿Cómo cargo una factura?',
    responseSummary: 'Enumeró los pasos del asistente de carga.',
    module: 'Facturas',
    status: 'respondido',
  },
  {
    id: 'ai-012',
    createdAt: buildRelativeDate(18, 14, 25),
    userName: 'Diego Flores',
    userEmail: 'diego@proveedores.com',
    question: '¿Cuál es el formato del registro sanitario?',
    responseSummary: 'Aclaró el formato de texto y fecha para el producto.',
    module: 'Productos',
    status: 'respondido',
  },
];

export const availableAdminUsers: AdminUserOption[] = dashboardUsers.map((user) => ({
  id: user.email,
  label: `${user.name} - ${user.email}`,
  email: user.email,
}));

const getDateWindow = (filters: AdminFilters) => {
  const now = new Date();

  if (filters.datePreset === 'custom' && (filters.startDate || filters.endDate)) {
    const start = filters.startDate ? startOfDay(new Date(filters.startDate)) : new Date(0);
    const end = filters.endDate ? endOfDay(new Date(filters.endDate)) : endOfDay(now);
    return { start, end };
  }

  if (filters.datePreset === 'today') {
    return { start: startOfDay(now), end: endOfDay(now) };
  }

  if (filters.datePreset === 'last7') {
    const start = startOfDay(now);
    start.setDate(start.getDate() - 6);
    return { start, end: endOfDay(now) };
  }

  if (filters.datePreset === 'last30') {
    const start = startOfDay(now);
    start.setDate(start.getDate() - 29);
    return { start, end: endOfDay(now) };
  }

  if (filters.datePreset === 'thisMonth') {
    return {
      start: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
      end: endOfDay(now),
    };
  }

  return { start: new Date(0), end: endOfDay(now) };
};

const matchesUser = (userName: string, userEmail: string, query: string) => {
  if (!query.trim()) return true;
  return includesInsensitive(userName, query) || includesInsensitive(userEmail, query);
};

export const filterTraceabilityEvents = (filters: AdminFilters) => {
  const { start, end } = getDateWindow(filters);

  return traceabilityEvents.filter((event) => {
    const createdAt = new Date(event.createdAt);
    if (createdAt < start || createdAt > end) return false;
    if (filters.module !== 'Todos' && event.module !== filters.module) return false;
    if (filters.eventType !== 'Todos' && event.eventType !== filters.eventType) return false;
    if (!matchesUser(event.userName, event.userEmail, filters.userQuery)) return false;
    return true;
  });
};

export const filterAiInteractions = (filters: AdminFilters) => {
  const { start, end } = getDateWindow(filters);

  return aiInteractionsSource.filter((record) => {
    const createdAt = new Date(record.createdAt);
    if (createdAt < start || createdAt > end) return false;

    if (filters.module !== 'Todos' && filters.module !== 'Chat IA' && record.module !== filters.module) {
      return false;
    }

    if (filters.eventType === 'Error' && record.status !== 'error') return false;
    if (filters.eventType === 'Soporte' && record.status !== 'fallback soporte') return false;
    if (filters.eventType !== 'Todos' && filters.eventType !== 'Pregunta IA' && filters.eventType !== 'Error' && filters.eventType !== 'Soporte') {
      return false;
    }

    if (!matchesUser(record.userName, record.userEmail, filters.userQuery)) return false;
    return true;
  });
};

export const buildInteractionsByDate = (events: TraceabilityEvent[]): InteractionsByDatePoint[] => {
  const counters = new Map<string, InteractionsByDatePoint>();

  events
    .slice()
    .sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime())
    .forEach((event) => {
      const date = event.createdAt.slice(0, 10);
      const existing = counters.get(date);
      if (existing) {
        existing.count += 1;
        return;
      }

      counters.set(date, {
        date,
        label: formatDateLabel(event.createdAt),
        count: 1,
      });
    });

  return Array.from(counters.values());
};

export const buildMostUsedModules = (events: TraceabilityEvent[]): CountByModule[] => {
  const counts = new Map<AdminModule, number>();
  ADMIN_MODULE_OPTIONS.forEach((module) => counts.set(module, 0));

  events.forEach((event) => {
    counts.set(event.module, (counts.get(event.module) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([module, count]) => ({ module, count }))
    .sort((left, right) => right.count - left.count);
};

export const buildFrequentQuestions = (records: AiInteractionRecord[]): FrequentQuestionItem[] => {
  const grouped = new Map<string, FrequentQuestionItem>();

  records.forEach((record) => {
    const key = `${record.module}::${record.question}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.count += 1;
      if (new Date(record.createdAt).getTime() > new Date(existing.lastAsked).getTime()) {
        existing.lastAsked = record.createdAt;
      }
      return;
    }

    grouped.set(key, {
      id: key,
      question: record.question,
      count: 1,
      module: record.module,
      lastAsked: record.createdAt,
      category: record.module === 'Soporte' ? 'Soporte' : record.module === 'Soy Nuevo' ? 'Registro' : 'Operativo',
    });
  });

  return Array.from(grouped.values())
    .sort((left, right) => {
      if (right.count !== left.count) return right.count - left.count;
      return new Date(right.lastAsked).getTime() - new Date(left.lastAsked).getTime();
    })
    .map((item) => ({
      ...item,
      lastAsked: formatDateTimeLabel(item.lastAsked),
    }));
};

export const buildAiUsageStats = (
  events: TraceabilityEvent[],
  records: AiInteractionRecord[],
): CountByLabel[] => {
  const whatsapp = events.filter((event) => event.action === 'Click WhatsApp soporte').length;
  const email = events.filter((event) => event.action === 'Click Correo soporte').length;
  const call = events.filter((event) => event.action === 'Click Llamada soporte').length;

  return [
    { label: 'Preguntas respondidas', count: records.filter((record) => record.status === 'respondido').length },
    { label: 'Errores del chat', count: records.filter((record) => record.status === 'error').length },
    { label: 'Fallback a soporte', count: records.filter((record) => record.status === 'fallback soporte').length },
    { label: 'Clicks WhatsApp', count: whatsapp },
    { label: 'Clicks Correo', count: email },
    { label: 'Clicks Llamada', count: call },
  ];
};

export const buildFormStats = (events: TraceabilityEvent[]): FormStats[] => {
  const started = events.filter((event) => event.action === 'Iniciar solicitud proveedor').length;
  const completed = events.filter((event) => event.action === 'Enviar solicitud proveedor').length;

  return [{ label: 'Solicitudes', started, completed }];
};

export const buildEventsByType = (events: TraceabilityEvent[]): CountByLabel[] =>
  ADMIN_EVENT_TYPE_OPTIONS.map((eventType) => ({
    label: eventType,
    count: events.filter((event) => event.eventType === eventType).length,
  }));

export const buildUserActivity = (events: TraceabilityEvent[]): UserActivityRecord[] => {
  const latestByUser = new Map<string, TraceabilityEvent>();

  events.forEach((event) => {
    const existing = latestByUser.get(event.userEmail);
    if (!existing || new Date(event.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
      latestByUser.set(event.userEmail, event);
    }
  });

  return Array.from(latestByUser.values())
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .map((event) => ({
      id: `usr-${event.id}`,
      userName: event.userName,
      userEmail: event.userEmail,
      role: event.role,
      lastActivity: event.description,
      moduleVisited: event.module,
      actionTaken: event.action,
      createdAt: event.createdAt,
    }));
};

export const buildSummaryMetrics = (
  events: TraceabilityEvent[],
  records: AiInteractionRecord[],
): MetricDefinition[] => {
  const uniqueUsers = new Set(events.map((event) => event.userEmail)).size;
  const frequentQuestionsDetected = buildFrequentQuestions(records).length;
  const formsStarted = events.filter((event) => event.action === 'Iniciar solicitud proveedor').length;
  const formsCompleted = events.filter((event) => event.action === 'Enviar solicitud proveedor').length;
  const chatErrors = records.filter((record) => record.status === 'error').length;
  const whatsappClicks = events.filter((event) => event.action === 'Click WhatsApp soporte').length;
  const emailClicks = events.filter((event) => event.action === 'Click Correo soporte').length;
  const callClicks = events.filter((event) => event.action === 'Click Llamada soporte').length;
  const guidesStarted = events.filter((event) => event.module === 'Guía Visual').length;
  const invoicesViewed = events.filter((event) => event.action === 'Consultar factura pendiente' || event.action === 'Consultar factura aprobada').length;
  const productsFiltered = events.filter((event) => event.action.includes('Filtrar productos')).length;

  return [
    {
      id: 'active-users',
      title: 'Usuarios activos',
      value: uniqueUsers,
      delta: '+8% esta semana',
      description: 'usuarios únicos con actividad reciente',
      accent: 'orange',
      icon: 'UA',
    },
    {
      id: 'ai-interactions',
      title: 'Total de interacciones con IA',
      value: records.length,
      delta: '+18% esta semana',
      description: 'consultas registradas por el asistente',
      accent: 'green',
      icon: 'IA',
    },
    {
      id: 'frequent-questions',
      title: 'Preguntas frecuentes detectadas',
      value: frequentQuestionsDetected,
      delta: 'Top consultas activas',
      description: 'preguntas repetidas por los usuarios',
      accent: 'gold',
      icon: 'PF',
    },
    {
      id: 'forms-started',
      title: 'Formularios iniciados',
      value: formsStarted,
      delta: 'Seguimiento diario',
      description: 'solicitudes que comenzaron el flujo',
      accent: 'dark',
      icon: 'FI',
    },
    {
      id: 'forms-completed',
      title: 'Formularios completados',
      value: formsCompleted,
      delta: 'Conversión estable',
      description: 'solicitudes enviadas correctamente',
      accent: 'green',
      icon: 'FC',
    },
    {
      id: 'chat-errors',
      title: 'Errores del chat',
      value: chatErrors,
      delta: 'Monitoreo activo',
      description: 'incidentes en respuestas o timeouts',
      accent: 'red',
      icon: 'ER',
    },
    {
      id: 'whatsapp-clicks',
      title: 'Clicks en WhatsApp',
      value: whatsappClicks,
      delta: 'Fallback de soporte',
      description: 'usuarios que pidieron ayuda por WhatsApp',
      accent: 'green',
      icon: 'WA',
    },
    {
      id: 'email-clicks',
      title: 'Clicks en Correo',
      value: emailClicks,
      delta: 'Canal alterno',
      description: 'consultas derivadas a correo',
      accent: 'orange',
      icon: 'EM',
    },
    {
      id: 'call-clicks',
      title: 'Clicks en Llamada',
      value: callClicks,
      delta: 'Escalación directa',
      description: 'usuarios que eligieron atención telefónica',
      accent: 'dark',
      icon: 'LL',
    },
    {
      id: 'guides-started',
      title: 'Guías visuales iniciadas',
      value: guidesStarted,
      delta: 'Ayuda contextual',
      description: 'recorridos guiados activados por usuarios',
      accent: 'gold',
      icon: 'GV',
    },
    {
      id: 'invoices-viewed',
      title: 'Facturas consultadas',
      value: invoicesViewed,
      delta: 'Módulo más sensible',
      description: 'facturas revisadas en el período',
      accent: 'orange',
      icon: 'FT',
    },
    {
      id: 'products-filtered',
      title: 'Productos filtrados',
      value: productsFiltered,
      delta: 'Uso operativo',
      description: 'búsquedas y filtros ejecutados',
      accent: 'green',
      icon: 'PR',
    },
  ];
};

export const DEFAULT_ALL_FILTERS: AdminFilters = {
  datePreset: 'last30',
  startDate: '',
  endDate: '',
  module: 'Todos',
  eventType: 'Todos',
  userQuery: '',
};

export const summaryMetrics = buildSummaryMetrics(traceabilityEvents, aiInteractionsSource);
export const interactionsByDate = buildInteractionsByDate(traceabilityEvents);
export const mostUsedModules = buildMostUsedModules(traceabilityEvents);
export const frequentQuestions = buildFrequentQuestions(aiInteractionsSource);
export const aiUsageStats = buildAiUsageStats(traceabilityEvents, aiInteractionsSource);
export const formStats = buildFormStats(traceabilityEvents);
export const eventsByType = buildEventsByType(traceabilityEvents);
export const recentActivity = traceabilityEvents
  .slice()
  .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
  .slice(0, 8);
export const userActivity = buildUserActivity(traceabilityEvents);
