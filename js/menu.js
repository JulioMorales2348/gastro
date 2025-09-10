// Array de objetos con los datos de los platillos
const platillos = [
    {
        id: 1,
        nombre: 'Guacamole Fresco',
        descripcion: 'Aguacate machacado con cebolla, tomate, cilantro y un toque de limón.',
        precio: 120,
        imagen: 'img/platillos/guacamole.jpg', // Asegúrate de tener esta imagen
        categoria: 'Entradas'
    },
    {
        id: 2,
        nombre: 'Tacos al Pastor',
        descripcion: 'Carne de cerdo marinada, asada en trompo, servida con piña, cebolla y cilantro.',
        precio: 180,
        imagen: 'img/platillos/tacos_pastor.jpg', // Asegúrate de tener esta imagen
        categoria: 'Platos Fuertes'
    },
    {
        id: 3,
        nombre: 'Flan Napolitano',
        descripcion: 'Postre cremoso de huevo, leche y caramelo, horneado a la perfección.',
        precio: 90,
        imagen: 'img/platillos/flan.jpg', // Asegúrate de tener esta imagen
        categoria: 'Postres'
    },
    {
        id: 4,
        nombre: 'Agua de Horchata',
        descripcion: 'Bebida refrescante a base de arroz, canela y un toque de vainilla.',
        precio: 40,
        imagen: 'img/platillos/horchata.jpg', // Asegúrate de tener esta imagen
        categoria: 'Bebidas'
    },
    // Puedes agregar más platillos aquí...
];

// Carrito de Compras
let carrito = [];

// Event Listener principal para agregar al carrito (usando delegación de eventos)
document.addEventListener('DOMContentLoaded', () => {
    // Cargar carrito de localStorage si existe
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    mostrarPlatillos(platillos);

    // ... (el código de los filtros va aquí) ...

    const menuContainer = document.getElementById('menu-container');
    menuContainer.addEventListener('click', (event) => {
        // Identificamos si el clic fue en un botón de "Agregar al carrito"
        if (event.target.classList.contains('btn-agregar')) {
            const platilloId = parseInt(event.target.getAttribute('data-id'));
            agregarAlCarrito(platilloId);
        }
    });
});

function agregarAlCarrito(id) {
    // Buscamos si el platillo ya existe en el carrito para aumentar la cantidad
    const platilloExistente = carrito.find(item => item.id === id);

    if (platilloExistente) {
        platilloExistente.cantidad++;
    } else {
        // Si no existe, lo buscamos en la lista original y lo agregamos
        const platilloAAgregar = platillos.find(item => item.id === id);
        carrito.push({
            ...platilloAAgregar,
            cantidad: 1
        });
    }

    // Guardamos el carrito actualizado en localStorage
    guardarCarritoEnStorage();
    
    // Opcional: Mostrar una confirmación
    alert('¡Platillo agregado al carrito!');
}

function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    mostrarPlatillos(platillos);
    const botonesFiltro = document.querySelectorAll('.btn-group .btn');

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            // Manejo visual del botón activo
            botonesFiltro.forEach(btn => btn.classList.remove('active'));
            boton.classList.add('active');

            const categoria = boton.textContent; // "Todos", "Entradas", etc.

            if (categoria === 'Todos') {
                mostrarPlatillos(platillos);
            } else {
                const platillosFiltrados = platillos.filter(platillo => platillo.categoria === categoria);
                mostrarPlatillos(platillosFiltrados);
            }
        });
    });
});

// Función para renderizar los platillos en el HTML
function mostrarPlatillos(listaPlatillos) {
    const contenedorPlatillos = document.getElementById('menu-container');
    contenedorPlatillos.innerHTML = ''; // Limpiar el contenedor antes de mostrar nuevos platillos

    listaPlatillos.forEach(platillo => {
        // Creamos el HTML para cada card usando template literals
        const platilloHTML = `
            <div class="col">
                <div class="card h-100">
                    <img src="${platillo.imagen}" class="card-img-top" alt="${platillo.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${platillo.nombre}</h5>
                        <p class="card-text">${platillo.descripcion}</p>
                        <p class="card-text fw-bold">$${platillo.precio.toFixed(2)}</p>
                        <button class="btn btn-primary btn-agregar" data-id="${platillo.id}"><i class="bi bi-cart-plus"></i> Agregar al carrito</button>
                    </div>
                </div>
            </div>
        `;
        // Agregamos la card al contenedor
        contenedorPlatillos.innerHTML += platilloHTML;
    });
}