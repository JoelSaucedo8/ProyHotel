import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HabitacionesService {
  private apiUrl = 'http://localhost:4000/api/'; // URL de la API
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedInSubject.next(true); // Si hay un token, el usuario está logueado
    } else {
      this.isLoggedInSubject.next(false);
   }
  }

  obtenerHabitaciones(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token en localStorage:', token); // 👈 Verificar en la consola
  
    const headers = new HttpHeaders({
      'Authorization': `${token}`,  // Asegúrate de que el token tiene el prefijo "Bearer"
      'Accept': 'application/json'
    });
  
    return this.http.get<any>(`${this.apiUrl}obtenerHabitaciones`, { headers }).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Habitaciones obtenidas con éxito:', response);
          return response.payload;
        }
        return null;
      }),
      catchError(err => {
        console.error('Error en la obtención de habitaciones:', err);
        return of(null);
      })
    );
  }
  

  obtenerHabitacionId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Token en localStorage:', token); // 👈 Verificar en la consola
  
    const headers = new HttpHeaders({
      'Authorization': `${token}`,  // Asegúrate de que el token tiene el prefijo "Bearer"
      'Accept': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}obtenerHabitacion/${id}`, {headers}).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Habitación obtenida con éxito:', response);
          return response.payload;
        }
        return null;
      }),
      catchError(err => {
        console.error('Error en la obtención de habitación:', err);
        return of(null);
      })
    );
  }

  // Crear una nueva habitación
  crearHabitacion(habitacion: any): Observable<any> {
    console.log('Body de la solicitud POST:', habitacion);
    return this.http.post<any>(`${this.apiUrl}crearHabitacion`, habitacion).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Habitación creada con éxito:', response);
          console.log(response.payload[0].cant_cama_simple);
          this.isLoggedInSubject.next(true); // Indica que el usuario está logueado
          localStorage.setItem('token', response.token); // Almacena el token
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en la creacion de habitacion:', err);
        return of(null);
      })
    );
  }

  actualizarHabitacion(habitacion: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}actualizarHabitacion`, habitacion).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          console.log('Habitación actualizada con éxito:', response);
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en la actualización de habitación:', err);
        return of(null);
      })
    );
  }
}
