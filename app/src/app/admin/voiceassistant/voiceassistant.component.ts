import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Define a minimal type for SpeechRecognitionEvent
interface SpeechRecognitionResult {
  transcript: string; // Holds the recognized speech as text
}

interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> { }

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

  constructor(private router: Router, private http: HttpClient) { }

  // Method to initialize speech recognition
  private initializeSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let speechResult = event.results[0][0].transcript.toLowerCase();
        console.log('Result received: ' + speechResult);
        this.processSpeech(speechResult); // Process the recognized speech
      };

      this.recognition.onerror = (event: Event) => {
        console.error('Speech recognition error detected:', (event as any).error);
      };

      this.recognition.onend = () => {
        console.log('Speech recognition service disconnected');
      };
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }

 // Method to start speech recognition
public startSpeechRecognition(): void {
  this.initializeSpeechRecognition(); // Initialize the recognition if not already done
  if (this.recognition) {
    this.recognition.start(); // Start speech recognition

    // Restart recognition if it ends before the timeout
    this.recognition.onend = () => {
      console.log('Speech recognition service ended, restarting...');
      this.recognition?.start(); // Restart speech recognition
    };

    // Stop recognition after 60 seconds
    setTimeout(() => {
      this.recognition?.stop(); // Stop recognition
      this.recognition.onend = () => {
        console.log('Speech recognition stopped by timeout');
      };
    }, 10000);
  }
}


  // Method to process the recognized speech and navigate or perform actions based on it
  private processSpeech(speech: string): void {
    this.oneFieldApi(speech); // Handle API-related commands first

    const pages: { [key: string]: string } = {
      'dashboard': '/admin/dashboard',
      'users': 'admin/users',
      'company': '/admin/company',
      'sales': '/admin/sales',
      'roles': 'users/roles',
      'inventory': 'admin/inventory',
      'master': 'admin/master',
      'product-groups': 'products/product-groups',
      'vendors': 'admin/vendors'
    };

    const page = Object.keys(pages).find(page => speech.includes('go to ' + page));
    if (page) {
      this.router.navigate([pages[page]]);
    } else {
      console.log('Speech not recognized for navigation');
    }
  }

  // Method to handle API-related speech commands
  private oneFieldApi(speech: string): void {
    // Regular expression to match "create new role for <role_name> and description is <role_description>"
    const roleMatch = speech.match(/create new role for (.+?) and description is (.+)/);

    if (roleMatch && roleMatch[1]) {
      const roleName = roleMatch[1].trim(); // Capture the role name and trim any leading/trailing whitespace
      const roleDescription = roleMatch[2]?.trim() || ''; // Capture the role description or set it as an empty string if not provided
      this.createRole(roleName, roleDescription); // Call the function to create a role
      return;
    }

    // Regular expression to match "create new <endpoint> with name <name>"
    const oneFieldMatch = speech.match(/create new ([\w\s]+) with name (.+)/);
    if (oneFieldMatch && oneFieldMatch[1] && oneFieldMatch[2]) {
      const endpoint = oneFieldMatch[1].trim(); // Capture the endpoint and trim any leading/trailing whitespace
      const name = oneFieldMatch[2].trim(); // Capture the name and trim any leading/trailing whitespace
      this.createOneFieldData(endpoint, name); // Call the function to create the data
      return;
    }

    console.log('Speech not recognized for API creation commands');
  }

  // Method to create a new role by calling the API
  private createRole(roleName: string, roleDescription: string): void {
    const payload = {
      role_name: roleName, // Set the role name in the payload
      description: roleDescription // Set the role description in the payload
    };

    this.http.post('https://apicore.cnlerp.com/api/v1/users/role/', payload)
      .subscribe(
        response => console.log('Role created:', response),
        error => console.error('Error creating role:', error)
      );
  }

  // Method to create a new item by calling the product group API
  private createOneFieldData(endpoint: string, name: string): void {
    endpoint = endpoint.replace(/\s+/g, '_'); // Convert endpoint name to snake_case
    const payload = { name: name }; // Set the name in the payload

    this.http.post(`https://apicore.cnlerp.com/api/v1/products/${endpoint}/`, payload)
      .subscribe(
        response => console.log('Data Created:', response),
        error => console.error('Error creating item:', error)
      );
  }

}
