// /routes/carrito.routes.js
import express from "express";
const router = express.Router();

// 🔹 Ruta temporal para probar
router.get("/", (req, res) => {
  res.json({ message: "Ruta de carrito funcionando correctamente ✅" });
});

// 🔹 Exportamos el router por defecto
export default router;
