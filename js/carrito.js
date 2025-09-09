document.addEventListener('DOMContentLoaded', () => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const tablaBody = document.getElementById('tabla-carrito-body');
    const carritoVacioMsg = document.getElementById('carrito-vacio');
    
    const subtotalElem = document.getElementById('subtotal-carrito');
    const descuentoElem = document.getElementById('descuento-carrito');
    const totalElem = document.getElementById('total-carrito');

    function renderizarCarrito() {
        tablaBody.innerHTML = ''; // Limpiar tabla

        if (carrito.length === 0) {
            carritoVacioMsg.style.display = 'block';
            return;
        }
        carritoVacioMsg.style.display = 'none';
        
        carrito.forEach(item => {
            const subtotalItem = item.precio * item.cantidad;
            const fila = `
                <tr>
                    <td>${item.nombre}</td>
                    <td>$${item.precio.toFixed(2)}</td>
                    <td class="text-center">${item.cantidad}</td>
                    <td>$${subtotalItem.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-danger btn-sm">Eliminar</button>
                    </td>
                </tr>
            `;
            tablaBody.innerHTML += fila;
        });

        actualizarTotales();
    }

    function actualizarTotales() {
        const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        // Lógica de descuento (la implementaremos después)
        const descuento = 0;
        const total = subtotal - descuento;

        subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
        descuentoElem.textContent = `-$${descuento.toFixed(2)}`;
        totalElem.textContent = `$${total.toFixed(2)}`;
    }

    renderizarCarrito();
});