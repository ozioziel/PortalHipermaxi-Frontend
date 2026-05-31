import { useCallback, useRef, useState } from 'react';
import { clearAssistantUI } from '../lib/assistantDomActions';
import { callUiAutomationMcpTool, connectUiAutomationMcpBridge } from '../lib/uiAutomationMcpBridge';

type VoiceStatus = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';

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
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const connectedRef = useRef(false);
  const stopRef = useRef<() => void>(() => undefined);
  const preserveAssistantUiOnStopRef = useRef(false);

  const sendEvent = useCallback((event: Record<string, unknown>) => {
    const channel = dataChannelRef.current;
    if (!channel || channel.readyState !== 'open') return false;
    channel.send(JSON.stringify(event));
    return true;
  }, []);

  const sendToolResult = useCallback((callId: string, result: unknown, createResponse = true) => {
    sendEvent({
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: callId,
        output: JSON.stringify(result),
      },
    });
    if (createResponse) {
      sendEvent({ type: 'response.create' });
    }
  }, [sendEvent]);

  const handleToolCall = useCallback(async (name?: string, callId?: string, rawArguments?: string) => {
    if (!name || !callId) return;
    const args = parseJson(rawArguments);
    const result = await callUiAutomationMcpTool(name, args);
    const deactivateVoice = shouldDeactivateForGuidedSteps(result);

    sendToolResult(callId, result, !deactivateVoice);

    if (deactivateVoice) {
      sendEvent({ type: 'response.cancel' });
      preserveAssistantUiOnStopRef.current = true;
      window.setTimeout(() => stopRef.current(), 120);
    }
  }, [sendEvent, sendToolResult]);

  const handleEvent = useCallback((event: Record<string, unknown>) => {
    const type = String(event.type || '');

    if (type === 'input_audio_buffer.speech_started') {
      clearAssistantUI();
      setStatus('listening');
      sendEvent({ type: 'response.cancel' });
    }

    if (type.includes('response.audio') && type.includes('started')) {
      setStatus('speaking');
    }

    if (type === 'response.audio.done' || type === 'response.done') {
      setStatus('listening');
    }

    if (type === 'response.audio_transcript.delta' || type === 'response.text.delta') {
      const delta = String(event.delta || '');
      if (delta) setLastMessage((current) => `${current}${delta}`);
    }

    if (type === 'conversation.item.input_audio_transcription.completed') {
      setLastMessage(String(event.transcript || ''));
    }

    if (type === 'response.function_call_arguments.done') {
      void handleToolCall(String(event.name || ''), String(event.call_id || ''), String(event.arguments || '{}'));
    }

    const item = event.item as Record<string, unknown> | undefined;
    if ((type === 'response.output_item.done' || type === 'conversation.item.created') && item?.type === 'function_call') {
      void handleToolCall(String(item.name || ''), String(item.call_id || ''), String(item.arguments || '{}'));
    }

    if (type === 'error') {
      const rawMsg = (event.error as { message?: string } | undefined)?.message || 'Error de conexion realtime.';
      if (import.meta.env && import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Realtime error event:', rawMsg);
      }
      setError(resolveUserMessage(String(rawMsg)));
      setStatus('error');
      setFallbackVisible(true);
    }
  }, [handleToolCall, sendEvent]);

  const stop = useCallback(() => {
    connectedRef.current = false;
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
    setStatus('idle');
  }, []);

  stopRef.current = stop;

  const start = useCallback(async () => {
    if (connectedRef.current) return;

    setStatus('connecting');
    setError('');
    setLastMessage('');
    setIsLoading(true);
    setFallbackVisible(false);

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
      audioRef.current = audio;
      peer.ontrack = (event) => {
        audio.srcObject = event.streams[0];
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      stream.getAudioTracks().forEach((track) => peer.addTrack(track, stream));

      const channel = peer.createDataChannel('oai-events');
      dataChannelRef.current = channel;
      channel.addEventListener('open', () => {
        setStatus('listening');
        connectedRef.current = true;
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
      setStatus('error');
      setFallbackVisible(true);
    } finally {
      setIsLoading(false);
    }
  }, [handleEvent, stop]);

  return {
    status,
    lastMessage,
    error,
    start,
    stop,
    connected: connectedRef.current,
    isLoading,
    fallbackVisible,
  };
};
