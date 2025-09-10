document.addEventListener('DOMContentLoaded', () => {
    const formContacto = document.getElementById('form-contacto');

    formContacto.addEventListener('submit', (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombre-contacto').value.trim();
        const email = document.getElementById('email-contacto').value.trim();
        const mensaje = document.getElementById('mensaje-contacto').value.trim();

        // Validación de campos vacíos
        if (!nombre || !email || !mensaje) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        // Validación de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, introduce un email válido.');
            return;
        }
        
        // Si todo es correcto, muestra el alert de éxito y resetea
        alert('¡Mensaje enviado con éxito!'); // Requisito: "Mostrar alert success al enviar"
        formContacto.reset();
    });
});