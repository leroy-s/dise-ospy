import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPracticante, ILinea } from '../model/usuarioprac-tutor';

@Injectable({
  providedIn: 'root'
})
export class PracticanteEPService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  createPracticante(practicante: IPracticante): Observable<any> {
    return this.http.post(`${this.baseUrl}/practicantelogin/createpracticante`, practicante);
  }

  getLineas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/lineas`);
  }

  getEscuelas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mantener/escuela`);
  }

  getEscuelasByFacultad(facultadId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mantener/escuela/facultad/${facultadId}`);
  }
}
