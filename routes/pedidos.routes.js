import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Ruta de pedidos funcionando ✅" });
});

export default router;
