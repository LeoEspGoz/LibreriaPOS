// Igual que en las otras pantallas
const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuarioPOS'));
if (!usuarioLogueado) {
    window.location.href = '/login.html';
} else if (usuarioLogueado.Rol !== 'Admin') {
    // Bloqueo de seguridad
    alert("Acceso denegado: Solo Administradores.");
    window.location.href = '/ventas.html';
} else {
    document.body.style.display = "block";
    const displayNombre = document.getElementById('nombre-usuario');
    if (displayNombre) {
        displayNombre.textContent = usuarioLogueado.NombreUsuario; // Usa el nombre real de la BD
       displayNombre.textContent = `${usuarioLogueado.NombreUsuario} (${usuarioLogueado.Rol})`;
    }
}
function logout() {
    sessionStorage.removeItem('usuarioPOS');
    window.location.href = '/login.html';
}

// ----------------------------------------------------
// LÓGICA REPORTE EMPLEADOS
// ----------------------------------------------------
async function generarReporteEmpleados() {
    const inicio = document.getElementById('fechaInicio').value;
    const fin = document.getElementById('fechaFin').value;

    if (!inicio || !fin) return alert("Selecciona ambas fechas");

    try {
        const res = await fetch(`/api/reportes/empleados?fechaInicio=${inicio}&fechaFin=${fin}`);
        const data = await res.json();

        const tbody = document.getElementById('tabla-empleados');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">No hay ventas en este rango</td></tr>';
            return;
        }

        data.forEach(emp => {
            const row = `<tr>
                <td>${emp.Clave}</td>
                <td>${emp.Nombre}</td>
                <td>$${parseFloat(emp.MontoVendido).toFixed(2)}</td>
            </tr>`;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error(error);
        alert("Error generando reporte");
    }
}

// ----------------------------------------------------
// LÓGICA REPORTE LIBROS
// ----------------------------------------------------
async function generarReporteLibros() {
    const mes = document.getElementById('selectMes').value;
    const anio = document.getElementById('inputAnio').value;

    try {
        const res = await fetch(`/api/reportes/libros?mes=${mes}&anio=${anio}`);
        const data = await res.json();

        const tbody = document.getElementById('tabla-libros');
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No se vendieron libros este mes</td></tr>';
            return;
        }

        data.forEach(libro => {
            const row = `<tr>
                <td>${libro.ISBN}</td>
                <td>${libro.Titulo}</td>
                <td>${libro.Descripcion}</td>
                <td>$${parseFloat(libro.Costo).toFixed(2)}</td>
                <td>${libro.UnidadesVendidas}</td>
            </tr>`;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error(error);
        alert("Error generando reporte");
    }
}

// Establecer fechas por defecto al cargar (Mes actual)
document.addEventListener('DOMContentLoaded', () => {
    const hoy = new Date();
    document.getElementById('inputAnio').value = hoy.getFullYear();
    document.getElementById('selectMes').value = hoy.getMonth() + 1;
});