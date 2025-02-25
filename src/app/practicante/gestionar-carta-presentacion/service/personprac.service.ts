import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartaPresentacion } from '../model/cartaprac';  // Importa la interfaz

@Injectable({
  providedIn: 'root'
})
export class PersonpracService {

  private apiUrl = 'http://localhost:8080/ppp/guardar-datos';  // URL de la API (reemplázala con tu endpoint)

  constructor(private http: HttpClient) { }

  // Obtener carta de presentación por ID o alguna lógica de filtrado
  // Método en el servicio que devuelve un solo objeto
obtenerCarta(): Observable<CartaPresentacion> {
  return this.http.get<CartaPresentacion>(`${this.apiUrl}/obtener`);
}


  // Crear o actualizar una carta de presentación
  comenzarCarta(carta: CartaPresentacion): Observable<CartaPresentacion> {
    // Se supone que el backend utilizará POST o PUT dependiendo de si es una nueva carta o se actualiza
    return this.http.post<CartaPresentacion>(`${this.apiUrl}/crear`, carta);
  }

  // Método para validar la carta (según tu lógica)
  validarCarta(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validar`, { id });
  }

  // Método para crear un nuevo registro de carta de presentación
  guardarCarta(carta: CartaPresentacion): Observable<CartaPresentacion> {
    return this.http.post<CartaPresentacion>(`${this.apiUrl}/crear`, carta);
  }

  // Otros métodos que puedas necesitar (como eliminar, actualizar, etc.)
}
