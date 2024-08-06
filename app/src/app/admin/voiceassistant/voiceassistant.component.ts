import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Define a minimal type for SpeechRecognitionEvent
interface SpeechRecognitionResult {
  transcript: string;
}

interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {}

interface SpeechRecognitionEvent extends Event {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
  start(): unknown;
  stop(): unknown;
  results: SpeechRecognitionResultList;
}

@Component({
  selector: 'app-voiceassistant',
  templateUrl: './voiceassistant.component.html',
  styleUrls: ['./voiceassistant.component.scss']
})
export class VoiceassistantComponent {
  private recognition: SpeechRecognitionEvent | null = null;

  constructor(private router: Router) {
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        console.log('Result received: ' + speechResult);
        this.processSpeech(speechResult);
      };

      this.recognition.onerror = (event: Event) => {
        console.error('Speech recognition error detected:', (event as any).error);
      };

      this.recognition.onend = () => {
        console.log('Speech recognition service disconnected');
      };

      this.startRecognition();
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }

  private startRecognition(): void {
    if (this.recognition) {
      this.recognition.start();
      setTimeout(() => {
        this.recognition?.stop();
      }, 30000); // Stops recognition after 30 seconds
    }
  }

  private processSpeech(speech: string): void {
    const pages: { [key: string]: string } = {
      'sales order': '/sales-order',
      'product': '/products-page',
      'vendor': '/vendors-page',
      'home': '/home'
    };

    const page = Object.keys(pages).find(page => speech.includes('go to ' + page + '.'));
    if (page) {
      this.router.navigate([pages[page]]);
    } else {
      console.log('Speech not recognized for navigation');
    }
  }
}
