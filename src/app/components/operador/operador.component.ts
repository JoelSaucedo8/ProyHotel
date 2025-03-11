import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Huesped } from 'src/app/interfaces/huesped.interface';
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import { OperadorService } from 'src/app/services/operador.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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
  criterioBusqueda: string = '';
  
  
  dniReserva: any;
  huespedEncontrado: any;
  dniUsuario: any;
  usuarioEncontrado: any;

  // Check-in Buscar habitacion por dni de Huesped y obtener habitaciones
  dniCheckin: any;
  habitacionCheckin: any;

  // Check-out Buscar habitacion por dni de Huesped y numero de habitacion
  dniCheckout: any;
  habitacionCheckout: any;

  // interface
  huesped: Huesped[] = [];

  // Obtenemos el ID del usuario seleccionado
  idUsuarioSeleccionado: number | null = null;

  constructor(
    private fb: FormBuilder,
    private operadorService: OperadorService,
    private habitacionService: HabitacionesService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.checkinForm = this.fb.group({ dni: [''] });
    this.checkoutForm = this.fb.group({ dni: [''], habitacion: [''] });
    this.reservaForm = this.fb.group({ dni: [''], nombre: [''], apellido: [''] });
    this.modificarUsuarioForm = this.fb.group({
      dni: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      rol: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  obtenerReservas() {
    this.operadorService.obtenerReservas().subscribe(response => {
      // this.habitaciones = response;
      console.log("Reservas:", response);
    }, error => {
      this.mensaje = 'Error al obtener las reservas';
    });
  }

  buscarCheckin() {
    const dniHuesped = Number(this.dniCheckin); // Verifica que coincida con el nombre del campo
    this.obtenerReservas();
    const idReserva = localStorage.getItem('id_reserva');
  
    console.log("DNI de huesped capturado:", dniHuesped); // Log para depurar
    console.log("ID de reserva obtenido:", idReserva);
  
    if (idReserva) {
      this.operadorService.obtenerHuespedReserva(idReserva).subscribe(response => {
        console.log("Respuesta del servicio:", response);
        
        if (response.codigo === 200 && response.payload.length > 0) {
          console.log("Huéspedes encontrados:", response.payload);
          const idHabitacion = response.payload[0].id_habitacion;
          this.obtenerHabitaciones(idHabitacion);
        } else {
          this.mensaje = 'No se encontraron huéspedes para la reserva';
        }
      });
    } else {
      console.log("ID de reserva no encontrado o es undefined");
    }
  }
  
  obtenerHabitaciones(idHabitacion: number) {
    // Aquí podrías hacer la lógica para obtener las habitaciones relacionadas con ese id_huesped
    this.habitacionService.obtenerHabitacionId(idHabitacion).subscribe(
      (habitacion) => {
        console.log("Habitacion :", habitacion);
        this.habitacionCheckin = habitacion[0];
        // Aquí puedes manejar el resultado de las habitaciones obtenidas

        // Forzar actualización en la vista
      this.cd.detectChanges();
      },
      (error) => {
        console.error("Error al obtener habitaciones:", error);
      }
    );
  }

  actualizarEstadoDeHabitacion(id_habitacion: number): void {
    const tipo = localStorage.getItem('tipo');
    const cant_cama_simple = localStorage.getItem('cant_camas_simples');
    const cant_cama_doble = localStorage.getItem('cant_camas_dobles');
    const numero = localStorage.getItem('numero');
    const estado = localStorage.getItem('estado');
  
    const idHabitacion = Number(id_habitacion);
  
    let nuevoEstado;
  
    if (estado === 'disponible') {
      nuevoEstado = {
        tipo: tipo,
        cantidad_camas_simples: cant_cama_simple,
        cantidad_camas_dobles: cant_cama_doble,
        numero: numero,
        estado: 'ocupado'
      };
    } else if (estado === 'ocupado') {
      nuevoEstado = {
        tipo: tipo,
        cantidad_camas_simples: cant_cama_simple,
        cantidad_camas_dobles: cant_cama_doble,
        numero: numero,
        estado: 'disponible'
      };
    } else {
      alert('❌ La habitación ya está ocupada o el estado es inválido.');
      return; // Salimos de la función si no es un estado válido
    }
  
    this.habitacionService.actualizarHabitacion(idHabitacion, nuevoEstado).subscribe(
      (response) => {
        console.log("Estado de la habitación actualizado con éxito:", response);
      },
      (error) => {
        console.error("Error al actualizar el estado de la habitación:", error);
        alert('❌ No se pudo actualizar el estado de la habitación.');
      }
    );
  }
  
  
  

  realizarCheckin(habitacionId: number) {
    this.habitacionService.obtenerHabitacionId(habitacionId).subscribe(
      (habitacion) => {
        this.actualizarEstadoDeHabitacion(habitacionId);
        console.log("Habitacion :", habitacion);
        this.mensaje = 'Check-in realizado con éxito';
      },
      (error) => {
        console.error("Error al obtener habitaciones:", error);
      }
    );
  }

  buscarCheckout() {
    // const dni = this.checkoutForm.value.dni;
    // const habitacion = this.checkoutForm.value.habitacion;
    // this.operadorService.buscarHabitacionPorDNIoNumero(dni, habitacion).subscribe(response => {
    //   this.habitaciones = response;
    // }, error => {
    //   this.mensaje = 'No se encontró ninguna habitación para los datos ingresados';
    // });
  }

  realizarCheckout(habitacionId: number) {
    this.habitacionService.obtenerHabitacionId(habitacionId).subscribe(
      (habitacion) => {
        this.actualizarEstadoDeHabitacion(habitacionId);
        console.log("Habitacion :", habitacion);
        this.mensaje = 'Check-in realizado con éxito';
      },
      (error) => {
        console.error("Error al obtener habitaciones:", error);
      }
    );
  }

  altaHuesped() {
    this.router.navigate(['/register']);
  } 

  buscarUsuario(criterio: string): void {
    if (!criterio) {
      alert('❌ Debes ingresar un DNI, nombre o apellido.');
      return;
    }
  
    this.usuarioService.obtenerUsuarios().subscribe(
      (response) => {
        if (response && response.payload) {
          const usuariosFiltrados = response.payload.filter((usuario: any) => 
            usuario.dni?.toString().includes(criterio) ||
            usuario.nombre?.toLowerCase().includes(criterio.toLowerCase()) ||
            usuario.apellido?.toLowerCase().includes(criterio.toLowerCase())
          );
  
          if (usuariosFiltrados.length > 0) {
            const usuarioEncontrado = usuariosFiltrados[0];
            console.log('👤 Usuarios encontrados:', usuariosFiltrados);
            this.idUsuarioSeleccionado = usuarioEncontrado.id_usuario;
            this.cd.detectChanges();
          } else {
            alert('❌ No se encontraron usuarios con ese criterio.');
          }
        }
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
        alert('❌ Error al buscar usuarios.');
      }
    );
  }

  buscar(): void {
    const criterio = this.criterioBusqueda.trim();
    this.buscarUsuario(criterio);
  }  

  actualizarUsuario(): void {
    if (!this.idUsuarioSeleccionado) {
      alert("No hay usuario seleccionado para actualizar.");
      return;
    }
  
    // Obtener los datos directamente del formulario
    const nuevosDatos = this.modificarUsuarioForm.value;
  
    // Llamar al servicio para actualizar el usuario
    this.operadorService.actualizarUsuario(this.idUsuarioSeleccionado, nuevosDatos).subscribe(
      (response) => {
        console.log("Usuario actualizado con éxito:", response);
        alert("✅ Usuario actualizado correctamente");
      },
      (error) => {
        console.error("Error al actualizar usuario:", error);
        alert("❌ No se pudo actualizar el usuario.");
      }
    );
  }
}