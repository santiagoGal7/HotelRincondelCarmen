export const postTicket = async (ticket) => {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    
    // Validar si la reserva existe y pertenece al usuario
    const reserva = reservas.find(r => r.id === ticket.reservaId && r.usuarioId === ticket.usuarioId);
    if (!reserva) {
        throw new Error('Reserva no encontrada o no pertenece al usuario');
    }

    tickets.push({
        ...ticket,
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        estado: 'Pendiente',
        respuesta: ''
    });
    localStorage.setItem('tickets', JSON.stringify(tickets));
    return ticket;
};

export const getTicketsByUsuario = async (usuarioId) => {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    return tickets.filter(t => t.usuarioId === usuarioId);
};

export const getAllTickets = async () => {
    return JSON.parse(localStorage.getItem('tickets')) || [];
};

export const deleteTicket = async (id, usuarioId) => {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    const ticket = tickets.find(t => t.id === id && t.usuarioId === usuarioId);
    if (!ticket) {
        throw new Error('Ticket no encontrado o no pertenece al usuario');
    }
    if (ticket.estado !== 'Pendiente') {
        throw new Error('Solo se pueden eliminar tickets en estado Pendiente');
    }
    const filtered = tickets.filter(t => t.id !== id);
    localStorage.setItem('tickets', JSON.stringify(filtered));
};

export const updateTicket = async (id, update) => {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) {
        throw new Error('Ticket no encontrado');
    }
    tickets[index] = { ...tickets[index], ...update };
    localStorage.setItem('tickets', JSON.stringify(tickets));
    return tickets[index];
};