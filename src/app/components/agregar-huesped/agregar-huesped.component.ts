import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Huesped } from 'src/app/interfaces/huesped.interface';
import { HuespedService } from 'src/app/services/huesped.service';
import { Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-agregar-huesped',
  templateUrl: './agregar-huesped.component.html',
  styleUrls: ['./agregar-huesped.component.css']
})
export class AgregarHuespedComponent {
  huespedForm: FormGroup;

  @Output() huespedesAgregados = new EventEmitter<Huesped[]>();

  constructor(private fb: FormBuilder, private huespedService: HuespedService, private router: Router) {
    this.huespedForm = this.fb.group({
      huespedes: this.fb.array([]),
    });
  }

  get huespedes() {
    return this.huespedForm.get('huespedes') as FormArray;
  }

  // Función separada para agregar huéspedes con el ID de reserva correcto
    // agregarHuespedes(): void {
    //   const idReserva = localStorage.getItem('id_reserva'); // Obtener ID reserva del LocalStorage
    
    //   if (!idReserva) {
    //     alert('❌ No se encontró la ID de reserva. Crea la reserva primero.');
    //     return;
    //   }
    
    //   // Asignar id_reserva a cada huésped
    //   const huespedesConReserva = this.huespedes.map(huesped => ({
    //     ...huesped,
    //     id_reserva: idReserva
    //   }));
    
    //   if (huespedesConReserva.length > 0) {
    //     const agregarHuespedes$ = huespedesConReserva.map(huesped => 
    //       this.huespedService.agregarHuespedes(huesped)
    //     );
    
    //     forkJoin(agregarHuespedes$).subscribe({
    //       next: (responses) => {
    //         const todosHuespedesAgregados = responses.every(response => response?.codigo === 200);
    //         if (todosHuespedesAgregados) {
    //           alert('✅ Reserva y huéspedes creados con éxito.');
    //           localStorage.removeItem('id_reserva'); // Limpia el ID de reserva
    //           this.router.navigate(['/resumen-reserva']); // Redirige a la página de confirmación
    //         } else {
    //           alert('⚠️ Hubo un problema al agregar los huéspedes.');
    //         }
    //       },
    //       error: (err) => {
    //         console.error('Error al agregar huéspedes:', err);
    //         alert('❌ No se pudo agregar a los huéspedes. Verifique la conexión.');
    //       }
    //     });
    //   }
    // }

    agregarHuesped(): void {
      const nuevoHuesped = this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8)]],
      });
    
      this.huespedes.push(nuevoHuesped);
    }    

  eliminarHuesped(index: number): void {
    this.huespedes.removeAt(index);
  }

  confirmarEliminar(index: number): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al huésped ${index + 1}?`)) {
      this.eliminarHuesped(index);
    }
  }
  
  enviarHuespedes(): void {
    const idReserva = localStorage.getItem('id_reserva');
    
    if (!idReserva) {
      alert('❌ No se encontró la ID de reserva. Crea la reserva primero.');
      return;
    }
  
    // Mapear los huéspedes con la interfaz
    const huespedesConReserva: Huesped[] = this.huespedForm.value.huespedes.map((huesped: Huesped) => ({
      ...huesped,
      id_reserva: idReserva
    }));
  
    if (huespedesConReserva.length > 0) {
      const agregarHuespedes$ = huespedesConReserva.map((huesped: Huesped) => 
        this.huespedService.agregarHuespedes(huesped)
      );
  
      forkJoin(agregarHuespedes$).subscribe({
        next: (responses) => {
          const todosHuespedesAgregados = responses.every(response => response?.codigo === 200);
          if (todosHuespedesAgregados) {
            alert('✅ Reserva y huéspedes creados con éxito.');
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
  
  // Actualizar el FormArray de huéspedes en la reserva según la cantidad de personas
  actualizarHuespedesReserva(cantidad: number): void {
    const huespedesArray = this.huespedForm.get('huespedes') as FormArray;
  
    for (let i = 0; i < cantidad; i++) {
      const huespedForm = this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        dni: ['', Validators.required]
      });
      huespedesArray.push(huespedForm); // Añadir cada huésped al FormArray
    }
  }

  // enviarHuespedes(): void {
  //   if (this.huespedes.length === 0) {
  //     alert('⚠️ Debes agregar al menos un huésped.');
  //     return;
  //   }
  
  //   if (this.huespedForm.valid) {
  //     this.huespedesAgregados.emit(this.huespedForm.value.huespedes);
  //     alert('✅ Huéspedes enviados correctamente.');
  //     this.huespedForm.reset();
  //     this.huespedes.clear();
  //   }
  // }
}
