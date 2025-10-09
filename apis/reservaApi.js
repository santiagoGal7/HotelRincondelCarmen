const getReservas = async () => {
    try {
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        console.log('Reservas obtenidas:', reservas);
        return reservas;
    } catch (error) {
        console.error('Error en getReservas:', error);
        return [];
    }
};

const postReserva = async (datos) => {
    try {
        console.log('Guardando reserva:', datos);
        const reservas = await getReservas();
        const solapada = reservas.some(r => 
            r.habitacionId === datos.habitacionId &&
            !(new Date(datos.fechaFin) < new Date(r.fechaInicio) || new Date(datos.fechaInicio) > new Date(r.fechaFin))
        );
        if (solapada) {
            throw new Error('Habitación no disponible en esas fechas');
        }
        reservas.push(datos);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        console.log('Reserva guardada exitosamente:', datos);
        return datos;
    } catch (error) {
        console.error('Error en postReserva:', error);
        throw error;
    }
};

const deleteReserva = async (id) => {
    try {
        console.log('Eliminando reserva:', id);
        let reservas = await getReservas();
        reservas = reservas.filter(r => r.id !== id);
        localStorage.setItem('reservas', JSON.stringify(reservas));
        console.log('Reserva eliminada:', id);
        return { id };
    } catch (error) {
        console.error('Error en deleteReserva:', error);
        throw error;
    }
};

export {
    getReservas,
    postReserva,
    deleteReserva
};