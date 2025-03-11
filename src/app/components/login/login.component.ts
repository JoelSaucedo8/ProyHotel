import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PermisosService } from 'src/app/services/permisos.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  documento: string = ''; 
  password: string = ''; 
  
  @Output() loginExitoso = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private permisosServices: PermisosService
  ) {}

  iniciar() {
  const user = {
    usuario: this.documento,
    password: this.password
  };

  console.log(user);

  this.permisosServices.login(user).subscribe({
    next: (data: any) => {
      console.log(data);
      console.log(data.payload[0].rol);
      console.log(data.payload[0].nombre);

      // Guardar los datos en localStorage
      localStorage.setItem('nombre', data.payload[0].nombre);
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('id', data.payload[0].id_usuario);
      localStorage.setItem('rol', data.payload[0].rol); // Asegúrate de guardar el rol correctamente

      // Emitir evento de login exitoso
      this.loginExitoso.emit();

      // Cerrar el pop-up
      this.dialogRef.close();

      // Redirigir según el rol
      if (data.payload[0].rol === 'admin') {
        this.router.navigate(['/admin']);
      } else if (data.payload[0].rol === 'operador') {
        this.router.navigate(['/operador']);
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: (err: any) => {
      console.error('Error during login:', err);
    }
  });
}


  cerrar(): void {
    this.dialogRef.close(); 
  }
}
