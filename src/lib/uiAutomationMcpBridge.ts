import { executeAssistantAction } from './assistantDomActions';

type PendingCall = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  timer: number;
};

const pending = new Map<string, PendingCall>();
let socket: WebSocket | null = null;
let connecting: Promise<WebSocket> | null = null;

const uuid = () => {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const wsUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname;
  return `${protocol}//${host}:3001/ws/ui-automation`;
};

const send = (payload: Record<string, unknown>) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    throw new Error('WebSocket UI automation no conectado.');
  }
  socket.send(JSON.stringify(payload));
};

const handleMessage = async (event: MessageEvent<string>) => {
  const message = JSON.parse(event.data) as {
    type: string;
    id?: string;
    action?: string;
    args?: Record<string, unknown>;
    result?: unknown;
  };

  if (message.type === 'mcp_tool_result' && message.id) {
    const call = pending.get(message.id);
    if (!call) return;
    window.clearTimeout(call.timer);
    pending.delete(message.id);
    call.resolve(message.result);
    return;
  }

  if (message.type === 'ui_action_request' && message.id && message.action) {
    const result = await executeAssistantAction(message.action, message.args || {});
    send({
      type: 'ui_action_result',
      id: message.id,
      result,
    });
  }
};

export const connectUiAutomationMcpBridge = () => {
  if (socket?.readyState === WebSocket.OPEN) return Promise.resolve(socket);
  if (connecting) return connecting;

  connecting = new Promise((resolve, reject) => {
    const nextSocket = new WebSocket(wsUrl());
    socket = nextSocket;

    nextSocket.addEventListener('open', () => {
      connecting = null;
      resolve(nextSocket);
    });
    nextSocket.addEventListener('message', (event) => {
      void handleMessage(event as MessageEvent<string>);
    });
    nextSocket.addEventListener('close', () => {
      socket = null;
      connecting = null;
      pending.forEach((call) => {
        window.clearTimeout(call.timer);
        call.reject(new Error('WebSocket UI automation cerrado.'));
      });
      pending.clear();
    });
    nextSocket.addEventListener('error', () => {
      connecting = null;
      reject(new Error('No se pudo conectar al WebSocket UI automation.'));
    });
  });

  return connecting;
};

export const callUiAutomationMcpTool = async (name: string, args: Record<string, unknown> = {}) => {
  await connectUiAutomationMcpBridge();
  const id = uuid();

  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timeout llamando MCP tool ${name}.`));
    }, 12000);

    pending.set(id, { resolve, reject, timer });
    send({
      type: 'mcp_tool_call',
      id,
      name,
      args,
    });
  });
};
