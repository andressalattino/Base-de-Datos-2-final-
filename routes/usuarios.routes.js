
//  routes/usuarios.routes.js — CRUD completo de Usuarios

import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} from "../controllers/usuarios.controller.js";

const router = express.Router();


//  AUTENTICACIÓN

// Registro (crear usuario)
router.post("/registro", registrarUsuario);

// Login de usuario existente
router.post("/login", loginUsuario);


//  CRUD DE USUARIOS


// Obtener todos los usuarios
router.get("/", obtenerUsuarios);

// Obtener un usuario por su ID
router.get("/:id", obtenerUsuarioPorId);

// Actualizar usuario
router.patch("/:id", actualizarUsuario);

// Eliminar usuario
router.delete("/:id", eliminarUsuario);


//  Exportar router

export default router;
