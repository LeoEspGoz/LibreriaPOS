const db = require('../config/db');

// REPORTE 1: Ventas por Empleado (Rango de Fechas)
exports.getVentasPorEmpleado = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        const sql = `
            SELECT 
                u.UsuarioID AS Clave,
                u.NombreUsuario AS Nombre, 
                IFNULL(SUM(v.Total), 0) AS MontoVendido
            FROM Usuarios u
            LEFT JOIN Ventas v ON u.UsuarioID = v.UsuarioID 
                AND DATE(v.Fecha) BETWEEN ? AND ?
            WHERE u.Rol = 'Vendedor' OR u.Rol = 'Admin'
            GROUP BY u.UsuarioID, u.NombreUsuario
            ORDER BY MontoVendido DESC;
        `;
        
        const [rows] = await db.query(sql, [fechaInicio, fechaFin]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REPORTE 2: Libros Vendidos (Por Mes y Año)
exports.getLibrosVendidos = async (req, res) => {
    const { mes, anio } = req.query;

    try {
        const sql = `
            SELECT 
                p.ISBN,
                p.Nombre AS Titulo,
                p.Descripcion,
                p.Precio AS Costo,
                IFNULL(SUM(dv.Cantidad), 0) AS UnidadesVendidas
            FROM Productos p
            INNER JOIN DetalleVenta dv ON p.Clave = dv.ProductoID
            INNER JOIN Ventas v ON dv.VentaID = v.VentaID
            WHERE MONTH(v.Fecha) = ? AND YEAR(v.Fecha) = ?
            GROUP BY p.Clave
            ORDER BY p.Nombre ASC;
        `;

        const [rows] = await db.query(sql, [mes, anio]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};