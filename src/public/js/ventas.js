let carrito = [];

// Escuchar el escáner (o teclado)
const inputISBN = document.getElementById('input-isbn');
inputISBN.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const isbn = this.value.trim();
        if (isbn) {
            buscarProducto(isbn);
        }
        this.value = ''; // Limpiar para el siguiente producto
    }
});

// Buscar producto en la API que hicimos en la Fase 3
async function buscarProducto(isbn) {
    try {
        const res = await fetch(`/api/productos/${isbn}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        
        const producto = await res.json();
        agregarAlCarrito(producto);
    } catch (error) {
        alert(error.message);
    }
}

function agregarAlCarrito(producto) {
    // Verificar si ya está en el carrito para sumar cantidad
    const existente = carrito.find(item => item.Clave === producto.Clave);
    
    if (existente) {
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

function renderizarCarrito() {
    const tbody = document.getElementById('tabla-carrito');
    tbody.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.Precio * item.cantidad;
        total += subtotal;

        tbody.innerHTML += `
            <tr>
                <td>${item.Nombre}</td>
                <td>$${item.Precio.toFixed(2)}</td>
                <td>${item.cantidad}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button onclick="eliminarItem(${index})">❌</button></td>
            </tr>
        `;
    });

    document.getElementById('total-display').textContent = `$${total.toFixed(2)}`;
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    renderizarCarrito();
}

async function procesarVenta() {
    if (carrito.length === 0) return alert("El carrito está vacío");

    const dataVenta = {
        usuarioId: 1, // Hardcodeado temporalmente hasta que hagamos el Login
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
            alert(`✅ Venta registrada! ID: ${result.ventaId}`);
            carrito = []; // Limpiar
            renderizarCarrito();
            inputISBN.focus();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}