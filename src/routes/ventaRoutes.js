const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventaController');

// POST /api/ventas -> Recibe el JSON del carrito y procesa la compra
router.post('/', ventaController.registrarVenta);

module.exports = router;