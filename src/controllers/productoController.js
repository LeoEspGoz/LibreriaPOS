const db = require('../config/db');

// 1. Obtener todos los productos (Para la cuadrícula del inciso F)
exports.getProductos = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Productos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Buscar producto por ISBN (Para el escáner)
exports.getProductoByISBN = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Productos WHERE ISBN = ?', [req.params.isbn]);
        if (rows.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Actualizar Precio (Esto activará el Trigger de Auditoría automáticamente)
exports.updatePrecio = async (req, res) => {
    const { id } = req.params;
    const { nuevoPrecio } = req.body;

    try {
        // Ejecutamos UPDATE. MySQL se encarga de llenar la tabla ProductoAudit gracias al Trigger.
        const [result] = await db.query('UPDATE Productos SET Precio = ? WHERE Clave = ?', [nuevoPrecio, id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto no encontrado' });
        
        res.json({ message: 'Precio actualizado correctamente. Auditoría registrada.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Ver Historial de Cambios (Inciso H - Grid de auditoría)
exports.getAuditoria = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ProductoAudit ORDER BY FechaHora DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};