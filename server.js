//  Importaciones base
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Configuración de entorno y conexión a la BD
import { connectDB } from "./config/db.js";           // conexión a MongoDB
import { errorHandler } from "./middleware/errorHandler.js"; // middleware global de errores

import "./models/Categoria.js";

//  Importacion de rutas 
import usuariosRoutes from "./routes/usuarios.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import carritoRoutes from "./routes/carrito.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
import resenasRoutes from "./routes/resenas.routes.js";



//  Inicialización de la app

dotenv.config();              // Carga las variables del archivo .env
const app = express();        // Inicializa Express


//  Middlewares base

app.use(express.json());      // Permite recibir datos en formato JSON
app.use(cors());              // Habilita peticiones desde otros orígenes (frontend, etc.)


//  Conexión a MongoDB

connectDB(); // se ejecuta una sola vez al iniciar el servidor


// Rutas principales
app.use("/api/ordenes", pedidosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/ordenes", pedidosRoutes);
app.use("/api/resenas", resenasRoutes);


// ✅ Ruta base de prueba

app.get("/", (req, res) => {
  res.send("API E-commerce funcionando ");
});


//  Middleware de errores

app.use(errorHandler);


// Inicio del servidor

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));
