export class HotelComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
        document.addEventListener('authUpdated', () => this.render());
    }

    render() {
        this.innerHTML = '';
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        const admin = JSON.parse(localStorage.getItem('adminLogueado'));

        let title = 'Gestión de Reservas';
        let tabs = `
            <li class="mr-1">
                <a class="inline-block py-2 px-4 text-blue-600 font-semibold border-b-2 border-blue-600" href="#" data-view="reg-reserva">Registrar Reserva</a>
            </li>
            <li class="mr-1">
                <a class="inline-block py-2 px-4 text-gray-600 hover:text-blue-600" href="#" data-view="lst-reserva">Listado de Reservas</a>
            </li>
        `;
        if (admin) {
            title = 'Gestión del Hotel';
            tabs += `
                <li class="mr-1">
                    <a class="inline-block py-2 px-4 text-gray-600 hover:text-blue-600" href="#" data-view="reg-habitacion">Registrar Habitación</a>
                </li>
                <li class="mr-1">
                    <a class="inline-block py-2 px-4 text-gray-600 hover:text-blue-600" href="#" data-view="lst-habitacion">Listado de Habitaciones</a>
                </li>
            `;
        } else if (!usuario) {
            this.innerHTML = '<p class="text-red-500 text-center">Debes iniciar sesión para acceder a reservas.</p>';
            return;
        }

        this.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                <h2 class="text-2xl font-semibold text-center text-gray-800 mb-4">${title}</h2>
                <ul class="flex border-b mb-4">
                    ${tabs}
                </ul>
                <div id="tab-content">
                    <reg-reserva></reg-reserva>
                </div>
            </div>
        `;
        this.setupTabs();
    }

    setupTabs() {
        const tabs = this.querySelectorAll('a[data-view]');
        const content = this.querySelector('#tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                tabs.forEach(t => t.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600'));
                tab.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');

                switch (tab.dataset.view) {
                    case 'reg-reserva':
                        content.innerHTML = '<reg-reserva></reg-reserva>';
                        break;
                    case 'lst-reserva':
                        content.innerHTML = '<lst-reservas></lst-reservas>';
                        break;
                    case 'reg-habitacion':
                        content.innerHTML = '<reg-habitacion></reg-habitacion>';
                        break;
                    case 'lst-habitacion':
                        content.innerHTML = '<lst-habitaciones></lst-habitaciones>';
                        break;
                }
            });
        });
    }
}
customElements.define('hotel-component', HotelComponent);