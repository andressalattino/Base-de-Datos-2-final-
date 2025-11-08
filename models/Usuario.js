import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  direccion: String,
  telefono: String,
  rol: { type: String, enum: ["cliente", "admin"], default: "cliente" },
}, { timestamps: true });

export default mongoose.model("Usuario", usuarioSchema);
