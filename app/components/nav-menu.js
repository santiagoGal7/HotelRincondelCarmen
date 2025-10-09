import './reg-usuario.js';

export class NavMenu extends HTMLElement {
    constructor() {
        super();
        console.log('NavMenu: Constructor ejecutado'); // Depuración
        this.render();
        document.addEventListener('usuarioLogueado', () => {
            console.log('NavMenu: Evento usuarioLogueado recibido'); // Depuración
            this.updateNav();
        });
        document.addEventListener('adminLogueado', () => {
            console.log('NavMenu: Evento adminLogueado recibido'); // Depuración
            this.updateNav();
        });
        this.updateNav();
    }

    render() {
        console.log('NavMenu: Renderizando navbar'); // Depuración
        this.innerHTML = `
            <nav class="bg-gray-800 text-white p-4">
                <div class="container mx-auto flex justify-between items-center">
                    <div class="text-xl font-bold">Hotel El Rincón del Carmen</div>
                    <ul class="flex space-x-4">
                        <li><a href="#" class="nav-link hover:text-blue-600" data-module="inicio">Inicio</a></li>
                        <li><a href="#" class="nav-link hover:text-blue-600" data-module="reservas">Reservas</a></li>
                        <li><a href="#" class="nav-link hover:text-blue-600" data-module="contacto">Contacto</a></li>
                        <li id="auth-link"><a href="#" class="nav-link hover:text-blue-600" data-module="auth">Iniciar Sesión</a></li>
                    </ul>
                </div>
            </nav>
        `;

        console.log('NavMenu: Configurando eventos para nav-links'); // Depuración
        this.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = e.target.dataset.module;
                const mainContent = document.querySelector('#mainContent');
                mainContent.innerHTML = '';

                console.log('NavMenu: Click en módulo', module); // Depuración

                if (module === 'inicio') {
                    mainContent.innerHTML = `
                        <h1 class="text-4xl font-bold text-center text-gray-800 mb-4">Bienvenidos al Hotel El Rincón del Carmen</h1>
                        <p class="text-lg text-center text-gray-600 mb-6">Disfruta de una experiencia única con nuestras cómodas habitaciones y servicios exclusivos.</p>
                        <hotel-carousel></hotel-carousel>
                        <div class="mt-8">
                            <h2 class="text-2xl font-semibold text-center text-gray-800 mb-4">Nuestros Servicios</h2>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="text-center">
                                    <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 mb-3">
                                        <img src="images/servicios/gastronomia/comida1.jpg" alt="Comida 1" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/gastronomia/comida2.jpg" alt="Comida 2" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/gastronomia/comida3.jpg" alt="Comida 3" class="w-full h-48 object-cover rounded-lg snap-center">
                                    </div>
                                    <h3 class="text-xl font-semibold">Gastronomía</h3>
                                    <p class="text-gray-600">Deléitate con nuestra oferta culinaria de primera calidad.</p>
                                </div>
                                <div class="text-center">
                                    <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 mb-3">
                                        <img src="images/servicios/spa/spa1.jpg" alt="Spa 1" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/spa/spa2.jpg" alt="Spa 2" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/spa/spa3.jpg" alt="Spa 3" class="w-full h-48 object-cover rounded-lg snap-center">
                                    </div>
                                    <h3 class="text-xl font-semibold">Spa</h3>
                                    <p class="text-gray-600">Relájate en nuestro spa con tratamientos exclusivos.</p>
                                </div>
                                <div class="text-center">
                                    <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 mb-3">
                                        <img src="images/servicios/piscina/piscina1.jpg" alt="Piscina 1" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/piscina/piscina2.jpg" alt="Piscina 2" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/piscina/piscina3.jpg" alt="Piscina 3" class="w-full h-48 object-cover rounded-lg snap-center">
                                    </div>
                                    <h3 class="text-xl font-semibold">Zonas Húmedas</h3>
                                    <p class="text-gray-600">Disfruta de nuestra piscina y jacuzzi al aire libre.</p>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (module === 'reservas') {
                    mainContent.innerHTML = '<hotel-component></hotel-component>';
                } else if (module === 'contacto') {
                    mainContent.innerHTML = '<contacto-section></contacto-section>';
                } else if (module === 'auth') {
                    console.log('NavMenu: Intentando cargar reg-usuario'); // Depuración
                    try {
                        mainContent.innerHTML = '<reg-usuario></reg-usuario>';
                        console.log('NavMenu: reg-usuario cargado en mainContent'); // Depuración
                    } catch (error) {
                        console.error('NavMenu: Error al cargar reg-usuario', error);
                        mainContent.innerHTML = '<div class="text-center text-red-500">Error al cargar el formulario de inicio de sesión</div>';
                    }
                } else if (module === 'logout') {
                    console.log('NavMenu: Cerrando sesión'); // Depuración
                    localStorage.removeItem('usuarioLogueado');
                    localStorage.removeItem('adminLogueado');
                    document.dispatchEvent(new Event('usuarioLogueado'));
                    alert('Sesión cerrada');
                    mainContent.innerHTML = `
                        <h1 class="text-4xl font-bold text-center text-gray-800 mb-4">Bienvenidos al Hotel El Rincón del Carmen</h1>
                        <p class="text-lg text-center text-gray-600 mb-6">Disfruta de una experiencia única con nuestras cómodas habitaciones y servicios exclusivos.</p>
                        <hotel-carousel></hotel-carousel>
                        <div class="mt-8">
                            <h2 class="text-2xl font-semibold text-center text-gray-800 mb-4">Nuestros Servicios</h2>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="text-center">
                                    <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 mb-3">
                                        <img src="images/servicios/gastronomia/comida1.jpg" alt="Comida 1" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/gastronomia/comida2.jpg" alt="Comida 2" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/gastronomia/comida3.jpg" alt="Comida 3" class="w-full h-48 object-cover rounded-lg snap-center">
                                    </div>
                                    <h3 class="text-xl font-semibold">Gastronomía</h3>
                                    <p class="text-gray-600">Deléitate con nuestra oferta culinaria de primera calidad.</p>
                                </div>
                                <div class="text-center">
                                    <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 mb-3">
                                        <img src="images/servicios/spa/spa1.jpg" alt="Spa 1" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/spa/spa2.jpg" alt="Spa 2" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/spa/spa3.jpg" alt="Spa 3" class="w-full h-48 object-cover rounded-lg snap-center">
                                    </div>
                                    <h3 class="text-xl font-semibold">Spa</h3>
                                    <p class="text-gray-600">Relájate en nuestro spa con tratamientos exclusivos.</p>
                                </div>
                                <div class="text-center">
                                    <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 mb-3">
                                        <img src="images/servicios/piscina/piscina1.jpg" alt="Piscina 1" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/piscina/piscina2.jpg" alt="Piscina 2" class="w-full h-48 object-cover rounded-lg snap-center">
                                        <img src="images/servicios/piscina/piscina3.jpg" alt="Piscina 3" class="w-full h-48 object-cover rounded-lg snap-center">
                                    </div>
                                    <h3 class="text-xl font-semibold">Zonas Húmedas</h3>
                                    <p class="text-gray-600">Disfruta de nuestra piscina y jacuzzi al aire libre.</p>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    console.error('NavMenu: Módulo desconocido', module);
                }
            });
        });
    }

    updateNav() {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        const admin = JSON.parse(localStorage.getItem('adminLogueado'));
        const authLink = this.querySelector('#auth-link');

        console.log('NavMenu: Actualizando navbar', { usuario, admin }); // Depuración

        if (admin) {
            authLink.innerHTML = '<a href="#" class="nav-link hover:text-blue-600" data-module="logout">Cerrar Sesión (Admin)</a>';
        } else if (usuario) {
            authLink.innerHTML = '<a href="#" class="nav-link hover:text-blue-600" data-module="logout">Cerrar Sesión (Usuario)</a>';
        } else {
            authLink.innerHTML = '<a href="#" class="nav-link hover:text-blue-600" data-module="auth">Iniciar Sesión</a>';
        }
    }
}
customElements.define('nav-menu', NavMenu);