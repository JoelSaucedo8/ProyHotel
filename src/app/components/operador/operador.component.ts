import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OperadorService } from 'src/app/services/operador.service';

@Component({
  selector: 'app-operador',
  templateUrl: './operador.component.html',
  styleUrls: ['./operador.component.css']
})
export class OperadorComponent implements OnInit {
  checkinForm: FormGroup;
  checkoutForm: FormGroup;
  reservaForm: FormGroup;
  modificarUsuarioForm: FormGroup;
  habitaciones: any[] = [];
  usuario: any = null;
  mensaje: string = '';
  dniCheckin: any;
  habitacionCheckin: any;
  dniCheckout: any;
  habitacionCheckout: any;
  dniReserva: any;
  huespedEncontrado: any;
  dniUsuario: any;
  usuarioEncontrado: any;

  constructor(
    private fb: FormBuilder,
    private operadorService: OperadorService
  ) {
    this.checkinForm = this.fb.group({ dni: [''] });
    this.checkoutForm = this.fb.group({ dni: [''], habitacion: [''] });
    this.reservaForm = this.fb.group({ dni: [''], nombre: [''], apellido: [''] });
    this.modificarUsuarioForm = this.fb.group({ dni: [''], nombre: [''], apellido: [''], email: [''] });
  }

  ngOnInit(): void {}

  buscarCheckin() {
    const dni = this.checkinForm.value.dni;
    this.operadorService.buscarHabitacionPorDNI(dni).subscribe(response => {
      this.habitaciones = response;
    }, error => {
      this.mensaje = 'No se encontró ninguna habitación para el DNI ingresado';
    });
  }

  realizarCheckin(habitacionId: number) {
    this.operadorService.checkinHabitacion(habitacionId).subscribe(response => {
      this.mensaje = 'Check-in realizado con éxito';
      return response
    }, error => {
      this.mensaje = 'Error al realizar el check-in';
      return error
    });
  }

  buscarCheckout() {
    const dni = this.checkoutForm.value.dni;
    const habitacion = this.checkoutForm.value.habitacion;
    this.operadorService.buscarHabitacionPorDNIoNumero(dni, habitacion).subscribe(response => {
      this.habitaciones = response;
    }, error => {
      this.mensaje = 'No se encontró ninguna habitación para los datos ingresados';
    });
  }

  realizarCheckout(habitacionId: number) {
    this.operadorService.checkoutHabitacion(habitacionId).subscribe(response => {
      this.mensaje = 'Check-out realizado con éxito';
    }, error => {
      this.mensaje = 'Error al realizar el check-out';
    });
  }

  reservarHabitacion() {
    const datos = this.reservaForm.value;
    this.operadorService.registrarHuesped(datos).subscribe(response => {
      this.mensaje = 'Huésped registrado y reserva creada con éxito';
    }, error => {
      this.mensaje = 'Error al realizar la reserva';
    });
  }

  buscarUsuario() {
    const dni = this.modificarUsuarioForm.value.dni;
    this.operadorService.buscarUsuario(dni).subscribe(response => {
      this.usuario = response;
      this.modificarUsuarioForm.patchValue(response);
    }, error => {
      this.mensaje = 'Usuario no encontrado';
    });
  }


  modificarUsuario() {
    const datos = this.modificarUsuarioForm.value;
    this.operadorService.actualizarUsuario(datos).subscribe(response => {
      this.mensaje = 'Usuario actualizado con éxito';
    }, error => {
      this.mensaje = 'Error al actualizar el usuario';
    });
  }

  buscarHuesped() {

  }

  registrarHuesped() {

  }

  editarUsuario() {
    
  }
}