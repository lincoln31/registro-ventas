// Middleware para verificar autenticación
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'No autenticado'
    });
  }
  next();
};

module.exports = { requireAuth };
