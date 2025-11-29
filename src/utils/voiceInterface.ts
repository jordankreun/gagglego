// Voice input using Web Speech API
export class VoiceRecognition {
  private recognition: any = null;
  private isListening = false;

  constructor(
    private onResult: (transcript: string, isFinal: boolean) => void,
    private onError?: (error: string) => void
  ) {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        const isFinal = event.results[last].isFinal;
        this.onResult(transcript, isFinal);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.onError?.(event.error);
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // Restart if it stops unexpectedly
          this.recognition.start();
        }
      };
    }
  }

  start() {
    if (!this.recognition) {
      this.onError?.('Speech recognition not supported in this browser');
      return;
    }

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      this.onError?.('Failed to start voice recognition');
    }
  }

  stop() {
    if (this.recognition) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  isSupported() {
    return !!this.recognition;
  }
}

// Voice output using Web Speech API
export class VoiceSynthesis {
  private synth: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number; voice?: string }) {
    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 1.0;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 1.0;

    // Try to find a friendly voice
    const voices = this.synth.getVoices();
    if (options?.voice) {
      const selectedVoice = voices.find(v => v.name.includes(options.voice!));
      if (selectedVoice) utterance.voice = selectedVoice;
    } else {
      // Default to a pleasant English voice
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha'))
      ) || voices.find(v => v.lang.startsWith('en'));
      
      if (preferredVoice) utterance.voice = preferredVoice;
    }

    this.currentUtterance = utterance;
    this.synth.speak(utterance);

    return new Promise<void>((resolve) => {
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };
    });
  }

  stop() {
    this.synth.cancel();
    this.currentUtterance = null;
  }

  isSpeaking() {
    return this.synth.speaking;
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }
}
