document.addEventListener('DOMContentLoaded', () => {
    const formReserva = document.getElementById('form-reserva');

    formReserva.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío tradicional del formulario

        // --- 1. CAPTURAR DATOS DEL FORMULARIO ---
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const personas = parseInt(document.getElementById('personas').value);
        const fechaHora = document.getElementById('fecha').value;
        const zona = document.getElementById('zona').value;

        // --- 2. VALIDACIONES (CORREGIDO) ---
        if (!nombre || !email || !telefono || isNaN(personas) || !fechaHora || !zona) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // --- AÑADIR ESTA VALIDACIÓN ---
        // Validación de número de personas
        if (personas < 1 || personas > 6) {
            alert('El número de personas debe ser entre 1 y 6.');
            return;
        }
        // -----------------------------

        // Validación de email con una expresión regular simple
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, introduce un email válido.');
            return;
        }

        // Validación de teléfono (solo números, 10 dígitos)
        const telefonoRegex = /^\d{10}$/;
        if (!telefonoRegex.test(telefono)) {
            alert('El teléfono debe contener 10 dígitos y solo números.');
            return;
        }

        // Validación de fecha y hora (no en el pasado)
        const fechaSeleccionada = new Date(fechaHora);
        const fechaActual = new Date();
        if (fechaSeleccionada < fechaActual) {
            alert('La fecha y hora de la reserva no pueden estar en el pasado.');
            return;
        }

        // --- 3. SI TODAS LAS VALIDACIONES PASAN ---
        const reserva = {
            nombre,
            email,
            telefono,
            personas,
            fecha: fechaSeleccionada.toLocaleDateString('es-MX'),
            hora: fechaSeleccionada.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
            zona
        };
        
        // Guardar en localStorage (guardaremos un array de reservas)
        const reservasGuardadas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservasGuardadas.push(reserva);
        localStorage.setItem('reservas', JSON.stringify(reservasGuardadas));

        // Formatear contenido para el archivo .txt
        let contenidoTxt = `GastroPro - Confirmación de Reserva\n`;
        contenidoTxt += `====================================\n`;
        contenidoTxt += `Cliente: ${reserva.nombre}\n`;
        contenidoTxt += `Teléfono: ${reserva.telefono}\n`;
        contenidoTxt += `Email: ${reserva.email}\n`;
        contenidoTxt += `Número de personas: ${reserva.personas}\n`;
        contenidoTxt += `Fecha: ${reserva.fecha}\n`;
        contenidoTxt += `Hora: ${reserva.hora} hrs\n`;
        contenidoTxt += `Zona: ${reserva.zona}\n`;
        contenidoTxt += `Estado: Confirmada\n`;
        contenidoTxt += `------------------------------------\n`;
        
        // Exportar archivo .txt
        const blob = new Blob([contenidoTxt], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reserva.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        // Mensaje de éxito y reseteo del formulario
        alert('¡Reserva guardada con éxito! Se ha descargado la confirmación.');
        formReserva.reset();
    });
});