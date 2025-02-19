import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { User } from 'src/app/interfaces/user.interface';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editarperfil',
  templateUrl: './editarperfil.component.html',
  styleUrls: ['./editarperfil.component.css']
})
export class EditarperfilComponent implements OnInit {
  usuario!: User;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario(): void {
    this.usuarioService.obtenerUsuarioId().subscribe(
      response => {
        if (response) {
          this.usuario = response.usuario; // Se obtiene correctamente el usuario
        } else {
          console.error('No se pudo obtener el usuario.');
        }
      },
      error => {
        console.error('Error al cargar usuario:', error);
        alert('Error al cargar datos del usuario.');
      }
    );
  }
  

  guardarDatos(): void {
    if (!this.usuario) {
      console.error('No hay datos de usuario para actualizar');
      return;
    }

    console.log('📤 Datos a enviar:', this.usuario);
  
    this.usuarioService.actualizarUsuario(this.usuario).pipe(
      catchError(err => {
        console.error('Error en la actualizacion de Usuario:', err);
        return of(null);
      })
    ).subscribe(response => {
        const datosGuardar = this.usuario;
        localStorage.setItem('usuario', JSON.stringify(datosGuardar));
        console.log('Usuario actualizado:', datosGuardar);
      },
      error => {
        console.error('Error:', error);
        alert(`Error al actualizar: ${error}`);
    });
  }

  cancelar(): void {
    this.cargarDatosUsuario();
    this.router.navigate(['/home']);
  }
}
