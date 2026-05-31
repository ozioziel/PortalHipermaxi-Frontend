const speech = () => {
  if (typeof window === 'undefined') return null;
  return window.speechSynthesis ?? null;
};

const pickSpanishVoice = () => {
  const voices = speech()?.getVoices() ?? [];
  return voices.find((voice) => voice.lang === 'es-BO') ?? voices.find((voice) => voice.lang.startsWith('es'));
};

export const VoiceService = {
  speak(text: string) {
    const api = speech();

    if (!api || typeof SpeechSynthesisUtterance === 'undefined') {
      return false;
    }

    api.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickSpanishVoice();
    utterance.lang = voice?.lang ?? 'es-ES';
    if (voice) utterance.voice = voice;
    api.speak(utterance);
    return true;
  },

  cancel() {
    speech()?.cancel();
  },
};
