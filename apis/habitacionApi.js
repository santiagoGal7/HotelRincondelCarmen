const getHabitaciones = async () => {
    try {
        const habitaciones = JSON.parse(localStorage.getItem('habitaciones')) || [];
        console.log('Habitaciones obtenidas:', habitaciones);
        return habitaciones;
    } catch (error) {
        console.error('Error en getHabitaciones:', error);
        return [];
    }
};

const postHabitacion = async (datos) => {
    try {
        console.log('Guardando habitación:', datos);
        const habitaciones = await getHabitaciones();
        datos.id = habitaciones.length ? Math.max(...habitaciones.map(h => h.id)) + 1 : 1;
        habitaciones.push(datos);
        localStorage.setItem('habitaciones', JSON.stringify(habitaciones));
        console.log('Habitación guardada exitosamente:', datos);
        return datos;
    } catch (error) {
        console.error('Error en postHabitacion:', error);
        throw error;
    }
};

const patchHabitacion = async (datos, id) => {
    try {
        console.log('Actualizando habitación:', id, datos);
        let habitaciones = await getHabitaciones();
        habitaciones = habitaciones.map(h => h.id === id ? { ...h, ...datos } : h);
        localStorage.setItem('habitaciones', JSON.stringify(habitaciones));
        console.log('Habitación actualizada:', id);
        return { id, ...datos };
    } catch (error) {
        console.error('Error en patchHabitacion:', error);
        throw error;
    }
};

const deleteHabitacion = async (id) => {
    try {
        console.log('Eliminando habitación:', id);
        const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        if (reservas.some(r => r.habitacionId === id)) {
            throw new Error('No se puede eliminar: la habitación tiene reservas activas');
        }
        let habitaciones = await getHabitaciones();
        habitaciones = habitaciones.filter(h => h.id !== id);
        localStorage.setItem('habitaciones', JSON.stringify(habitaciones));
        console.log('Habitación eliminada:', id);
        return { id };
    } catch (error) {
        console.error('Error en deleteHabitacion:', error);
        throw error;
    }
};

export {
    getHabitaciones,
    postHabitacion,
    patchHabitacion,
    deleteHabitacion
};