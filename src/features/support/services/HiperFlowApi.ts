import type {
  GuideResponse,
  InteractionLog,
  ProductFormState,
  SupportChatResponse,
  ValidationResult,
} from '../types';

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HiperFlow API respondio ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const HiperFlowApi = {
  chat(message: string, formState: ProductFormState): Promise<SupportChatResponse> {
    return requestJson('/api/support-agent/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        process: 'registro_producto',
        page: 'catalogo-productos',
        formState,
      }),
    });
  },

  getProductGuide(): Promise<GuideResponse> {
    return requestJson('/api/guides/registro-producto');
  },

  validateProduct(formState: ProductFormState): Promise<ValidationResult> {
    return requestJson('/api/processes/registro-producto/validate', {
      method: 'POST',
      body: JSON.stringify(formState),
    });
  },

  logInteraction(interaction: InteractionLog): Promise<InteractionLog> {
    return requestJson('/api/debug/interactions', {
      method: 'POST',
      body: JSON.stringify(interaction),
    });
  },

  async getInteractions(): Promise<InteractionLog[]> {
    const response = await requestJson<{ interactions: InteractionLog[] }>('/api/debug/interactions');
    return response.interactions;
  },

  // Admin endpoints for dashboard (require admin role on server)
  async getDashboardSummary(): Promise<any> {
    return requestJson('/api/admin/dashboard/summary');
  },

  async getFrequentQuestions(): Promise<any[]> {
    return requestJson('/api/admin/dashboard/frequent-questions');
  },

  async getRecentActivity(): Promise<any[]> {
    return requestJson('/api/admin/dashboard/recent-activity');
  },

  async getAiInteractions(): Promise<any[]> {
    return requestJson('/api/admin/dashboard/ai-interactions');
  },

  async getUsersActivity(): Promise<any[]> {
    return requestJson('/api/admin/dashboard/users-activity');
  },
};
