import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { IPracticante, Facultad, EscuelaProfesional } from '../model/usuarioprac-tutor';

@Injectable({
  providedIn: 'root'
})
export class PracticanteEPService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  createPracticante(practicante: IPracticante): Observable<any> {
    return this.http.post(`${this.baseUrl}/practicantelogin/createpracticante`, practicante);
  }

  // getLineas(): Observable<ILinea[]> {
  //   return this.http.get<ILinea[]>(`${this.baseUrl}/lineas`);
  // }

  getFacultades(): Observable<Facultad[]> {
    return this.http.get<Facultad[]>(`${this.baseUrl}/mantenercord/facultad`).pipe(
      catchError(error => {
        console.error('Error al obtener facultades:', error);
        throw error;
      })
    );
  }

  getEscuelasByFacultad(facultadId: number): Observable<EscuelaProfesional[]> {
    const url = `${this.baseUrl}/mantenercord/escuela/facultad/${facultadId}`;
    console.log('Consultando escuelas:', url); // Debug URL

    return this.http.get<EscuelaProfesional[]>(url).pipe(
      tap(response => {
        console.log('Respuesta del servidor (escuelas):', response);
      }),
      catchError(error => {
        console.error('Error al obtener escuelas:', error);
        throw error;
      })
    );
  }

  getPracticantes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/practicantelogin/listarpracticante`).pipe(
      tap(response => console.log('Practicantes recibidos:', response)),
      catchError(error => {
        console.error('Error al obtener practicantes:', error);
        throw error;
      })
    );
  }
}
