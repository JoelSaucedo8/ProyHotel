import { Component } from '@angular/core';
import { catchError, of } from 'rxjs';
import { HabitacionesService } from 'src/app/services/habitaciones.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  // Variables para los valores seleccionados
  tipoHabitacion: string = ''; // Tipo de habitación seleccionada
  tipoCama: string = ''; // Tipo de cama seleccionada
  numeroHabitacion: string = ''; // Número de habitación

  // Opciones de camas según el tipo de habitación
  opcionesCamas: { [key: string]: { label: string; value: string; camasSimples: number; camasDobles: number }[] } = {
    dosPersonas: [
      { label: '2 camas simples', value: '2simples', camasSimples: 2, camasDobles: 0 },
      { label: '1 cama doble', value: '1doble', camasSimples: 0, camasDobles: 1 }
    ],
    tresPersonas: [
      { label: '3 camas simples', value: '3simples', camasSimples: 3, camasDobles: 0 },
      { label: '1 cama doble y 1 cama simple', value: '1doble1simple', camasSimples: 1, camasDobles: 1 }
    ]
  };

  // Inyección del servicio
  constructor(private habitacionesService: HabitacionesService) {}

  // Obtener las opciones de cama disponibles según el tipo de habitación seleccionado
  get opcionesCamasDisponibles() {
    return this.opcionesCamas[this.tipoHabitacion] || [];
  }

  // Método para guardar la habitación
  guardarHabitacion(): void {
    if (this.tipoHabitacion && this.tipoCama && this.numeroHabitacion !== null) {
      // Buscar la configuración de camas seleccionada
      const opcionSeleccionada = this.opcionesCamasDisponibles.find(opcion => opcion.value === this.tipoCama);

      if (!opcionSeleccionada) {
        alert('Configuración de camas inválida.');
        return;
      }

      // Crear el objeto habitación con los datos seleccionados
      const habitacion = {
        tipo: this.tipoHabitacion,
        cantidad_camas_simples: opcionSeleccionada.camasSimples,
        cantidad_camas_dobles: opcionSeleccionada.camasDobles,
        numero: this.numeroHabitacion,
        estado: 'disponible'
      };

      console.log('Datos enviados al body:', habitacion); // Verifica el body aquí

      // Llamar al servicio para guardar la habitación
      this.habitacionesService.crearHabitacion(habitacion)
      .pipe(
        catchError(err => {
          console.error('Error en la creación de la habitación:', err);
          return of(null);
        })
      )
      .subscribe((response: any) => {
          if(response) {
            console.log('Habitación creada con éxito:', response);
            alert('Habitación creada con éxito.');
            this.resetFormulario(); // Resetear el formulario después de guardar
          }
        });
  }
}

// Método para resetear el formulario
private resetFormulario() {
  this.tipoHabitacion = '';
  this.tipoCama = '';
}
}