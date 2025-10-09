export class ContactoSection extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Contáctanos</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-lg font-semibold mb-2">Información de Contacto</h4>
                        <p class="text-gray-600 mb-2"><strong>Teléfono:</strong> +57 123 456 7890</p>
                        <p class="text-gray-600 mb-2"><strong>Email:</strong> info@rincondelcarmen.com</p>
                        <p class="text-gray-600"><strong>Dirección:</strong> Carrera 10 #25-30, Carmen de Apicalá, Colombia</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold mb-2">Ubicación</h4>
                        <iframe class="w-full h-64 rounded-lg" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.123456789!2d-74.735123456789!3d4.147123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNOKAnDE0JzQ4LjQiTiA3NMKwNDQnMDYuNCJX!5e0!3m2!1ses!2sco!4v1697051234567" allowfullscreen="" loading="lazy"></iframe>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('contacto-section', ContactoSection);