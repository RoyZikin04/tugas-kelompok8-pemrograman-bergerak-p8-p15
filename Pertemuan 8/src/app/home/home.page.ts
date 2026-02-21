import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFooter
} from '@ionic/angular/standalone';

// Import Service Gemini
import { GeminiService } from '../services/gemini.service';

// Import RxJS untuk Fitur Grammar Checker
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

// Import lastValueFrom untuk mengubah Observable ke Promise (Fitur 2)
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Interface untuk data Random User
interface RandomUser {
  name: { first: string; last: string };
  email: string;
  phone: string;
  picture: { large: string };
  login: { username: string };
  location: { city: string; country: string };
  dob: { date: string; age: number };
  gender: string;
}

// Interface untuk hasil Grammar Check
interface GrammarResult {
  status: 'Correct' | 'Incorrect';
  correction: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Hanya Ionic component yang benar-benar dipakai di template
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFooter,
  ],
})
export class HomePage implements OnInit, OnDestroy {

  // ============================================================
  // STATE NAVIGASI
  // ============================================================
  activeSegment: string = 'chatbot';

  // ============================================================
  // FITUR 1: AI CHATBOT
  // Konsep: Observable - subscribe() untuk menerima respon AI
  // ============================================================
  userInput: string = '';
  chatHistory: { role: 'user' | 'model'; text: string }[] = [];
  chatLoading: boolean = false;

  // ============================================================
  // FITUR 2: RANDOM USER GENERATOR
  // Konsep: Promise - async/await + lastValueFrom()
  // ============================================================
  randomUser: RandomUser | null = null;
  userLoading: boolean = false;

  // ============================================================
  // FITUR 3: LIVE GRAMMAR CHECKER
  // Konsep: Observable + debounceTime + switchMap
  // ============================================================
  grammarInput: string = '';
  grammarResult: GrammarResult | null = null;
  grammarLoading: boolean = false;
  grammarError: string = '';

  // Subject sebagai "trigger" untuk grammar check
  private grammarSubject = new Subject<string>();
  private grammarSubscription!: Subscription;

  constructor(
    private geminiService: GeminiService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Setup pipeline Observable untuk Grammar Checker
    this.grammarSubscription = this.grammarSubject.pipe(
      // [Operator 1] debounceTime: Tunda 1000ms setelah user berhenti mengetik
      debounceTime(1000),

      // [Operator 2] switchMap: Batalkan request lama jika ada input baru
      switchMap((text: string) => {
        this.grammarLoading = true;
        this.grammarError = '';
        this.grammarResult = null;

        const prompt = `You are a grammar checker. Check the grammar of this English sentence: "${text}"
        
Return ONLY a valid JSON object with no markdown, no backticks, no explanation. Format:
{"status": "Correct", "correction": ""}
or
{"status": "Incorrect", "correction": "Write the corrected sentence here"}`;

        return this.geminiService.generateText(prompt);
      })
    ).subscribe({
      next: (response: any) => {
        this.grammarLoading = false;
        try {
          const rawText = response.candidates[0].content.parts[0].text;
          const cleanJson = rawText.replace(/```json|```/g, '').trim();
          this.grammarResult = JSON.parse(cleanJson);
        } catch (e) {
          this.grammarError = 'AI mengembalikan format yang tidak terduga. Coba lagi.';
        }
      },
      error: (err: any) => {
        this.grammarLoading = false;
        this.grammarError = 'Gagal terhubung ke AI. Periksa koneksi dan API Key Anda.';
        console.error('Grammar check error:', err);
      }
    });
  }

  ngOnDestroy() {
    if (this.grammarSubscription) {
      this.grammarSubscription.unsubscribe();
    }
  }

  // ============================================================
  // Handler perpindahan segment
  // ============================================================
  onSegmentChange() {
    if (this.activeSegment !== 'grammar') {
      this.grammarResult = null;
      this.grammarError = '';
    }
  }

  // ============================================================
  // FUNGSI FITUR 1: KIRIM PESAN KE AI CHATBOT
  // ============================================================
  kirimPesan() {
    if (!this.userInput.trim()) return;

    const pesanUser = this.userInput.trim();
    this.chatHistory.push({ role: 'user', text: pesanUser });
    this.userInput = '';
    this.chatLoading = true;

    this.geminiService.generateText(pesanUser).subscribe({
      next: (response: any) => {
        const jawabanAI = response.candidates[0].content.parts[0].text;
        this.chatHistory.push({ role: 'model', text: jawabanAI });
        this.chatLoading = false;
      },
      error: (err: any) => {
        console.error('Chat error:', err);
        this.chatHistory.push({
          role: 'model',
          text: '⚠️ Maaf, terjadi kesalahan. Periksa API Key dan koneksi internet Anda.'
        });
        this.chatLoading = false;
      }
    });
  }

  // ============================================================
  // FUNGSI FITUR 2: GENERATE RANDOM USER
  // ============================================================
  async generateUser() {
    this.userLoading = true;
    this.randomUser = null;

    try {
      const response: any = await lastValueFrom(
        this.http.get('https://randomuser.me/api/')
      );
      this.randomUser = response.results[0];
    } catch (error) {
      console.error('Error fetching random user:', error);
      alert('Gagal mengambil data user. Periksa koneksi internet Anda.');
    } finally {
      this.userLoading = false;
    }
  }

  // ============================================================
  // FUNGSI FITUR 3: HANDLER INPUT GRAMMAR CHECKER
  // ============================================================
  onGrammarInput(event: any) {
    const text = event.target.value || '';

    if (!text.trim()) {
      this.grammarResult = null;
      this.grammarError = '';
      this.grammarLoading = false;
      return;
    }

    this.grammarSubject.next(text);
  }
}
