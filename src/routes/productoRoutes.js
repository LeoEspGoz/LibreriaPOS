const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Definir las rutas
router.get('/', productoController.getProductos);           // GET /api/productos
router.get('/audit', productoController.getAuditoria);      // GET /api/productos/audit
router.get('/:isbn', productoController.getProductoByISBN); // GET /api/productos/111-222
router.put('/:id/precio', productoController.updatePrecio); // PUT /api/productos/1/precio
router.post('/', productoController.createProducto);   // POST /api/productos
router.delete('/:id', productoController.deleteProducto); // DELETE /api/productos/1
router.put('/:id', productoController.updateProductoCompleto);

module.exports = router;