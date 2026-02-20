import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarangService {
  // Alamat Backend API
  private apiUrl = 'http://localhost:3000/api/barang';

  constructor(private http: HttpClient) { }

  // Method untuk mengambil semua data barang (GET)
  getBarang(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Method untuk menambah barang baru (POST)
  tambahBarang(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}