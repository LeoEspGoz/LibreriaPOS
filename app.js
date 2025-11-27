const express = require('express');
const cors = require('cors');
const path = require('path'); // Necesario para rutas de archivos
require('dotenv').config();

// IMPORTAR LA CONEXIÓN (Para el diagnóstico)
const db = require('./src/config/db');

// --- AQUÍ ESTABA EL ERROR: FALTABA ESTA LÍNEA ---
const productoRoutes = require('./src/routes/productoRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes'); // <--- NUEVO
// ------------------------------------------------

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src/public')));
app.use('/api/ventas', ventaRoutes); // <--- NUEVO

// --- BLOQUE DE DIAGNÓSTICO (Opcional, pero útil) ---
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ ¡CONEXIÓN EXITOSA A LA BASE DE DATOS!');
    connection.release();
  } catch (error) {
    console.error('❌ ERROR DE CONEXIÓN:', error.message);
  }
})();
// ---------------------------------------------------

// CONECTAR LAS RUTAS
app.use('/api/productos', productoRoutes); // Ahora sí va a funcionar porque ya lo importamos arriba

// Ruta de prueba Health Check
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'OK', db_check: rows[0].solution });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});