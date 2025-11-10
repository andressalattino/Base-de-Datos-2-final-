import Producto from "../models/Producto.js";

//  Crear producto (solo admin)
export const crearProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json({
      success: true,
      message: "Producto creado correctamente ",
      data: productoGuardado
    });
  } catch (error) {
    console.error(" ERROR AL CREAR PRODUCTO:", error); // 👈 agrega esta línea
    res.status(500).json({
      success: false,
      message: "Error al crear producto ",
      error: error.message
    });
  }
};

//  Obtener productos (con filtros opcionales)
export const obtenerProductos = async (req, res) => {
  try {
    // Filtros dinámicos desde query params
    const { categoria, min, max, nombre } = req.query;
    const filtro = {};

    //  Filtro por categoría (ObjectId)
    if (categoria) filtro.categoria = categoria;

    //  Filtro por rango de precios
    if (min || max) {
      filtro.precio = {};
      if (min) filtro.precio.$gte = Number(min);
      if (max) filtro.precio.$lte = Number(max);
    }

    //  Filtro por nombre (coincidencia parcial)
    if (nombre) filtro.nombre = new RegExp(nombre, "i");

    //  Buscar en la base con populate
    const productos = await Producto.find(filtro).populate("categoria", "nombre descripcion");

    res.status(200).json({
      success: true,
      count: productos.length,
      data: productos
    });
  } catch (error) {
    console.error(" Error en obtenerProductos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos ",
      error: error.message
    });
  }
};


// Obtener producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate("categoria");
    if (!producto)
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado "
      });

    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar producto ",
      error: error.message
    });
  }
};

//  Actualizar producto (solo admin)
export const actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },  //  solo actualiza los campos enviados
      { new: true, runValidators: true } //  devuelve actualizado y valida el schema
    );

    if (!productoActualizado) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado ",
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto actualizado correctamente ",
      data: productoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar producto ",
      error: error.message,
    });
  }
};

// 📍 Eliminar producto (solo admin)
export const eliminarProducto = async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado)
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado "
      });

    res.json({
      success: true,
      message: "Producto eliminado correctamente "
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar producto ",
      error: error.message
    });
  }
};

// 📍 Filtrar productos por rango de precio y marca
export const filtrarProductos = async (req, res) => {
  try {
    const { minPrecio, maxPrecio, marca } = req.query;

    const filtro = {};

    if (minPrecio || maxPrecio) {
      filtro.precio = {};
      if (minPrecio) filtro.precio.$gte = Number(minPrecio);
      if (maxPrecio) filtro.precio.$lte = Number(maxPrecio);
    }

    if (marca) {
      filtro.marca = { $regex: marca, $options: "i" };
    }

    const productos = await Producto.find(filtro).populate("categoria", "nombre");
    res.status(200).json({
      success: true,
      message: "Productos filtrados correctamente ",
      data: productos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al filtrar productos ",
      error: error.message,
    });
  }
};

// 📍 Productos más reseñados
export const productosTop = async (req, res) => {
  try {
    const productos = await Producto.aggregate([
      {
        $lookup: {
          from: "resenas", // nombre de la colección de reseñas
          localField: "_id",
          foreignField: "producto",
          as: "resenas",
        },
      },
      {
        $addFields: {
          totalResenas: { $size: "$resenas" },
        },
      },
      { $sort: { totalResenas: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      message: "Top productos más reseñados ",
      data: productos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener productos top ",
      error: error.message,
    });
  }
};
