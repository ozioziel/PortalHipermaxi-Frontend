export type SupportNextAction = 'START_GUIDE' | 'VALIDATE_FORM' | 'ANSWER_ONLY';

export interface ProductImageState {
  filename: string;
  type: string;
  size: number;
}

export interface ProductFormState {
  description: string;
  internalCode: string;
  barcode: string;
  label: string;
  dimensions: string;
  images: ProductImageState[];
  price: string;
  unit: string;
  sanitaryRegister: string;
}

export interface ValidationIssue {
  field: keyof ProductFormState | 'images';
  message: string;
  reason?: string;
  solution?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  recommendation: string;
  confidence: number;
}

export interface KnowledgeSource {
  id: string;
  title: string;
  score: number;
}

export interface SupportChatResponse {
  answer: string;
  intent: string;
  process: 'registro_producto';
  next_action: SupportNextAction;
  confidence: number;
  sources: KnowledgeSource[];
  suggested_guide: string;
}

export interface GuideStep {
  step: number;
  selector: string;
  title: string;
  message: string;
  voice_text: string;
  example: string | null;
}

export interface GuideResponse {
  process: 'registro_producto';
  title: string;
  steps: GuideStep[];
}

export interface InteractionLog {
  id?: string;
  timestamp?: string;
  process: 'registro_producto';
  type: 'chat' | 'guide_step' | 'validation' | 'voice' | 'error';
  user_message?: string;
  assistant_response?: string;
  intent?: string;
  confidence?: number;
  action_taken?: string;
  metadata?: Record<string, unknown>;
}
