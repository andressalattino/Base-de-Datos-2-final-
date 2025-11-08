import express from "express";
import { registrarUsuario, loginUsuario } from "../controllers/usuarios.controller.js";
import { verificarToken } from "../middleware/auth.js";
import { verificarAdmin } from "../middleware/verificarAdmin.js"; // ✅ mover arriba

const router = express.Router();

// Rutas públicas
router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);

// RUTA PROTEGIDA (solo con token válido)
router.get("/perfil", verificarToken, (req, res) => {
  res.json({
    success: true,
    message: "Accediste al perfil protegido correctamente ✅",
    user: req.user,
  });
});

// 🔒 RUTA SOLO PARA ADMIN
router.get("/solo-admin", verificarToken, verificarAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Bienvenido, administrador ✅",
    user: req.user,
  });
});

export default router;
