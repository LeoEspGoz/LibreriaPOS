const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuarioPOS'));

// Si no hay sesión, lo mandamos al login
if (!usuarioLogueado) {
    window.location.href = '/login.html';
} else {
    // Si hay sesión, mostramos la pantalla
    // (Asegúrate de poner el estilo display:none en el HTML como veremos abajo)
    document.body.style.display = "block"; 
}
// Cargar productos al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarAuditoria();
});

// Función para obtener productos del Backend
async function cargarProductos() {
    try {
        const response = await fetch('/api/productos');
        const productos = await response.json();
        
        const tbody = document.getElementById('tabla-productos');
        tbody.innerHTML = ''; // Limpiar tabla

        productos.forEach(prod => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${prod.ISBN}</td>
                <td>${prod.Nombre}</td>
                <td>${prod.Descripcion}</td>
                <td>$${prod.Precio}</td>
                <td>${prod.Stock}</td>
                <td>
                    <button class="btn-edit" onclick="editarPrecio('${prod.Clave}')">✏️ Editar Precio</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

// Función para editar precio (Esto dispara el TRIGGER)
async function editarPrecio(id) {
    const nuevoPrecio = prompt("Ingresa el nuevo precio:");
    if (!nuevoPrecio) return;

    try {
        const response = await fetch(`/api/productos/${id}/precio`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nuevoPrecio: parseFloat(nuevoPrecio) })
        });

        const data = await response.json();
        alert(data.message);
        
        // Recargar las tablas para ver los cambios y la auditoría
        cargarProductos();
        cargarAuditoria();
    } catch (error) {
        alert("Error actualizando precio");
    }
}

// Función para cargar la tabla de Auditoría (Inciso H)
async function cargarAuditoria() {
    try {
        const response = await fetch('/api/productos/audit');
        const auditoria = await response.json();

        const tbody = document.getElementById('tabla-auditoria');
        tbody.innerHTML = '';

        auditoria.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(log.FechaHora).toLocaleString()}</td>
                <td>${log.Accion}</td>
                <td>${log.ValorAnterior}</td>
                <td>${log.ValorNuevo}</td>
                <td>${log.Usuario}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando auditoría:', error);
    }
}
function logout() {
    sessionStorage.removeItem('usuarioPOS');
    window.location.href = '/login.html';
}