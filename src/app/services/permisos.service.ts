import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private apiUrl='http://localhost:4000/api/';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private roleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {
      const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedInSubject.next(true); // Si hay un token, el usuario está logueado
    } else {
      this.isLoggedInSubject.next(false);
    }
   }

  obtenerUsuarios(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'obtenerUsuarios');
  }

  login(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login`, user).pipe(
      map((response: any) => {
        if (response.codigo === 200) {
          this.isLoggedInSubject.next(true);
          localStorage.setItem('nombre', response.payload[0].nombre);
          localStorage.setItem('token', response.jwt);
          localStorage.setItem('id', response.payload[0].id_usuario);
          localStorage.setItem('rol', response.payload[0].rol);
          localStorage.setItem('usuario', JSON.stringify(response.payload[0]));
          console.log(localStorage.getItem('usuario'));
        }
        return response;
      }),
      catchError((error: any) => {
        console.error('Error en el login:', error);
        return throwError(() => new Error(error.message || 'Error en el servidor'));
      })
    );
  }

  // Registrar un nuevo usuario
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crearUsuario`, userData).pipe(
      map(response => {
        if (response && response.codigo === 200) {
          const user: User = response.payload[0]; // Obtiene el usuario
          this.roleSubject.next(user.rol); // Actualiza el rol
          this.isLoggedInSubject.next(true); // Indica que el usuario está logueado
          localStorage.setItem('token', response.token); // Almacena el token
        }
        return response;
      }),
      catchError(err => {
        console.error('Error en el registro:', err);
        return of(null);
      })
    );
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('nombre');
    localStorage.removeItem('token');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario')
    this.router.navigate(['/']);
  }

  // Getter para el estado de inicio de sesión
  get isLoggedIn(): boolean {
    return this.isLoggedIn.valueOf();
  }
}
