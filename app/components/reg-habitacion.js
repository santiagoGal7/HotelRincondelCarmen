import { postHabitacion } from '../../apis/habitacionApi.js';

export class RegHabitacion extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="card">
                <h3 class="text-xl font-semibold mb-4">Registrar Habitación</h3>
                <form id="habitacion-form">
                    <div class="mb-4">
                        <label class="form-label">Tipo <span class="text-red-500">*</span></label>
                        <input type="text" class="form-control w-full" id="habitacion-tipo" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Precio por Noche <span class="text-red-500">*</span></label>
                        <input type="number" class="form-control w-full" id="habitacion-precio" required min="0">
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Capacidad <span class="text-red-500">*</span></label>
                        <input type="number" class="form-control w-full" id="habitacion-capacidad" required min="1">
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button type="button" class="btn-primary" id="habitacion-btnGuardar">Guardar</button>
                        <button type="button" class="btn-danger disabled" id="habitacion-btnCancelar">Cancelar</button>
                    </div>
                </form>
            </div>
        `;
        this.setupForm();
    }

    setupForm() {
        const form = this.querySelector('#habitacion-form');
        const btnGuardar = this.querySelector('#habitacion-btnGuardar');
        const btnCancelar = this.querySelector('#habitacion-btnCancelar');

        form.addEventListener('input', () => {
            btnCancelar.classList.remove('disabled');
        });

        btnGuardar.addEventListener('click', async () => {
            const tipo = this.querySelector('#habitacion-tipo').value;
            const precio = parseFloat(this.querySelector('#habitacion-precio').value);
            const capacidad = parseInt(this.querySelector('#habitacion-capacidad').value);

            if (!tipo || isNaN(precio) || isNaN(capacidad)) {
                alert('Por favor complete todos los campos obligatorios (*)');
                return;
            }

            try {
                await postHabitacion({ tipo, precio, capacidad });
                alert('Habitación registrada con éxito');
                form.reset();
                btnCancelar.classList.add('disabled');
            } catch (error) {
                alert(error.message);
            }
        });

        btnCancelar.addEventListener('click', () => {
            form.reset();
            btnCancelar.classList.add('disabled');
        });
    }
}
customElements.define('reg-habitacion', RegHabitacion);