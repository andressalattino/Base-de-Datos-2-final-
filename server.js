// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";   // ✅ usamos la función separada
import { errorHandler } from "./middleware/errorHandler.js";

// Rutas
import usuariosRoutes from "./routes/usuarios.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import categoriasRoutes from "./routes/categorias.routes.js";
import carritoRoutes from "./routes/carrito.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js";
import resenasRoutes from "./routes/resenas.routes.js";

// 1️⃣ Inicializamos Express
dotenv.config();
const app = express();

// 2️⃣ Middlewares base
app.use(express.json());
app.use(cors());

// 3️⃣ Conexión a MongoDB (solo una vez)
connectDB();

// 4️⃣ Definimos rutas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/ordenes", pedidosRoutes);
app.use("/api/resenas", resenasRoutes);

// 5️⃣ Ruta de prueba
app.get("/", (req, res) => {
  res.send("API E-commerce funcionando ✅");
});

// 6️⃣ Middleware de manejo de errores
app.use(errorHandler);

// 7️⃣ Encendemos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
