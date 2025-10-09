import { getHabitaciones } from '../../Apis/habitacionApi.js';
import { postReserva } from '../../Apis/reservaApi.js';

export class RegReserva extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.setupEvents();
        this.loadHabitaciones();
        this.disableForm(true);
    }

    async loadHabitaciones() {
        const select = this.querySelector('#habitacionId');
        try {
            const habitaciones = await getHabitaciones();
            if (habitaciones.length === 0) {
                select.innerHTML = '<option value="">No hay habitaciones disponibles</option>';
                select.disabled = true;
                this.querySelector('#alertaHabitaciones').style.display = 'block';
            } else {
                select.innerHTML = '<option value="">Seleccione una habitación</option>' +
                    habitaciones.map(h => `<option value="${h.id}">Habitación ${h.id} (${h.camas} camas, hasta ${h.maxPersonas} personas)</option>`).join('');
                select.disabled = false;
                this.querySelector('#alertaHabitaciones').style.display = 'none';
            }
        } catch (error) {
            console.error('Error al cargar habitaciones:', error);
            select.innerHTML = '<option value="">Error al cargar habitaciones</option>';
            select.disabled = true;
            this.querySelector('#alertaHabitaciones').style.display = 'block';
        }
    }

    render() {
        this.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Nueva Reserva</h3>
                <div class="bg-yellow-100 text-yellow-800 p-4 rounded mb-4 hidden" id="alertaHabitaciones">
                    <strong>¡Atención!</strong> No hay habitaciones disponibles. Registre una habitación primero.
                </div>
                <form id="reserva-form">
                    <div class="mb-4">
                        <label class="block text-gray-700">Fecha de Inicio <span class="text-red-500">*</span></label>
                        <input type="date" id="fechaInicio" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Fecha de Fin <span class="text-red-500">*</span></label>
                        <input type="date" id="fechaFin" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Número de Personas <span class="text-red-500">*</span></label>
                        <input type="number" id="personas" min="1" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Habitación <span class="text-red-500">*</span></label>
                        <select id="habitacionId" class="w-full p-2 border rounded" required>
                            <option value="">Cargando habitaciones...</option>
                        </select>
                    </div>
                    <div id="precioTotal" class="mb-4 text-gray-700 hidden"></div>
                    <div class="text-center">
                        <button type="button" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" id="btnNuevo">Nuevo</button>
                        <button type="button" class="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 disabled" id="btnCancelar">Cancelar</button>
                        <button type="button" class="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled" id="btnGuardar">Guardar</button>
                    </div>
                </form>
            </div>
        `;
    }

    setupEvents() {
        this.querySelector('#btnNuevo').addEventListener('click', () => this.handleNuevo());
        this.querySelector('#btnCancelar').addEventListener('click', () => this.handleCancelar());
        this.querySelector('#btnGuardar').addEventListener('click', () => this.handleGuardar());
        this.querySelector('#fechaInicio').addEventListener('change', () => this.updatePrecio());
        this.querySelector('#fechaFin').addEventListener('change', () => this.updatePrecio());
        this.querySelector('#personas').addEventListener('change', () => this.updatePrecio());
        this.querySelector('#habitacionId').addEventListener('change', () => this.updatePrecio());
    }

    handleNuevo() {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        if (!usuario) {
            alert('Debes iniciar sesión para hacer una reserva');
            return;
        }
        if (this.querySelector('#habitacionId').disabled) {
            alert('No hay habitaciones disponibles');
            return;
        }
        this.disableForm(false);
        this.resetForm();
        this.toggleButtons(['btnGuardar', 'btnCancelar'], ['btnNuevo']);
    }

    handleCancelar() {
        this.disableForm(true);
        this.resetForm();
        this.toggleButtons(['btnNuevo'], ['btnGuardar', 'btnCancelar']);
    }

    async handleGuardar() {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
        if (!usuario) {
            alert('Debes iniciar sesión para hacer una reserva');
            return;
        }
        const form = this.querySelector('#reserva-form');
        const data = {
            id: Date.now(),
            habitacionId: parseInt(form.querySelector('#habitacionId').value),
            usuarioId: usuario.id,
            fechaInicio: form.querySelector('#fechaInicio').value,
            fechaFin: form.querySelector('#fechaFin').value,
            personas: parseInt(form.querySelector('#personas').value),
            total: await this.calculateTotal()
        };
        if (!data.habitacionId || !data.fechaInicio || !data.fechaFin || !data.personas) {
            alert('Por favor complete todos los campos obligatorios (*)');
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        if (data.fechaInicio < today) {
            alert('La fecha de inicio debe ser hoy o en el futuro');
            return;
        }
        if (data.fechaFin <= data.fechaInicio) {
            alert('La fecha de fin debe ser posterior a la fecha de inicio');
            return;
        }
        try {
            await postReserva(data);
            alert('Reserva realizada con éxito');
            this.disableForm(true);
            this.resetForm();
            this.toggleButtons(['btnNuevo'], ['btnGuardar', 'btnCancelar']);
            document.dispatchEvent(new Event('reservasUpdated'));
        } catch (error) {
            alert('Error al reservar: ' + error.message);
        }
    }

    async updatePrecio() {
        const fechaInicio = this.querySelector('#fechaInicio').value;
        const fechaFin = this.querySelector('#fechaFin').value;
        const personas = parseInt(this.querySelector('#personas').value);
        const habitacionId = parseInt(this.querySelector('#habitacionId').value);
        const precioTotalDiv = this.querySelector('#precioTotal');

        if (fechaInicio && fechaFin && personas && habitacionId) {
            const today = new Date().toISOString().split('T')[0];
            if (fechaInicio < today) {
                precioTotalDiv.textContent = 'Error: Fecha de inicio debe ser hoy o futura';
                precioTotalDiv.classList.remove('hidden');
                return;
            }
            if (fechaFin <= fechaInicio) {
                precioTotalDiv.textContent = 'Error: Fecha de fin debe ser posterior a inicio';
                precioTotalDiv.classList.remove('hidden');
                return;
            }
            const habitaciones = await getHabitaciones();
            const habitacion = habitaciones.find(h => h.id === habitacionId);
            if (habitacion && personas <= habitacion.maxPersonas) {
                const start = new Date(fechaInicio);
                const end = new Date(fechaFin);
                const noches = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                const total = noches * habitacion.precioNoche;
                precioTotalDiv.textContent = `Precio total: $${total.toLocaleString()} por ${noches} noche(s)`;
                precioTotalDiv.classList.remove('hidden');
            } else {
                precioTotalDiv.textContent = 'Error: Verifique el número de personas';
                precioTotalDiv.classList.remove('hidden');
            }
        } else {
            precioTotalDiv.classList.add('hidden');
        }
    }

    async calculateTotal() {
        const fechaInicio = this.querySelector('#fechaInicio').value;
        const fechaFin = this.querySelector('#fechaFin').value;
        const habitacionId = parseInt(this.querySelector('#habitacionId').value);
        const start = new Date(fechaInicio);
        const end = new Date(fechaFin);
        const noches = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const habitaciones = await getHabitaciones();
        const habitacion = habitaciones.find(h => h.id === habitacionId);
        return noches * habitacion.precioNoche;
    }

    toggleButtons(enable, disable) {
        enable.forEach(id => this.querySelector(`#${id}`).classList.remove('disabled'));
        disable.forEach(id => this.querySelector(`#${id}`).classList.add('disabled'));
    }

    resetForm() {
        this.querySelector('#reserva-form').reset();
        this.querySelector('#precioTotal').classList.add('hidden');
    }

    disableForm(disabled) {
        const form = this.querySelector('#reserva-form');
        Array.from(form.elements).forEach(el => {
            if (el.tagName !== 'BUTTON') el.disabled = disabled;
        });
    }
}
customElements.define('reg-reserva', RegReserva);