export interface User {
    dni: number;
    nombre: string;
    apellido: string;
    email: string;
    fecha_nacimiento: Date;
    telefono: number;
    password: string;
    rol: string; // 'Operador', 'Huesped', 'Administrador'
  }