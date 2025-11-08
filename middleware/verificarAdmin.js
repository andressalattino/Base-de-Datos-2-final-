export const verificarAdmin = (req, res, next) => {
  // Si el usuario no tiene rol admin
  if (req.user.rol !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Acceso denegado: solo los administradores pueden realizar esta acción.",
    });
  }

  // Si es admin
  next();
};
