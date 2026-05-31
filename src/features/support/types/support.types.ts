export interface ChatSource {
  id: string;
  title: string;
  score: number | null;
}

export interface ChatAction {
  type: 'NAVIGATE';
  route: string;
  label: string;
  openGuide: boolean;
}

export interface ChatResponse {
  answer: string;
  intent: string;
  process: string;
  next_action: string;
  confidence: number;
  answer_source: 'rag' | 'rules';
  knowledge_source: 'rag' | 'local';
  sources: ChatSource[];
  action: ChatAction | null;
  suggested_guide: string;
}

export interface ChatRequest {
  message: string;
  process?: string;
  page?: string;
  formState?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: ChatSource[];
  source?: 'rag' | 'rules';
  action?: ChatAction | null;
}
