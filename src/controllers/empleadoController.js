const db = require('../config/db');

exports.getEmpleados = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Empleados');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createEmpleado = async (req, res) => {
    // Ahora recibimos también usuario, password y rol
    const { nombre, puesto, telefono, usuario, password, rol } = req.body;
    
    try {
        // Llamada al Stored Procedure actualizado con 6 parámetros
        await db.query('CALL sp_CrearEmpleado(?, ?, ?, ?, ?, ?)', 
            [nombre, puesto, telefono, usuario, password, rol]
        );
        res.json({ message: 'Empleado y Usuario creados correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEmpleado = async (req, res) => {
    const { id } = req.params;
    const { nombre, puesto, telefono } = req.body;
    try {
        await db.query('CALL sp_EditarEmpleado(?, ?, ?, ?)', [id, nombre, puesto, telefono]);
        res.json({ message: 'Empleado actualizado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEmpleado = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('CALL sp_EliminarEmpleado(?)', [id]);
        res.json({ message: 'Empleado eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};