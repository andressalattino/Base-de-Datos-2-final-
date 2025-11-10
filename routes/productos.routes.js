import express from "express";
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
  filtrarProductos,
  productosTop, //  ya está incluido acá, no lo repitas abajo
} from "../controllers/productos.controller.js";

import { verificarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/verificarAdmin.js";

const router = express.Router();

//  Productos más reseñados
router.get("/top", productosTop);

// Filtro de productos
router.get("/filtro", filtrarProductos);

//  Público: ver productos
router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);

//  Admin: crear, actualizar, eliminar
router.post("/", verificarToken, verificarAdmin, crearProducto);
router.patch("/:id", verificarToken, verificarAdmin, actualizarProducto);
router.delete("/:id", verificarToken, verificarAdmin, eliminarProducto);

export default router;
