import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";

// 📦 Crear carrito
export const crearCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    if (!usuarioId) {
      return res.status(400).json({ success: false, message: "Debe indicar el ID del usuario ❌" });
    }

    let carrito = await Carrito.findOne({ usuario: usuarioId });
    if (carrito) {
      return res.status(400).json({ success: false, message: "El carrito ya existe para este usuario ❌" });
    }

    carrito = new Carrito({ usuario: usuarioId, items: [] });
    await carrito.save();

    res.status(201).json({
      success: true,
      message: "Carrito creado correctamente ✅",
      data: carrito,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al crear carrito ❌", error: error.message });
  }
};

// 📋 Listar todos los carritos (solo admin)
export const obtenerTodosLosCarritos = async (req, res) => {
  try {
    const carritos = await Carrito.find()
      .populate("usuario", "nombre email rol")
      .populate("items.producto", "nombre precio imagen");

    res.status(200).json({
      success: true,
      count: carritos.length,
      data: carritos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener carritos ❌", error: error.message });
  }
};

// 📍 Obtener carrito por usuario
export const obtenerCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const carrito = await Carrito.findOne({ usuario: usuarioId }).populate(
      "items.producto",
      "nombre precio imagen"
    );

    if (!carrito)
      return res.status(404).json({ success: false, message: "Carrito no encontrado ❌" });

    res.status(200).json({ success: true, data: carrito });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al obtener carrito ❌", error: error.message });
  }
};

// 🛒 Agregar producto al carrito
export const agregarProducto = async (req, res) => {
  try {
    const { usuarioId, productoId, cantidad } = req.body;

    const producto = await Producto.findById(productoId);
    if (!producto) return res.status(404).json({ success: false, message: "Producto no encontrado ❌" });

    let carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) carrito = new Carrito({ usuario: usuarioId, items: [] });

    const index = carrito.items.findIndex((i) => i.producto.toString() === productoId);

    if (index >= 0) carrito.items[index].cantidad += cantidad;
    else carrito.items.push({ producto: productoId, cantidad });

    await carrito.save();
    const carritoPopulado = await carrito.populate("items.producto", "nombre precio imagen");

    res.status(200).json({
      success: true,
      message: "Producto agregado al carrito ✅",
      data: carritoPopulado,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al agregar producto ❌", error: error.message });
  }
};

// ✏️ Actualizar carrito (por ejemplo, cambiar cantidad o eliminar un ítem)
export const actualizarCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { items } = req.body; // array actualizado de productos [{ producto, cantidad }]

    const carrito = await Carrito.findOneAndUpdate(
      { usuario: usuarioId },
      { $set: { items } },
      { new: true, runValidators: true }
    ).populate("items.producto", "nombre precio imagen");

    if (!carrito) return res.status(404).json({ success: false, message: "Carrito no encontrado ❌" });

    res.status(200).json({
      success: true,
      message: "Carrito actualizado correctamente ✅",
      data: carrito,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar carrito ❌", error: error.message });
  }
};

// 🧮 Calcular total del carrito
export const calcularTotal = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const carrito = await Carrito.findOne({ usuario: usuarioId }).populate("items.producto", "precio nombre");

    if (!carrito)
      return res.status(404).json({ success: false, message: "Carrito no encontrado ❌" });

    let total = 0;
    const detalle = carrito.items.map((i) => {
      if (!i.producto) return null;
      const subtotal = i.cantidad * i.producto.precio;
      total += subtotal;
      return { producto: i.producto.nombre, cantidad: i.cantidad, subtotal };
    }).filter(Boolean);

    res.status(200).json({ success: true, message: "Total calculado correctamente ✅", total, detalle });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al calcular total ❌", error: error.message });
  }
};

// ❌ Eliminar carrito completo
export const eliminarCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const carrito = await Carrito.findOneAndDelete({ usuario: usuarioId });
    if (!carrito) return res.status(404).json({ success: false, message: "Carrito no encontrado ❌" });

    res.status(200).json({ success: true, message: "Carrito eliminado correctamente ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al eliminar carrito ❌", error: error.message });
  }
};
