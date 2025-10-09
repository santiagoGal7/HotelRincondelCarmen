export class HotelCarousel extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="relative w-full max-w-4xl mx-auto">
                <div class="overflow-hidden rounded-lg">
                    <div class="flex transition-transform duration-500 ease-in-out" id="carousel-track" style="transform: translateX(0%)">
                        <img src="images/habitaciones/deluxe/deluxe1.jpg" class="w-full h-96 object-cover flex-shrink-0 snap-center" alt="Habitación Deluxe 1">
                        <img src="images/habitaciones/deluxe/deluxe2.jpg" class="w-full h-96 object-cover flex-shrink-0 snap-center" alt="Habitación Deluxe 2">
                        <img src="images/habitaciones/estandar/estandar1.jpg" class="w-full h-96 object-cover flex-shrink-0 snap-center" alt="Habitación Estándar 1">
                        <img src="images/habitaciones/estandar/estandar2.jpg" class="w-full h-96 object-cover flex-shrink-0 snap-center" alt="Habitación Estándar 2">
                        <img src="images/habitaciones/suite/suite1.jpg" class="w-full h-96 object-cover flex-shrink-0 snap-center" alt="Suite Premium 1">
                        <img src="images/habitaciones/suite/suite2.jpg" class="w-full h-96 object-cover flex-shrink-0 snap-center" alt="Suite Premium 2">
                    </div>
                </div>
                <button class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700" id="prev-btn">❮</button>
                <button class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700" id="next-btn">❯</button>
            </div>
        `;
        this.setupCarousel();
    }

    setupCarousel() {
        const track = this.querySelector('#carousel-track');
        const images = track.children;
        let currentIndex = 0;

        const moveCarousel = (direction) => {
            currentIndex = (currentIndex + direction + images.length) % images.length;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        this.querySelector('#prev-btn').addEventListener('click', () => moveCarousel(-1));
        this.querySelector('#next-btn').addEventListener('click', () => moveCarousel(1));
        setInterval(() => moveCarousel(1), 5000);
    }
}
customElements.define('hotel-carousel', HotelCarousel);