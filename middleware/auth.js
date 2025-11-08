import jwt from "jsonwebtoken";
// Middleware para verificar token JWT
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Si no viene el header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guardamos los datos del usuario en la request
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Token inválido o expirado" });
  }
};
