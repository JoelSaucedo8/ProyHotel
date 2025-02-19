import { getConnection } from "./../database/database";
const secret = process.env.secret;
const jwt = require ("jsonwebtoken");

// Obtener habitaciones
const obtenerHabitaciones = async (req, res) => {
    try{
        
        const connection = await getConnection();
        const response = await connection.query("SELECT * from habitacion");
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

// Obtener usuarios
const obtenerHabitacion = async (req, res) => {
    try{

        const resultadoVerificar = verificarToken(req);
        if(resultadoVerificar.estado == false){
            return res.send({codigo: -1, mensaje: resultadoVerificar.error})
        }
        const {id} = req.params
        const connection = await getConnection();
        const response = await connection.query("SELECT * from habitacion where id_habitacion = ?",id);
        if(response.length == 1){
            res.json({codigo: 200, mensaje:"OK", payload: response})
        }
        else{
            res.json({codigo: -1, mensaje:"Habitación no encontrada", payload: []})
        }
    }
    catch(error){
            res.status(500);
            res.send(error.message);
    }
}

//crear usuario
const crearHabitacion= async (req, res) => {
    try{
        const {
            numero,
            tipo,
            cantidad_camas_simples,
            cantidad_camas_dobles,
            estado,
        } = req.body

        const habitacion = {
            numero,
            tipo,
            cantidad_camas_simples,
            cantidad_camas_dobles,
            estado,
        }

        const connection = await getConnection();
        const response = await connection.query("INSERT INTO habitacion set ?",habitacion)
        res.json ({codigo: 200, mensaje: "Habitación añadida", payload: [{id_habitacion: response.insertId}]});
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

//UPDATE (todos los campos)
const actualizarHabitacion = async (req, res) => {
    try{
        const resultadoVerificar = verificarToken(req);
        if(resultadoVerificar.estado == false){
            return res.send({codigo: -1, mensaje: resultadoVerificar.error})
        }
        console.log(req.params);
        const {id} = req.params;
        const {
            numero,
            tipo,
            cantidad_camas_simples,
            cantidad_camas_dobles,
            estado,
        } = req.body

        const usuario = {
            numero,
            tipo,
            cantidad_camas_simples,
            cantidad_camas_dobles,
            estado,
        }

        const connection = await getConnection();
        await connection.query("UPDATE habitacion set ? where id_habitacion = ?",[usuario,id])
        res.json ({codigo: 200, mensaje: "Habitacion modificada", payload: []});
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}



export const methods = {
    obtenerHabitaciones,
    crearHabitacion,
    actualizarHabitacion,
    obtenerHabitacion
};