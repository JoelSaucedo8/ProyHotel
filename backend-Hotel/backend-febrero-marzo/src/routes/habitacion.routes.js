import { Router } from "express";
import { methods as habitacionController} from "./../controllers/habitacion.controller";

const router = Router();

router.get("/obtenerHabitaciones", habitacionController.obtenerHabitaciones);
router.get("/obtenerHabitacion/:id", habitacionController.obtenerHabitacion);
router.post("/crearHabitacion",habitacionController.crearHabitacion);
router.put("/actualizarHabitacion/:id",habitacionController.actualizarHabitacion)

export default router;