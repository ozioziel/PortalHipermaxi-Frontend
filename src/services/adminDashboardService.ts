import {
  DEFAULT_ALL_FILTERS,
  availableAdminUsers,
  buildAiUsageStats,
  buildEventsByType,
  buildFormStats,
  buildFrequentQuestions,
  buildInteractionsByDate,
  buildMostUsedModules,
  buildSummaryMetrics,
  buildUserActivity,
  filterAiInteractions,
  filterTraceabilityEvents,
} from '../mocks/adminDashboardMock';
import type {
  AdminFilters,
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

export const DEFAULT_ADMIN_FILTERS: AdminFilters = {
  ...DEFAULT_ALL_FILTERS,
  datePreset: 'last7',
};

const cloneFilters = (filters?: Partial<AdminFilters>): AdminFilters => ({
  ...DEFAULT_ADMIN_FILTERS,
  ...filters,
});

const toCsvValue = (value: unknown) => {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

export const downloadCsvReport = (
  filename: string,
  rows: Array<Record<string, unknown>>,
) => {
  if (rows.length === 0) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.map(toCsvValue).join(','),
    ...rows.map((row) => headers.map((header) => toCsvValue(row[header])).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const adminDashboardService = {
  async getDashboardSummary(filters?: Partial<AdminFilters>): Promise<MetricDefinition[]> {
    const applied = cloneFilters(filters);
    const events = filterTraceabilityEvents(applied);
    const ai = filterAiInteractions(applied);
    return buildSummaryMetrics(events, ai);
  },

  async getInteractionsByDate(filters?: Partial<AdminFilters>): Promise<InteractionsByDatePoint[]> {
    return buildInteractionsByDate(filterTraceabilityEvents(cloneFilters(filters)));
  },

  async getMostUsedModules(filters?: Partial<AdminFilters>): Promise<CountByModule[]> {
    return buildMostUsedModules(filterTraceabilityEvents(cloneFilters(filters)));
  },

  async getFrequentQuestions(filters?: Partial<AdminFilters>): Promise<FrequentQuestionItem[]> {
    return buildFrequentQuestions(filterAiInteractions(cloneFilters(filters)));
  },

  async getAiUsageStats(filters?: Partial<AdminFilters>): Promise<CountByLabel[]> {
    const applied = cloneFilters(filters);
    return buildAiUsageStats(filterTraceabilityEvents(applied), filterAiInteractions(applied));
  },

  async getFormsCompletion(filters?: Partial<AdminFilters>): Promise<FormStats[]> {
    return buildFormStats(filterTraceabilityEvents(cloneFilters(filters)));
  },

  async getEventsByType(filters?: Partial<AdminFilters>): Promise<CountByLabel[]> {
    return buildEventsByType(filterTraceabilityEvents(cloneFilters(filters)));
  },

  async getTraceability(filters?: Partial<AdminFilters>): Promise<TraceabilityEvent[]> {
    return filterTraceabilityEvents(cloneFilters(filters))
      .slice()
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  },

  async getAiInteractions(filters?: Partial<AdminFilters>): Promise<AiInteractionRecord[]> {
    return filterAiInteractions(cloneFilters(filters))
      .slice()
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
  },

  async getRecentActivity(filters?: Partial<AdminFilters>): Promise<TraceabilityEvent[]> {
    return this.getTraceability(filters).then((rows) => rows.slice(0, 8));
  },

  async getUserActivity(filters?: Partial<AdminFilters>): Promise<UserActivityRecord[]> {
    return buildUserActivity(filterTraceabilityEvents(cloneFilters(filters)));
  },

  async getAvailableUsers(): Promise<AdminUserOption[]> {
    return availableAdminUsers;
  },
};
