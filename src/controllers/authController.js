const db = require('../config/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // CORRECCIÓN PARA CUMPLIR RÚBRICA:
        // No comparamos la contraseña directa, usamos SHA2(?, 256) en la consulta SQL.
        const sql = `
            SELECT UsuarioID, NombreUsuario, Rol 
            FROM Usuarios 
            WHERE NombreUsuario = ? 
            AND Password = SHA2(?, 256) 
            AND Estado = 1
        `;

        const [rows] = await db.query(sql, [username, password]);

        if (rows.length > 0) {
            const user = rows[0];
            
            // Éxito: Devolvemos los datos del usuario (sin el password)
            res.json({ 
                success: true, 
                message: 'Bienvenido al sistema', 
                user: user 
            });
        } else {
            // Fallo: Credenciales inválidas
            res.status(401).json({ 
                success: false, 
                message: 'Usuario o contraseña incorrectos' 
            });
        }
    } catch (error) {
        // Control de errores para evitar caída del servidor
        console.error("Error en login:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};