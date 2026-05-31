import { executeAssistantAction, getPageContext } from '../../../lib/assistantDomActions';
import { assistantChat, knowledgeSearch, type OpenAiMessage } from './assistantApi';

const MAX_STEPS = 6;

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
        result = await knowledgeSearch(String(args.query ?? ''));
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
