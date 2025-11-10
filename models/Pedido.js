import mongoose from "mongoose";

const pedidoSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    items: [
      {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
        cantidad: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    metodoPago: { type: String, enum: ["tarjeta", "efectivo", "transferencia"], required: true },
    direccionEnvio: { type: String, required: true },
    estado: { type: String, enum: ["pendiente", "enviado", "entregado"], default: "pendiente" },
  },
  { timestamps: true }
);

export default mongoose.model("Pedido", pedidoSchema);
