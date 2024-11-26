import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartaPresentacion } from '../model/cartaprac';

@Injectable({
  providedIn: 'root'
})
export class PersonpracService {
  private baseUrl = 'http://localhost:8080/cartapresentacion';

  constructor(private http: HttpClient) { }

  public comenzarCarta(carta: CartaPresentacion): Observable<CartaPresentacion> {
    return this.http.put<CartaPresentacion>(`${this.baseUrl}/comenzarcarta`, carta);
  }

  public obtenerCarta(): Observable<CartaPresentacion> {
    return this.http.get<CartaPresentacion>(`${this.baseUrl}/micarta`);
  }
}
