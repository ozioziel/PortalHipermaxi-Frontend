const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface OpenAiToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

export interface OpenAiMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: OpenAiToolCall[];
  tool_call_id?: string;
}

export type KnowledgeSearchContext = {
  pageContext?: unknown;
  credentialState?: unknown;
};

/** One OpenAI turn: returns the assistant message (may contain tool_calls). */
export async function assistantChat(
  messages: OpenAiMessage[],
  pageContext: unknown,
): Promise<{ message: OpenAiMessage }> {
  const res = await fetch(`${API_URL}/api/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, pageContext }),
  });
  if (!res.ok) {
    throw new Error(`Assistant API error: ${res.status}`);
  }
  return res.json() as Promise<{ message: OpenAiMessage }>;
}

/** Retrieves SOP chunks from the RAG (no generation) for the search_knowledge tool. */
export async function knowledgeSearch(
  query: string,
  context: KnowledgeSearchContext = {},
): Promise<{ chunks: unknown[] }> {
  const res = await fetch(`${API_URL}/api/knowledge/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, ...context }),
  });
  if (!res.ok) {
    return { chunks: [] };
  }
  return res.json() as Promise<{ chunks: unknown[] }>;
}
