const db = require('../config/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscamos el usuario (En un sistema real, la contraseña debería estar encriptada)
        const [rows] = await db.query(
            'SELECT UsuarioID, NombreUsuario, Rol FROM Usuarios WHERE NombreUsuario = ? AND Password = ? AND Estado = 1', 
            [username, password]
        );

        if (rows.length > 0) {
            const user = rows[0];
            // Devolvemos los datos del usuario para guardarlos en el Frontend
            res.json({ 
                success: true, 
                message: 'Bienvenido', 
                user: user 
            });
        } else {
            res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};