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
            <div class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Registro e Inicio de Sesión</h3>
                <form id="usuario-form">
                    <div class="mb-4">
                        <label class="block text-gray-700">Identificación <span class="text-red-500">*</span></label>
                        <input type="text" id="id" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Nombre <span class="text-red-500">*</span></label>
                        <input type="text" id="nombre" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Nacionalidad <span class="text-red-500">*</span></label>
                        <input type="text" id="nacionalidad" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Email <span class="text-red-500">*</span></label>
                        <input type="email" id="email" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Teléfono <span class="text-red-500">*</span></label>
                        <input type="tel" id="telefono" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Contraseña <span class="text-red-500">*</span></label>
                        <input type="password" id="password" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="text-center">
                        <button type="button" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" id="btnNuevo">Nuevo</button>
                        <button type="button" class="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 disabled" id="btnCancelar">Cancelar</button>
                        <button type="button" class="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled" id="btnGuardar">Guardar</button>
                        <button type="button" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" id="btnLogin">Iniciar Sesión</button>
                        <button type="button" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" id="btnLoginAdmin">Iniciar Sesión Admin</button>
                    </div>
                </form>
            </div>
        `;
    }

    setupEvents() {
        this.querySelector('#btnNuevo').addEventListener('click', () => this.handleNuevo());
        this.querySelector('#btnCancelar').addEventListener('click', () => this.handleCancelar());
        this.querySelector('#btnGuardar').addEventListener('click', () => this.handleGuardar());
        this.querySelector('#btnLogin').addEventListener('click', () => this.handleLogin());
        this.querySelector('#btnLoginAdmin').addEventListener('click', () => this.handleLoginAdmin());
    }

    handleNuevo() {
        this.disableForm(false);
        this.resetForm();
        this.toggleButtons(['btnGuardar', 'btnCancelar'], ['btnNuevo', 'btnLogin', 'btnLoginAdmin']);
    }

    handleCancelar() {
        this.disableForm(true);
        this.resetForm();
        this.toggleButtons(['btnNuevo', 'btnLogin', 'btnLoginAdmin'], ['btnGuardar', 'btnCancelar']);
    }

    async handleGuardar() {
        const form = this.querySelector('#usuario-form');
        const data = {
            id: form.querySelector('#id').value,
            nombre: form.querySelector('#nombre').value,
            nacionalidad: form.querySelector('#nacionalidad').value,
            email: form.querySelector('#email').value,
            telefono: form.querySelector('#telefono').value,
            password: form.querySelector('#password').value
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
            this.toggleButtons(['btnNuevo', 'btnLogin', 'btnLoginAdmin'], ['btnGuardar', 'btnCancelar']);
        } catch (error) {
            alert('Error al registrar: ' + error.message);
        }
    }

    async handleLogin() {
        const form = this.querySelector('#usuario-form');
        const id = form.querySelector('#id').value;
        const password = form.querySelector('#password').value;
        if (!id || !password) {
            alert('Por favor ingrese identificación y contraseña');
            return;
        }
        try {
            const usuario = await loginUsuario(id, password);
            localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
            alert('Inicio de sesión exitoso');
            this.resetForm();
            document.dispatchEvent(new Event('usuarioLogueado'));
        } catch (error) {
            alert('Error al iniciar sesión: ' + error.message);
        }
    }

    async handleLoginAdmin() {
        const form = this.querySelector('#usuario-form');
        const username = form.querySelector('#id').value;
        const password = form.querySelector('#password').value;
        if (!username || !password) {
            alert('Por favor ingrese nombre de usuario y contraseña');
            return;
        }
        try {
            const admin = await loginAdmin(username, password);
            localStorage.setItem('adminLogueado', JSON.stringify(admin));
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