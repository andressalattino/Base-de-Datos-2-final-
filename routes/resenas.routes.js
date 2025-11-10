import express from "express";
import {
  crearResena,
  obtenerResenas,
  obtenerResenasPorProducto,
  obtenerTopResenas,
  actualizarResena,
  eliminarResena
} from "../controllers/resenas.controller.js";

const router = express.Router();

// Crear reseña (solo si el usuario compró el producto)
router.post("/", crearResena);

//  Listar todas las reseñas con datos de usuario y producto
router.get("/", obtenerResenas);

//  Reseñas de un producto
router.get("/product/:productId", obtenerResenasPorProducto);

//  Top productos mejor calificados
router.get("/top", obtenerTopResenas);

//  Actualizar reseña (PATCH)
router.patch("/:id", actualizarResena);

// Eliminar reseña
router.delete("/:id", eliminarResena);

export default router;
