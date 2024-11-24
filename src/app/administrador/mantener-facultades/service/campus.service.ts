import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Campus } from '../models/campus';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CampusService {
  private readonly API_URL = 'http://localhost:8080/mantener';

  constructor(private http: HttpClient) {}

  getCampus(): Observable<Campus[]> {
    return this.http.get<Campus[]>(`${this.API_URL}/campus`);
  }

  createCampus(campus: Campus): Observable<Campus> {
    return this.http.post<Campus>(`${this.API_URL}/campus`, campus);
  }
}
