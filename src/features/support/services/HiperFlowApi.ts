import type {
  GuideResponse,
  InteractionLog,
  ProductFormState,
  SupportChatResponse,
  ValidationResult,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
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
};
