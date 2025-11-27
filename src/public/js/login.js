// src/public/js/login.js

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    // Limpiar mensaje de error previo
    errorMsg.textContent = "";

    if (!username || !password) {
        errorMsg.textContent = "Por favor ingresa usuario y contraseña";
        return;
    }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
            // Guardamos al usuario en la memoria del navegador
            sessionStorage.setItem('usuarioPOS', JSON.stringify(data.user));
            
            // Redirigir a la pantalla de ventas
            window.location.href = '/ventas.html'; 
        } else {
            errorMsg.textContent = data.message;
        }
    } catch (error) {
        console.error(error);
        errorMsg.textContent = "Error de conexión con el servidor";
    }
}

// Opcional: Permitir hacer login presionando "Enter"
document.getElementById('password').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        login();
    }
});