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
const assistantSpotlightClass = 'assistant-dom-spotlight';
const tooltipClass = 'assistant-dom-tooltip';
const stepsClass = 'assistant-steps-panel';
const guidedStepsClass = 'assistant-guided-steps';
const guidedHighlightClass = 'assistant-guided-highlight';

const dispatchAssistantGuideEvent = (type: 'start' | 'end') => {
  window.dispatchEvent(new CustomEvent(`assistant-guided-steps:${type}`));
};

const dispatchAssistantTargetEvent = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  window.dispatchEvent(new CustomEvent('assistant-ui-target', {
    detail: {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
    },
  }));
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

const clearSpotlights = () => {
  document.querySelectorAll(`.${assistantSpotlightClass}`).forEach((element) => element.remove());
};

const clearSteps = () => {
  document.querySelectorAll(`.${stepsClass}`).forEach((element) => element.remove());
  document.querySelectorAll(`.${guidedStepsClass}`).forEach((element) => element.remove());
  document.querySelectorAll(`.${guidedHighlightClass}`).forEach((element) => element.remove());
};

const createSpotlight = (element: HTMLElement, timeout: number) => {
  clearSpotlights();
  const rect = element.getBoundingClientRect();
  const padding = 8;
  const spotlight = document.createElement('div');
  spotlight.className = assistantSpotlightClass;
  spotlight.style.position = 'fixed';
  spotlight.style.top = `${Math.max(rect.top - padding, 8)}px`;
  spotlight.style.left = `${Math.max(rect.left - padding, 8)}px`;
  spotlight.style.width = `${Math.min(rect.width + padding * 2, window.innerWidth - 16)}px`;
  spotlight.style.height = `${Math.min(rect.height + padding * 2, window.innerHeight - 16)}px`;
  document.body.appendChild(spotlight);
  window.setTimeout(() => spotlight.remove(), timeout);
};

const highlight = (element: HTMLElement, timeout = 7000) => {
  dispatchAssistantTargetEvent(element);
  createSpotlight(element, timeout);
  element.classList.add(assistantUiClass);
  window.setTimeout(() => element.classList.remove(assistantUiClass), timeout);
};

export const clearAssistantUI = (): AssistantActionResult => {
  clearTooltips();
  clearSpotlights();
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
  dispatchAssistantTargetEvent(element);

  const tooltipWidth = Math.min(320, window.innerWidth - 32);
  const estimatedTooltipHeight = 110;
  const gap = 14;
  const leftNearTarget = Math.min(Math.max(rect.left, 16), window.innerWidth - tooltipWidth - 16);
  const positions = [
    {
      left: leftNearTarget,
      top: rect.bottom + gap,
      fits: rect.bottom + gap + estimatedTooltipHeight <= window.innerHeight - 16,
    },
    {
      left: leftNearTarget,
      top: rect.top - estimatedTooltipHeight - gap,
      fits: rect.top - estimatedTooltipHeight - gap >= 16,
    },
    {
      left: rect.left - tooltipWidth - gap,
      top: Math.min(Math.max(rect.top, 16), window.innerHeight - estimatedTooltipHeight - 16),
      fits: rect.left - tooltipWidth - gap >= 16,
    },
    {
      left: rect.right + gap,
      top: Math.min(Math.max(rect.top, 16), window.innerHeight - estimatedTooltipHeight - 16),
      fits: rect.right + tooltipWidth + gap <= window.innerWidth - 16,
    },
  ];
  const position = positions.find((candidate) => candidate.fits) || {
    left: rect.left + rect.width / 2 > window.innerWidth / 2 ? 16 : window.innerWidth - tooltipWidth - 16,
    top: 16,
  };

  const tooltip = document.createElement('div');
  tooltip.className = tooltipClass;
  tooltip.textContent = message;
  tooltip.style.position = 'fixed';
  tooltip.style.left = `${position.left}px`;
  tooltip.style.top = `${position.top}px`;
  tooltip.style.width = `${tooltipWidth}px`;
  document.body.appendChild(tooltip);
  window.setTimeout(() => tooltip.remove(), 7000);
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

export const startNewProductFlow = (): AssistantActionResult => {
  navigateTo('/productos');
  delayedClick('new-product', window.location.pathname === '/productos' ? 220 : 700);
  showGlobalMessage('Nuevo producto: dime la descripcion del producto para empezar.');

  return {
    ok: true,
    message: 'Bueno, creemos un nuevo producto. Que quieres poner en la descripcion del producto?',
    data: {
      route: '/productos',
      action: 'new-product',
      flow: 'new_product',
      nextPrompt: 'Bueno, creemos un nuevo producto. Que quieres poner en la descripcion del producto?',
      deactivateVoiceAssistant: false,
    },
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

export const startNewSupplierGuide = (): AssistantActionResult => {
  const alreadyOnSupplierPage = window.location.pathname === '/nuevo-proveedor';

  window.dispatchEvent(new CustomEvent('support-chat:close'));
  navigateTo('/nuevo-proveedor');
  delayedClick('start-supplier-guide', alreadyOnSupplierPage ? 220 : 700);
  showGlobalMessage('Te llevo a Nuevo Proveedor e inicio la guia visual.');

  return {
    ok: true,
    message: 'Estoy abriendo Nuevo Proveedor y ejecutando Iniciar guia.',
    data: {
      route: '/nuevo-proveedor',
      action: 'start-supplier-guide',
      guide: 'nuevo-proveedor',
      deactivateVoiceAssistant: true,
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
    (
      normalizedTask.includes('proveedor') ||
      normalizedTask.includes('plataforma') ||
      normalizedTask.includes('portal')
    ) &&
    (
      normalizedTask.includes('soy nuevo') ||
      normalizedTask.includes('soy nueva') ||
      normalizedTask.includes('nuevo proveedor') ||
      normalizedTask.includes('ser proveedor') ||
      normalizedTask.includes('registr') ||
      normalizedTask.includes('alta')
    ) &&
    !normalizedTask.includes('producto')
  ) {
    return startNewSupplierGuide();
  }

  if (
    (normalizedTask.includes('nuevo') || normalizedTask.includes('agregar') || normalizedTask.includes('anad') || normalizedTask.includes('crear')) &&
    normalizedTask.includes('producto') &&
    (normalizedTask.includes('guia') || normalizedTask.includes('guiada') || normalizedTask.includes('paso') || normalizedTask.includes('soporte') || normalizedTask.includes('ayuda'))
  ) {
    return startProductCreationGuide();
  }

  if (
    (normalizedTask.includes('nuevo') || normalizedTask.includes('agregar') || normalizedTask.includes('anad') || normalizedTask.includes('crear')) &&
    normalizedTask.includes('producto')
  ) {
    return startNewProductFlow();
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

// ─── Auth / Session ───────────────────────────────────────────────────────────

type StoredSession = { user?: { id: string; email: string; role: string; name?: string }; token?: string };

export const authGetSession = (): AssistantActionResult => {
  try {
    const raw = localStorage.getItem('session');
    if (!raw) {
      return { ok: true, message: 'El usuario no está autenticado.', data: { loggedIn: false } };
    }
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.user || !parsed.token) {
      return { ok: true, message: 'El usuario no está autenticado.', data: { loggedIn: false } };
    }
    const { name, email, role } = parsed.user;
    return {
      ok: true,
      message: `El usuario ya está autenticado como ${name || email} (rol: ${role}).`,
      data: { loggedIn: true, name: name || null, email, role },
    };
  } catch {
    return { ok: true, data: { loggedIn: false } };
  }
};

// ─── Navigation ──────────────────────────────────────────────────────────────

const VALID_ROUTES = ['/', '/productos', '/facturas', '/avd', '/nuevo-proveedor', '/admin/dashboard', '/admin/trazabilidad', '/admin/preguntas-frecuentes', '/admin/interacciones-ia', '/admin/actividad-usuarios'];

export const navGoToPage = (route: string, reason?: string): AssistantActionResult => {
  if (!VALID_ROUTES.includes(route)) {
    return { ok: false, message: `Ruta no válida: ${route}. Disponibles: ${VALID_ROUTES.join(', ')}` };
  }
  navigateTo(route);
  if (reason) showGlobalMessage(reason);
  return { ok: true, message: `Navegando a ${route}.`, data: { route } };
};

// ─── Support & Escalation ────────────────────────────────────────────────────

const ESCALATION_KEYWORDS = ['no puedo acceder', 'credenciales', 'contrasena', 'error tecnico', 'falla', 'no carga', 'bloqueado', 'urgente', 'error interno', 'no funciona', 'perdio acceso', 'olvide', 'no recuerdo', 'no me llego', 'no recibi'];
const CREDENTIALS_KEYWORDS = ['credencial', 'contrasena', 'acceder', 'acceso', 'olvide', 'no recuerdo', 'no me llego', 'no recibi', 'perdio acceso', 'bloqueado', 'usuario'];

export const supportDetectEscalation = (reason: string): AssistantActionResult => {
  const normalized = normalize(reason);
  const shouldEscalate = ESCALATION_KEYWORDS.some((kw) => normalized.includes(normalize(kw)));
  const isCredentialsCase = CREDENTIALS_KEYWORDS.some((kw) => normalized.includes(normalize(kw)));

  return {
    ok: true,
    message: shouldEscalate
      ? 'Esta situación requiere gestión con el equipo de soporte de Hipermaxi.'
      : 'Puedo seguir intentando ayudarte desde aquí.',
    data: {
      shouldEscalate,
      isCredentialsCase,
      suggestedGuide: isCredentialsCase ? 'credenciales' : null,
      channel: shouldEscalate ? 'email' : null,
      contact: shouldEscalate ? 'soportehub@hipermaxi.com' : null,
      whatsapp: shouldEscalate ? '+591 78401543' : null,
      reason,
      instruction: isCredentialsCase
        ? 'Llama help_get_guide con topic="credenciales" para mostrar los pasos exactos del proceso SOP-SR-03 y support_get_contacts para mostrar los canales. No intentes enviar nada automaticamente.'
        : 'Llama support_get_contacts para mostrar los canales de soporte disponibles.',
    },
  };
};

export const supportGetContacts = (): AssistantActionResult => ({
  ok: true,
  message: 'Canales de soporte disponibles.',
  data: {
    email: 'soportehub@hipermaxi.com',
    whatsapp: '+591 78401543',
    hours: 'Lunes a viernes, 8:00 – 18:00 (hora Bolivia)',
    note: 'El WhatsApp es para orientación inicial. La solicitud formal debe enviarse al correo.',
    channels: ['Email (formal)', 'WhatsApp (orientación)'],
  },
});

export const supportCreateTicket = (issue: string, priority = 'medium'): AssistantActionResult => {
  const ticketId = `TKT-${Date.now().toString(36).toUpperCase()}`;
  showGlobalMessage(`Ticket ${ticketId} registrado. El equipo de soporte te contactará pronto.`);
  return {
    ok: true,
    message: `Ticket creado: ${ticketId}. Te contactarán por soportehub@hipermaxi.com en 1-2 días hábiles.`,
    data: {
      ticketId,
      issue,
      priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      estimatedResponse: '1-2 días hábiles',
      contact: 'soportehub@hipermaxi.com',
    },
  };
};

// ─── Help & FAQ ───────────────────────────────────────────────────────────────

const PAGE_EXPLANATIONS: Record<string, string> = {
  '/': 'Página de inicio del Portal Hipermaxi. Desde aquí puedes acceder a Productos, Facturas, Aviso de Despacho o registrarte como nuevo proveedor.',
  '/productos': 'Módulo de Productos. Puedes ver, agregar y gestionar tus productos: descripción, código de barra, registro sanitario, imágenes y precios.',
  '/facturas': 'Módulo de Facturas. Carga tus facturas en PDF o XML seleccionando la orden de compra correspondiente.',
  '/avd': 'Aviso de Despacho (AVD). Notifica a Hipermaxi que tu pedido está listo: completa datos de despacho y confirma.',
  '/nuevo-proveedor': 'Registro de Nuevo Proveedor. Completa datos generales, contactos y documentos para solicitar acceso como proveedor.',
  '/admin/dashboard': 'Dashboard Administrativo. Métricas generales: facturas cargadas, productos registrados, proveedores activos y uso del asistente Maxi.',
};

export const helpExplainPage = (route?: string): AssistantActionResult => {
  const currentRoute = route || window.location.pathname;
  const explanation = PAGE_EXPLANATIONS[currentRoute] ?? `Sección ${currentRoute}. Puedes preguntarme qué campos o acciones están disponibles aquí.`;
  return {
    ok: true,
    message: explanation,
    data: { route: currentRoute, explanation },
  };
};

const FAQ_ITEMS = [
  { q: 'como cargo una factura', a: 'Ve a Facturas, selecciona la orden de compra, adjunta el PDF o XML de tu factura y presiona Enviar.' },
  { q: 'como registro un nuevo producto', a: 'Ve a Productos, presiona Nuevo, completa la descripción, código de barra, registro sanitario y otros datos requeridos.' },
  { q: 'que es el avd', a: 'El Aviso de Despacho (AVD) es la notificación que haces a Hipermaxi cuando tu pedido está listo para ser entregado.' },
  { q: 'como me registro como proveedor', a: 'Ve a Nuevo Proveedor, completa el formulario con datos generales, contactos y documentos. El equipo revisará tu solicitud.' },
  {
    q: 'olvide mi contrasena credenciales acceso no puedo entrar perdí acceso bloqueado',
    a: 'Para recuperar tus credenciales debes seguir el proceso SOP-SR-03:\n1. Envía un correo a soportehub@hipermaxi.com con el asunto "Solicitud de Reenvío de Credenciales de Acceso".\n2. Incluye: Nombre del Proveedor, Razón Social, NIT, Rol, Email, Teléfono y datos del catálogo (Código Proveedor, Región, Nombre del Vendedor).\n3. Recibirás un archivo Excel para completar y devolver.\n4. Una vez validado, las credenciales se reenvían al correo del Encargado HUB.\nPara orientación previa puedes escribir al WhatsApp +591 78401543.',
  },
  { q: 'que formatos acepta la factura', a: 'Las facturas deben estar en formato PDF o XML, con un máximo de 5 MB por archivo.' },
  { q: 'cuanto tarda en procesarse una factura', a: 'El procesamiento puede tomar entre 1 y 5 días hábiles.' },
  { q: 'como ver el estado de mis facturas', a: 'En la sección Facturas puedes ver el listado con el estado actual de cada factura enviada.' },
  { q: 'puedo editar un producto ya guardado', a: 'Sí, en la lista de Productos puedes seleccionar un producto y editar sus datos.' },
  { q: 'que documentos necesito para registrarme', a: 'Necesitas: NIT de la empresa, poder notarial del representante legal y datos de contacto del responsable.' },
  { q: 'informacion necesaria para solicitar credenciales', a: 'Debes enviar: Nombre de Proveedor, Razón Social, NIT, Rol, Email, Teléfono y datos del catálogo (Código Proveedor ya registrado, Región, Nombre del Vendedor, Nombre del Gerente Comercial). Sin esta información la solicitud será devuelta.' },
];

export const helpSearchFaq = (query: string): AssistantActionResult => {
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(/\s+/).filter((t) => t.length > 3);
  const matches = FAQ_ITEMS.filter((item) => {
    const q = normalize(item.q);
    return tokens.some((t) => q.includes(t)) || q.split(' ').some((w) => w.length > 3 && normalizedQuery.includes(w));
  });

  return {
    ok: matches.length > 0,
    message: matches.length > 0 ? `Encontré ${matches.length} respuesta(s).` : 'No encontré respuesta específica. Contacta a soportehub@hipermaxi.com.',
    data: { query, results: matches.slice(0, 3) },
  };
};

const GUIDES: Record<string, { title: string; steps: string[]; contacts?: Record<string, string>; note?: string }> = {
  'credenciales': {
    title: 'Recuperar credenciales de acceso (SOP-SR-03)',
    steps: [
      'Envía un correo a soportehub@hipermaxi.com con el asunto exacto: "Solicitud de Reenvío de Credenciales de Acceso".',
      'En el correo incluye: Nombre del Proveedor, Razón Social, NIT.',
      'Indica tu Rol: Encargado de Sistemas, Encargado HUB o Encargado de Área Comercial.',
      'Agrega tu Email, Teléfono y los datos del catálogo: Código Proveedor, Región y Nombre del Vendedor.',
      'El equipo de Compras te enviará un archivo Excel para completar y devolver.',
      'Una vez validada tu información, Soporte reenviará las credenciales al correo del Encargado HUB autorizado.',
      'Confirma el acceso exitoso al portal y comunícalo a soportehub@hipermaxi.com para cerrar el ticket.',
    ],
    contacts: {
      email: 'soportehub@hipermaxi.com',
      whatsapp: '+591 78401543 (orientación inicial)',
    },
    note: 'Este proceso aplica solo a proveedores activos con credenciales previamente creadas. Para registro nuevo de proveedor, usa la sección "Nuevo Proveedor".',
  },
  'registro-producto': {
    title: 'Registrar un nuevo producto',
    steps: [
      'Ve a la sección Productos desde el menú principal.',
      'Presiona el botón "Nuevo" en la barra de herramientas.',
      'Completa la descripción del producto (nombre completo).',
      'Ingresa el código de barra del proveedor.',
      'Agrega el registro sanitario y su fecha de vencimiento.',
      'Sube las imágenes del producto (frente, trasero, lateral).',
      'Si aplica, agrega precio en el catálogo de precios.',
      'Presiona "Guardar" para registrar el producto.',
    ],
  },
  'carga-factura': {
    title: 'Cargar una factura',
    steps: [
      'Ve a la sección Facturas desde el menú principal.',
      'Selecciona la orden de compra correspondiente.',
      'Presiona "Cargar Factura" o el ícono de carga.',
      'Selecciona el archivo PDF o XML (máx. 5 MB).',
      'Verifica que los datos sean correctos.',
      'Presiona "Enviar" para subir la factura.',
      'Espera la confirmación del procesamiento (1-5 días hábiles).',
    ],
  },
  'avd': {
    title: 'Registrar un Aviso de Despacho',
    steps: [
      'Ve a la sección AVD desde el menú principal.',
      'Selecciona el pedido que vas a despachar.',
      'Completa los datos: fecha, transportista y número de guía.',
      'Verifica las cantidades y productos del despacho.',
      'Presiona "Confirmar Despacho" para registrar el AVD.',
    ],
  },
  'nuevo-proveedor': {
    title: 'Registrarse como nuevo proveedor',
    steps: [
      'Ve a la sección "Nuevo Proveedor" desde la pantalla de inicio.',
      'Completa los datos generales: nombre de empresa, NIT, dirección.',
      'Agrega tus contactos: nombre, cargo, correo y teléfono.',
      'Sube los documentos requeridos: NIT y poder del representante legal.',
      'Revisa el resumen de tu solicitud.',
      'Envía la solicitud y espera la confirmación del equipo Hipermaxi.',
    ],
  },
};

export const helpGetGuide = (topic: string): AssistantActionResult => {
  const normalizedTopic = normalize(topic);
  const key = Object.keys(GUIDES).find(
    (k) => normalize(k).includes(normalizedTopic) || normalizedTopic.includes(normalize(k)) || normalizedTopic.split(/[-\s]+/).some((w) => w.length > 3 && normalize(k).includes(w)),
  );

  if (!key) {
    return {
      ok: false,
      message: 'No encontré guía para ese tema. Temas disponibles: registro-producto, carga-factura, avd, nuevo-proveedor.',
      data: { availableGuides: Object.keys(GUIDES) },
    };
  }

  return { ok: true, message: `Guía para: ${GUIDES[key].title}`, data: GUIDES[key] };
};

// ─── Invoices / Files ────────────────────────────────────────────────────────

export const invoiceGetRequirements = (): AssistantActionResult => ({
  ok: true,
  message: 'Requisitos para carga de facturas.',
  data: {
    formats: ['PDF', 'XML'],
    maxSize: '5 MB',
    requirements: [
      'La factura debe corresponder a una orden de compra existente en el sistema.',
      'El NIT del proveedor debe coincidir con el registrado.',
      'La factura no puede estar duplicada.',
      'Debe incluir número, fecha, monto y descripción.',
      'El archivo debe ser legible y sin contraseña.',
    ],
    tip: 'Si tienes problemas, verifica que el archivo no esté dañado y que sea menor a 5 MB.',
    contact: 'soportehub@hipermaxi.com',
  },
});

const INVOICE_ERRORS: Record<string, string> = {
  'formato': 'La factura debe estar en formato PDF o XML. No se aceptan imágenes JPG, PNG ni documentos Word.',
  'tamano': 'El archivo supera el límite de 5 MB. Intenta comprimir el PDF antes de subirlo.',
  'duplicada': 'Esta factura ya fue registrada. Verifica el número de factura para evitar duplicados.',
  'proveedor-no-registrado': 'El NIT del proveedor no está registrado. Contacta a soportehub@hipermaxi.com.',
  'orden-no-encontrada': 'No se encontró la orden de compra asociada. Verifica que el número de orden sea correcto.',
  'fecha-invalida': 'La fecha de la factura no es válida o está fuera del período permitido.',
};

export const invoiceExplainError = (errorType: string): AssistantActionResult => {
  const normalized = normalize(errorType);
  const key = Object.keys(INVOICE_ERRORS).find((k) => normalize(k).includes(normalized) || normalized.includes(normalize(k)));
  const explanation = key ? INVOICE_ERRORS[key] : `Error en la carga de factura. Contacta a soportehub@hipermaxi.com para más ayuda.`;

  return {
    ok: true,
    message: explanation,
    data: { errorType, explanation, contact: 'soportehub@hipermaxi.com' },
  };
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardGetSummary = (): AssistantActionResult => ({
  ok: true,
  message: 'Resumen del dashboard administrativo.',
  data: {
    metrics: {
      proveedoresActivos: 48,
      productosRegistrados: 312,
      facturasCargadasMes: 127,
      tasaCompletadoFormularios: '84%',
      interaccionesIA: 253,
      ticketsSoporte: 12,
    },
    period: 'Último mes',
    lastUpdated: new Date().toISOString(),
    topModule: 'Productos',
  },
});

const METRIC_EXPLANATIONS: Record<string, string> = {
  'facturas-cargadas': 'Número total de facturas enviadas por proveedores en el período seleccionado.',
  'productos-registrados': 'Total de productos únicos registrados en el catálogo del portal.',
  'proveedores-activos': 'Número de proveedores con actividad en el período.',
  'tasa-completado': 'Porcentaje de formularios iniciados que fueron completados y enviados exitosamente.',
  'interacciones-ia': 'Número de consultas al asistente Maxi (chat y voz) en el período.',
  'tickets-soporte': 'Tickets de soporte abiertos en el período actual.',
};

export const dashboardExplainMetric = (metric: string): AssistantActionResult => {
  const normalized = normalize(metric);
  const key = Object.keys(METRIC_EXPLANATIONS).find(
    (k) => normalize(k).includes(normalized) || normalized.includes(normalize(k)) || normalized.split(/[-\s]+/).some((w) => w.length > 3 && normalize(k).includes(w)),
  );
  const explanation = key ? METRIC_EXPLANATIONS[key] : `La métrica "${metric}" refleja el rendimiento del portal en esa categoría.`;

  return {
    ok: true,
    message: explanation,
    data: { metric, explanation },
  };
};

// ─── Voice confirmation ───────────────────────────────────────────────────────

export const voiceConfirmAction = (action: string, description: string): AssistantActionResult => {
  showGlobalMessage(`Confirmar: ${action}. Responde "sí, confirmo" o "cancelar".`);
  return {
    ok: true,
    message: `Para ejecutar "${action}" necesito tu confirmación. ${description} ¿Confirmas esta acción?`,
    data: {
      action,
      description,
      needsConfirmation: true,
      confirmPhrase: 'sí, confirmo',
      cancelPhrase: 'cancelar',
    },
  };
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
    case 'start_new_product_flow':
      return startNewProductFlow();
    case 'start_product_creation_guide':
      return startProductCreationGuide();
    case 'start_new_order_flow':
      return startNewOrderFlow();
    case 'start_new_supplier_guide':
      return startNewSupplierGuide();
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
    // Navigation
    case 'nav_go_to_page':
      return navGoToPage(String(args.route || '/'), args.reason ? String(args.reason) : undefined);
    // Support
    case 'support_detect_escalation':
      return supportDetectEscalation(String(args.reason || ''));
    case 'support_get_contacts':
      return supportGetContacts();
    case 'support_create_ticket':
      return supportCreateTicket(String(args.issue || ''), args.priority ? String(args.priority) : 'medium');
    // Help / FAQ
    case 'help_explain_page':
      return helpExplainPage(args.route ? String(args.route) : undefined);
    case 'help_search_faq':
      return helpSearchFaq(String(args.query || ''));
    case 'help_get_guide':
      return helpGetGuide(String(args.topic || ''));
    // Invoices
    case 'invoice_get_requirements':
      return invoiceGetRequirements();
    case 'invoice_explain_error':
      return invoiceExplainError(String(args.errorType || ''));
    // Dashboard
    case 'dashboard_get_summary':
      return dashboardGetSummary();
    case 'dashboard_explain_metric':
      return dashboardExplainMetric(String(args.metric || ''));
    // Voice confirmation
    case 'voice_confirm_action':
      return voiceConfirmAction(String(args.action || ''), String(args.description || ''));
    // Auth / session
    case 'auth_get_session':
      return authGetSession();
    default:
      return { ok: false, message: `Tool no soportada: ${actionName}` };
  }
};
