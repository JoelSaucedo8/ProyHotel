import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:4000/api/';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private usuarioIdSubject = new BehaviorSubject<number | null>(null); // Almacena el ID del usuario

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    const storedId = localStorage.getItem('id_usuario');

    if (token && storedId) {
      this.isLoggedInSubject.next(true);
      this.usuarioIdSubject.next(Number(storedId)); // Guarda el ID del usuario en el BehaviorSubject
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  // Obtener todos los usuarios
  obtenerUsuarios(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `${token}`,
      'Accept': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}obtenerUsuarios`, { headers }).pipe(
      map(response => {
        console.log('Respuesta del servicio:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error en la solicitud de usuarios:', error);
        return of(null);
      })
    );
  }

  obtenerUsuarioId(): Observable<any> {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
  
    if (!id || !token) { // Verifica también el token
      console.error("Error: ID o token de usuario no disponibles.");
      return throwError(() => new Error('ID o token no disponibles'));
    }
  
    // Configura los headers con el token
    const headers = new HttpHeaders({
      'Authorization': ` ${token}`
    });
  
    console.log(`URL generada: ${this.apiUrl}obtenerUsuario/${id}`);
  
    return this.http.get<any>(`${this.apiUrl}obtenerUsuario/${id}`, { headers }).pipe( // <-- Agrega los headers aquí
      map(response => {
        console.log('🔄 Respuesta del backend:', response);
  
        if (response.codigo === 200 && response.payload && response.payload.length > 0) {
          console.log('✅ Usuario obtenido con éxito:', response.payload[0]);
  
          // Guardar usuario actualizado en localStorage
          localStorage.setItem('usuario', JSON.stringify(response.payload[0]));
  
          return {
            usuario: response.payload[0], // Acceder al primer usuario del array
            token
          };
        }
        console.error('❌ Usuario no disponible');
        throw new Error('Usuario no disponible');
      }),
      catchError(err => {
        console.error('❌ Error al obtener el usuario:', err);
        return of(null);
      })
    );
  }
  
  
  

  // 🔹 Método para actualizar el usuario
  actualizarUsuario(usuario: User): Observable<any> {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
  
    // Validaciones iniciales
    if (!id) {
      console.error('Error: No se puede actualizar un usuario sin ID.');
      return throwError(() => new Error('ID de usuario no proporcionado'));
    }
  
    if (!token) {
      console.error('Error: Token no disponible.');
      return throwError(() => new Error('Token no disponible'));
    }
  
    // Configurar headers
    const headers = new HttpHeaders({
      'Authorization': `${token}`
    });
  
    console.log('📝 Datos enviados:', usuario);
  
    return this.http.put<any>(`${this.apiUrl}actualizarUsuario/${id}`, usuario, { headers }).pipe(
      map(response => {
        console.log('🔄 Respuesta del backend:', response);
  
        if (response.codigo === 200 && response.payload?.length > 0) {
          const usuarioActualizado = response.payload[0]; // Accede al primer elemento
          console.log('✅ Usuario actualizado:', usuarioActualizado);
          return usuarioActualizado;
        }
  
        throw new Error('Respuesta inválida del servidor');
      }),
      catchError(err => {
        console.error('❌ Error al actualizar:', err);
        return throwError(() => new Error(err.error?.mensaje || 'Error de conexión'));
      })
    );
  }
  

  // 🔹 Método para obtener el ID actual
  getUsuarioId(): number | null {
    return this.usuarioIdSubject.getValue();
  }

  // 🔹 Método para cerrar sesión
  logout(): void {
    this.isLoggedInSubject.next(false);
    this.usuarioIdSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']); // Redirigir al login
  }
}
