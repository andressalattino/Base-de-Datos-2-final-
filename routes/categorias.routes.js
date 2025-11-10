import express from "express";
import {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoriaPorId,
  actualizarCategoria,
  eliminarCategoria,
  obtenerEstadisticasCategorias
} from "../controllers/categorias.controller.js";
import { verificarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/verificarAdmin.js";

const router = express.Router();

// 📊 Ruta especial: estadísticas (antes que /:id)
router.get("/stats", obtenerEstadisticasCategorias);

// 🔹 Rutas públicas
router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoriaPorId);

// 🔒 Solo admin: crear, actualizar, eliminar
router.post("/", verificarToken, verificarAdmin, crearCategoria);

// ✅ Actualizar parcialmente (PATCH)
router.patch("/:id", verificarToken, verificarAdmin, actualizarCategoria);

// ✅ También permitir PUT si querés mantener compatibilidad
router.put("/:id", verificarToken, verificarAdmin, actualizarCategoria);

router.delete("/:id", verificarToken, verificarAdmin, eliminarCategoria);

export default router;

