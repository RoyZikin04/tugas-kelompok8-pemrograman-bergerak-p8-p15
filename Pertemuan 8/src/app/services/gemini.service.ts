import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class Gemini {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
  private apiKey = environment.geminiApiKey;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const key = (this.apiKey ?? '').trim();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-goog-api-key': key,
    });

    const body = {
      contents: [{ parts: [{ text: message }] }],
    };

    // log aman (tanpa substring yang bisa error kalau kosong)
    console.log('Gemini key length:', key.length);

    return this.http.post(this.apiUrl, body, { headers });
  }

  

isApiKeyConfigured(): boolean {
  const key = (this.apiKey ?? '').trim();
  return key.length > 10 && !key.includes('YOUR_GEMINI_API_KEY_HERE');
}


}
