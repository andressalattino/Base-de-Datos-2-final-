import Pedido from "../models/Pedido.js";
import Carrito from "../models/Carrito.js";

//  Crear un nuevo pedido a partir del carrito
export const crearPedido = async (req, res) => {
  try {
    const { usuarioId, metodoPago, direccionEnvio } = req.body;

    const carrito = await Carrito.findOne({ usuario: usuarioId }).populate(
      "items.producto",
      "nombre precio"
    );

    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El carrito está vacío o no existe ",
      });
    }

    const items = carrito.items.map((item) => ({
      producto: item.producto._id,
      cantidad: item.cantidad,
      subtotal: item.cantidad * item.producto.precio,
    }));

    const total = items.reduce((acc, item) => acc + item.subtotal, 0);

    const nuevoPedido = new Pedido({
      usuario: usuarioId,
      items,
      total,
      metodoPago,
      direccionEnvio,
      estado: "pendiente",
    });

    await nuevoPedido.save();

    carrito.items = [];
    await carrito.save();

    res.status(201).json({
      success: true,
      message: "Pedido creado correctamente ",
      pedido: nuevoPedido,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear el pedido ",
      error: error.message,
    });
  }
};

//  Listar todos los pedidos (admin)
export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate("usuario", "nombre email")
      .populate("items.producto", "nombre precio imagen")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Pedidos obtenidos correctamente ",
      count: pedidos.length,
      data: pedidos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener pedidos ",
      error: error.message,
    });
  }
};

// Obtener un pedido por ID
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate("usuario", "nombre email")
      .populate("items.producto", "nombre precio imagen");

    if (!pedido)
      return res.status(404).json({
        success: false,
        message: "Pedido no encontrado ",
      });

    res.status(200).json({
      success: true,
      data: pedido,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener pedido ",
      error: error.message,
    });
  }
};

//  Obtener todos los pedidos de un usuario
export const obtenerPedidosPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const pedidos = await Pedido.find({ usuario: usuarioId })
      .populate("items.producto", "nombre precio imagen")
      .sort({ createdAt: -1 });

    if (!pedidos || pedidos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron pedidos para este usuario ",
      });
    }

    res.status(200).json({
      success: true,
      count: pedidos.length,
      pedidos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener pedidos del usuario ",
      error: error.message,
    });
  }
};

// Actualizar datos generales del pedido (dirección, método de pago)
export const actualizarPedido = async (req, res) => {
  try {
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("usuario", "nombre email");

    if (!pedidoActualizado) {
      return res.status(404).json({
        success: false,
        message: "Pedido no encontrado ",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pedido actualizado correctamente ",
      pedido: pedidoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar pedido ",
      error: error.message,
    });
  }
};

//  Actualizar solo el estado del pedido
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { nuevoEstado } = req.body;

    const estadosValidos = [
      "pendiente",
      "en proceso",
      "enviado",
      "entregado",
      "cancelado",
    ];

    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Debe ser uno de: ${estadosValidos.join(", ")} `,
      });
    }

    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado: nuevoEstado },
      { new: true }
    );

    if (!pedidoActualizado) {
      return res.status(404).json({
        success: false,
        message: "Pedido no encontrado ",
      });
    }

    res.status(200).json({
      success: true,
      message: "Estado del pedido actualizado correctamente ",
      pedido: pedidoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar estado del pedido ",
      error: error.message,
    });
  }
};

//  Eliminar un pedido (solo admin)
export const eliminarPedido = async (req, res) => {
  try {
    const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);

    if (!pedidoEliminado) {
      return res.status(404).json({
        success: false,
        message: "Pedido no encontrado ",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pedido eliminado correctamente ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar pedido ",
      error: error.message,
    });
  }
};

//  Estadísticas de pedidos agrupados por estado
export const obtenerEstadisticasPedidos = async (req, res) => {
  try {
    const stats = await Pedido.aggregate([
      {
        $group: {
          _id: "$estado",
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          estado: "$_id",
          total: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Estadísticas de pedidos obtenidas correctamente ",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas de pedidos    ",
      error: error.message,
    });
  }
};
