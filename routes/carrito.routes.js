import express from "express";
import {
  crearCarrito,
  agregarProducto,
  obtenerCarrito,
  obtenerTodosLosCarritos,
  calcularTotal,
  actualizarCarrito,
  eliminarCarrito
} from "../controllers/carrito.controller.js";

import { verificarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/verificarAdmin.js";

const router = express.Router();

//  Crear carrito (solo usuarios logueados)
router.post("/", verificarToken, crearCarrito);

//  Agregar producto al carrito
router.post("/agregar", verificarToken, agregarProducto);

//  Listar todos los carritos (solo admin)
router.get("/", verificarToken, verificarAdmin, obtenerTodosLosCarritos);

//  Ver carrito de un usuario
router.get("/:usuarioId", verificarToken, obtenerCarrito);

//  Calcular total de un carrito
router.get("/:usuarioId/total", verificarToken, calcularTotal);

//  Actualizar carrito (por ejemplo, cambiar cantidades)
router.patch("/:usuarioId", verificarToken, actualizarCarrito);

//  Eliminar carrito de un usuario
router.delete("/:usuarioId", verificarToken, eliminarCarrito);

export default router;

