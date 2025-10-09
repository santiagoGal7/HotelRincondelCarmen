import { postUsuario, loginUsuario } from '../../apis/usuarioApi.js';
import { loginAdmin } from '../../apis/adminApi.js';

export class RegUsuario extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.setupEvents();
        this.disableForm(true);
    }

    render() {
        this.innerHTML = `
            <div class="card max-w-md mx-auto">
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Registro e Inicio de Sesión</h3>
                <form id="usuario-form">
                    <div class="mb-4">
                        <label class="form-label">Identificación <span class="text-red-500">*</span></label>
                        <input type="text" id="usuario-id" class="form-control w-full" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Nombre <span class="text-red-500">*</span></label>
                        <input type="text" id="usuario-nombre" class="form-control w-full" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Nacionalidad <span class="text-red-500">*</span></label>
                        <input type="text" id="usuario-nacionalidad" class="form-control w-full" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Email <span class="text-red-500">*</span></label>
                        <input type="email" id="usuario-email" class="form-control w-full" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Teléfono <span class="text-red-500">*</span></label>
                        <input type="tel" id="usuario-telefono" class="form-control w-full" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Contraseña <span class="text-red-500">*</span></label>
                        <input type="password" id="usuario-password" class="form-control w-full" required>
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button type="button" class="btn-primary" id="usuario-btnNuevo">Nuevo</button>
                        <button type="button" class="btn-danger disabled" id="usuario-btnCancelar">Cancelar</button>
                        <button type="button" class="btn-primary disabled" id="usuario-btnGuardar">Guardar</button>
                        <button type="button" class="btn-primary" id="usuario-btnLogin">Iniciar Sesión</button>
                        <button type="button" class="btn-primary" id="usuario-btnLoginAdmin">Iniciar Sesión Admin</button>
                    </div>
                </form>
            </div>
        `;
    }

    setupEvents() {
        this.querySelector('#usuario-btnNuevo').addEventListener('click', () => this.handleNuevo());
        this.querySelector('#usuario-btnCancelar').addEventListener('click', () => this.handleCancelar());
        this.querySelector('#usuario-btnGuardar').addEventListener('click', () => this.handleGuardar());
        this.querySelector('#usuario-btnLogin').addEventListener('click', () => this.handleLogin());
        this.querySelector('#usuario-btnLoginAdmin').addEventListener('click', () => this.handleLoginAdmin());
    }

    handleNuevo() {
        this.disableForm(false);
        this.resetForm();
        this.toggleButtons(['usuario-btnGuardar', 'usuario-btnCancelar'], ['usuario-btnNuevo', 'usuario-btnLogin', 'usuario-btnLoginAdmin']);
    }

    handleCancelar() {
        this.disableForm(true);
        this.resetForm();
        this.toggleButtons(['usuario-btnNuevo', 'usuario-btnLogin', 'usuario-btnLoginAdmin'], ['usuario-btnGuardar', 'usuario-btnCancelar']);
    }

    async handleGuardar() {
        const form = this.querySelector('#usuario-form');
        const data = {
            id: form.querySelector('#usuario-id').value,
            nombre: form.querySelector('#usuario-nombre').value,
            nacionalidad: form.querySelector('#usuario-nacionalidad').value,
            email: form.querySelector('#usuario-email').value,
            telefono: form.querySelector('#usuario-telefono').value,
            password: form.querySelector('#usuario-password').value
        };
        if (!data.id || !data.nombre || !data.nacionalidad || !data.email || !data.telefono || !data.password) {
            alert('Por favor complete todos los campos obligatorios (*)');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Por favor ingrese un email válido');
            return;
        }
        const phoneRegex = /^\+?\d{7,15}$/;
        if (!phoneRegex.test(data.telefono)) {
            alert('Por favor ingrese un número de teléfono válido (7-15 dígitos)');
            return;
        }
        try {
            const response = await postUsuario(data);
            alert('Usuario registrado exitosamente');
            this.disableForm(true);
            this.resetForm();
            this.toggleButtons(['usuario-btnNuevo', 'usuario-btnLogin', 'usuario-btnLoginAdmin'], ['usuario-btnGuardar', 'usuario-btnCancelar']);
        } catch (error) {
            alert('Error al registrar: ' + error.message);
        }
    }

    async handleLogin() {
        const form = this.querySelector('#usuario-form');
        const id = form.querySelector('#usuario-id').value;
        const password = form.querySelector('#usuario-password').value;
        if (!id || !password) {
            alert('Por favor ingrese identificación y contraseña');
            return;
        }
        try {
            const usuario = await loginUsuario(id, password);
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
            localStorage.removeItem('adminLogueado');
            alert('Inicio de sesión exitoso');
            this.resetForm();
            document.dispatchEvent(new Event('usuarioLogueado'));
        } catch (error) {
            alert('Error al iniciar sesión: ' + error.message);
        }
    }

    async handleLoginAdmin() {
        const form = this.querySelector('#usuario-form');
        const username = form.querySelector('#usuario-id').value;
        const password = form.querySelector('#usuario-password').value;
        if (!username || !password) {
            alert('Por favor ingrese nombre de usuario y contraseña');
            return;
        }
        try {
            const admin = await loginAdmin({ username, password });
            localStorage.setItem('adminLogueado', JSON.stringify(admin));
            localStorage.removeItem('usuarioLogueado');
            alert('Inicio de sesión admin exitoso');
            this.resetForm();
            document.dispatchEvent(new Event('adminLogueado'));
        } catch (error) {
            alert('Error al iniciar sesión admin: ' + error.message);
        }
    }

    toggleButtons(enable, disable) {
        enable.forEach(id => this.querySelector(`#${id}`).classList.remove('disabled'));
        disable.forEach(id => this.querySelector(`#${id}`).classList.add('disabled'));
    }

    resetForm() {
        this.querySelector('#usuario-form').reset();
    }

    disableForm(disabled) {
        const form = this.querySelector('#usuario-form');
        Array.from(form.elements).forEach(el => {
            if (el.tagName !== 'BUTTON') el.disabled = disabled;
        });
    }
}
customElements.define('reg-usuario', RegUsuario);