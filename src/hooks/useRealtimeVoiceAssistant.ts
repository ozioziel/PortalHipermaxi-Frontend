import { useCallback, useEffect, useRef, useState } from 'react';
import { clearAssistantUI } from '../lib/assistantDomActions';
import { callUiAutomationMcpTool, connectUiAutomationMcpBridge } from '../lib/uiAutomationMcpBridge';

type VoiceStatus = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

type RealtimeSessionResponse = {
  value?: string;
  client_secret?: { value?: string };
  error?: string;
};

const realtimeUrl = 'https://api.openai.com/v1/realtime/calls';

const getEphemeralKey = (data: RealtimeSessionResponse) => data.value || data.client_secret?.value || '';

const parseJson = (value: string | undefined) => {
  if (!value) return {};
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
};

const shouldDeactivateForGuidedSteps = (result: unknown) => {
  const data = (result as { data?: { deactivateVoiceAssistant?: boolean } } | null)?.data;
  return Boolean(data?.deactivateVoiceAssistant);
};

const resolveUserMessage = (raw: string) => {
  const lower = raw.toLowerCase();
  if (lower.includes('404')) return 'El servicio no fue encontrado (404).';
  if (lower.includes('500')) return 'El servicio encontro un error interno (500).';
  if (lower.includes('timeout')) return 'La conexion con el asistente tardo demasiado.';
  if (lower.includes('network') || lower.includes('failed to fetch') || lower.includes('connection')) return 'Error de red al conectar con el servicio.';
  if (lower.includes('401') || lower.includes('api key') || lower.includes('invalid')) return 'Problema de autorizacion con la API del asistente.';
  if (lower.includes('no se pudo crear la sesion') || lower.includes('efimero')) return 'No se pudo iniciar la sesion del asistente.';
  return 'Ahora mismo no puedo conectarme con el asistente. Puedes contactar a soporte por otro medio.';
};

const buildPageContextMessage = async () => {
  const context = await callUiAutomationMcpTool('ui_get_page_context');
  return [
    'Contexto actual de la pagina para el asistente. No respondas a este mensaje.',
    'Este contexto viene del MCP ui-automation-mcp. Usa tools ui_* y no le digas IDs tecnicos al usuario.',
    JSON.stringify(context),
  ].join('\n');
};

export const useRealtimeVoiceAssistant = () => {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [lastMessage, setLastMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const [connected, setConnected] = useState(false);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const connectedRef = useRef(false);
  const stopRef = useRef<() => void>(() => undefined);
  const statusRef = useRef<VoiceStatus>('idle');
  const activeResponseRef = useRef<string | null>(null);
  const completedToolCallsRef = useRef<Set<string>>(new Set());
  const preserveAssistantUiOnStopRef = useRef(false);

  const setVoiceStatus = useCallback((nextStatus: VoiceStatus) => {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  }, []);

  const sendEvent = useCallback((event: Record<string, unknown>) => {
    const channel = dataChannelRef.current;
    if (!channel || channel.readyState !== 'open') return false;
    channel.send(JSON.stringify(event));
    return true;
  }, []);

  const sendToolResult = useCallback((callId: string, result: unknown, createResponse = true) => {
    const sent = sendEvent({
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: callId,
        output: JSON.stringify(result),
      },
    });
    if (sent && createResponse) {
      sendEvent({ type: 'response.create' });
    }
  }, [sendEvent]);

  const handleToolCall = useCallback(async (name?: string, callId?: string, rawArguments?: string) => {
    if (!name || !callId) return;
    if (completedToolCallsRef.current.has(callId)) return;
    completedToolCallsRef.current.add(callId);

    try {
      setVoiceStatus('thinking');
      const args = parseJson(rawArguments);
      const result = await callUiAutomationMcpTool(name, args);
      const deactivateVoice = shouldDeactivateForGuidedSteps(result);

      sendToolResult(callId, result, !deactivateVoice);

      if (deactivateVoice) {
        preserveAssistantUiOnStopRef.current = true;
        window.setTimeout(() => stopRef.current(), 120);
      }
    } catch (caught) {
      sendToolResult(callId, {
        ok: false,
        message: caught instanceof Error ? caught.message : 'No se pudo ejecutar la accion solicitada.',
      });
    }
  }, [sendToolResult, setVoiceStatus]);

  const handleEvent = useCallback((event: Record<string, unknown>) => {
    const type = String(event.type || '');

    if (type === 'input_audio_buffer.speech_started') {
      if (statusRef.current === 'speaking') {
        sendEvent({ type: 'output_audio_buffer.clear' });
      }
      clearAssistantUI();
      setLastMessage('Te escucho...');
      setVoiceStatus('listening');
      return;
    }

    if (type === 'input_audio_buffer.speech_stopped' || type === 'input_audio_buffer.committed') {
      setVoiceStatus('thinking');
      return;
    }

    if (type === 'response.created') {
      const response = event.response as { id?: string } | undefined;
      activeResponseRef.current = response?.id || null;
      setLastMessage('');
      setVoiceStatus('thinking');
      return;
    }

    if (type === 'output_audio_buffer.started' || type === 'response.output_audio.delta') {
      setVoiceStatus('speaking');
      return;
    }

    if (type === 'output_audio_buffer.stopped' || type === 'response.output_audio.done') {
      if (connectedRef.current) setVoiceStatus('listening');
      return;
    }

    if (
      type === 'response.output_audio_transcript.delta' ||
      type === 'response.output_text.delta' ||
      type === 'response.text.delta'
    ) {
      const delta = String(event.delta || '');
      if (delta) setLastMessage((current) => `${current}${delta}`);
      return;
    }

    if (type === 'conversation.item.input_audio_transcription.completed') {
      const transcript = String(event.transcript || '').trim();
      if (transcript) setLastMessage(transcript);
      return;
    }

    if (type === 'response.function_call_arguments.done') {
      void handleToolCall(String(event.name || ''), String(event.call_id || ''), String(event.arguments || '{}'));
      return;
    }

    const item = event.item as Record<string, unknown> | undefined;
    if (type === 'response.output_item.done' && item?.type === 'function_call') {
      void handleToolCall(String(item.name || ''), String(item.call_id || ''), String(item.arguments || '{}'));
      return;
    }

    if (type === 'response.done') {
      activeResponseRef.current = null;
      if (connectedRef.current && statusRef.current !== 'error') {
        setVoiceStatus('listening');
      }
      return;
    }

    if (type === 'error') {
      const rawMsg = (event.error as { message?: string } | undefined)?.message || 'Error de conexion realtime.';
      if (import.meta.env && import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Realtime error event:', rawMsg);
      }
      setError(resolveUserMessage(String(rawMsg)));
      setVoiceStatus('error');
      setFallbackVisible(true);
    }
  }, [handleToolCall, sendEvent, setVoiceStatus]);

  const stop = useCallback(() => {
    connectedRef.current = false;
    setConnected(false);
    activeResponseRef.current = null;
    completedToolCallsRef.current.clear();
    dataChannelRef.current?.close();
    peerRef.current?.close();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioRef.current?.remove();
    dataChannelRef.current = null;
    peerRef.current = null;
    streamRef.current = null;
    audioRef.current = null;
    if (!preserveAssistantUiOnStopRef.current) {
      clearAssistantUI();
    }
    preserveAssistantUiOnStopRef.current = false;
    setIsLoading(false);
    setVoiceStatus('idle');
  }, [setVoiceStatus]);

  stopRef.current = stop;

  const start = useCallback(async () => {
    if (connectedRef.current) return;

    setVoiceStatus('connecting');
    setError('');
    setLastMessage('');
    setIsLoading(true);
    setFallbackVisible(false);
    completedToolCallsRef.current.clear();

    try {
      await connectUiAutomationMcpBridge();
      const sessionResponse = await fetch('/api/realtime/session', { method: 'POST' });
      const sessionData = await sessionResponse.json() as RealtimeSessionResponse;
      if (!sessionResponse.ok) throw new Error(sessionData.error || 'No se pudo crear la sesion Realtime.');

      const ephemeralKey = getEphemeralKey(sessionData);
      if (!ephemeralKey) throw new Error('El backend no devolvio un token efimero valido.');

      const peer = new RTCPeerConnection();
      peerRef.current = peer;

      const audio = document.createElement('audio');
      audio.autoplay = true;
      audio.setAttribute('playsinline', 'true');
      audioRef.current = audio;
      peer.ontrack = (event) => {
        audio.srcObject = event.streams[0];
        void audio.play().catch(() => undefined);
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;
      stream.getAudioTracks().forEach((track) => peer.addTrack(track, stream));

      const channel = peer.createDataChannel('oai-events');
      dataChannelRef.current = channel;
      channel.addEventListener('open', () => {
        connectedRef.current = true;
        setConnected(true);
        setVoiceStatus('listening');
        void buildPageContextMessage().then((text) => {
          sendEvent({
            type: 'conversation.item.create',
            item: {
              type: 'message',
              role: 'user',
              content: [
                {
                  type: 'input_text',
                  text,
                },
              ],
            },
          });
        });
      });
      channel.addEventListener('message', (messageEvent) => {
        try {
          handleEvent(JSON.parse(messageEvent.data) as Record<string, unknown>);
        } catch {
          setLastMessage(String(messageEvent.data));
        }
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      const sdpResponse = await fetch(realtimeUrl, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(await sdpResponse.text());
      }

      await peer.setRemoteDescription({
        type: 'answer',
        sdp: await sdpResponse.text(),
      });
    } catch (caught) {
      stop();
      const raw = caught instanceof Error ? caught.message : String(caught);
      if (import.meta.env && import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Error en useRealtimeVoiceAssistant start():', raw);
      }
      setError(resolveUserMessage(raw));
      setVoiceStatus('error');
      setFallbackVisible(true);
    } finally {
      setIsLoading(false);
    }
  }, [handleEvent, sendEvent, setVoiceStatus, stop]);

  useEffect(() => {
    const stopForBlockingUi = () => {
      if (connectedRef.current) stopRef.current();
    };

    window.addEventListener('assistant-guided-steps:start', stopForBlockingUi);
    window.addEventListener('support-chat:open', stopForBlockingUi);
    return () => {
      window.removeEventListener('assistant-guided-steps:start', stopForBlockingUi);
      window.removeEventListener('support-chat:open', stopForBlockingUi);
    };
  }, []);

  return {
    status,
    lastMessage,
    error,
    start,
    stop,
    connected,
    isLoading,
    fallbackVisible,
  };
};
