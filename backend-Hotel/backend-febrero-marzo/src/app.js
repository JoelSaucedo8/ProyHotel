import express from "express";
import morgan from "morgan";
import cors from "cors";

//Routes
import usuarioRoutes from "./routes/usuario.routes";
import loginRoutes from "./routes/login.routes";
import habitacionRoutes from "./routes/habitacion.routes";
import reservaRoutes from "./routes/reserva.routes";
import huespedRoutes from "./routes/huesped.routes";

const app = express();

app.use(cors());

//Settings
app.set("port", 4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use("/api",usuarioRoutes);
app.use("/api",loginRoutes);
app.use("/api",habitacionRoutes);
app.use("/api",reservaRoutes);
app.use("/api",huespedRoutes);

export default app;