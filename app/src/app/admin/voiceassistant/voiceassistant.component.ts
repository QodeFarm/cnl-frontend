import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Define a minimal type for SpeechRecognitionEvent
interface SpeechRecognitionResult {
  transcript: string; // Holds the recognized speech as text
}

interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {}

// Extends the Event interface to add speech recognition-specific properties
interface SpeechRecognitionEvent extends Event {
  lang: string; // Language of the recognition
  interimResults: boolean; // Whether to return interim results
  maxAlternatives: number; // Maximum number of alternatives for recognition results
  onresult: (event: SpeechRecognitionEvent) => void; // Callback when recognition results are available
  onerror: (event: Event) => void; // Callback when an error occurs
  onend: () => void; // Callback when recognition ends
  start(): unknown; // Method to start recognition
  stop(): unknown; // Method to stop recognition
  results: SpeechRecognitionResultList; // Array of recognition results
}

@Component({
  selector: 'app-voiceassistant',
  templateUrl: './voiceassistant.component.html',
  styleUrls: ['./voiceassistant.component.scss']
})
export class VoiceassistantComponent {
  // Stores the speech recognition instance
  private recognition: SpeechRecognitionEvent | null = null;

  constructor(private router: Router) {}

  // Method to initialize speech recognition
  private initializeSpeechRecognition(): void {
    // Check if the browser supports the SpeechRecognition API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      // Create a new instance of SpeechRecognition
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US'; // Set the recognition language to English (US)
      this.recognition.interimResults = false; // Only return final results
      this.recognition.maxAlternatives = 1; // Return only the top result

      // Define the onresult event handler to process the recognized speech
      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let speechResult = event.results[0][0].transcript.toLowerCase(); // Get the transcript and convert it to lowercase
        console.log('Result received: ' + speechResult);       
        this.processSpeech(speechResult); // Process the recognized speech
      };

      // Define the onerror event handler to handle recognition errors
      this.recognition.onerror = (event: Event) => {
        console.error('Speech recognition error detected:', (event as any).error);
      };

      // Define the onend event handler to handle the end of recognition
      this.recognition.onend = () => {
        console.log('Speech recognition service disconnected');
      };
    } else {
      // Warn if the browser does not support speech recognition
      console.warn('Speech recognition not supported in this browser.');
    }
  }

  // Method to start speech recognition
  public startSpeechRecognition(): void {
    this.initializeSpeechRecognition(); // Initialize the recognition if not already done
    if (this.recognition) {
      this.recognition.start(); // Start speech recognition
      setTimeout(() => {
        this.recognition?.stop(); // Stop recognition after 30 seconds
      }, 60000); // Stops recognition after 30 seconds
    }
  }

  // Method to process the recognized speech and navigate based on it
  private processSpeech(speech: string): void {
    // Mapping of recognized speech commands to routes
    const pages: { [key: string]: string } = {
      'dashboard': '/admin/dashboard',
      'users': 'admin/users',
      'company':'/admin/company',
      'sales' : '/admin/sales',
      'roles': 'users/roles',
      'inventory':'admin/inventory',
      'master': 'admin/master',
      'product-groups':'products/product-groups',
      'vendors':'admin/vendors'
    };

    // Check if the recognized speech matches any of the commands
    const page = Object.keys(pages).find(page => speech.includes('go to ' + page));
    if (page) {
      this.router.navigate([pages[page]]); // Navigate to the matched page
    } else {
      console.log('Speech not recognized for navigation'); // Log if the speech does not match any command
    }
  }
}
