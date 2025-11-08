// /middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error capturado:", err.stack);

  res.status(500).json({
    success: false,
    error: err.message || "Error interno del servidor"
  });
};
