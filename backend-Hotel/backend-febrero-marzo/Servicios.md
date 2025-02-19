- Gestión de Usuarios:
    . GET - /api/obtenerUsuarios

    . GET - /api/obtenerUsuario/:id

    . POST - /api/crearUsuario
        body:
        {
            "nombre": string,
            "apellido": string,
            "dni": string,
            "fecha_nacimiento": date,
            "password": string,
            "email": string,
            "telefono": string,
            "rol": string
        }
    . PUT - /actualizarUsuario/:id
        body:
        {
            "nombre": string,
            "apellido": string,
            "dni": string,
            "fecha_nacimiento": date,
            "password": string,
            "email": string,
            "telefono": string,
            "rol": string
        }
- Login
    . POST - /api/login
    body:
    {
        usuario: string,
        password: string
    }
    . PUT - /api/resetearPassword/:id
    body: {
        password: string
    }
- Gestion de Habitaciones:
    . GET - /api/obtenerHabitaciones
    . GET - /api/obtenerHabitacion/:id
    . POST - /api/crearHabitacion
            body:
            {
               numero: int
               tipo: string,
               cantidad_camas_simples: int
               cantidad_camas_dobles: int
               estado: string
            }
    . PUT - /actualizarHabitacion/:id
            body:
            {
               numero: int
               tipo: string,
               cantidad_camas_simples: int
               cantidad_camas_dobles: int
               estado: string
            }
- Gestion de Reservas
. GET - /api/obtenerReservas
    . GET - /api/obtenerReservaUsuario/:id
    . POST - /api/crearReserva
            body:
            {
                id_habitacion,
                id_usuario,
                fecha_inicio,
                fecha_fin,
                id_reserva_huesped,
            }
    . PUT - /actualizarReserva/:id
            body:
            {
                id_habitacion,
                id_usuario,
                fecha_inicio,
                fecha_fin,
                id_reserva_huesped,
            }
- Gestion de Huesped
    . GET - /api/obtenerHuespedReserva/:id
    . POST - /api/agregarHuespedes
            body:
            {
                nombre,
                apellido,
                dni,
                id_reserva_huesped
            }
    . PUT - /actualizarHuespedes/:id
            body:
            {
                nombre,
                apellido,
                dni,
                id_reserva_huesped
            }
