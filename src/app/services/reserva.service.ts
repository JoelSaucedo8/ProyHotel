import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'http://localhost:4000/api/';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedInSubject.next(true); // Si hay un token, el usuario está logueado
    } else {
      this.isLoggedInSubject.next(false);
   }
   }

   // Post para crear una reserva
   crearReserva(reserva: any): Observable<any> {
    console.log('Body de la solicitud POST:', reserva);
    return this.http.post<any>(`${this.apiUrl}crearReserva`, reserva).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Reserva creada con éxito:', response);
          this.isLoggedInSubject.next(true); // Indica que el usuario está logueado
          localStorage.setItem('id_reserva', response.payload[0]?.id_reserva);
          console.log('id reserva en service:' + localStorage.getItem('id_reserva'))
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en la creacion de reserva:', err);
        return of(null);
      })
    );
  }

  crearReservaHuesped(reservaHuesped: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}crearReservaHuesped`, reservaHuesped).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Reserva creada con éxito:', response);
          this.isLoggedInSubject.next(true); // Indica que el usuario está logueado
          localStorage.getItem('id_reserva');
          localStorage.getItem('id_huesped');
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en la creacion de reserva:', err);
        return of(null);
      })
    );
  }

  // Get para obtener las reservas
  obtenerReservas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}obtenerReservas`).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Reservas obtenidas con éxito:', response);
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en la obtención de reservas:', err);
        return of(null);
      })
    );
  }
  
  // Get para obtener una reserva por ID
  obtenerReservaUsuarioId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}obtenerReservaUsuarioId/${id}`).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Reserva obtenida con éxito:', response);
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en la obtención de reserva:', err);
        return of(null);
      })
    );
  }

  // Put para actualizar una reserva
  actualizarReservaId(id: number, reserva: any): Observable<any> {
    console.log('Body de la solicitud PUT:', reserva);
    return this.http.put<any>(`${this.apiUrl}actualizarReservaId/${id}`, reserva).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Reserva actualizada con éxito:', response);
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en la actualización de reserva:', err);
        return of(null);
      })
    );
  }
}