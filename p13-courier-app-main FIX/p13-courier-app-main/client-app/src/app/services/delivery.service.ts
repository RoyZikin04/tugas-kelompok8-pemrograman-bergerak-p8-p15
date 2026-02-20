import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery } from '../interfaces/models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private apiUrl = `${environment.baseUrl}/api/deliveries`;

  constructor(private http: HttpClient) {}

  getDeliveries(userId: number): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.apiUrl}/${userId}`);
  }

  getDeliveryDetail(id: number): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.apiUrl}/detail/${id}`);
  }

  // UBAH KE ANY AGAR FLEKSIBEL
  createDelivery(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  deleteDelivery(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}