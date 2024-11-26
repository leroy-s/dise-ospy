import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Escuela } from '../models/escuela';

@Injectable({
  providedIn: 'root'
})
export class EscuelaService {
  private apiUrl = 'http://localhost:8080/mantener/escuela';

  constructor(private http: HttpClient) {}

  getEscuelasByFacultad(facultadId: number): Observable<Escuela[]> {
    // Actualizando la URL para que coincida con el endpoint del backend
    return this.http.get<Escuela[]>(`${this.apiUrl}/facultad/${facultadId}`);
  }

  getEscuela(): Observable<Escuela[]> {
    return this.http.get<Escuela[]>(this.apiUrl);
  }

  getEscuelaById(id: number): Observable<Escuela> {
    return this.http.get<Escuela>(`${this.apiUrl}/${id}`);
  }

  createEscuela(escuela: Escuela): Observable<Escuela> {
    return this.http.post<Escuela>(this.apiUrl, {
      carrera: escuela.carrera,
      idFacultad: escuela.idFacultad
    });
  }

  updateEscuela(id: number, escuela: Escuela): Observable<Escuela> {
    return this.http.put<Escuela>(`${this.apiUrl}/${id}`, {
      carrera: escuela.carrera,
      idFacultad: escuela.idFacultad
    });
  }

  deleteEscuela(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
