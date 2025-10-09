const loginAdmin = async (username, password) => {
    try {
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (!admin || admin.username !== username || admin.password !== password) {
            throw new Error('Credenciales de administrador inválidas');
        }
        console.log('Admin autenticado:', username);
        return { username };
    } catch (error) {
        console.error('Error en loginAdmin:', error);
        throw error;
    }
};

export { loginAdmin };