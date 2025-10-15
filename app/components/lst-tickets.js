import { getTicketsByUsuario, deleteTicket } from '../../../apis/ticketApi.js';

export class LstTickets extends HTMLElement {
    constructor() {
        super();
        console.log('LstTickets: Constructor ejecutado');
        this.render();
        document.addEventListener('ticketActualizado', () => this.render());
    }

    async render() {
        console.log('LstTickets: Renderizando componente');
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        const usuarioId = usuario ? usuario.id : 'invitado';
        const tickets = usuarioId !== 'invitado' ? await getTicketsByUsuario(usuarioId) : [];

        if (usuarioId === 'invitado') {
            this.innerHTML = `
                <div class="card max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">Mis Quejas y Reclamos</h3>
                    <p class="text-red-500 text-center">Debe iniciar sesión para ver sus quejas/reclamos.</p>
                </div>
            `;
            return;
        }

        this.innerHTML = `
            <div class="card max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Mis Quejas y Reclamos</h3>
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="p-2">Fecha</th>
                            <th class="p-2">Asunto</th>
                            <th class="p-2">Tipo</th>
                            <th class="p-2">Estado</th>
                            <th class="p-2">Respuesta</th>
                            <th class="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tickets.length ? tickets.map(t => `
                            <tr class="border-b">
                                <td class="p-2">${new Date(t.fecha).toLocaleDateString()}</td>
                                <td class="p-2">${t.asunto}</td>
                                <td class="p-2">${t.tipo}</td>
                                <td class="p-2">${t.estado}</td>
                                <td class="p-2">${t.respuesta || 'Sin respuesta'}</td>
                                <td class="p-2">
                                    ${t.estado === 'Pendiente' ? `<button class="btn-delete bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-id="${t.id}">Eliminar</button>` : ''}
                                </td>
                            </tr>
                        `).join('') : '<tr><td colspan="6" class="p-2 text-center">No hay quejas/reclamos registrados</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;

        this.setupEvents();
    }

    setupEvents() {
        console.log('LstTickets: Configurando eventos');
        this.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.dataset.id;
                try {
                    const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
                    await deleteTicket(id, usuario.id);
                    alert('Ticket eliminado exitosamente');
                    this.render();
                } catch (error) {
                    alert('Error al eliminar: ' + error.message);
                }
            });
        });
    }
}
customElements.define('lst-tickets', LstTickets);