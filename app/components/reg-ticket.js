import { postTicket } from '../../../apis/ticketApi.js';
import { getReservas } from '../../../apis/reservaApi.js';

export class RegTicket extends HTMLElement {
    constructor() {
        super();
        console.log('RegTicket: Constructor ejecutado');
        this.render();
        this.setupEvents();
    }

    async render() {
        console.log('RegTicket: Renderizando componente');
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        const usuarioId = usuario ? usuario.id : 'invitado';
        const reservas = usuarioId !== 'invitado' ? await getReservasByUsuario(usuarioId) : [];

        if (usuarioId === 'invitado') {
            this.innerHTML = `
                <div class="card max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">Quejas y Reclamos</h3>
                    <p class="text-red-500 text-center">Debe iniciar sesión para registrar una queja o reclamo.</p>
                </div>
            `;
            return;
        }

        this.innerHTML = `
            <div class="card max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Registrar Queja o Reclamo</h3>
                <form id="ticket-form">
                    <div class="mb-4">
                        <label class="form-label block text-gray-700">Reserva <span class="text-red-500">*</span></label>
                        <select id="ticket-reserva" class="form-control w-full border rounded p-2" required>
                            <option value="">Seleccione una reserva</option>
                            ${reservas.map(r => `<option value="${r.id}">Reserva ${r.id} - ${r.fechaInicio}</option>`).join('')}
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="form-label block text-gray-700">Asunto <span class="text-red-500">*</span></label>
                        <input type="text" id="ticket-asunto" class="form-control w-full border rounded p-2" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label block text-gray-700">Tipo <span class="text-red-500">*</span></label>
                        <select id="ticket-tipo" class="form-control w-full border rounded p-2" required>
                            <option value="Queja">Queja</option>
                            <option value="Reclamo">Reclamo</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="form-label block text-gray-700">Descripción <span class="text-red-500">*</span></label>
                        <textarea id="ticket-descripcion" class="form-control w-full border rounded p-2" rows="4" required></textarea>
                    </div>
                    <div class="flex justify-end">
                        <button type="button" class="btn-primary bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" id="ticket-btnGuardar">Guardar</button>
                    </div>
                </form>
            </div>
        `;
    }

    setupEvents() {
        console.log('RegTicket: Configurando eventos');
        const btnGuardar = this.querySelector('#ticket-btnGuardar');
        if (btnGuardar) {
            btnGuardar.addEventListener('click', async () => {
                console.log('RegTicket: Clic en Guardar');
                const form = this.querySelector('#ticket-form');
                const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
                const data = {
                    reservaId: form.querySelector('#ticket-reserva').value,
                    asunto: form.querySelector('#ticket-asunto').value,
                    tipo: form.querySelector('#ticket-tipo').value,
                    descripcion: form.querySelector('#ticket-descripcion').value,
                    usuarioId: usuario ? usuario.id : 'invitado'
                };
                if (!data.reservaId || !data.asunto || !data.tipo || !data.descripcion) {
                    alert('Por favor complete todos los campos obligatorios');
                    return;
                }
                try {
                    await postTicket(data);
                    alert('Queja/Reclamo registrado exitosamente');
                    form.reset();
                    document.dispatchEvent(new Event('ticketActualizado'));
                } catch (error) {
                    alert('Error al registrar: ' + error.message);
                }
            });
        }
    }
}
customElements.define('reg-ticket', RegTicket);