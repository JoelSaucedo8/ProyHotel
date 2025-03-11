import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperadorService {
  private apiUrl = 'http://localhost:4000/api/';

  constructor(private http: HttpClient) { }

  obtenerReservas(): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'Accept': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}obtenerReservas`, {headers}).pipe(
      map(reponse => {
        localStorage.setItem('id_reserva', reponse.payload[0].id_reserva);
        console.log('Respuesta del servicio:', reponse);
        return reponse;
      }),
      catchError(error => {
        console.error('Error en la solicitud de reserva:', error);
        return of(null);
      })
    );
  }

  obtenerHuespedReserva(id: any): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'Accept': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}obtenerHuespedReserva/${id}`, {headers}).pipe(
      map(reponse => {
        console.log('Respuesta del servicio:', reponse);
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
  
  actualizarUsuario(id: any, datos: any): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}actualizarUsuario/${id}`, datos).pipe(
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