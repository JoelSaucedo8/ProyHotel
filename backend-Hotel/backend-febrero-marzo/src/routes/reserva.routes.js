import { Router } from "express";
import { methods as reservaController} from "./../controllers/reserva.controller";

const router = Router();

router.get("/obtenerReservas", reservaController.obtenerReservas);
router.get("/obtenerReservaUsuario/:id", reservaController.obtenerReservaUsuario);
router.post("/crearReserva",reservaController.crearReserva);
router.put("/actualizarReserva/:id",reservaController.actualizarReserva)

export default router;