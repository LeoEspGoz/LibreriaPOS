
// Verificamos si existe la sesión. Si no, pateamos al usuario al login.
const usuarioLogueado = JSON.parse(sessionStorage.getItem('usuarioPOS'));

if (!usuarioLogueado) {
    window.location.href = '/login.html';
} else {
    // Si pasó la seguridad, mostramos el cuerpo de la página
    // (Asegúrate de tener body { display: none; } en tu CSS para que funcione el efecto)
    document.body.style.display = "flex"; 
    
    // Opcional: Si quieres mostrar el nombre del cajero en algún lado:
    // console.log("Cajero activo:", usuarioLogueado.NombreUsuario);
}


let carrito = [];
const inputISBN = document.getElementById('input-isbn');


inputISBN.focus();


inputISBN.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const isbn = this.value.trim();
        if (isbn) {
            buscarProducto(isbn);
        }
        this.value = ''; // Limpiar input para el siguiente producto
    }
});


async function buscarProducto(isbn) {
    try {
        const res = await fetch(`/api/productos/${isbn}`);
        
        if (res.status === 404) {
            alert('Producto no encontrado');
            return;
        }

        const producto = await res.json();
        agregarAlCarrito(producto);
    } catch (error) {
        console.error(error);
        alert('Error al buscar el producto');
    }
}

// B. Agregar al Array del Carrito
function agregarAlCarrito(producto) {
    // Verificamos si ya existe para sumar cantidad
    const existente = carrito.find(item => item.Clave === producto.Clave);
    
    if (existente) {
        // Validar stock (Opcional visualmente, el backend valida igual)
        if (existente.cantidad + 1 > producto.Stock) {
            alert("Advertencia: Posible stock insuficiente");
        }
        existente.cantidad++;
    } else {
        carrito.push({
            Clave: producto.Clave,
            Nombre: producto.Nombre,
            Precio: parseFloat(producto.Precio),
            cantidad: 1
        });
    }
    renderizarCarrito();
}

// C. Dibujar la tabla HTML
function renderizarCarrito() {
    const tbody = document.getElementById('tabla-carrito');
    tbody.innerHTML = ''; // Limpiar tabla actual
    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.Precio * item.cantidad;
        total += subtotal;

        tbody.innerHTML += `
            <tr>
                <td>${item.Nombre}</td>
                <td>$${item.Precio.toFixed(2)}</td>
                <td>
                    <button onclick="cambiarCantidad(${index}, -1)">-</button>
                    ${item.cantidad}
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button onclick="eliminarItem(${index})" style="color:red;">🗑️</button></td>
            </tr>
        `;
    });

    document.getElementById('total-display').textContent = `$${total.toFixed(2)}`;
}

// D. Funciones auxiliares de la tabla
function eliminarItem(index) {
    carrito.splice(index, 1);
    renderizarCarrito();
    inputISBN.focus();
}

function cambiarCantidad(index, delta) {
    const item = carrito[index];
    if (item.cantidad + delta > 0) {
        item.cantidad += delta;
        renderizarCarrito();
    }
}

async function procesarVenta() {
    if (carrito.length === 0) return alert("El carrito está vacío");

    if (!confirm("¿Confirmar venta?")) return;

    const dataVenta = {
        usuarioId: usuarioLogueado.UsuarioID, // <--- AQUÍ USAMOS EL ID REAL DE LA SESIÓN
        items: carrito.map(item => ({
            productoId: item.Clave,
            cantidad: item.cantidad,
            precio: item.Precio
        }))
    };

    try {
        const res = await fetch('/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataVenta)
        });

        const result = await res.json();
        
        if (res.ok) {
            alert(`✅ Venta registrada con éxito!\nID Venta: ${result.ventaId}`);
            carrito = []; // Vaciar carrito
            renderizarCarrito();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión con el servidor");
    } finally {
        inputISBN.focus(); // Regresar foco al escáner
    }
}


function logout() {
    sessionStorage.removeItem('usuarioPOS'); // Borrar datos de sesión
    window.location.href = '/login.html';    // Redirigir al login
}