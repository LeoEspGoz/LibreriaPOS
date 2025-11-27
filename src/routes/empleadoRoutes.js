const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

// Rutas del CRUD
router.get('/', empleadoController.getEmpleados);
router.post('/', empleadoController.createEmpleado);
router.put('/:id', empleadoController.updateEmpleado);
router.delete('/:id', empleadoController.deleteEmpleado);

// --- ¡ESTA ES LA LÍNEA QUE TE FALTA! ---
module.exports = router;