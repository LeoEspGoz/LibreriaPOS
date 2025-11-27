const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

router.get('/empleados', reporteController.getVentasPorEmpleado);
router.get('/libros', reporteController.getLibrosVendidos);

module.exports = router;