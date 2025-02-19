import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HuespedService {
  private apiUrl = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) {}

  // Post para agregar un huésped
  agregarHuespedes(huesped: any): Observable<any> {
    console.log('Body de la solicitud POST:', huesped);
    return this.http.post<any>(`${this.apiUrl}agregarHuespedes`, huesped).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Huesped agregado con éxito:', response);
          localStorage.setItem('token', response.token);
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en la creación de huésped:', err);
        return of(null);
      })
    );
  }
  

  obtenerHuespedReservaId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}obtenerHuespedReservaId/${id}`).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Huespedes obtenidos con éxito:', response);
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en la obtención de huespedes:', err);
        return of(null);
      })
    );
  }

  actualizarHuesped(huesped: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}actualizarHuesped`, huesped).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Huesped actualizado con éxito:', response);
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en la actualización de huesped:', err);
        return of(null);
      })
    );
  }
}
