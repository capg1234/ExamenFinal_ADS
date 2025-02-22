// Sistema del Carrito usando localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función principal para agregar productos
function addToCart(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre === nombre);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            id: Date.now(),
            nombre: nombre,
            precio: Number(precio),
            cantidad: 1
        });
    }
    
    guardarCarrito();
    mostrarNotificacion(`✅ ${nombre} agregado`);
}

// Función para guardar en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarVistaCarrito();
    actualizarContador(); // Actualiza el contador después de guardar
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 2000);
}

// Actualizar vista del carrito (para carrito.html)
function actualizarVistaCarrito() {
    const cartDiv = document.getElementById('cart');
    const totalSpan = document.getElementById('total');
    let total = 0;
    
    cartDiv.innerHTML = '';
    
    carrito.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="item-info">
                <h4>${item.nombre}</h4>
                <p>Cantidad: ${item.cantidad} - $${item.precio.toFixed(2)} c/u</p>
            </div>
            <div class="item-actions">
                <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                <button onclick="eliminarDelCarrito(${item.id})" class="remove-btn">Eliminar</button>
            </div>
        `;
        cartDiv.appendChild(itemDiv);
        total += item.precio * item.cantidad;
    });
    
    totalSpan.textContent = total.toFixed(2);
}

// Función para eliminar productos
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
}

// Función para actualizar el contador de artículos en el carrito
function actualizarContador() {
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    document.querySelectorAll('.contador-carrito').forEach(contador => {
        contador.textContent = totalItems;
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    actualizarVistaCarrito();
    actualizarContador(); // Actualiza el contador al cargar la página
    
    // Event listeners para todos los botones "Agregar al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const nombre = button.dataset.name;
            const precio = button.dataset.price;
            addToCart(nombre, precio);
        });
    });
});