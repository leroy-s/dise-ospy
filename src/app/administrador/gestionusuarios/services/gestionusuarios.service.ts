import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Director } from '../models/director.model';

@Injectable({
  providedIn: 'root'
})
export class GestionusuariosService {
  private readonly AUTH_API = 'http://localhost:8080/auth';
  private readonly BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  signUp(userData: {
    username: string;
    roles: string[];
    nombre: string;
    apellido: string;
    correoElectronico: string;
    dni: string;
    telefono: string;
    carreraId: number;
  }): Observable<any> {
    console.log('Enviando datos al servidor:', userData);
    return this.http.post(`${this.AUTH_API}/sign-up`, userData);
  }

  signUpDirector(directorData: Director): Observable<any> {
    console.log('Enviando datos de director al servidor:', directorData);
    return this.http.post(`${this.BASE_URL}/users/createdirectora`, directorData);
  }

  getEscuelas(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/mantener/api/escuelas`);
  }

  getFacultadesByEscuela(escuelaId: number): Observable<any> {
    return this.http.get(`http://localhost:8080/facultades/escuela/${escuelaId}`);
  }

  getRoles(): Observable<string[]> {
    return new Observable(observer => {
      observer.next(['COORDINADOR', 'DIRECTOR', 'DOCENTE']);
      observer.complete();
    });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/users`);
  }
}
