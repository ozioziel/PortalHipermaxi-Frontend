import { executeAssistantAction, getPageContext } from '../../../lib/assistantDomActions';
import { assistantChat, knowledgeSearch, type OpenAiMessage } from './assistantApi';

const MAX_STEPS = 6;

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const latestUserText = (history: OpenAiMessage[]) => {
  for (let index = history.length - 1; index >= 0; index -= 1) {
    const message = history[index];
    if (message.role === 'user') return message.content ?? '';
  }
  return '';
};

const isNewSupplierIntentFromHome = (history: OpenAiMessage[], path?: string) => {
  if (path !== '/') return false;

  const text = normalize(latestUserText(history));
  const talksAboutSupplierOrPlatform =
    text.includes('proveedor') ||
    text.includes('plataforma') ||
    text.includes('portal');
  const wantsOnboarding =
    text.includes('soy nuevo') ||
    text.includes('soy nueva') ||
    text.includes('nuevo proveedor') ||
    text.includes('nueva proveedor') ||
    text.includes('ser proveedor') ||
    text.includes('hacerme proveedor') ||
    text.includes('registrarme') ||
    text.includes('registro') ||
    text.includes('alta');

  return talksAboutSupplierOrPlatform && wantsOnboarding && !text.includes('producto');
};

const getSimulatedCredentialState = () => {
  try {
    const raw = window.localStorage.getItem('session');
    const parsed = raw ? JSON.parse(raw) as { user?: { email?: string; role?: string; name?: string }; token?: string } : null;

    if (parsed?.user && parsed.token) {
      return {
        source: 'simulado-demo',
        status: 'activas',
        hasCredentials: true,
        deliveryState: 'entregadas',
        userRole: parsed.user.role || 'cliente',
        userEmail: parsed.user.email || null,
        note: 'Estado simulado a partir de la sesion local del navegador; no validado contra backend.',
      };
    }
  } catch {
    // Continue with the default simulated state.
  }

  return {
    source: 'simulado-demo',
    status: 'no_emitidas',
    hasCredentials: false,
    deliveryState: 'pendiente_de_solicitud',
    userRole: 'proveedor_nuevo',
    userEmail: null,
    note: 'Estado simulado: usuario demo sin credenciales activas en esta sesion.',
  };
};

/**
 * Runs one agentic turn of the text assistant: calls the LLM, executes any tool
 * calls it requests (ui_* in the browser via assistantDomActions, search_knowledge
 * via the RAG, ui_navigate via react-router), feeds results back, and loops until
 * the model returns a plain text answer.
 */
export async function runAssistantTurn(
  history: OpenAiMessage[],
  navigate: (route: string) => void,
): Promise<{ history: OpenAiMessage[]; reply: string }> {
  const convo: OpenAiMessage[] = [...history];
  const initialContext = getPageContext();

  if (isNewSupplierIntentFromHome(convo, (initialContext.data as { path?: string } | undefined)?.path)) {
    await executeAssistantAction('ui_start_new_supplier_guide');
    const reply = 'Claro, te llevo a Nuevo Proveedor e inicio la guia visual para que completes la solicitud.';
    convo.push({ role: 'assistant', content: reply });
    return { history: convo, reply };
  }

  for (let step = 0; step < MAX_STEPS; step += 1) {
    const context = getPageContext();
    const { message } = await assistantChat(convo, context.data);
    convo.push(message);

    const calls = message.tool_calls ?? [];
    if (calls.length === 0) {
      return { history: convo, reply: message.content ?? '' };
    }

    for (const call of calls) {
      const name = call.function.name;
      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(call.function.arguments || '{}');
      } catch {
        args = {};
      }

      let result: unknown;
      if (name === 'search_knowledge') {
        const ragContext = {
          pageContext: context.data,
          credentialState: getSimulatedCredentialState(),
        };
        const ragResult = await knowledgeSearch(String(args.query ?? ''), ragContext);
        result = { ...ragResult, context: ragContext };
      } else if (name === 'ui_navigate') {
        const route = String(args.route ?? '/');
        navigate(route);
        result = { ok: true, message: `Redirigido a ${route}` };
      } else {
        // ui_* tools run in the browser, reusing the same DOM executor as the voice assistant.
        result = await executeAssistantAction(name, args);
      }

      convo.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) });
    }
  }

  return { history: convo, reply: 'Hice varias acciones en la pantalla. ¿Necesitas algo más?' };
}
