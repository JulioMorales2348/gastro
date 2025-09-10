document.addEventListener('DOMContentLoaded', () => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let descuentoAplicado = 0; // 0 para 0%, 0.10 para 10%, etc.
    const tablaBody = document.getElementById('tabla-carrito-body');
    const carritoVacioMsg = document.getElementById('carrito-vacio');
    
    const aplicarCuponBtn = document.getElementById('aplicar-cupon-btn');
    const cuponInput = document.getElementById('cupon-input');
    const subtotalElem = document.getElementById('subtotal-carrito');
    const descuentoElem = document.getElementById('descuento-carrito');
    const totalElem = document.getElementById('total-carrito');

    const confirmarPedidoBtn = document.getElementById('confirmar-pedido-btn');
    const horaRecogidaInput = document.getElementById('hora-recogida');

    confirmarPedidoBtn.addEventListener('click', () => {
        // 1. Validación: Carrito no vacío
        if (carrito.length === 0) {
            alert('Error: Tu carrito está vacío.');
            return; // Detiene la ejecución
        }

        // 2. Validación: Hora de recogida
        const horaRecogida = horaRecogidaInput.value;
        if (!horaRecogida) {
            alert('Error: Debes seleccionar una hora de recogida.');
            return;
        }

        const horaSeleccionada = parseInt(horaRecogida.split(':')[0]);
        if (horaSeleccionada < 12 || horaSeleccionada >= 22) {
            alert('Error: La hora de recogida debe ser entre las 12:00 y las 21:59.');
            return;
        }

        // 3. Formatear el contenido del archivo .txt
        let contenidoTxt = 'GastroPro - Confirmación de Pedido\n';
        contenidoTxt += '====================================\n';
        contenidoTxt += `Hora de recogida: ${horaRecogida} hrs\n\n`;
        contenidoTxt += 'Platillos:\n';
        
        carrito.forEach(item => {
            const subtotalItem = item.precio * item.cantidad;
            contenidoTxt += `- ${item.cantidad}x ${item.nombre} ($${item.precio.toFixed(2)} c/u) = $${subtotalItem.toFixed(2)}\n`;
        });

        contenidoTxt += '\n------------------------------------\n';
        const subtotal = parseFloat(subtotalElem.textContent.replace('$', ''));
        const descuento = parseFloat(descuentoElem.textContent.replace('-$', ''));
        const total = parseFloat(totalElem.textContent.replace('$', ''));
        
        contenidoTxt += `Subtotal: $${subtotal.toFixed(2)}\n`;
        if (descuento > 0) {
            contenidoTxt += `Cupón aplicado: -$${descuento.toFixed(2)}\n`;
        }
        contenidoTxt += `Total: $${total.toFixed(2)}\n\n`;
        contenidoTxt += 'Gracias por ordenar en GastroPro.';

        // 4. Crear y descargar el archivo .txt
        const blob = new Blob([contenidoTxt], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orden.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 5. Limpiar el carrito después de confirmar
        carrito = [];
        localStorage.removeItem('carrito');
        renderizarCarrito(); // Actualizar la vista para mostrar el carrito vacío
        horaRecogidaInput.value = '';
        alert('¡Pedido confirmado con éxito! Se ha descargado el recibo.');
    });

    aplicarCuponBtn.addEventListener('click', () => {
        const codigoCupon = cuponInput.value.trim();
        if (codigoCupon === 'DESCUENTO10') {
            descuentoAplicado = 0.10; // 10% de descuento
            alert('¡Cupón aplicado correctamente!');
        } else {
            descuentoAplicado = 0;
            alert('El cupón no es válido.');
        }
        actualizarTotales(); // Recalculamos con el nuevo descuento
    });

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
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${item.id}">Eliminar</button>
                    </td>
                </tr>
            `;
            tablaBody.innerHTML += fila;
        });

        actualizarTotales();
    }

    // Reemplaza tu función actualizarTotales existente con esta
    function actualizarTotales() {
        const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const descuento = subtotal * descuentoAplicado; // Cálculo del descuento
        const total = subtotal - descuento;

        subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
        descuentoElem.textContent = `-$${descuento.toFixed(2)}`;
        totalElem.textContent = `$${total.toFixed(2)}`;
    }

    // ... justo después de la función actualizarTotales() ...

    // Event listener para los botones de eliminar (usando delegación)
    tablaBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-eliminar')) {
            const platilloId = parseInt(event.target.getAttribute('data-id'));
            eliminarDelCarrito(platilloId);
        }
    });

    function eliminarDelCarrito(id) {
        // Filtramos el carrito para crear un nuevo array sin el item eliminado
        carrito = carrito.filter(item => item.id !== id);

        // Guardamos el carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Volvemos a renderizar todo para que se actualice la vista
        renderizarCarrito();
    }

    renderizarCarrito();
});