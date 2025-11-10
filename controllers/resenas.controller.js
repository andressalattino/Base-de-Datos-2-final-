import Resena from "../models/Resena.js";
import Pedido from "../models/Pedido.js";

//  Crear reseña (solo si el usuario compró el producto)
export const crearResena = async (req, res) => {
  try {
    const { usuarioId, productoId, calificacion, comentario } = req.body;

    // Validar compra previa
    const pedido = await Pedido.findOne({
      usuario: usuarioId,
      "items.producto": productoId,
    });

    if (!pedido) {
      return res.status(400).json({
        success: false,
        message: "Solo puedes reseñar productos que compraste ❌",
      });
    }

    const nuevaResena = new Resena({
      usuario: usuarioId,
      producto: productoId,
      calificacion,
      comentario,
    });

    await nuevaResena.save();

    res.status(201).json({
      success: true,
      message: "Reseña creada correctamente ",
      data: nuevaResena,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear reseña ",
      error: error.message,
    });
  }
};

//  Listar todas las reseñas
export const obtenerResenas = async (req, res) => {
  try {
    const resenas = await Resena.find()
      .populate("usuario", "nombre email")
      .populate("producto", "nombre precio");

    res.status(200).json({
      success: true,
      data: resenas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reseñas ",
      error: error.message,
    });
  }
};

// Reseñas de un producto
export const obtenerResenasPorProducto = async (req, res) => {
  try {
    const { productId } = req.params;

    const resenas = await Resena.find({ producto: productId })
      .populate("usuario", "nombre")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Reseñas del producto obtenidas correctamente ",
      data: resenas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reseñas del producto ",
      error: error.message,
    });
  }
};

//  Promedio de calificación por producto
export const obtenerTopResenas = async (req, res) => {
  try {
    const top = await Resena.aggregate([
      {
        $group: {
          _id: "$producto",
          promedioCalificacion: { $avg: "$calificacion" },
          totalResenas: { $sum: 1 },
        },
      },
      { $sort: { promedioCalificacion: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      message: "Top productos mejor calificados ",
      data: top,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener top reseñas ",
      error: error.message,
    });
  }
};

// Actualizar reseña
export const actualizarResena = async (req, res) => {
  try {
    const { id } = req.params;
    const resenaActualizada = await Resena.findByIdAndUpdate(id, req.body, { new: true });
    if (!resenaActualizada)
      return res.status(404).json({ success: false, message: "Reseña no encontrada ❌" });

    res.status(200).json({
      success: true,
      message: "Reseña actualizada correctamente ",
      data: resenaActualizada,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar reseña ",
      error: error.message,
    });
  }
};

//  Eliminar reseña
export const eliminarResena = async (req, res) => {
  try {
    const { id } = req.params;
    const resenaEliminada = await Resena.findByIdAndDelete(id);
    if (!resenaEliminada)
      return res.status(404).json({ success: false, message: "Reseña no encontrada " });

    res.status(200).json({
      success: true,
      message: "Reseña eliminada correctamente ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar reseña ",
      error: error.message,
    });
  }
};
