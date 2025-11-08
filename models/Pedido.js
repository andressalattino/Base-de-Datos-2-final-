import mongoose from "mongoose";

const itemPedidoSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
  cantidad: Number,
  subtotal: Number
}, { _id: false });

const pedidoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, enum: ["pendiente", "pagado", "enviado", "cancelado"], default: "pendiente" },
  total: Number,
  metodoPago: String,
  items: [itemPedidoSchema]
}, { timestamps: true });

export default mongoose.model("Pedido", pedidoSchema);
