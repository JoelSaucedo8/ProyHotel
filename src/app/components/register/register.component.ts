import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermisosService } from 'src/app/services/permisos.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog'; // Importar MatDialogRef

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre: string = '';
  apellido: string = '';
  fechaNacimiento: string = '';
  documento: string = '';
  correo: string = '';
  telefono: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private permisos: PermisosService,
    public dialogRef: MatDialogRef<RegisterComponent> // Para cerrar el diálogo
  ) {}

  closeRegister(): void {
    this.dialogRef.close(); // Cierra el pop-up
  }

  submitRegister(): void {
    if (!this.nombre || !this.apellido || !this.fechaNacimiento || !this.documento || !this.correo || !this.telefono || !this.password || !this.confirmPassword) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const userData = {
      dni: this.documento,
      apellido: this.apellido,
      nombre: this.nombre,
      fecha_nacimiento: this.fechaNacimiento,
      password: this.password,
      rol: 'huesped',
      email: this.correo,
      telefono: this.telefono
    };

    this.permisos.register(userData).pipe(
      catchError(err => {
        console.error('Error en el registro:', err);
        alert('Error al registrar. Inténtalo nuevamente.');
        return of(null);
      })
    ).subscribe((response: any) => {
      if (response) {
        console.log("Formulario de registro enviado");
        alert("Registro exitoso");
        this.dialogRef.close(); // Cierra el pop-up después del éxito
      }
    });
  }
}
