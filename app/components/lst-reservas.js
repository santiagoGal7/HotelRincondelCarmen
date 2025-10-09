import { getReservas, deleteReserva } from '../../Apis/reservaApi.js';
import { getHabitaciones } from '../../Apis/habitacionApi.js';
import { getUsuarios } from '../../Apis/usuarioApi.js';

export class LstReservas extends HTMLElement {
    constructor() {
        super();
        this.reservas = [];
        this.habitaciones = {};
        this.usuarios = {};
        this.render();
        this.loadReservas();
    }

    async loadReservas() {
        const tbody = this.querySelector('#reservas-table');
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600 mx-auto"></div>
                </td>
            </tr>
        `;
        try {
            const [reservasData, habitacionesData, usuariosData] = await Promise.all([
                getReservas(),
                getHabitaciones(),
                getUsuarios()
            ]);
            this.habitaciones = habitacionesData.reduce((acc, h) => {
                acc[h.id] = h;
                return acc;
            }, {});
            this.usuarios = usuariosData.reduce((acc, u) => {
                acc[u.id] = u.nombre;
                return acc;
            }, {});
            const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
            const admin = JSON.parse(localStorage.getItem('adminLogueado'));
            this.reservas = admin ? reservasData : reservasData.filter(r => r.usuarioId === usuario?.id);
            if (!usuario && !admin) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-red-500">
                            Debes iniciar sesión para ver tus reservas
                        </td>
                    </tr>
                `;
                return;
            }
            this.showReservas();
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-red-500">
                        Error al cargar las reservas. Por favor, intente nuevamente.
                    </td>
                </tr>
            `;
        }
    }

    showReservas() {
        const tbody = this.querySelector('#reservas-table');
        if (this.reservas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No hay reservas registradas</td>
                </tr>
            `;
            return;
        }
        tbody.innerHTML = this.reservas.map(r => `
            <tr>
                <td class="p-2">${r.id}</td>
                <td class="p-2">Habitación ${r.habitacionId}</td>
                <td class="p-2">${this.usuarios[r.usuarioId] || 'Usuario desconocido'}</td>
                <td class="p-2">${r.fechaInicio}</td>
                <td class="p-2">${r.fechaFin}</td>
                <td class="p-2">${r.personas}</td>
                <td class="p-2">$${r.total.toLocaleString()}</td>
                <td class="p-2">
                    <button class="bg-red-600 text-white p-1 rounded hover:bg-red-700" data-id="${r.id}">Cancelar</button>
                </td>
            </tr>
        `).join('');
        tbody.querySelectorAll('button[data-id]').forEach(btn => {
            btn.addEventListener('click', () => this.cancelarReserva(btn.dataset.id));
        });
    }

    async cancelarReserva(id) {
        if (confirm('¿Confirmar cancelación de la reserva?')) {
            try {
                await deleteReserva(parseInt(id));
                this.loadReservas();
            } catch (error) {
                alert('Error al cancelar: ' + error.message);
            }
        }
    }

    render() {
        this.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md mt-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold">Mis Reservas</h3>
                    <button class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" id="btnRecargar">Recargar</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left table-auto">
                        <thead class="bg-gray-200">
                            <tr>
                                <th class="p-2">ID</th>
                                <th class="p-2">Habitación</th>
                                <th class="p-2">Usuario</th>
                                <th class="p-2">Fecha Inicio</th>
                                <th class="p-2">Fecha Fin</th>
                                <th class="p-2">Personas</th>
                                <th class="p-2">Total</th>
                                <th class="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="reservas-table"></tbody>
                    </table>
                </div>
            </div>
        `;
        this.querySelector('#btnRecargar').addEventListener('click', () => this.loadReservas());
        document.addEventListener('reservasUpdated', () => this.loadReservas());
    }
}
customElements.define('lst-reservas', LstReservas);