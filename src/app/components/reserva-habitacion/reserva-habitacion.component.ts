import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
//Services
import { HabitacionesService } from 'src/app/services/habitaciones.service';
import { ReservaService } from 'src/app/services/reserva.service';
import { HuespedService } from 'src/app/services/huesped.service';
//Interface
import { Huesped } from 'src/app/interfaces/huesped.interface';
import { response } from 'express';

@Component({
  selector: 'app-reserva-habitacion',
  templateUrl: './reserva-habitacion.component.html',
  styleUrls: ['./reserva-habitacion.component.css']
})
export class ReservaHabitacionComponent implements OnInit {
  // Formulario para buscar disponibilidad
  busquedaForm!: FormGroup;
  // Formulario para hacer la reserva
  reservaForm!: FormGroup;
  
  // Lista de habitaciones disponibles filtradas
  habitacionesDisponibles: any[] = [];
  idHabitacionSeleccionada: number | null = null;
  
  // Indicador para mostrar el formulario de reserva
  mostrarReserva: boolean = false;
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

  constructor(
    private fb: FormBuilder,
    private habitacionService: HabitacionesService,
    private reservaService: ReservaService,
    private huespedService: HuespedService,
    private router: Router
  ) {}

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
      cantidadHuespedes: ['', [Validators.required, Validators.min(1)]],
      huespedes: this.fb.array([])
    });
  }

  // Buscar disponibilidad: se llama al endpoint obtenerHabitaciones y se filtra
  buscarDisponibilidad(): void {
    if (this.busquedaForm.valid) {
      const {  personas } = this.busquedaForm.value;
  
      this.habitacionService.obtenerHabitaciones().subscribe(
        (response: any) => {
          console.log("Respuesta de la API:", response);
      
          // Extraemos el objeto si `response` es un array
          const data = Array.isArray(response) && response.length > 0 ? response[0] : response;
      
          // Creamos un array de habitaciones basado en la respuesta
          const habitaciones = [data]; // Como `response[0]` es una habitación, lo ponemos en un array
      
          this.habitacionesDisponibles = habitaciones.filter((hab: any) => {
      
            if (!hab || hab.cantidad_camas_simples === undefined || hab.cantidad_camas_dobles === undefined || hab.estado === undefined) {
              console.warn("Habitación con datos inválidos:", hab);
              return false;
            }
      
            if (Number(personas) === 2) {
              return (hab.cantidad_camas_simples === 2 || hab.cantidad_camas_dobles === 1) && hab.estado === 'disponible';
            } else if (Number(personas) === 3) {
              return (hab.cantidad_camas_simples === 3 ||
                (hab.cantidad_camas_dobles === 1 && hab.cantidad_camas_simples === 1)) && hab.estado === 'disponible';
            }
            return false;
          });
      
          if (this.habitacionesDisponibles.length === 0) {
            alert('No hay habitaciones disponibles para esos criterios.');
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

    // Verificar si el usuario está logueado (token en localStorage)
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    } else {
      this.habitacionSeleccionada = habitacion;
      // Pre-cargar el formulario de reserva con la información de búsqueda y de la habitación
      const busqueda = this.busquedaForm.value;
      this.reservaForm.patchValue({
        fecha_inicio: busqueda.fechaEntrada,
        fecha_fin: busqueda.fechaSalida,
        id_habitacion: this.idHabitacionSeleccionada,
        // Podemos deducir el tipo a partir de la habitación (por ejemplo, si el campo "tipo" ya existe en la habitación)
        tipoHabitacion: habitacion.tipo,
        // Para el tipo de cama, se puede derivar según la configuración de camas de la habitación
        tipoCama: habitacion.cantidad_camas_simples === 2 ? 'simple' : 'doble',
        cantidadHuespedes: busqueda.personas
      });
      // Inicializar el FormArray de huéspedes con la cantidad de personas seleccionada
      this.actualizarHuespedesReserva(busqueda.personas);
      this.mostrarReserva = true;
    }
  }

  // Getter para el FormArray de huespedes en el formulario de reserva
  get huespedes(): FormArray {
    return this.reservaForm.get('huespedes') as FormArray;
  }

  // Actualizar el FormArray de huéspedes en la reserva según la cantidad de personas
  actualizarHuespedesReserva(cantidad: number): void {
    const huespedesArray = this.huespedes;
    huespedesArray.clear();
    for (let i = 0; i < cantidad; i++) {
      huespedesArray.push(
        this.fb.group({
          nombre: ['', Validators.required],
          apellido: ['', Validators.required],
          dni: ['', Validators.required]
        })
      );
    }
  }

  // Enviar la reserva
  reserva(): void {
    if (this.reservaForm.valid) {
      this.reservaService.crearReserva(this.reservaForm.value).pipe(
        map(response => {
          console.log(response.payload.id_reserva)
          if (response?.codigo === 200) {
            // Obtener los huéspedes desde el formulario y asignarles el ID de la reserva
            return this.reservaForm.value.huespedes.map((huesped: any) => ({
              ...huesped
            }));
          } else {
            throw new Error('No se pudo obtener el ID de la reserva.');
          }
        })
      ).subscribe({
        next: (huespedes) => this.agregarHuespedes(huespedes),
        error: (err) => {
          console.error('Error al crear la reserva:', err);
          alert('❌ No se pudo completar la operación. Verifique la conexión.');
        }
      });
    } else {
      alert('⚠️ Por favor, complete todos los campos de la reserva.');
    }
  }
  
  
  // Función separada para agregar huéspedes con el ID de reserva correcto
  agregarHuespedes(huespedes: Huesped[]): void {
    if (huespedes.length > 0) {
      const agregarHuespedes$ = huespedes.map(huesped => this.huespedService.agregarHuespedes(huesped));
  
      forkJoin(agregarHuespedes$).subscribe({
        next: (responses) => {
          const todosHuespedesAgregados = responses.every(response => response?.codigo === 200);
          if (todosHuespedesAgregados) {
            alert('✅ Reserva y huéspedes creados con éxito.');
            this.router.navigate(['/resumen-reserva']); // Redirigir a una página de confirmación
          } else {
            alert('⚠️ Hubo un problema al agregar los huéspedes.');
          }
        },
        error: (err) => {
          console.error('Error al agregar huéspedes:', err);
          alert('❌ No se pudo agregar a los huéspedes. Verifique la conexión.');
        }
      });
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

          // Verificar si hay huéspedes en el formulario
          const huespedes: Huesped[] = this.reservaForm.value.huespedes.map((huesped: any) => ({
            nombre: huesped.nombre,
            apellido: huesped.apellido,
            dni: huesped.dni
          }));
          

        alert('✅ Reserva creada con éxito.');
        this.reservaForm.reset(); // Resetea el formulario
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

//Obtiene la reserva segun el usuario
  // obtenerIdReserva(): void{
  //   const id_user = Number(localStorage.getItem('id'));

  //   this.reservaService.obtenerReservaUsuarioId(id_user).subscribe(
      
  //   )
  // }

  // Cancelar la reserva (vuelve al buscador)
  cancelar(): void {
    this.mostrarReserva = false;
  }
}
