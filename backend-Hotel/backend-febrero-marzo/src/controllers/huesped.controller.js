import { getConnection } from "./../database/database";
const secret = process.env.secret;
const jwt = require ("jsonwebtoken");

// Obtener huespedes por reserva
const obtenerHuespedReserva = async (req, res) => {
    try{
        
        const resultadoVerificar = verificarToken(req);
        if(resultadoVerificar.estado == false){
            return res.send({codigo: -1, mensaje: resultadoVerificar.error})
        }
        const {id} = req.params
        const connection = await getConnection();
        const response = await connection.query("SELECT * FROM huesped h JOIN reserva_huesped rh on h.id_huesped = rh.id_huesped JOIN reserva r ON r.id_reserva = rh.id_reserva WHERE r.id_reserva = ?" , id);
        if(response.length == 1){
            res.json({codigo: 200, mensaje:"OK", payload: response})
        }
        else{
            res.json({codigo: -1, mensaje:"Huespedes no encontrados", payload: []})
        }
      
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


//crear huespedes
const agregarHuespedes= async (req, res) => {
    try{
        const {
            nombre,
            apellido,
            dni
        } = req.body

        const huesped = {
            nombre,
            apellido,
            dni
        }

        const connection = await getConnection();
        const response = await connection.query("INSERT INTO huesped set ?",huesped)
        res.json ({codigo: 200, mensaje: "Huesped añadida", payload: [{id_huesped: response.insertId}]});
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}

//UPDATE (todos los campos)
const actualizarHuespedes= async (req, res) => {
    try{
        const resultadoVerificar = verificarToken(req);
        if(resultadoVerificar.estado == false){
            return res.send({codigo: -1, mensaje: resultadoVerificar.error})
        }
        console.log(req.params);
        const {id} = req.params;
        const {
            nombre,
            apellido,
            dni,
            id_reserva_huesped
        } = req.body

        const huesped = {
            nombre,
            apellido,
            dni,
            id_reserva_huesped
        }

        const connection = await getConnection();
        await connection.query("UPDATE huesped set ? where id_habitacion = ?",[huesped,id])
        res.json ({codigo: 200, mensaje: "Huespedes modificados", payload: []});
    }
    catch(error){
        res.status(500);
        res.send(error.message);
    }
}



export const methods = {
    obtenerHuespedReserva,
    agregarHuespedes,
    actualizarHuespedes
};