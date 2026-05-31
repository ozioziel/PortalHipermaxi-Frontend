import type { ChatRequest, ChatResponse } from '../types/support.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/api/support-agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Support API error: ${res.status}`);
  }

  return res.json() as Promise<ChatResponse>;
}
