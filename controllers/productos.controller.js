import Producto from "../models/Producto.js";

// 📍 Crear producto (solo admin)
export const crearProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json({
      success: true,
      message: "Producto creado correctamente ✅",
      data: productoGuardado
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear producto", error: error.message });
  }
};

// 📍 Obtener todos los productos (acceso público)
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().populate("categoria", "nombre descripcion");
    res.status(200).json({ success: true, data: productos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener productos", error: error.message });
  }
};

// 📍 Obtener producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate("categoria");
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    res.json({ success: true, data: producto });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al buscar producto", error: error.message });
  }
};

// 📍 Actualizar producto (solo admin)
export const actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productoActualizado) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    res.json({ success: true, message: "Producto actualizado ✅", data: productoActualizado });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar producto", error: error.message });
  }
};

// 📍 Eliminar producto (solo admin)
export const eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) return res.status(404).json({ success: false, message: "Producto no encontrado" });
    res.json({ success: true, message: "Producto eliminado correctamente 🗑️" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar producto", error: error.message });
  }
};
