import { RegHabitacion } from './reg-habitacion.js';
import { LstHabitaciones } from './lst-habitaciones.js';
import { RegReserva } from './reg-reserva.js';
import { LstReservas } from './lst-reservas.js';

export class HotelComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">Gestión del Hotel</h2>
                <ul class="flex border-b mb-4" role="tablist">
                    <li class="mr-1">
                        <a class="block px-4 py-2 text-gray-600 hover:bg-blue-100 rounded-t-lg active:bg-blue-600 active:text-white" href="#" data-tab="reg-reserva">Registrar Reserva</a>
                    </li>
                    <li class="mr-1">
                        <a class="block px-4 py-2 text-gray-600 hover:bg-blue-100 rounded-t-lg active:bg-blue-600 active:text-white" href="#" data-tab="lst-reservas">Listar Reservas</a>
                    </li>
                    <li class="mr-1">
                        <a class="block px-4 py-2 text-gray-600 hover:bg-blue-100 rounded-t-lg active:bg-blue-600 active:text-white" href="#" data-tab="reg-habitacion">Registrar Habitación</a>
                    </li>
                    <li class="mr-1">
                        <a class="block px-4 py-2 text-gray-600 hover:bg-blue-100 rounded-t-lg active:bg-blue-600 active:text-white" href="#" data-tab="lst-habitaciones">Listar Habitaciones</a>
                    </li>
                </ul>
                <div id="tab-content">
                    <reg-reserva></reg-reserva>
                </div>
            </div>
        `;
        this.setupTabs();
    }

    setupTabs() {
        const tabs = this.querySelectorAll('[data-tab]');
        const content = this.querySelector('#tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                tabs.forEach(t => t.classList.remove('active:bg-blue-600', 'active:text-white'));
                tab.classList.add('active:bg-blue-600', 'active:text-white');

                switch (tab.dataset.tab) {
                    case 'reg-reserva':
                        content.innerHTML = '<reg-reserva></reg-reserva>';
                        break;
                    case 'lst-reservas':
                        content.innerHTML = '<lst-reservas></lst-reservas>';
                        break;
                    case 'reg-habitacion':
                        content.innerHTML = '<reg-habitacion></reg-habitacion>';
                        break;
                    case 'lst-habitaciones':
                        content.innerHTML = '<lst-habitaciones></lst-habitaciones>';
                        break;
                }
            });
        });
    }
}
customElements.define('hotel-component', HotelComponent);