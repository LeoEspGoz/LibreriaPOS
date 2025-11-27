
// 1. SEGURIDAD Y CONFIGURACIÓN

const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuarioPOS'));

if (!usuarioLogueado) {
    window.location.href = '/login.html';
} else if (usuarioLogueado.Rol !== 'Admin') {
    alert("Acceso denegado: Solo Administradores.");
    window.location.href = '/ventas.html';
} else {
    document.body.style.display = "block";
    
    // Mostrar nombre del usuario en el header
    const displayNombre = document.getElementById('nombre-usuario');
    if (displayNombre) {
        displayNombre.textContent = usuarioLogueado.NombreUsuario;
    }
}

// Cargar empleados al inicio
document.addEventListener('DOMContentLoaded', cargarEmpleados);

// 2. FUNCIONES DE CARGA (READ)

async function cargarEmpleados() {
    try {
        // TRUCO ANTI-CACHÉ: Agregamos ?t=tiempo para obligar a descargar datos frescos
        const url = `/api/empleados?t=${new Date().getTime()}`;
        
        const res = await fetch(url);
        const empleados = await res.json();
        
        const tbody = document.getElementById('tabla-empleados');
        tbody.innerHTML = '';
        
        empleados.forEach(emp => {
            // Formatear fecha simple (YYYY-MM-DD)
            const fecha = new Date(emp.FechaIngreso).toLocaleDateString();
            
            tbody.innerHTML += `
                <tr>
                    <td class="text-center">${emp.EmpleadoID}</td>
                    <td><strong>${emp.Nombre}</strong></td>
                    <td>${emp.Puesto}</td>
                    <td>${emp.Telefono}</td>
                    <td>${fecha}</td>
                    <td class="text-center">
                        <button class="btn-edit" onclick="cargarDatosEdicion(${emp.EmpleadoID}, '${emp.Nombre}', '${emp.Puesto}', '${emp.Telefono}')" title="Editar">✏️</button>
                        <button class="btn-danger" onclick="eliminarEmpleado(${emp.EmpleadoID})" title="Eliminar">🗑️</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error cargando empleados:", error);
    }
}


// 3. FUNCIONES DE ESCRITURA (CREATE / UPDATE)

async function guardarEmpleado() {
    const id = document.getElementById('empId').value;
    
    // Datos Personales
    const nombre = document.getElementById('nombre').value;
    const puesto = document.getElementById('puesto').value;
    const telefono = document.getElementById('telefono').value;
    
    // Datos Login
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    // Validaciones
    if (!nombre || !puesto) return alert("El nombre y el puesto son obligatorios.");

    // Si es nuevo registro, validamos que tenga usuario y contraseña
    if (!id && (!usuario || !password)) {
        return alert("Para crear un nuevo empleado, debes asignar Usuario y Contraseña.");
    }

    const datos = { nombre, puesto, telefono, usuario, password, rol };
    
    try {
        let url = '/api/empleados';
        let method = 'POST';

        // Si hay ID, es una EDICIÓN (PUT)
        if (id) {
            url += `/${id}`;
            method = 'PUT';
        }

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const result = await res.json();
        
        if (res.ok) {
            alert("✅ " + result.message);
            limpiarFormulario();
            cargarEmpleados(); // <--- ESTO ACTUALIZA LA TABLA
        } else {
            alert("❌ Error: " + result.message);
        }
        
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}


// 4. FUNCIONES DE ELIMINACIÓN (DELETE)

async function eliminarEmpleado(id) {
    if(!confirm("¿Estás seguro de eliminar este empleado y su acceso al sistema?")) return;

    try {
        const res = await fetch(`/api/empleados/${id}`, { method: 'DELETE' });
        const result = await res.json();

        if (res.ok) {
            alert("🗑️ " + result.message);
            cargarEmpleados(); // <--- ACTUALIZA LA TABLA DESPUÉS DE BORRAR
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        alert("Error eliminando");
    }
}


// 5. UTILIDADES

function cargarDatosEdicion(id, nombre, puesto, telefono) {
    document.getElementById('empId').value = id;
    document.getElementById('nombre').value = nombre;
    document.getElementById('puesto').value = puesto;
    document.getElementById('telefono').value = telefono;
    
    // Bloqueamos los campos de login porque el SP de editar actual solo edita datos personales
    // (Según la lógica actual del SP_EditarEmpleado)
    document.getElementById('usuario').disabled = true;
    document.getElementById('password').disabled = true;
    document.getElementById('rol').disabled = true;
    document.getElementById('usuario').placeholder = "(No editable)";
    document.getElementById('password').placeholder = "(No editable)";

    document.getElementById('btn-guardar').textContent = "Actualizar Empleado";
    document.getElementById('btn-guardar').style.backgroundColor = "#ffc107"; // Amarillo para indicar edición
    document.getElementById('btn-guardar').style.color = "#333";
}

function limpiarFormulario() {
    document.getElementById('empId').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('puesto').value = '';
    document.getElementById('telefono').value = '';
    
    // Reactivar campos de login para nuevos registros
    document.getElementById('usuario').value = '';
    document.getElementById('password').value = '';
    document.getElementById('rol').value = 'Vendedor';
    
    document.getElementById('usuario').disabled = false;
    document.getElementById('password').disabled = false;
    document.getElementById('rol').disabled = false;
    document.getElementById('usuario').placeholder = "Usuario para login";
    document.getElementById('password').placeholder = "Contraseña";

    document.getElementById('btn-guardar').textContent = "💾 Guardar Empleado";
    document.getElementById('btn-guardar').style.backgroundColor = "#007bff"; // Azul original
    document.getElementById('btn-guardar').style.color = "white";
}

function logout() {
    sessionStorage.removeItem('usuarioPOS');
    window.location.href = '/login.html';
}