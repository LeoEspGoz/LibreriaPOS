const db = require('../config/db');

exports.registrarVenta = async (req, res) => {
    const { usuarioId, items } = req.body; // items es un array: [{ productoId, cantidad, precio }]
    
    // Obtenemos una conexión exclusiva del pool para manejar la transacción
    const connection = await db.getConnection();

    try {
        // 1. INICIAR TRANSACCIÓN (Todo o nada)
        await connection.beginTransaction();

        // 2. Calcular total
        const totalVenta = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        // 3. Insertar encabezado de Venta (Inciso B)
        const [ventaResult] = await connection.query(
            'INSERT INTO Ventas (UsuarioID, Total) VALUES (?, ?)',
            [usuarioId || 1, totalVenta] // Usamos ID 1 (Admin) por defecto si no hay login aún
        );
        const ventaId = ventaResult.insertId;

        // 4. Procesar cada producto del carrito
        for (const item of items) {
            // A. Insertar en DetalleVenta
            await connection.query(
                'INSERT INTO DetalleVenta (VentaID, ProductoID, Cantidad, PrecioUnitario) VALUES (?, ?, ?, ?)',
                [ventaId, item.productoId, item.cantidad, item.precio]
            );

            // B. Restar del Stock (Actualizar Inventario)
            await connection.query(
                'UPDATE Productos SET Stock = Stock - ? WHERE Clave = ?',
                [item.cantidad, item.productoId]
            );
        }

        // 5. CONFIRMAR CAMBIOS
        await connection.commit();

        res.json({ message: 'Venta registrada con éxito', ventaId });

    } catch (error) {
        // SI ALGO FALLA, DESHACER TODO
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error procesando la venta', error: error.message });
    } finally {
        connection.release(); // Liberar conexión
    }
};