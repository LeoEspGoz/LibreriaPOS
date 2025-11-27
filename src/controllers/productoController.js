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
exports.createProducto = async (req, res) => {
    const { isbn, nombre, descripcion, precio, stock } = req.body;
    
    // Validación básica
    if (!isbn || !nombre || !precio) {
        return res.status(400).json({ message: 'ISBN, Nombre y Precio son obligatorios' });
    }

    try {
        const sql = 'INSERT INTO Productos (ISBN, Nombre, Descripcion, Precio, Stock) VALUES (?, ?, ?, ?, ?)';
        await db.query(sql, [isbn, nombre, descripcion, precio, stock || 0]);
        
        // Esto disparará el Trigger trg_Audit_Insert_Producto automáticamente
        res.json({ message: 'Libro agregado correctamente al inventario' });
    } catch (error) {
        // Si el ISBN ya existe, MySQL tirará error
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'El ISBN ya existe en el sistema' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};
exports.deleteProducto = async (req, res) => {
    const { id } = req.params; // Aquí el ID es el ISBN o la Clave, según prefieras. Usaremos Clave (ID).
    try {
        // Primero borramos detalles de ventas asociados para mantener integridad (Opcional, depende de tu lógica)
        // await db.query('DELETE FROM DetalleVenta WHERE ProductoID = ?', [id]);
        
        // Borramos el producto
        await db.query('DELETE FROM Productos WHERE Clave = ?', [id]);
        
        // El Trigger trg_Audit_Delete_Producto registrará esto automáticamente
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        // Si hay ventas ligadas y no tienes borrado en cascada, dará error
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             res.status(400).json({ message: 'No se puede eliminar: Este producto tiene ventas registradas.' });
        } else {
             res.status(500).json({ message: error.message });
        }
    }
};
exports.updateProductoCompleto = async (req, res) => {
    const { id } = req.params; // Este es el ID (Clave)
    const { isbn, nombre, descripcion, precio, stock } = req.body;

    try {
        const sql = `
            UPDATE Productos 
            SET ISBN = ?, Nombre = ?, Descripcion = ?, Precio = ?, Stock = ?
            WHERE Clave = ?
        `;
        
        // El Trigger de auditoría se disparará si el precio cambia
        await db.query(sql, [isbn, nombre, descripcion, precio, stock, id]);
        
        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};