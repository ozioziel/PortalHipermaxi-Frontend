import React from 'react';
import '../../styles/assistant.css';
import { useAuth } from '../../core/auth/AuthContext';
import { HiperFlowApi } from '../../features/support/services/HiperFlowApi';

const encode = (text: string) => encodeURIComponent(text);

const ChatFallbackSupport: React.FC = () => {
  const supportMessage = 'Hola, necesito ayuda con el Portal Hipermaxi. El asistente IA no pudo conectarse.';
  const whatsappUrl = `https://wa.me/59178401543?text=${encode(supportMessage)}`;
  const mailUrl = `mailto:soporte@hipermaxi.com?subject=${encode('Soporte Portal Hipermaxi')}&body=${encode(supportMessage)}`;
  const phoneUrl = 'tel:+59178401543';

  const auth = useAuth();

  const logSupportClick = async (action: string) => {
    void HiperFlowApi.logInteraction({
      userId: auth.user?.id ?? 'anonymous',
      userEmail: auth.user?.email ?? 'anonymous',
      role: auth.user?.role ?? 'guest',
      module: 'Support',
      action,
      description: `Usuario hizo clic en soporte: ${action}`,
      createdAt: new Date().toISOString(),
    } as any).catch(() => null);
  };

  return (
    <div className="chat-fallback-card" role="status" aria-live="polite">
      <h4>No pudimos conectar con el asistente</h4>
      <div className="chat-fallback-note">
        El servicio de chat no está disponible en este momento. Puedes contactar a soporte por otro medio.
      </div>

      <div className="chat-fallback-actions">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-fallback-action whatsapp"
          aria-label="WhatsApp"
          onClick={() => void logSupportClick('CLICK_WHATSAPP_SUPPORT')}
        >
          WhatsApp
        </a>
        <a
          href={mailUrl}
          className="chat-fallback-action mail"
          aria-label="Correo"
          onClick={() => void logSupportClick('CLICK_EMAIL_SUPPORT')}
        >
          Correo
        </a>
        <a
          href={phoneUrl}
          className="chat-fallback-action phone"
          aria-label="Llamar"
          onClick={() => void logSupportClick('CLICK_CALL_SUPPORT')}
        >
          Llamar
        </a>
      </div>
    </div>
  );
};

export default ChatFallbackSupport;
