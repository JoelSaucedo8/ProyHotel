import { Router } from "express";
import { methods as huespedController} from "./../controllers/huesped.controller";

const router = Router();

router.get("/obtenerHuespedReserva/:id", huespedController.obtenerHuespedReserva);
router.post("/agregarHuespedes",huespedController.agregarHuespedes);
router.put("/actualizarHuespedes/:id",huespedController.actualizarHuespedes)

export default router;