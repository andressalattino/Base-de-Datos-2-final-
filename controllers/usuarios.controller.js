import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ========================================
// 📌 Registrar nuevo usuario
// ========================================
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ success: false, error: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ success: false, error: "El usuario ya está registrado" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear el usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      rol: "cliente",
    });

    await nuevoUsuario.save();

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========================================
// 🔐 Login de usuario
// ========================================
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Verificar datos
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email y contraseña son obligatorios" });
    }

    // 2️⃣ Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    // 3️⃣ Comparar contraseñas
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ success: false, error: "Contraseña incorrecta" });
    }

    // 4️⃣ Generar token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 5️⃣ Devolver respuesta
    res.status(200).json({
      success: true,
      message: "Login exitoso",
      token,
      user: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
