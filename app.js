import './app/components/nav-menu.js';
import './app/components/carousel.js';
import './app/components/hotel-component.js';
import './app/components/reg-usuario.js';
import './app/components/contacto.js';
import { initLocalStorage } from './js/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initLocalStorage();

    const inicioLink = document.querySelector('.nav-link[data-module="inicio"]');
    if (inicioLink) {
        inicioLink.click();
    } else {
        console.error('No se encontró el enlace de Inicio');
        document.querySelector('#mainContent').innerHTML = `
            <div class="text-center text-red-500">
                Error al cargar la página inicial. Verifique la consola para más detalles.
            </div>
        `;
    }
});