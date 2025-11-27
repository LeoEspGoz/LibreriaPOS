
// 1. SEGURIDAD Y CONFIGURACIÓN

const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuarioPOS'));

if (!usuarioLogueado) {
    window.location.href = '/login.html';
} else {
    document.body.style.display = "block";
    
    // Mostrar nombre de usuario
    const displayNombre = document.getElementById('nombre-usuario');
    if (displayNombre) {
        displayNombre.textContent = `${usuarioLogueado.NombreUsuario} (${usuarioLogueado.Rol})`;
    }
    
    // SI ES VENDEDOR, OCULTAMOS COSAS DE ADMIN
    if (usuarioLogueado.Rol !== 'Admin') {
        // Ocultar botón de agregar (Buscamos por el onclick)
        const btnAgregar = document.querySelector('button[onclick="toggleFormulario()"]');
        if (btnAgregar) btnAgregar.style.display = 'none';
        
        // Ocultar sección de auditoría
        const auditSection = document.querySelector('.audit-section');
        if (auditSection) auditSection.style.display = 'none';

        // Ocultar enlaces del menú que no le corresponden
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            if (link.href.includes('empleados') || link.href.includes('reportes')) {
                link.style.display = 'none';
            }
        });
    }
}


// 2. INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(); // Cargar la tabla al iniciar
    
    // Solo cargamos auditoría si es Admin
    if (usuarioLogueado && usuarioLogueado.Rol === 'Admin') {
        cargarAuditoria();
    }
});


// 3. FUNCIONES DEL FORMULARIO (CRUD)


function toggleFormulario() {
    const form = document.getElementById('form-agregar');
    // Si está oculto, lo mostramos limpio (como Nuevo)
    if (form.style.display === 'none' || form.style.display === '') {
        limpiarFormulario(); 
        form.style.display = 'block';
        document.getElementById('new-isbn').focus();
    } else {
        limpiarFormulario(); // Al cerrar, limpiamos
    }
}

// 1. CARGAR DATOS EN EL FORMULARIO (Al dar clic en Editar)
function cargarDatosEdicion(id, isbn, nombre, desc, precio, stock) {
    const form = document.getElementById('form-agregar');
    form.style.display = 'block';
    
    // Rellenamos los campos
    document.getElementById('edit-id').value = id; 
    document.getElementById('new-isbn').value = isbn;
    document.getElementById('new-titulo').value = nombre;
    document.getElementById('new-desc').value = desc;
    document.getElementById('new-precio').value = precio;
    document.getElementById('new-stock').value = stock;

    // Estilo visual "Modo Edición"
    document.getElementById('form-titulo').textContent = "Editar Libro";
    document.getElementById('form-titulo').style.color = "#ffc107"; // Amarillo
    document.getElementById('btn-submit').textContent = "🔄 Actualizar Libro";
    document.getElementById('form-agregar').style.borderLeft = "5px solid #ffc107";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. FUNCIÓN INTELIGENTE: GUARDAR O ACTUALIZAR
// 2. FUNCIÓN INTELIGENTE: GUARDAR O ACTUALIZAR CON VALIDACIÓN ESTRICTA
async function guardarProducto() {
    // 1. OBTENER DATOS
    const id = document.getElementById('edit-id').value;
    const isbn = document.getElementById('new-isbn').value.trim();
    const nombre = document.getElementById('new-titulo').value.trim();
    const descripcion = document.getElementById('new-desc').value.trim();
    
    // Convertimos a números para validar rangos
    const precioStr = document.getElementById('new-precio').value;
    const stockStr = document.getElementById('new-stock').value;
    const precio = parseFloat(precioStr);
    const stock = parseInt(stockStr);

    // 2. VALIDACIONES (RÚBRICA)
    
    // A. Campos Obligatorios
    if (!isbn || !nombre || !precioStr || !stockStr) {
        return alert("⚠️ Error: Todos los campos marcados son obligatorios.");
    }

    // B. Validación de Tipos y Rangos (Precio)
    if (isNaN(precio) || precio <= 0) {
        return alert("⚠️ Error: El PRECIO debe ser un número mayor a 0.");
    }

    // C. Validación de Tipos y Rangos (Stock)
    // El stock puede ser 0, pero no negativo, y debe ser entero
    if (isNaN(stock) || stock < 0 || !Number.isInteger(parseFloat(stockStr))) {
        return alert("⚠️ Error: El STOCK debe ser un número entero positivo (0 o más).");
    }

    // D. Longitud de Texto (Ejemplo para ISBN y Nombre)
    if (isbn.length < 3) {
        return alert("⚠️ Error: El ISBN es demasiado corto (mínimo 3 caracteres).");
    }
    
    // 3. PREPARAR OBJETO
    const datosLibro = { isbn, nombre, descripcion, precio, stock };

    // 4. ENVIAR AL BACKEND
    try {
        let url = '/api/productos';
        let method = 'POST';

        if (id) {
            url += `/${id}`; 
            method = 'PUT';
        }

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosLibro)
        });

        const result = await res.json();

        if (res.ok) {
            alert("✅ " + result.message);
            limpiarFormulario(); 
            cargarProductos();
            if (usuarioLogueado.Rol === 'Admin') cargarAuditoria();
        } else {
            // Si el error viene del servidor (ej. ISBN duplicado)
            alert("❌ Error del sistema: " + result.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error crítico de conexión.");
    }
}
// 3. LIMPIAR FORMULARIO (Resetear a estado "Nuevo")
function limpiarFormulario() {
    document.getElementById('edit-id').value = '';
    document.getElementById('new-isbn').value = '';
    document.getElementById('new-titulo').value = '';
    document.getElementById('new-desc').value = '';
    document.getElementById('new-precio').value = '';
    document.getElementById('new-stock').value = '1';

    // Regresar estilos a "Nuevo Libro"
    document.getElementById('form-titulo').textContent = "Nuevo Libro";
    document.getElementById('form-titulo').style.color = "#28a745"; // Verde
    document.getElementById('btn-submit').textContent = "💾 Guardar Libro";
    document.getElementById('form-agregar').style.borderLeft = "5px solid #28a745";
    document.getElementById('form-agregar').style.display = 'none';
}


// 4. FUNCIONES DE LECTURA Y ELIMINACIÓN


async function cargarProductos() {
    try {
        // Truco anti-caché
        const res = await fetch(`/api/productos?t=${new Date().getTime()}`);
        const productos = await res.json();
        
        const tbody = document.getElementById('tabla-productos');
        tbody.innerHTML = ''; 

        productos.forEach(prod => {
            let botonesAccion = '';
            
            if (usuarioLogueado.Rol === 'Admin') {
                // Pasamos todos los datos a la función cargarDatosEdicion
                // Usamos comillas simples para strings y manejamos nulos con || ''
                botonesAccion = `
                    <div style="display:flex; gap:5px; justify-content:center;">
                        <button class="btn-edit" 
                            onclick="cargarDatosEdicion('${prod.Clave}', '${prod.ISBN}', '${prod.Nombre}', '${prod.Descripcion || ''}', '${prod.Precio}', '${prod.Stock}')" 
                            title="Editar Completo">✏️</button>
                        
                        <button class="btn-danger" 
                            onclick="eliminarProducto('${prod.Clave}')" 
                            title="Eliminar">🗑️</button>
                    </div>
                `;
            } else {
                botonesAccion = '<span style="color:gray; font-size:0.8em;">Solo Lectura</span>';
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prod.ISBN}</td>
                <td><strong>${prod.Nombre}</strong></td>
                <td>${prod.Descripcion || ''}</td>
                <td class="text-right">$${parseFloat(prod.Precio).toFixed(2)}</td>
                <td class="text-center">${prod.Stock}</td>
                <td class="text-center">${botonesAccion}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

async function eliminarProducto(id) {
    if (!confirm("¿Estás seguro de que quieres eliminar este libro?")) return;

    try {
        const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
        const data = await res.json();

        if (res.ok) {
            alert("🗑️ " + data.message);
            cargarProductos();
            cargarAuditoria();
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Error de conexión");
    }
}

// ==============================================================
// 5. AUDITORÍA Y SESIÓN
// ==============================================================

async function cargarAuditoria() {
    try {
        const res = await fetch(`/api/productos/audit?t=${new Date().getTime()}`);
        const auditoria = await res.json();

        const tbody = document.getElementById('tabla-auditoria');
        tbody.innerHTML = '';

        auditoria.forEach(log => {
            // Colores según acción
            let color = '#333';
            if(log.Accion === 'INSERT') color = 'green';
            if(log.Accion === 'UPDATE') color = '#ffc107';
            if(log.Accion === 'DELETE') color = 'red';

            tbody.innerHTML += `
                <tr>
                    <td style="font-size:0.85em">${new Date(log.FechaHora).toLocaleString()}</td>
                    <td style="font-weight:bold; color:${color}">${log.Accion}</td>
                    <td style="color:#d9534f; font-size:0.9em">${log.ValorAnterior || '-'}</td>
                    <td style="color:#28a745; font-size:0.9em">${log.ValorNuevo || '-'}</td>
                    <td style="font-style:italic">${log.Usuario}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error cargando auditoría:', error);
    }
}

function logout() {
    sessionStorage.removeItem('usuarioPOS');
    window.location.href = '/login.html';
}