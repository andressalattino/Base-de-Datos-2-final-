import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
  cantidad: { type: Number, required: true },
  subtotal: { type: Number, required: true }
}, { _id: false });

const carritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", unique: true },
  items: [itemSchema]
}, { timestamps: true });

export default mongoose.model("Carrito", carritoSchema);
