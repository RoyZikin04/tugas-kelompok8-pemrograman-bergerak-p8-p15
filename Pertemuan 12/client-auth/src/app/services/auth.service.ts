import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // 1. REGISTER - Daftar user baru
  register(data: any): Observable<any> {
    console.log('📝 Registering user:', data.username);
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // 2. LOGIN - Autentikasi user
  login(data: any): Observable<any> {
    console.log('🔑 Logging in user:', data.username);
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  // 3. SIMPAN TOKEN ke Capacitor Preferences
  async setToken(token: string): Promise<void> {
    await Preferences.set({ 
      key: 'auth_token', 
      value: token 
    });
    console.log('✅ Token saved to storage');
  }

  // 4. AMBIL TOKEN dari storage
  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'auth_token' });
    return value;
  }

  // 5. CEK STATUS LOGIN
  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    
    if (!token) {
      console.log('❌ No token found');
      return false;
    }
    
    console.log('✅ Token found');
    return true;
  }

  // 6. SIMPAN INFO USER (username, role, dll)
  async saveUserInfo(userInfo: any): Promise<void> {
    await Preferences.set({ 
      key: 'user_info', 
      value: JSON.stringify(userInfo) 
    });
    console.log('✅ User info saved:', userInfo);
  }

  // 7. AMBIL INFO USER dari storage
  async getUserInfo(): Promise<any> {
    const { value } = await Preferences.get({ key: 'user_info' });
    
    if (!value) {
      return null;
    }
    
    return JSON.parse(value);
  }

  // 8. LOGOUT - Hapus token dan user info
  async logout(): Promise<void> {
    await Preferences.remove({ key: 'auth_token' });
    await Preferences.remove({ key: 'user_info' });
    console.log('✅ User logged out');
  }

  // 9. CLEAR ALL DATA (untuk reset)
  async clearAll(): Promise<void> {
    await Preferences.clear();
    console.log('✅ All storage cleared');
  }
}