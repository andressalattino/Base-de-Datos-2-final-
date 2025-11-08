import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
  calificacion: { type: Number, min: 1, max: 5 },
  comentario: String
}, { timestamps: true });

export default mongoose.model("Resena", resenaSchema);
