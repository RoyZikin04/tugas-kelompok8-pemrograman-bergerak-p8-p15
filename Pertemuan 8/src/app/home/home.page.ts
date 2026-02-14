import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonFooter, 
  IonInput, 
  IonButton, 
  IonIcon,
  IonSpinner,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, trashOutline, sparklesOutline, personOutline } from 'ionicons/icons';
import { Gemini, Message } from '../services/gemini.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonFooter,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonCard,
    IonCardContent,
  ],
})
export class HomePage {
@ViewChild('content', { static: false }) content!: IonContent;
  
  messages: Message[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  apiKeyConfigured: boolean = true;

  constructor(private geminiService: Gemini) {
    addIcons({ sendOutline, trashOutline, sparklesOutline, personOutline });
    this.checkApiKey();
    this.addWelcomeMessage();
  }

  checkApiKey() {
    this.apiKeyConfigured = this.geminiService.isApiKeyConfigured();
  }

  addWelcomeMessage() {
    if (this.apiKeyConfigured) {
      this.messages.push({
        text: 'Halo! 👋 Saya adalah AI Assistant berbasis Gemini. Ada yang bisa saya bantu?',
        isUser: false,
        timestamp: new Date()
      });
    }
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isLoading) {
      return;
    }

    if (!this.apiKeyConfigured) {
      alert('Please configure your Gemini API key in environment.ts file');
      return;
    }

    const userMessage: Message = {
      text: this.userInput,
      isUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageText = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    setTimeout(() => this.scrollToBottom(), 100);

    this.geminiService.sendMessage(messageText).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Full Response:', response);
        
        if (response && response.candidates && response.candidates.length > 0) {
          const aiResponse = response.candidates[0].content.parts[0].text;
          
          const aiMessage: Message = {
            text: aiResponse,
            isUser: false,
            timestamp: new Date()
          };
          
          this.messages.push(aiMessage);
          setTimeout(() => this.scrollToBottom(), 100);
        } else {
          console.error('Invalid response structure:', response);
          this.showError('Tidak ada respon dari AI');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Full Error Object:', error);
        console.error('Error Status:', error.status);
        console.error('Error Message:', error.message);
        console.error('Error Details:', error.error);
        
        let errorMessage = 'Terjadi kesalahan saat mengirim pesan.';
        
        if (error.status === 400) {
          errorMessage = 'API Key tidak valid. Silakan periksa konfigurasi API Key Anda.';
          if (error.error && error.error.error && error.error.error.message) {
            errorMessage += '\nDetail: ' + error.error.error.message;
          }
        } else if (error.status === 429) {
          errorMessage = 'Terlalu banyak permintaan. Silakan coba lagi nanti.';
        } else if (error.status === 0) {
          errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        } else if (error.error) {
          // Tampilkan detail error jika ada
          errorMessage += '\nStatus: ' + error.status;
          if (error.error.error && error.error.error.message) {
            errorMessage += '\nDetail: ' + error.error.error.message;
          }
        }
        
        this.showError(errorMessage);
      }
    });
  }

  showError(message: string) {
    const errorMessage: Message = {
      text: `❌ ${message}`,
      isUser: false,
      timestamp: new Date()
    };
    this.messages.push(errorMessage);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  clearChat() {
    this.messages = [];
    this.addWelcomeMessage();
  }

  scrollToBottom() {
    this.content?.scrollToBottom(300)
  }

  onKeyPress(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
