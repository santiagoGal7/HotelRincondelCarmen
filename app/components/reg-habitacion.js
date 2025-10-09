import { getHabitaciones, postHabitacion, patchHabitacion, deleteHabitacion } from '../../Apis/habitacionApi.js';

export class RegHabitacion extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.setupEvents();
        this.disableForm(true);
    }

    render() {
        this.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <h3 class="text-xl font-semibold mb-4">Gestionar Habitación <span class="text-blue-600" id="idView"></span></h3>
                <form id="habitacion-form">
                    <div class="mb-4">
                        <label class="block text-gray-700">Número de Camas <span class="text-red-500">*</span></label>
                        <input type="number" id="camas" min="1" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Máximo de Personas <span class="text-red-500">*</span></label>
                        <input type="number" id="maxPersonas" min="1" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Precio por Noche (COP) <span class="text-red-500">*</span></label>
                        <input type="number" id="precioNoche" min="0" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Servicios (separados por comas)</label>
                        <input type="text" id="servicios" class="w-full p-2 border rounded" placeholder="internet, minibar, jacuzzi">
                    </div>
                    <input type="hidden" id="id">
                    <div class="text-center">
                        <button type="button" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" id="btnNuevo">Nuevo</button>
                        <button type="button" class="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 disabled" id="btnCancelar">Cancelar</button>
                        <button type="button" class="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled" id="btnGuardar">Guardar</button>
                        <button type="button" class="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700 disabled" id="btnEditar">Editar</button>
                        <button type="button" class="bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled" id="btnEliminar">Eliminar</button>
                    </div>
                </form>
            </div>
        `;
    }

    setupEvents() {
        this.querySelector("#btnNuevo").addEventListener("click", () => this.handleNuevo());
        this.querySelector("#btnCancelar").addEventListener("click", () => this.handleCancelar());
        this.querySelector("#btnGuardar").addEventListener("click", () => this.handleGuardar());
        this.querySelector("#btnEditar").addEventListener("click", () => this.handleEditar());
        this.querySelector("#btnEliminar").addEventListener("click", () => this.handleEliminar());
    }

    handleNuevo() {
        const admin = JSON.parse(localStorage.getItem('adminLogueado'));
        if (!admin) {
            alert('Debes iniciar sesión como administrador');
            return;
        }
        this.disableForm(false);
        this.resetForm();
        this.toggleButtons(['btnGuardar', 'btnCancelar'], ['btnNuevo', 'btnEditar', 'btnEliminar']);
    }

    handleCancelar() {
        this.disableForm(true);
        this.resetForm();
        this.toggleButtons(['btnNuevo'], ['btnGuardar', 'btnCancelar', 'btnEditar', 'btnEliminar']);
    }

    async handleGuardar() {
        const admin = JSON.parse(localStorage.getItem('adminLogueado'));
        if (!admin) {
            alert('Debes iniciar sesión como administrador');
            return;
        }
        const form = this.querySelector('#habitacion-form');
        const data = {
            camas: parseInt(form.querySelector('#camas').value),
            maxPersonas: parseInt(form.querySelector('#maxPersonas').value),
            precioNoche: parseInt(form.querySelector('#precioNoche').value),
            servicios: form.querySelector('#servicios').value.split(',').map(s => s.trim()).filter(s => s)
        };
        if (!data.camas || !data.maxPersonas || !data.precioNoche) {
            alert('Por favor complete todos los campos obligatorios (*)');
            return;
        }
        try {
            const id = form.querySelector('#id').value;
            let response;
            if (id) {
                response = await patchHabitacion(data, parseInt(id));
                alert('Habitación actualizada con éxito');
            } else {
                response = await postHabitacion(data);
                alert('Habitación creada con éxito');
            }
            this.viewData(response.id);
            this.toggleButtons(['btnNuevo', 'btnEditar', 'btnCancelar', 'btnEliminar'], ['btnGuardar']);
            this.disableForm(true);
            document.dispatchEvent(new Event('habitacionesUpdated'));
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        }
    }

    async handleEditar() {
        const id = this.querySelector('#idView').textContent;
        if (!id) return;
        const form = this.querySelector('#habitacion-form');
        const data = {
            camas: parseInt(form.querySelector('#camas').value),
            maxPersonas: parseInt(form.querySelector('#maxPersonas').value),
            precioNoche: parseInt(form.querySelector('#precioNoche').value),
            servicios: form.querySelector('#servicios').value.split(',').map(s => s.trim()).filter(s => s)
        };
        if (!data.camas || !data.maxPersonas || !data.precioNoche) {
            alert('Por favor complete todos los campos obligatorios (*)');
            return;
        }
        try {
            await patchHabitacion(data, parseInt(id));
            alert('Habitación actualizada con éxito');
        } catch (error) {
            alert('Error al actualizar: ' + error.message);
        }
    }

    async handleEliminar() {
        const id = this.querySelector('#idView').textContent;
        if (!id) return;
        if (!confirm('¿Está seguro de eliminar esta habitación?')) return;
        try {
            await deleteHabitacion(id);
            this.resetForm();
            this.disableForm(true);
            this.toggleButtons(['btnNuevo'], ['btnGuardar', 'btnCancelar', 'btnEditar', 'btnEliminar']);
            alert('Habitación eliminada con éxito');
            document.dispatchEvent(new Event('habitacionesUpdated'));
        } catch (error) {
            alert('Error al eliminar: ' + error.message);
        }
    }

    async editHabitacion(id) {
        const habitaciones = await getHabitaciones();
        const habitacion = habitaciones.find(h => h.id === parseInt(id));
        if (habitacion) {
            this.querySelector('#camas').value = habitacion.camas;
            this.querySelector('#maxPersonas').value = habitacion.maxPersonas;
            this.querySelector('#precioNoche').value = habitacion.precioNoche;
            this.querySelector('#servicios').value = habitacion.servicios.join(', ');
            this.querySelector('#id').value = id;
            this.viewData(id);
            this.disableForm(false);
            this.toggleButtons(['btnGuardar', 'btnCancelar', 'btnEditar', 'btnEliminar'], ['btnNuevo']);
        }
    }

    toggleButtons(enable, disable) {
        enable.forEach(id => this.querySelector(`#${id}`).classList.remove('disabled'));
        disable.forEach(id => this.querySelector(`#${id}`).classList.add('disabled'));
    }

    viewData(id) {
        this.querySelector('#idView').textContent = id;
    }

    resetForm() {
        this.querySelector('#habitacion-form').reset();
        this.querySelector('#idView').textContent = '';
    }

    disableForm(disabled) {
        const form = this.querySelector('#habitacion-form');
        Array.from(form.elements).forEach(el => {
            if (el.tagName !== 'BUTTON') el.disabled = disabled;
        });
    }
}
customElements.define('reg-habitacion', RegHabitacion);