const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

// 1. IMPORTAR CONEXIÓN (Para diagnóstico)
const db = require('./src/config/db');

// 2. IMPORTAR RUTAS
const productoRoutes = require('./src/routes/productoRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes'); 
const authRoutes = require('./src/routes/authRoutes'); 
const reporteRoutes = require('./src/routes/reporteRoutes');
const empleadoRoutes = require('./src/routes/empleadoRoutes');

const app = express();

// 3. MIDDLEWARES

app.use(cors());
app.use(express.json());

// --- NUEVO: MIDDLEWARE ANTI-CACHÉ ---
// Esto obliga al navegador a no guardar copias viejas.
// Así, si borras un empleado o libro, al recargar desaparecerá de verdad.
app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

// Configuración de carpeta pública (Frontend)
app.use(express.static(path.join(__dirname, 'src/public')));


// 4. CONEXIÓN DE RUTAS (ENDPOINTS)

app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes); 
app.use('/api/auth', authRoutes); 
app.use('/api/reportes', reporteRoutes);
app.use('/api/empleados', empleadoRoutes);


// 5. DIAGNÓSTICO DE BASE DE DATOS

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ ¡CONEXIÓN EXITOSA A LA BASE DE DATOS!');
    connection.release();
  } catch (error) {
    console.error('❌ ERROR DE CONEXIÓN:', error.message);
  }
})();

// Ruta de prueba Health Check
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'OK', db_check: rows[0].solution });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message });
    }
});


// 6. INICIAR SERVIDOR

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});