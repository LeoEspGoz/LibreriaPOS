const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares (Configuraciones)
app.use(cors()); // Permite peticiones de otros dominios (útil en desarrollo)
app.use(express.json()); // Permite recibir datos en formato JSON (POST/PUT)
app.use(express.static(path.join(__dirname, 'src/public'))); // Servir archivos frontend

// Ruta de prueba para verificar conexión
const db = require('./src/config/db');
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'OK', db_check: rows[0].solution });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message });
    }
});

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});