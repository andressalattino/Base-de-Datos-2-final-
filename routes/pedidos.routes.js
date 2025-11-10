import express from "express";
import {
  crearPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  obtenerPedidosPorUsuario,
  actualizarPedido,
  actualizarEstadoPedido,
  eliminarPedido,
  obtenerEstadisticasPedidos
} from "../controllers/pedidos.controller.js";

import { verificarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/verificarAdmin.js";

const router = express.Router();

//  Crear pedido (usuario logueado)
router.post("/", verificarToken, crearPedido);

//  Listar todos los pedidos (solo admin)
router.get("/", verificarToken, verificarAdmin, obtenerPedidos);

//  Estadísticas: cantidad de pedidos por estado
router.get("/stats", verificarToken, verificarAdmin, obtenerEstadisticasPedidos);

//  Obtener pedido por ID (admin o dueño del pedido)
router.get("/:id", verificarToken, obtenerPedidoPorId);

//  Pedidos de un usuario
router.get("/user/:usuarioId", verificarToken, obtenerPedidosPorUsuario);

//  Actualizar datos del pedido (dirección, método de pago, etc.)
router.patch("/:id", verificarToken, actualizarPedido);

//  Actualizar estado del pedido (solo admin)
router.patch("/:id/status", verificarToken, verificarAdmin, actualizarEstadoPedido);

//  Eliminar un pedido (solo admin)
router.delete("/:id", verificarToken, verificarAdmin, eliminarPedido);

export default router;
