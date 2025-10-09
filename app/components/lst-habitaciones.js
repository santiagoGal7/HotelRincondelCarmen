import { getHabitaciones, deleteHabitacion } from '../../apis/habitacionApi.js';

export class LstHabitaciones extends HTMLElement {
    constructor() {
        super();
        this.habitaciones = [];
        this.render();
        this.loadHabitaciones();
    }

    async loadHabitaciones() {
        const tbody = this.querySelector('#habitaciones-table');
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600 mx-auto"></div>
                </td>
            </tr>
        `;
        const admin = JSON.parse(localStorage.getItem('adminLogueado'));
        if (!admin) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-red-500">
                        Acceso restringido: Inicia sesión como administrador
                    </td>
                </tr>
            `;
            return;
        }
        try {
            this.habitaciones = await getHabitaciones();
            this.showHabitaciones();
        } catch (error) {
            console.error('Error al cargar habitaciones:', error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-red-500">
                        Error al cargar las habitaciones. Por favor, intente nuevamente.
                    </td>
                </tr>
            `;
        }
    }

    showHabitaciones() {
        const tbody = this.querySelector('#habitaciones-table');
        if (this.habitaciones.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No hay habitaciones registradas</td>
                </tr>
            `;
            return;
        }
        tbody.innerHTML = this.habitaciones.map(h => `
            <tr>
                <td class="p-2">${h.id}</td>
                <td class="p-2">${h.camas}</td>
                <td class="p-2">${h.maxPersonas}</td>
                <td class="p-2">$${h.precioNoche.toLocaleString()}</td>
                <td class="p-2">${h.servicios.join(', ')}</td>
                <td class="p-2">
                    <button class="bg-blue-600 text-white p-1 rounded hover:bg-blue-700" data-id="${h.id}">Editar</button>
                    <button class="bg-red-600 text-white p-1 rounded hover:bg-red-700" data-id="${h.id}">Eliminar</button>
                </td>
            </tr>
        `).join('');
        tbody.querySelectorAll('button[data-id]').forEach(btn => {
            if (btn.textContent === 'Editar') {
                btn.addEventListener('click', () => {
                    const regHabitacion = document.querySelector('reg-habitacion');
                    if (regHabitacion) regHabitacion.editHabitacion(btn.dataset.id);
                });
            } else {
                btn.addEventListener('click', () => this.deleteHabitacion(btn.dataset.id));
            }
        });
    }

    async deleteHabitacion(id) {
        if (confirm('¿Confirmar eliminación de la habitación?')) {
            try {
                await deleteHabitacion(parseInt(id));
                this.loadHabitaciones();
            } catch (error) {
                alert('Error al eliminar: ' + error.message);
            }
        }
    }

    render() {
        this.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md mt-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">Lista de Habitaciones</h3>
                    <button class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" id="btnRecargar">Recargar</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left table-auto">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="p-2">ID</th>
                                <th class="p-2">Camas</th>
                                <th class="p-2">Máx. Personas</th>
                                <th class="p-2">Precio/Noche</th>
                                <th class="p-2">Servicios</th>
                                <th class="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="habitaciones-table"></tbody>
                    </table>
                </div>
            </div>
        `;
        this.querySelector('#btnRecargar').addEventListener('click', () => this.loadHabitaciones());
    }
}
customElements.define('lst-habitaciones', LstHabitaciones);