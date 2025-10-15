export class ContactoSection extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Quejas & Reclamos</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-lg font-semibold mb-2">En caso de tener alguna queja o reclamo hazlo saber:</h4>
                        <a class="text-gray-600 mb-2"><strong>Teléfono:</strong>Quejas o Reclamos</a>
                        <br>
                        <h4 class="text-lg font-semibold mb-2">Tienes alguna duda?, contactanos:</h4>
                        <li><a href="#" class="nav-link hover:-gray-600 mb-2" data-module="contacto">Contacto</a></li>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('contacto-section', ContactoSection);