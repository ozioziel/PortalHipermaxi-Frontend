export const ADMIN_MODULE_OPTIONS = [
  'Facturas',
  'Productos',
  'Soy Nuevo',
  'Chat IA',
  'Guía Visual',
  'Login',
  'Soporte',
] as const;

export const ADMIN_EVENT_TYPE_OPTIONS = [
  'Login',
  'Click',
  'Error',
  'Pregunta IA',
  'Formulario',
  'Soporte',
  'Factura',
  'Producto',
] as const;

export const ADMIN_DATE_PRESET_OPTIONS = [
  { value: 'today', label: 'Hoy' },
  { value: 'last7', label: 'Últimos 7 días' },
  { value: 'last30', label: 'Últimos 30 días' },
  { value: 'thisMonth', label: 'Este mes' },
  { value: 'custom', label: 'Rango personalizado' },
] as const;

export type AdminModule = typeof ADMIN_MODULE_OPTIONS[number];
export type AdminEventType = typeof ADMIN_EVENT_TYPE_OPTIONS[number];
export type AdminDatePreset = typeof ADMIN_DATE_PRESET_OPTIONS[number]['value'];
export type AdminMetricAccent = 'orange' | 'green' | 'gold' | 'dark' | 'red';
export type AdminStatus = 'success' | 'warning' | 'error' | 'info';

export interface AdminFilters {
  datePreset: AdminDatePreset;
  startDate: string;
  endDate: string;
  module: 'Todos' | AdminModule;
  eventType: 'Todos' | AdminEventType;
  userQuery: string;
}

export interface MetricDefinition {
  id: string;
  title: string;
  value: number;
  delta: string;
  description: string;
  accent: AdminMetricAccent;
  icon: string;
}

export interface InteractionsByDatePoint {
  date: string;
  label: string;
  count: number;
}

export interface CountByModule {
  module: AdminModule;
  count: number;
}

export interface FrequentQuestionItem {
  id: string;
  question: string;
  count: number;
  module: AdminModule | 'General';
  lastAsked: string;
  category: string;
}

export interface CountByLabel {
  label: string;
  count: number;
}

export interface FormStats {
  label: string;
  started: number;
  completed: number;
}

export interface TraceabilityEvent {
  id: string;
  createdAt: string;
  userName: string;
  userEmail: string;
  role: string;
  module: AdminModule;
  eventType: AdminEventType;
  action: string;
  description: string;
  status: AdminStatus;
}

export interface AiInteractionRecord {
  id: string;
  createdAt: string;
  userName: string;
  userEmail: string;
  question: string;
  responseSummary: string;
  module: AdminModule | 'General';
  status: 'respondido' | 'fallback soporte' | 'error';
}

export interface UserActivityRecord {
  id: string;
  userName: string;
  userEmail: string;
  role: string;
  lastActivity: string;
  moduleVisited: AdminModule;
  actionTaken: string;
  createdAt: string;
}

export interface AdminUserOption {
  id: string;
  label: string;
  email: string;
}
