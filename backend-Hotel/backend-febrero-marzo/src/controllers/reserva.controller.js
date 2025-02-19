import { getConnection } from "./../database/database";
const secret = process.env.secret;
const jwt = require ("jsonwebtoken");

// Obtener reserva
const obtenerReservas = async (req, res) => {
    try{
        
        const resultadoVerificar = verificarToken(req);
        if(resultadoVerificar.estado == false){
            return res.send({codigo: -1, mensaje: resultadoVerificar.error})
        }
        const connection = await getConnection();
        const response = await connection.query("SELECT * from reserva");
        res.json({codigo: 200, mensaje: "OK", payload:  response});
    }
    catch(error){
            res.status(500);
            res.send(error.message);
    }
}

function verificarToken(req){
    const token = req.headers.authorization;
    if(!token){
        return {estado: false, error: "Token no proporcionado"}
    }
    try{
        const payload = jwt.verify(token, secret);
        if(Date.now() > payload.exp){
            return {estado: false, error: "Token expirado"}
        }
        return {estado: true};
    }
    catch(error){
        return {estado: false, error: "Token inválido"}
    }  

}


// Obtener reserva
const obtenerReservaUsuario = async (req, res) => {
    try{

        const resultadoVerificar = verificarToken(req);
        if(resultadoVerificar.estado == false){
            return res.send({codigo: -1, mensaje: resultadoVerificar.error})
        }
        const {id} = req.params
        const connection = await getConnection();
        const response = await connection.query("SELECT u.nombre AS usuario_nombre, u.apellido AS usuario_apellido, r.fecha_inicio, r.fecha_fin, ha.tipo AS habitacion_tipo FROM usuario u JOIN reserva r ON r.id_usuario = u.id_usuario JOIN habitacion ha ON r.id_habitacion = ha.id_habitacion WHERE u.id_usuario = ?",id);
        if(response.length == 1){
            res.json({codigo: 200, mensaje:"OK", payload: response})
        }
        else{
            res.json({codigo: -1, mensaje:"Reserva no encontrada", payload: []})
        }
    }
    catch(error){
            res.status(500);
            res.send(error.message);
    }
}



//crear reserva
const crearReserva = async (req, res) => {
    console.log("Datos recibidos:", req.body); // Para verificar los datos recibidos
    try {
        const {
            id_habitacion,
            id_usuario,
            fecha_inicio,
            fecha_fin
        } = req.body;

        const reserva = { id_habitacion, id_usuario, fecha_inicio, fecha_fin };
        console.log('reserva',reserva)
        const connection = await getConnection();
        const response = await connection.query("INSERT INTO reserva SET ?", reserva);

        res.json({
            codigo: 200,
            mensaje: "Reserva añadida",
            payload: [{ id_reserva: response.insertId }]});
    } catch (error) {
        console.error("Error al crear la reserva:", error.message);
        res.status(500).send({ mensaje: "Error al crear la reserva", error: error.message });
    }
};


//UPDATE (todos los campos)
const actualizarReserva = async (req, res) => {
    try{
        const resultadoVerificar = verificarToken(req);
        if(resultadoVerificar.estado == false){
            return res.send({codigo: -1, mensaje: resultadoVerificar.error})
        }
        console.log(req.params);
        const {id} = req.params;
        const {
            id_habitacion,
            id_usuario,
            fecha_inicio,
            fecha_fin,
            id_reserva_huesped,
        } = req.body

        const reserva = {
            id_habitacion,
            id_usuario,
            fecha_inicio,
            fecha_fin,
            id_reserva_huesped,
        }

        const connection = await getConnection();
        await connection.query("UPDATE reserva set ? where id_reserva = ?",[reserva,id])
        res.json ({codigo: 200, mensaje: "Reserva modificada", payload: []});
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}



export const methods = {
    obtenerReservas,
    crearReserva,
    actualizarReserva,
    obtenerReservaUsuario
};