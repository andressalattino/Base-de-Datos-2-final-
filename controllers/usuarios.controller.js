import Usuario from "../models/Usuario.js";
import Carrito from "../models/Carrito.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ================================
// 🟢 Registrar nuevo usuario
// ================================
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios ❌",
      });
    }

    // Verificar si ya existe el usuario
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        error: "El usuario ya está registrado ❌",
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear y guardar usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      rol: "cliente",
    });

    await nuevoUsuario.save();

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente ✅",
      data: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ================================
// 🔐 Login de usuario
// ================================
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email y contraseña son obligatorios ❌" });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado ❌" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res
        .status(401)
        .json({ success: false, error: "Contraseña incorrecta ❌" });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: "Login exitoso ✅",
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

// ================================
// 📋 Obtener todos los usuarios (admin)
// ================================
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password");
    res.status(200).json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================================
// 📋 Obtener usuario por ID
// ================================
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-password");
    if (!usuario)
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado ❌" });

    res.status(200).json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================================
// ✏️ Actualizar usuario
// ================================
export const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario)
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado ❌" });

    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
    }

    await usuario.save();
    res
      .status(200)
      .json({ success: true, message: "Usuario actualizado ✅", data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================================
// 🗑️ Eliminar usuario (borra también su carrito)
// ================================
export const eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado)
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado ❌" });

    await Carrito.findOneAndDelete({ usuario: req.params.id });

    res.status(200).json({
      success: true,
      message: "Usuario y carrito eliminados correctamente 🗑️",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
