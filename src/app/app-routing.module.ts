import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { OperadorComponent } from './components/operador/operador.component';
import { EditarperfilComponent } from './components/editarperfil/editarperfil.component';
import { AgregarHuespedComponent } from './components/agregar-huesped/agregar-huesped.component';
import { ReservaHabitacionComponent } from './components/reserva-habitacion/reserva-habitacion.component';
// import { PermisosGuard } from './guards/permisos.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'operador', component: OperadorComponent},
  { path: 'editarperfil', component: EditarperfilComponent},
  { path: 'agregar-huesped', component: AgregarHuespedComponent},
  { path: 'reserva-habitacion', component: ReservaHabitacionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
