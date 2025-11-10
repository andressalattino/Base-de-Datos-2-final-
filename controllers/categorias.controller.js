import Categoria from "../models/Categoria.js";

// Crear una nueva categoría
export const crearCategoria = async (req, res) => {
  try {
    const nuevaCategoria = new Categoria(req.body);
    const categoriaGuardada = await nuevaCategoria.save();
    res.status(201).json({
      success: true,
      message: "Categoría creada correctamente ✅",
      data: categoriaGuardada,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear categoría",
      error: error.message,
    });
  }
};

// Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json({
      success: true,
      data: categorias,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener categorías",
      error: error.message,
    });
  }
};

// Obtener categoría por ID
export const obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria)
      return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    res.status(200).json({ success: true, data: categoria });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener categoría",
      error: error.message,
    });
  }
};

// ✅ Actualizar categoría (funciona para PUT y PATCH)
export const actualizarCategoria = async (req, res) => {
  try {
    // Solo los campos enviados se actualizan (PATCH)
    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // new: devuelve la versión actualizada
    );

    if (!categoriaActualizada)
      return res.status(404).json({ success: false, message: "Categoría no encontrada" });

    res.status(200).json({
      success: true,
      message: "Categoría actualizada correctamente ✅",
      data: categoriaActualizada,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar categoría",
      error: error.message,
    });
  }
};

// Eliminar categoría
export const eliminarCategoria = async (req, res) => {
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaEliminada)
      return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    res.status(200).json({
      success: true,
      message: "Categoría eliminada correctamente ✅",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar categoría",
      error: error.message,
    });
  }
};

// 📊 Obtener cantidad de productos por categoría
export const obtenerEstadisticasCategorias = async (req, res) => {
  try {
    const stats = await Categoria.aggregate([
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "categoria",
          as: "productos",
        },
      },
      {
        $project: {
          nombre: 1,
          totalProductos: { $size: "$productos" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Estadísticas de categorías obtenidas correctamente ✅",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};
