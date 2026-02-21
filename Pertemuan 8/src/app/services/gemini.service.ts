import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  // ⚠️ GANTI dengan API Key Gemini Anda dari aistudio.google.com
  private apiKey = 'API_PASTE_DISINI_CUY';

  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  constructor(private http: HttpClient) { }

  // Digunakan oleh: Fitur 1 (Chatbot) & Fitur 3 (Grammar Checker)
  generateText(prompt: string): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}`;
    const body = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
    return this.http.post<any>(url, body);
  }
}
