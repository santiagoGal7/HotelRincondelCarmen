import './lst-habitaciones.js';
import './reg-reserva.js';

export class HotelComponent extends HTMLElement {
    constructor() {
        super();
        console.log('HotelComponent: Constructor ejecutado'); // Depuración
        this.render();
    }

    render() {
        console.log('HotelComponent: Renderizando componente'); // Depuración
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        const admin = JSON.parse(localStorage.getItem('adminLogueado'));
        let userMessage = 'Invitado';
        if (admin) {
            userMessage = 'Administrador';
        } else if (usuario) {
            userMessage = `Bienvenido, ${usuario.nombre}`;
        }

        this.innerHTML = `
            <div class="container mx-auto p-4">
                <h2 class="text-2xl font-bold mb-4 text-gray-800">Reservas</h2>
                <p class="mb-4 text-gray-600">Usuario actual: ${userMessage}</p>
                ${admin ? `
                    <div class="mb-4">
                        <h3 class="text-xl font-semibold mb-2">Gestión de Habitaciones</h3>
                        <reg-habitacion></reg-habitacion>
                    </div>
                    <div class="mb-4">
                        <h3 class="text-xl font-semibold mb-2">Listado de Habitaciones</h3>
                        <lst-habitaciones></lst-habitaciones>
                    </div>
                ` : ''}
                <div class="mb-4">
                    <h3 class="text-xl font-semibold mb-2">Hacer una Reserva</h3>
                    <reg-reserva></reg-reserva>
                </div>
                <div>
                    <h3 class="text-xl font-semibold mb-2">Mis Reservas</h3>
                    <lst-reservas></lst-reservas>
                </div>
            </div>
        `;
    }
}
customElements.define('hotel-component', HotelComponent);