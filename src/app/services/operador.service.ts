import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperadorService {
  private apiUrl = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) { }

  buscarHabitacionPorDNI(dni: any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`, dni).pipe(
      map(reponse => {
        return reponse;
      }),
      catchError(error => {
        console.error('Error en la solicitud de habitacion:', error);
        return of(null);
      })
    );
  }

  checkinHabitacion(id: any): Observable<any>{
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
          'Authorization': `${token}`,
          'Accept': 'application/json'
        });
    
    return this.http.get<any>(`${this.apiUrl}obtenerHabitacion/${id}`, {headers}).pipe(
      map(reponse => {
        return reponse;
      }),
      catchError(error => {
        console.error('Error en la solicitud de habitacion:', error);
        return of(null);
      })
    );
  }

  buscarHabitacionPorDNIoNumero(dni: any, habitacion: any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`, dni && habitacion).pipe(
      map(reponse => {
        return reponse;
      }),
      catchError(error => {
        console.error('Error en la solicitud de habitacion:', error);
        return of(null);
      })
    );
  }

  checkoutHabitacion(habitacionId: any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`, habitacionId).pipe(
      map(reponse => {
        return reponse;
      }),
      catchError(error => {
        console.error('Error en la solicitud de habitacion:', error);
        return of(null);
      })
    );
  }

  registrarHuesped(datos: any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`, datos).pipe(
      map(reponse => {
        return reponse;
      }),
      catchError(error => {
        console.error('Error en la solicitud de habitacion:', error);
        return of(null);
      })
    );
  }

  buscarUsuario(dni: any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`, dni).pipe(
      map(reponse => {
        return reponse;
      }),
      catchError(error => {
        console.error('Error en la solicitud de habitacion:', error);
        return of(null);
      })
    );
  }

  actualizarUsuario(datos: any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}`, datos).pipe(
      map(reponse => {
        return reponse;
      }),
      catchError(error => {
        console.error('Error en la solicitud de habitacion:', error);
        return of(null);
      })
    );
  }
}