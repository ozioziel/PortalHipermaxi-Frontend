type AssistantActionResult = {
  ok: boolean;
  message?: string;
  data?: unknown;
};

type UiElementSummary = {
  elementId: string;
  kind: 'field' | 'button' | 'action' | 'section';
  label: string;
  value?: string;
  empty?: boolean;
  required?: boolean;
  type?: string;
  placeholder?: string;
  aliases: string[];
};

const assistantUiClass = 'assistant-dom-highlight';
const tooltipClass = 'assistant-dom-tooltip';
const stepsClass = 'assistant-steps-panel';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const compact = (value: string | null | undefined, maxLength = 120) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const escapeSelectorValue = (value: string) => {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
  return value.replace(/"/g, '\\"');
};

const visible = (element: Element) => {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

const getField = (fieldId: string): HTMLElement | null => {
  const safe = escapeSelectorValue(fieldId);
  return (
    document.querySelector<HTMLElement>(`[data-ai-field="${safe}"]`) ||
    document.querySelector<HTMLElement>(`[data-ai-alias="${safe}"]`) ||
    document.querySelector<HTMLElement>(`[data-ai-action="${safe}"]`) ||
    document.getElementById(fieldId) ||
    document.querySelector<HTMLElement>(`[name="${safe}"]`) ||
    findUiElement(fieldId).element
  );
};

const stripUiPrefix = (actionName: string) => actionName.startsWith('ui_') ? actionName.slice(3) : actionName;

const fieldLabel = (element: HTMLElement) => {
  const explicit = element.getAttribute('aria-label');
  if (explicit) return explicit;

  const id = element.id;
  if (id) {
    const label = document.querySelector<HTMLLabelElement>(`label[for="${escapeSelectorValue(id)}"]`);
    if (label?.innerText) return label.innerText.trim();
  }

  const parentLabel = element.closest('label');
  if (parentLabel?.textContent) return parentLabel.textContent.trim();

  const field = element.closest('.field');
  const label = field?.querySelector('label');
  return label?.textContent?.trim() || element.getAttribute('name') || element.dataset.aiField || 'Campo';
};

const elementId = (element: HTMLElement) =>
  element.dataset.aiField ||
  element.dataset.aiAction ||
  element.dataset.aiAlias ||
  element.id ||
  element.getAttribute('name') ||
  normalize(fieldLabel(element)).replace(/\s+/g, '-');

const elementAliases = (element: HTMLElement) =>
  [
    element.dataset.aiField,
    element.dataset.aiAlias,
    element.dataset.aiAction,
    element.id,
    element.getAttribute('name'),
    element.getAttribute('placeholder'),
    fieldLabel(element),
    compact(element.textContent),
  ].filter(Boolean) as string[];

const summarizeField = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): UiElementSummary => ({
  elementId: elementId(element),
  kind: 'field',
  label: fieldLabel(element),
  value: element instanceof HTMLInputElement && element.type === 'password' ? '[oculto]' : compact(element.value, 80),
  empty: !element.value,
  required: element.required,
  type: element instanceof HTMLInputElement ? element.type : element.tagName.toLowerCase(),
  placeholder: element.getAttribute('placeholder') || '',
  aliases: elementAliases(element),
});

const summarizeButton = (element: HTMLButtonElement | HTMLAnchorElement): UiElementSummary => ({
  elementId: elementId(element),
  kind: element.dataset.aiAction ? 'action' : 'button',
  label: element.getAttribute('aria-label') || compact(element.textContent) || element.dataset.aiAction || 'Accion',
  aliases: elementAliases(element),
});

const getVisibleFields = () =>
  Array.from(document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select'))
    .filter((element) => visible(element));

const getVisibleButtons = () =>
  Array.from(document.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>('button, a[href]'))
    .filter((element) => visible(element));

const scoreElement = (element: HTMLElement, query: string) => {
  const normalizedQuery = normalize(query);
  const aliases = elementAliases(element).map(normalize);
  let score = 0;

  for (const alias of aliases) {
    if (!alias) continue;
    if (alias === normalizedQuery) score += 100;
    if (alias.includes(normalizedQuery)) score += 45;
    for (const token of normalizedQuery.split(/\s+/)) {
      if (token.length > 2 && alias.includes(token)) score += 12;
    }
  }

  return score;
};

export const findUiElement = (query: string, kind = 'any') => {
  const candidates: HTMLElement[] = [
    ...getVisibleFields(),
    ...getVisibleButtons(),
    ...Array.from(document.querySelectorAll<HTMLElement>('[data-ai-section]')).filter((element) => visible(element)),
  ];

  const filtered = candidates.filter((element) => {
    if (kind === 'any') return true;
    if (kind === 'field') return element.matches('input, textarea, select');
    if (kind === 'button' || kind === 'action') return element.matches('button, a[href]');
    return true;
  });

  const matches = filtered
    .map((element) => ({ element, score: scoreElement(element, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return matches[0] || { element: null, score: 0 };
};

const showGlobalMessage = (message: string) => {
  clearTooltips();
  const tooltip = document.createElement('div');
  tooltip.className = tooltipClass;
  tooltip.textContent = message;
  tooltip.style.position = 'fixed';
  tooltip.style.right = '18px';
  tooltip.style.bottom = '96px';
  document.body.appendChild(tooltip);
  window.setTimeout(() => tooltip.remove(), 5000);
};

const clearTooltips = () => {
  document.querySelectorAll(`.${tooltipClass}`).forEach((element) => element.remove());
};

const clearSteps = () => {
  document.querySelectorAll(`.${stepsClass}`).forEach((element) => element.remove());
};

const highlight = (element: HTMLElement, timeout = 4500) => {
  element.classList.add(assistantUiClass);
  window.setTimeout(() => element.classList.remove(assistantUiClass), timeout);
};

export const clearAssistantUI = (): AssistantActionResult => {
  clearTooltips();
  clearSteps();
  document.querySelectorAll(`.${assistantUiClass}`).forEach((element) => {
    element.classList.remove(assistantUiClass);
  });
  return { ok: true, message: 'Interfaz del asistente limpiada.' };
};

export const getPageContext = (): AssistantActionResult => {
  const fields = getVisibleFields().map(summarizeField);
  const actions = getVisibleButtons().map(summarizeButton);
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-ai-section]'))
    .filter((element) => visible(element))
    .map((element) => ({
      elementId: elementId(element),
      kind: 'section' as const,
      label: element.getAttribute('aria-label') || element.dataset.aiSection || compact(element.textContent, 80) || 'Seccion',
      aliases: elementAliases(element),
    }));

  return {
    ok: true,
    data: {
      path: window.location.pathname,
      title: document.title,
      pageHeading: document.querySelector('h1,h2')?.textContent?.trim() || '',
      fields,
      actions,
      sections,
      instruction: 'Usa elementId para ejecutar focus_field, fill_field, highlight_field o click_element. No muestres elementId al usuario.',
    },
  };
};

export const findElementAction = (query: string, kind = 'any'): AssistantActionResult => {
  const match = findUiElement(query, kind);
  if (!match.element) {
    return { ok: false, message: `No encontre un elemento visible para: ${query}` };
  }

  const element = match.element;
  const summary = element.matches('input, textarea, select')
    ? summarizeField(element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
    : summarizeButton(element as HTMLButtonElement | HTMLAnchorElement);

  return {
    ok: true,
    message: `Elemento encontrado: ${summary.label}`,
    data: { ...summary, score: match.score },
  };
};

export const showTooltip = (fieldId: string, message: string): AssistantActionResult => {
  const element = getField(fieldId);

  if (!element) {
    showGlobalMessage(`No encontre ese campo en esta pagina: ${fieldId}.`);
    return { ok: false, message: `No encontre el campo ${fieldId}.` };
  }

  clearTooltips();
  const rect = element.getBoundingClientRect();
  const tooltip = document.createElement('div');
  tooltip.className = tooltipClass;
  tooltip.textContent = message;
  tooltip.style.position = 'fixed';
  tooltip.style.left = `${Math.min(Math.max(rect.left, 16), window.innerWidth - 320)}px`;
  tooltip.style.top = `${Math.min(rect.bottom + 10, window.innerHeight - 90)}px`;
  document.body.appendChild(tooltip);
  window.setTimeout(() => tooltip.remove(), 6500);
  return { ok: true, message: 'Tooltip mostrado.' };
};

export const focusField = (fieldId: string, message?: string): AssistantActionResult => {
  const element = getField(fieldId);

  if (!element) {
    showGlobalMessage(`No encontre ese campo en esta pagina: ${fieldId}.`);
    return { ok: false, message: `No encontre el campo ${fieldId}.` };
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  window.setTimeout(() => {
    if ('focus' in element) element.focus({ preventScroll: true });
    highlight(element);
    if (message) showTooltip(fieldId, message);
  }, 280);

  return { ok: true, message: `Campo enfocado: ${fieldId}.` };
};

export const highlightField = (fieldId: string, message?: string): AssistantActionResult => {
  const result = focusField(fieldId, message);
  return result.ok ? { ok: true, message: `Campo resaltado: ${fieldId}.` } : result;
};

export const fillField = (fieldId: string, value: string): AssistantActionResult => {
  const element = getField(fieldId);

  if (!element) {
    showGlobalMessage(`No encontre ese campo en esta pagina: ${fieldId}.`);
    return { ok: false, message: `No encontre el campo ${fieldId}.` };
  }

  if (element instanceof HTMLInputElement && element.type === 'file') {
    focusField(fieldId, 'Este campo requiere que selecciones el archivo manualmente.');
    return { ok: false, message: 'No puedo llenar campos de archivo por seguridad del navegador.' };
  }

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    const prototype = Object.getPrototypeOf(element);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    descriptor?.set?.call(element, value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    focusField(fieldId, `Complete este campo con: ${value}`);
    return { ok: true, message: `Campo ${fieldId} llenado.` };
  }

  return { ok: false, message: `El elemento ${fieldId} no es un campo editable.` };
};

export const clickElement = (elementIdValue: string, message?: string): AssistantActionResult => {
  const element = getField(elementIdValue);

  if (!element) {
    showGlobalMessage(`No encontre ese boton o accion: ${elementIdValue}.`);
    return { ok: false, message: `No encontre el elemento ${elementIdValue}.` };
  }

  element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  window.setTimeout(() => {
    highlight(element);
    if (message) showTooltip(elementIdValue, message);
    element.click();
  }, 250);

  return { ok: true, message: `Accion ejecutada: ${elementIdValue}.` };
};

export const showSteps = (title: string, steps: string[]): AssistantActionResult => {
  clearSteps();
  const panel = document.createElement('aside');
  panel.className = stepsClass;

  const heading = document.createElement('strong');
  heading.textContent = title;
  panel.appendChild(heading);

  const list = document.createElement('ol');
  steps.forEach((step) => {
    const item = document.createElement('li');
    item.textContent = step;
    list.appendChild(item);
  });
  panel.appendChild(list);

  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Cerrar';
  close.addEventListener('click', () => panel.remove());
  panel.appendChild(close);

  document.body.appendChild(panel);
  return { ok: true, message: 'Pasos mostrados.' };
};

export const getFormState = (): AssistantActionResult => {
  const fields = getVisibleFields().map((element) => ({
    ...summarizeField(element),
    fieldId: elementId(element),
    validationMessage: element.validationMessage || '',
  }));

  return { ok: true, data: { fields } };
};

export const validateVisibleForm = (): AssistantActionResult => {
  const invalid = getVisibleFields()
    .filter((element) => !element.checkValidity())
    .map((element) => ({
      fieldId: elementId(element),
      label: fieldLabel(element),
      message: element.validationMessage || 'Campo invalido.',
    }));

  if (invalid.length) {
    focusField(invalid[0].fieldId, invalid[0].message);
    return { ok: false, data: { invalid }, message: 'Hay campos invalidos.' };
  }

  return { ok: true, data: { invalid: [] }, message: 'No encontre errores visibles con validacion HTML.' };
};

export const goToNextError = (): AssistantActionResult => {
  const htmlInvalid = getVisibleFields().find((element) => !element.checkValidity());
  if (htmlInvalid) {
    return focusField(elementId(htmlInvalid), htmlInvalid.validationMessage || 'Corrige este campo.');
  }

  const visualError = document.querySelector<HTMLElement>('.field-error,.error,[role="alert"]');
  const relatedField = visualError?.closest('.field')?.querySelector<HTMLElement>('input, textarea, select');
  if (relatedField) {
    return focusField(elementId(relatedField), visualError?.textContent?.trim() || 'Corrige este campo.');
  }

  return { ok: true, message: 'No encontre errores visibles en este momento.' };
};

export const explainField = (fieldId: string): AssistantActionResult => {
  const element = getField(fieldId);
  if (!element) {
    return { ok: false, message: `No encontre el campo ${fieldId}.` };
  }

  const summary = element.matches('input, textarea, select')
    ? summarizeField(element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)
    : summarizeButton(element as HTMLButtonElement | HTMLAnchorElement);
  const message = [
    `${summary.label}.`,
    summary.placeholder ? `Ejemplo o pista: ${summary.placeholder}.` : '',
    summary.required ? 'Este campo es obligatorio.' : 'Este campo puede ser opcional segun el proceso.',
  ].filter(Boolean).join(' ');

  showTooltip(summary.elementId, message);
  return { ok: true, message, data: summary };
};

const candidateFillFields = ['providerName', 'supplierName', 'legalName', 'nit', 'email', 'phone', 'city', 'description', 'barcode', 'internalCode', 'label', 'price'];

export const autofillFromUserMessage = (message: string): AssistantActionResult => {
  const updates: Array<{ fieldId: string; value: string; result: AssistantActionResult }> = [];
  const normalizedMessage = normalize(message);

  for (const fieldId of candidateFillFields) {
    const element = getField(fieldId);
    if (!element) continue;

    const label = normalize(fieldLabel(element));
    const aliases = elementAliases(element).map(normalize);
    const matches = [fieldId, label, ...aliases].map(normalize).some((alias) => alias && normalizedMessage.includes(alias));
    if (!matches) continue;

    const parts = message.split(/ con | como |:|=/i);
    const value = parts.at(-1)?.trim();
    if (!value || value.length < 2) continue;

    updates.push({ fieldId, value, result: fillField(fieldId, value) });
    break;
  }

  if (!updates.length) {
    return { ok: false, message: 'No pude detectar que campo y valor llenar desde el mensaje.' };
  }

  return { ok: true, message: 'Autollenado aplicado.', data: { updates } };
};

export const performTask = (task: string, value?: string): AssistantActionResult => {
  const normalizedTask = normalize(task);

  if (normalizedTask.includes('siguiente error') || normalizedTask.includes('error')) {
    return goToNextError();
  }

  if (normalizedTask.includes('pasos') || normalizedTask.includes('guia')) {
    return showSteps('Pasos sugeridos', [
      'Revisa los campos marcados como obligatorios.',
      'Completa los datos faltantes.',
      'Valida imagenes o documentos requeridos.',
      'Presiona Guardar o Continuar cuando todo este completo.',
    ]);
  }

  const found = findUiElement(task, 'any');
  if (found.element) {
    if (value && found.element.matches('input, textarea, select')) {
      return fillField(elementId(found.element), value);
    }
    return focusField(elementId(found.element), 'Te muestro esta parte de la pantalla.');
  }

  return { ok: false, message: `No pude ejecutar la tarea: ${task}` };
};

export const executeAssistantAction = async (actionName: string, args: Record<string, unknown> = {}): Promise<AssistantActionResult> => {
  switch (stripUiPrefix(actionName)) {
    case 'get_page_context':
      return getPageContext();
    case 'find_field':
    case 'find_ui_element':
      return findElementAction(String(args.query || ''), args.kind ? String(args.kind) : 'any');
    case 'click_button':
    case 'click_element':
      return clickElement(String(args.elementId || args.fieldId || ''), args.message ? String(args.message) : undefined);
    case 'focus_field':
      return focusField(String(args.fieldId || ''), args.message ? String(args.message) : undefined);
    case 'highlight_field':
      return highlightField(String(args.fieldId || ''), args.message ? String(args.message) : undefined);
    case 'fill_field':
      return fillField(String(args.fieldId || ''), String(args.value || ''));
    case 'show_tooltip':
      return showTooltip(String(args.fieldId || ''), String(args.message || ''));
    case 'show_steps':
      return showSteps(String(args.title || 'Pasos'), Array.isArray(args.steps) ? args.steps.map(String) : []);
    case 'clear_assistant_ui':
      return clearAssistantUI();
    case 'get_form_state':
      return getFormState();
    case 'validate_form':
      return validateVisibleForm();
    case 'go_to_next_error':
      return goToNextError();
    case 'scroll_to_section':
      return focusField(String(args.sectionId || args.fieldId || ''), args.message ? String(args.message) : undefined);
    case 'explain_field':
      return explainField(String(args.fieldId || ''));
    case 'autofill_from_user_message':
      return autofillFromUserMessage(String(args.message || ''));
    case 'perform_task':
      return performTask(String(args.task || ''), args.value ? String(args.value) : undefined);
    default:
      return { ok: false, message: `Tool no soportada: ${actionName}` };
  }
};
