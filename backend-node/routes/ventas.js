const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { requireAuth } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Rutas de ventas
router.post('/', ventasController.create);
router.get('/', ventasController.list);
router.delete('/:id', ventasController.delete);

module.exports = router;
