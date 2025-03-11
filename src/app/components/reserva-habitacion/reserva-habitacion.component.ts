import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
//Services
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import { ReservaService } from 'src/app/services/reserva.service';
//Interface
import { reservaHuesped } from 'src/app/interfaces/reservahuesped.interface';
import { AgregarHuespedComponent } from '../agregar-huesped/agregar-huesped.component';
import { Habitacion } from 'src/app/interfaces/habitacion.interface';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-reserva-habitacion',
  templateUrl: './reserva-habitacion.component.html',
  styleUrls: ['./reserva-habitacion.component.css']
})
export class ReservaHabitacionComponent implements OnInit {

  @ViewChild(AgregarHuespedComponent) huespedesComponent!: AgregarHuespedComponent;

  mostrarPopupLogin = false;
  // Formulario para buscar disponibilidad
  busquedaForm!: FormGroup;
  // Formulario para hacer la reserva
  reservaForm!: FormGroup;
  
  // Lista de habitaciones disponibles filtradas
  habitacionesDisponibles: Habitacion[] = [];
  idHabitacionSeleccionada: number | null = null;
  
  // Indicador para mostrar el formulario de reserva
  mostrarReserva: boolean = false;
  
  Habitacion: Habitacion[] = [];
  reservaHuesped: reservaHuesped[] = [];
  // Almacenar la habitación seleccionada
  habitacionSeleccionada: any;

  // Definir la propiedad tiposCama
  tiposCama: { value: string; label: string }[] = [
    { value: 'simple', label: 'Simple' },
    { value: 'doble', label: 'Doble' }
  ];

  // Puedes tener también tiposHabitacion
  tiposHabitacion = [
    { value: 'dosPersonas', label: 'Dos Personas' },
    { value: 'tresPersonas', label: 'Tres Personas' },
  ];

  isLoggedIn$: Observable<boolean>;

  @ViewChild(AgregarHuespedComponent) agregarHuespedComponent!: AgregarHuespedComponent;

  constructor(
    private fb: FormBuilder,
    private habitacionService: HabitacionesService,
    private reservaService: ReservaService,
    private router: Router,
    private permisos: PermisosService
  ) {
    this.isLoggedIn$ = this.permisos.isLoggedIn$;
  }

  ngOnInit(): void {
    const id_user = localStorage.getItem('id')

    // Formulario de búsqueda
    this.busquedaForm = this.fb.group({
      fechaEntrada: ['', Validators.required],
      fechaSalida: ['', Validators.required],
      personas: ['', [Validators.required, Validators.min(1), Validators.max(3)]]
    });

    // Formulario de reserva: los campos pueden pre-cargarse cuando se selecciona una habitación
    this.reservaForm = this.fb.group({
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      id_usuario: [id_user],
      id_habitacion: [this.idHabitacionSeleccionada],
      tipoHabitacion: ['', Validators.required],
      tipoCama: ['', Validators.required],
    });
  }

  // Buscar disponibilidad: se llama al endpoint obtenerHabitaciones y se filtra
  buscarDisponibilidad(): void {
    if (this.busquedaForm.valid) {
      const { personas } = this.busquedaForm.value;
  
      this.habitacionService.obtenerHabitaciones().subscribe(
        (response: any) => {
          console.log("Respuesta de la API:", response);
  
          // Usar la respuesta completa como array
          const habitaciones = Array.isArray(response) ? response : [];
  
          // Filtrar habitaciones disponibles según la cantidad de personas
          this.habitacionesDisponibles = habitaciones.filter((hab: any) => {
            if (!hab || hab.tipo === undefined || hab.estado === undefined) {
              console.warn("Habitación con datos inválidos:", hab);
              return false;
            }
  
            if (Number(personas) === 2 || Number(personas) === 1) {
              return hab.tipo === 'dosPersonas' && hab.estado === 'disponible';
            } else if (Number(personas) === 3) {
              return hab.tipo === 'tresPersonas' && hab.estado === 'disponible';
            }
            return false;
          });
  
          // Mostrar alerta si no hay habitaciones disponibles
          if (this.habitacionesDisponibles.length === 0) {
            alert('No hay habitaciones disponibles para esos criterios.');
          } else {
            console.log("Habitaciones disponibles:", this.habitacionesDisponibles);
          }
        },
        error => {
          console.error('Error al obtener disponibilidad:', error);
          alert('Error al buscar disponibilidad.');
        }
      );
    } else {
      alert('Por favor, complete todos los campos.');
    }
  }
  
  

  // Al seleccionar una habitación, se muestra el formulario de reserva
  seleccionarHabitacion(habitacion: any): void {
    // Verificar si el usuario está logueado (token en localStorage)
    if (!localStorage.getItem('token')) {
      console.log("Usuario no autenticado. Mostrando pop-up de login...");
      this.mostrarPopupLogin = true;
    }
  
    if (!habitacion || !habitacion.id_habitacion) {
      console.warn("La habitación seleccionada no tiene un ID válido:", habitacion);
      return;
    }
  
    this.idHabitacionSeleccionada = Number(habitacion.id_habitacion);
    console.log("ID de la habitación seleccionada:", this.idHabitacionSeleccionada);
  
    // Llamar a obtenerHabitacionId para obtener más detalles de la habitación
    this.habitacionService.obtenerHabitacionId(this.idHabitacionSeleccionada).subscribe(
      (response: any) => {
        if (response) {
          this.habitacionSeleccionada = response;
          console.log("Detalles de la habitación seleccionada:", this.habitacionSeleccionada);
        } else {
          console.warn("No se encontraron detalles para la habitación seleccionada.");
        }
      },
      error => {
        console.error("Error al obtener detalles de la habitación:", error);
      }
    );
  
    // Pre-cargar el formulario de reserva con la información de búsqueda y de la habitación
    this.habitacionSeleccionada = habitacion;
    const busqueda = this.busquedaForm.value;
    this.reservaForm.patchValue({
      fecha_inicio: busqueda.fechaEntrada,
      fecha_fin: busqueda.fechaSalida,
      id_habitacion: this.idHabitacionSeleccionada,
      tipoHabitacion: habitacion.tipo,
      tipoCama: habitacion.cantidad_camas_simples === 2 ? 'simple' : 'doble',
    });
  
    this.mostrarReserva = true;
  }
  

  // Enviar la reserva
  reserva(): void {
  if (this.reservaForm.valid) {
    this.reservaService.crearReserva(this.reservaForm.value).pipe(
      map(response => {
        if (response?.codigo === 200 && response?.payload[0]?.id_reserva) {
          this.actualizarEstadoDeHabitacion();
          localStorage.setItem('id_reserva', response.payload[0].id_reserva); // Guardar ID en localStorage
          this.router.navigate(['/agregar-huesped']); // Redirigir al componente de huéspedes
        } else {
          throw new Error('No se pudo obtener el ID de la reserva.');
        }
      })
    ).subscribe({
      error: (err) => {
        console.error('Error al crear la reserva:', err);
        alert('❌ No se pudo completar la operación. Verifique la conexión.');
      }
    });
  } else {
    alert('⚠️ Por favor, complete todos los campos de la reserva.');
  }
}

// Función para crear la reserva
crearReserva(): void {
  console.time("Tiempo de envío de reserva");

  this.reservaService.crearReserva(this.reservaForm.value).subscribe(
    (response) => {
      console.timeEnd("Tiempo de envío de reserva");
      console.log('Respuesta del servidor:', response);
      
      if (response && response.codigo === 200) {
        alert('✅ Reserva creada con éxito.');
      } else {
        alert('⚠️ Error al crear la reserva. Intente nuevamente.');
      }
    },
    (error) => {
      console.timeEnd("Tiempo de envío de reserva");
      console.error('Error al enviar la reserva:', error);
      alert('❌ No se pudo procesar la reserva. Verifique su conexión.');
    }
  );
}

crearReservaHuesped(reservaHuesped: reservaHuesped[]): void {
  const idReserva = localStorage.getItem('id_reserva');
  const idHuesped = localStorage.getItem('id_huesped');
  
  if (idReserva && idHuesped) {
    const reservaData = reservaHuesped.map(huesped => ({
      id_reserva: idReserva,
      id_huesped: huesped.id_huesped
    }));
    
    this.reservaService.crearReservaHuesped(reservaData).subscribe(
      (response) => {
        console.log("Reserva creada con éxito:", response);
      },
      (error) => {
        console.error("Error al crear la reserva:", error);
      }
    );
  } else {
    console.error("ID de reserva o huésped no encontrado en localStorage");
  }
}

actualizarEstadoDeHabitacion(): void {
  const tipo = localStorage.getItem('tipo');
  const cant_cama_simple = localStorage.getItem('cant_camas_simples');
  const cant_cama_doble = localStorage.getItem('cant_camas_dobles');
  const numero = localStorage.getItem('numero');

  const nuevoEstado = { tipo: tipo,cantidad_camas_simples: cant_cama_simple, 
    cantidad_camas_dobles: cant_cama_doble, numero: numero, estado: 'ocupado' };
  const idHabitacion = Number(this.idHabitacionSeleccionada);
  

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


  // Cancelar la reserva (vuelve al buscador)
  cancelar(): void {
    this.mostrarReserva = false;
  }

  cerrarPopupLogin() {
    this.mostrarPopupLogin = false;
  }
}