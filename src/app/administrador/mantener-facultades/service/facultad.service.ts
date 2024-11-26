import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Facultad } from '../models/facultad';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacultadService {
  private readonly API_URL = 'http://localhost:8080/mantener';  // Actualiza la URL base

  constructor(private http: HttpClient) {}

  getFacultadesByCampus(campusId: number): Observable<Facultad[]> {
    // Como no hay un endpoint específico para obtener facultades por campus,
    // obtenemos todas las facultades y filtramos en el frontend
    return this.http.get<Facultad[]>(`${this.API_URL}/facultad`)
      .pipe(
        map((facultades: Facultad[]) =>
          facultades.filter(facultad => facultad.idCampus === campusId)
        )
      );
  }

  getFacultades(): Observable<Facultad[]> {
    return this.http.get<Facultad[]>(`${this.API_URL}/facultad`);
  }

  getFacultadById(id: number): Observable<Facultad> {
    return this.http.get<Facultad>(`${this.API_URL}/facultad/${id}`);
  }

  createFacultad(facultad: Facultad): Observable<Facultad> {
    return this.http.post<Facultad>(`${this.API_URL}/facultad`, {
      nombre: facultad.nombre,
      idCampus: facultad.idCampus
    });
  }

  updateFacultad(id: number, facultad: Facultad): Observable<Facultad> {
    return this.http.put<Facultad>(`${this.API_URL}/facultad/${id}`, {
      nombre: facultad.nombre,
      idCampus: facultad.idCampus
    });
  }

  deleteFacultad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/facultad/${id}`);
  }
}
