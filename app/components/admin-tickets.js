import { getAllTickets, updateTicket } from '../../../apis/ticketApi.js';
import { getReservas } from '../../../apis/reservaApi.js';
import { getUsuarios } from '../../../apis/usuarioApi.js';

export class AdminTickets extends HTMLElement {
    constructor() {
        super();
        console.log('AdminTickets: Constructor ejecutado');
        this.render();
        document.addEventListener('ticketActualizado', () => this.render());
    }

    async render() {
        console.log('AdminTickets: Renderizando componente');
        const tickets = await getAllTickets();
        const reservas = await getReservas();
        const usuarios = await getUsuarios();

        this.innerHTML = `
            <div class="card max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Gestión de Quejas y Reclamos</h3>
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="p-2">Fecha</th>
                            <th class="p-2">Tipo</th>
                            <th class="p-2">Asunto</th>
                            <th class="p-2">Usuario</th>
                            <th class="p-2">Estado</th>
                            <th class="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tickets.length ? tickets.map(t => {
                            const usuario = usuarios.find(u => u.id === t.usuarioId) || { nombre: 'Desconocido' };
                            return `
                                <tr class="border-b">
                                    <td class="p-2">${new Date(t.fecha).toLocaleDateString()}</td>
                                    <td class="p-2">${t.tipo}</td>
                                    <td class="p-2">${t.asunto}</td>
                                    <td class="p-2">${usuario.nombre}</td>
                                    <td class="p-2">${t.estado}</td>
                                    <td class="p-2">
                                        <button class="btn-responder bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" data-id="${t.id}">Responder</button>
                                    </td>
                                </tr>
                            `;
                        }).join('') : '<tr><td colspan="6" class="p-2 text-center">No hay quejas/reclamos registrados</td></tr>'}
                    </tbody>
                </table>
                <div id="responder-form" class="mt-4 hidden">
                    <h4 class="text-lg font-semibold mb-2">Responder Ticket</h4>
                    <form id="admin-ticket-form">
                        <div class="mb-4">
                            <label class="form-label block text-gray-700">Respuesta</label>
                            <textarea id="ticket-respuesta" class="form-control w-full border rounded p-2" rows="4" required></textarea>
                        </div>
                        <div class="mb-4">
                            <label class="form-label block text-gray-700">Estado</label>
                            <select id="ticket-estado" class="form-control w-full border rounded p-2" required>
                                <option value="Resuelto">Resuelto</option>
                                <option value="Rechazado">Rechazado</option>
                            </select>
                        </div>
                        <div class="flex justify-end space-x-2">
                            <button type="button" class="btn-cancel bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" id="ticket-btnCancelar">Cancelar</button>
                            <button type="button" class="btn-primary bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" id="ticket-btnGuardar">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.setupEvents();
    }

    setupEvents() {
        console.log('AdminTickets: Configurando eventos');
        this.querySelectorAll('.btn-responder').forEach(button => {
            button.addEventListener('click', () => {
                this.querySelector('#responder-form').classList.remove('hidden');
                this.currentTicketId = button.dataset.id;
            });
        });

        this.querySelector('#ticket-btnCancelar').addEventListener('click', () => {
            this.querySelector('#responder-form').classList.add('hidden');
            this.querySelector('#admin-ticket-form').reset();
        });

        this.querySelector('#ticket-btnGuardar').addEventListener('click', async () => {
            const respuesta = this.querySelector('#ticket-respuesta').value;
            const estado = this.querySelector('#ticket-estado').value;
            if (!respuesta || !estado) {
                alert('Por favor complete la respuesta y el estado');
                return;
            }
            try {
                await updateTicket(this.currentTicketId, { respuesta, estado });
                alert('Respuesta guardada exitosamente');
                this.querySelector('#responder-form').classList.add('hidden');
                this.querySelector('#admin-ticket-form').reset();
                this.render();
            } catch (error) {
                alert('Error al guardar respuesta: ' + error.message);
            }
        });
    }
}
customElements.define('admin-tickets', AdminTickets);