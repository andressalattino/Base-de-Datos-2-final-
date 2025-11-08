import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria" },
  imagen: String
}, { timestamps: true });

export default mongoose.model("Producto", productoSchema);
