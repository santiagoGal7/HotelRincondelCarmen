const getUsuarios = async () => {
    try {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        console.log('Usuarios obtenidos:', usuarios);
        return usuarios;
    } catch (error) {
        console.error('Error en getUsuarios:', error);
        return [];
    }
};

const postUsuario = async (datos) => {
    try {
        console.log('Guardando usuario:', datos);
        const usuarios = await getUsuarios();
        if (usuarios.some(u => u.id === datos.id || u.email === datos.email)) {
            throw new Error('Usuario ya existe');
        }
        usuarios.push(datos);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log('Usuario guardado exitosamente:', datos);
        return datos;
    } catch (error) {
        console.error('Error en postUsuario:', error);
        throw error;
    }
};

const loginUsuario = async (id, password) => {
    try {
        const usuarios = await getUsuarios();
        const usuario = usuarios.find(u => u.id === id && u.password === password);
        if (!usuario) {
            throw new Error('Credenciales inválidas');
        }
        console.log('Usuario autenticado:', usuario);
        return usuario;
    } catch (error) {
        console.error('Error en loginUsuario:', error);
        throw error;
    }
};

export {
    getUsuarios,
    postUsuario,
    loginUsuario
};