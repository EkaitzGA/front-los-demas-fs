import { io } from 'socket.io-client';

let socket = null;
let isInitializing = false;

export const initSocket = () => {
    if (isInitializing) {
        console.log('Inicialización del socket en progreso...');
        return socket;
    }

    const token = localStorage.getItem('token');
    // Decodificar el token para obtener el ID
    let userId = null;
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
        localStorage.setItem('userId', userId);
    }

    console.log('===== Inicialización del Socket =====');
    console.log('Token existe:', !!token);
    console.log('ID de usuario:', userId);
    
    if (!token || !userId) {
        console.error('No se encontró token o userId');
        return null;
    }

    try {
        if (!socket || !socket.connected) {
            isInitializing = true;
            console.log('Creando nueva conexión de socket...');
            
            const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3002';
            socket = io(baseUrl, {
                auth: {
                    token
                },
                withCredentials: true,
                transports: ['polling', 'websocket'],
                forceNew: false,
                reconnectionAttempts: 3,
                reconnectionDelay: 1000,
                timeout: 10000
            });

            socket.on('connect', () => {
                console.log('Conectado al servidor de socket, registrando usuario...');
                socket.emit('register-socket', userId);
                isInitializing = false;
            });

            socket.on('connect_error', (error) => {
                console.error('Error de conexión del socket:', error.message);
                isInitializing = false;
            });

            socket.on('disconnect', () => {
                console.log('Desconectado del servidor de socket');
                isInitializing = false;
            });

            socket.on('connected-users', (users) => {
                console.log('Lista de usuarios actualizada:', users);
            });
        } else {
            console.log('Usando conexión de socket existente');
            socket.emit('register-socket', userId);
        }
    } catch (error) {
        console.error('Error al crear el socket:', error);
        isInitializing = false;
        return null;
    }

    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log('Desconectando socket...');
        socket.disconnect();
        socket = null;
        isInitializing = false;
    }
};

export default { initSocket, getSocket, disconnectSocket };