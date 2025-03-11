import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PermisosService } from 'src/app/services/permisos.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean>; // Observable que indica si el usuario está logueado
  userName = 'Usuario'; // Nombre del usuario
  userType = 'Tipo de Usuario'; // Rol del usuario
  showTooltip = false; // Indica si se muestra la información del usuario

  constructor(private router: Router, private permisos: PermisosService, private dialog: MatDialog) {
    this.isLoggedIn$ = this.permisos.isLoggedIn$;
  }
  
  ngOnInit(): void {
    this.permisos.isLoggedIn$.subscribe(isLoggedIn => {
      // Si el usuario está logueado, obtiene el nombre y el rol del usuario
      if (isLoggedIn) {
        const userName = localStorage.getItem('nombre'); // Obtiene el nombre del usuario
        const userType = localStorage.getItem('rol'); // Obtiene el rol del usuario
        this.userName = userName ? userName : 'Usuario'; // Si no hay nombre, muestra 'Usuario'
        this.userType = userType ? userType : 'Tipo de Usuario'; // Si no hay rol, muestra 'Tipo de Usuario'
      }
    });
  }  

  // Abrir popup de login
  abrirLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '300px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo de login fue cerrado'); 
    });
  }

  abrirRegistro(): void {
    this.dialog.open(RegisterComponent, {
      width: '500px',   // Ancho fijo
      maxWidth: '90vw', // Máximo ancho (para que no se haga gigante en pantallas grandes)
      height: '90vh',   // Altura automática según el contenido
      maxHeight: '90vh',
      disableClose: true // Para que no se cierre clickeando fuera
    });
  }

  openModifyProfile() {
    this.router.navigate(['/editarperfil']); // Redirige a la página de edición de perfil
  }

  // Mostrar información de usuario
  showUserInfo() {
    this.showTooltip = true;
  }

  // Ocultar información de usuario
  hideUserInfo() {
    this.showTooltip = false;
  }

  // Cerrar la sesión
  logout() {
    this.permisos.logout();
  }
}
