import { mockProducts } from '../features/products/data/mockProducts';

type AssistantActionResult = {
  ok: boolean;
  message?: string;
  data?: unknown;
};

type GuidedStep = {
  title?: string;
  message: string;
  target?: string;
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
const guidedStepsClass = 'assistant-guided-steps';
const guidedHighlightClass = 'assistant-guided-highlight';

const dispatchAssistantGuideEvent = (type: 'start' | 'end') => {
  window.dispatchEvent(new CustomEvent(`assistant-guided-steps:${type}`));
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const productStorageKey = 'hiperflow.products.mock';

const readProducts = () => {
  try {
    const raw = window.localStorage.getItem(productStorageKey);
    return raw ? JSON.parse(raw) as typeof mockProducts : mockProducts;
  } catch {
    return mockProducts;
  }
};

const summarizeProduct = (product: typeof mockProducts[number]) => ({
  id: product.id,
  name: product.description,
  barcode: product.supplierBar,
  sanitaryRegistry: product.sanitaryRegistry,
  sanitaryRegistryDate: product.sanitaryRegistryDate,
  price: product.price || null,
  currency: product.price ? 'BOB' : null,
});

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
    document.querySelector<HTMLElement>(`[data-guide="${safe}"]`) ||
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

const navigateTo = (path: string) => {
  if (window.location.pathname === path) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const delayedClick = (elementIdValue: string, delay = 450) => {
  window.setTimeout(() => {
    const element = getField(elementIdValue);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      highlight(element);
      element.click();
    }
  }, delay);
};

const clearTooltips = () => {
  document.querySelectorAll(`.${tooltipClass}`).forEach((element) => element.remove());
};

const clearSteps = () => {
  document.querySelectorAll(`.${stepsClass}`).forEach((element) => element.remove());
  document.querySelectorAll(`.${guidedStepsClass}`).forEach((element) => element.remove());
  document.querySelectorAll(`.${guidedHighlightClass}`).forEach((element) => element.remove());
};

const highlight = (element: HTMLElement, timeout = 4500) => {
  element.classList.add(assistantUiClass);
  window.setTimeout(() => element.classList.remove(assistantUiClass), timeout);
};

export const clearAssistantUI = (): AssistantActionResult => {
  clearTooltips();
  clearSteps();
  dispatchAssistantGuideEvent('end');
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

export const getProductsData = (limit = 20): AssistantActionResult => {
  const products = readProducts().slice(0, Math.max(1, Math.min(limit, 50))).map(summarizeProduct);

  return {
    ok: true,
    message: products.length
      ? `Encontre ${products.length} productos disponibles.`
      : 'No encontre productos registrados.',
    data: {
      products,
      total: readProducts().length,
      instruction: 'Responde con nombres legibles. Si el usuario pregunta precio, usa price y currency; si price es null, di que no esta registrado.',
    },
  };
};

export const findProductData = (query: string, limit = 5): AssistantActionResult => {
  const normalizedQuery = normalize(query);
  const products = readProducts();
  const matches = products
    .map((product) => {
      const haystack = normalize([
        product.description,
        product.supplierBar,
        product.sanitaryRegistry,
        product.sanitaryRegistryDate,
        product.price,
      ].filter(Boolean).join(' '));
      const exactName = normalize(product.description) === normalizedQuery ? 100 : 0;
      const includes = haystack.includes(normalizedQuery) ? 45 : 0;
      const tokenScore = normalizedQuery
        .split(/\s+/)
        .filter((token) => token.length > 2 && haystack.includes(token))
        .length * 12;

      return { product, score: exactName + includes + tokenScore };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, Math.min(limit, 20)))
    .map((item) => ({ ...summarizeProduct(item.product), score: item.score }));

  return {
    ok: matches.length > 0,
    message: matches.length
      ? `Encontre ${matches.length} coincidencia(s).`
      : `No encontre productos para: ${query}.`,
    data: { query, products: matches },
  };
};

export const getProductPrice = (query: string): AssistantActionResult => {
  const result = findProductData(query, 3);
  const products = (result.data as { products?: Array<{ name: string; price: string | null; currency: string | null }> } | undefined)?.products || [];
  const product = products[0];

  if (!product) {
    return { ok: false, message: `No encontre el producto ${query}.`, data: { query } };
  }

  if (!product.price) {
    return {
      ok: true,
      message: `El producto ${product.name} no tiene precio registrado.`,
      data: { product, priceFound: false },
    };
  }

  return {
    ok: true,
    message: `El precio de ${product.name} es ${product.price} ${product.currency}.`,
    data: { product, priceFound: true },
  };
};

const resolveGuidedTarget = (target?: string) => {
  if (!target) return null;
  const direct = getField(target);
  if (direct) return direct;
  return findUiElement(target, 'any').element;
};

const createGuidedHighlight = (target: HTMLElement | null) => {
  document.querySelectorAll(`.${guidedHighlightClass}`).forEach((element) => element.remove());

  if (!target) return;

  const rect = target.getBoundingClientRect();
  const highlight = document.createElement('div');
  highlight.className = guidedHighlightClass;
  highlight.style.position = 'fixed';
  highlight.style.top = `${Math.max(rect.top - 8, 8)}px`;
  highlight.style.left = `${Math.max(rect.left - 8, 8)}px`;
  highlight.style.width = `${Math.max(rect.width + 16, 24)}px`;
  highlight.style.height = `${Math.max(rect.height + 16, 24)}px`;
  document.body.appendChild(highlight);
};

export const runGuidedSteps = (title: string, steps: GuidedStep[]): AssistantActionResult => {
  const normalizedSteps = steps.filter((step) => step.message?.trim());

  if (!normalizedSteps.length) {
    return { ok: false, message: 'No hay pasos validos para ejecutar.' };
  }

  clearAssistantUI();
  dispatchAssistantGuideEvent('start');

  let currentIndex = 0;
  const panel = document.createElement('aside');
  panel.className = guidedStepsClass;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');

  const render = () => {
    const step = normalizedSteps[currentIndex];
    const target = resolveGuidedTarget(step.target);

    panel.innerHTML = '';

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      window.setTimeout(() => createGuidedHighlight(target), 260);
    } else {
      createGuidedHighlight(null);
    }

    const label = document.createElement('span');
    label.className = 'assistant-guided-steps__label';
    label.textContent = `Paso ${currentIndex + 1} de ${normalizedSteps.length}`;
    panel.appendChild(label);

    const heading = document.createElement('strong');
    heading.textContent = step.title || title;
    panel.appendChild(heading);

    const message = document.createElement('p');
    message.textContent = step.message;
    panel.appendChild(message);

    if (!target && step.target) {
      const missing = document.createElement('small');
      missing.textContent = 'No encontre el elemento exacto en esta pantalla, pero puedes continuar con el paso.';
      panel.appendChild(missing);
    }

    const actions = document.createElement('div');
    actions.className = 'assistant-guided-steps__actions';

    const previous = document.createElement('button');
    previous.type = 'button';
    previous.textContent = 'Anterior';
    previous.disabled = currentIndex === 0;
    previous.addEventListener('click', () => {
      currentIndex = Math.max(currentIndex - 1, 0);
      render();
    });

    const next = document.createElement('button');
    next.type = 'button';
    next.textContent = currentIndex === normalizedSteps.length - 1 ? 'Finalizar' : 'Siguiente';
    next.addEventListener('click', () => {
      if (currentIndex >= normalizedSteps.length - 1) {
        panel.remove();
        createGuidedHighlight(null);
        dispatchAssistantGuideEvent('end');
        return;
      }

      currentIndex += 1;
      render();
    });

    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Salir';
    close.addEventListener('click', () => {
      panel.remove();
      createGuidedHighlight(null);
      dispatchAssistantGuideEvent('end');
    });

    actions.append(previous, next, close);
    panel.appendChild(actions);
  };

  document.body.appendChild(panel);
  render();

  return {
    ok: true,
    message: 'Guia paso a paso iniciada. El asistente de voz se desactivo mientras la guia esta activa.',
    data: { deactivateVoiceAssistant: true, steps: normalizedSteps.length },
  };
};

export const startProductCreationGuide = (): AssistantActionResult => {
  dispatchAssistantGuideEvent('start');
  navigateTo('/productos');

  window.setTimeout(() => {
    const supportGuideButton =
      getField('product-support-guide') ||
      findUiElement('Soporte y Ayuda', 'button').element ||
      findUiElement('guia crear nuevo producto', 'button').element;

    if (supportGuideButton) {
      supportGuideButton.click();
    }
  }, window.location.pathname === '/productos' ? 120 : 550);

  return {
    ok: true,
    message: 'Estoy abriendo Productos y ejecutando Soporte y Ayuda para crear un nuevo producto.',
    data: { deactivateVoiceAssistant: true, route: '/productos', guide: 'product_support_button' },
  };
};

export const startNewOrderFlow = (): AssistantActionResult => {
  navigateTo('/avd');
  showGlobalMessage('Nuevo pedido: dime la descripcion del pedido para empezar.');

  return {
    ok: true,
    message: 'Bueno, agreguemos un nuevo pedido. Que quieres poner de descripcion?',
    data: {
      route: '/avd',
      flow: 'new_order',
      nextPrompt: 'Bueno, agreguemos un nuevo pedido. Que quieres poner de descripcion?',
      deactivateVoiceAssistant: false,
    },
  };
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

  if (
    (normalizedTask.includes('nuevo') || normalizedTask.includes('agregar') || normalizedTask.includes('anad') || normalizedTask.includes('crear')) &&
    normalizedTask.includes('pedido')
  ) {
    return startNewOrderFlow();
  }

  if (
    (normalizedTask.includes('nuevo') || normalizedTask.includes('agregar') || normalizedTask.includes('crear')) &&
    normalizedTask.includes('producto') &&
    (normalizedTask.includes('guia') || normalizedTask.includes('guiada') || normalizedTask.includes('paso'))
  ) {
    return startProductCreationGuide();
  }

  if (
    (normalizedTask.includes('nuevo') || normalizedTask.includes('agregar') || normalizedTask.includes('crear')) &&
    normalizedTask.includes('producto')
  ) {
    navigateTo('/productos');
    delayedClick('new-product', window.location.pathname === '/productos' ? 250 : 650);
    return {
      ok: true,
      message: 'Estoy abriendo la seccion de productos y el formulario de nuevo producto.',
      data: { route: '/productos', action: 'new-product' },
    };
  }

  if (normalizedTask.includes('producto') && normalizedTask.includes('seccion')) {
    navigateTo('/productos');
    return { ok: true, message: 'Navegando a la seccion de productos.', data: { route: '/productos' } };
  }

  if (normalizedTask.includes('avd')) {
    navigateTo('/avd');
    return { ok: true, message: 'Navegando a la seccion AVD.', data: { route: '/avd' } };
  }

  if (normalizedTask.includes('siguiente error') || normalizedTask.includes('error')) {
    return goToNextError();
  }

  if (normalizedTask.includes('pasos') || normalizedTask.includes('guia')) {
    return runGuidedSteps('Pasos sugeridos', [
      {
        title: 'Revisar campos obligatorios',
        message: 'Revisa los campos marcados como obligatorios o pendientes.',
        target: 'formulario',
      },
      {
        title: 'Completar datos faltantes',
        message: 'Completa los datos faltantes antes de continuar.',
      },
      {
        title: 'Validar adjuntos',
        message: 'Si el proceso requiere imagenes o documentos, verifica que esten cargados.',
        target: 'imagenes',
      },
      {
        title: 'Guardar o continuar',
        message: 'Cuando todo este completo, presiona Guardar o Continuar.',
        target: 'guardar',
      },
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
    case 'run_guided_steps':
      return runGuidedSteps(
        String(args.title || 'Guia paso a paso'),
        Array.isArray(args.steps) ? args.steps.map((step) => {
          if (typeof step === 'string') return { message: step };
          const value = step as Record<string, unknown>;
          return {
            title: value.title ? String(value.title) : undefined,
            message: String(value.message || ''),
            target: value.target ? String(value.target) : undefined,
          };
        }) : [],
      );
    case 'start_product_creation_guide':
      return startProductCreationGuide();
    case 'start_new_order_flow':
      return startNewOrderFlow();
    case 'data_get_products':
      return getProductsData(Number(args.limit || 20));
    case 'data_find_product':
      return findProductData(String(args.query || ''), Number(args.limit || 5));
    case 'data_get_product_price':
      return getProductPrice(String(args.query || ''));
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
