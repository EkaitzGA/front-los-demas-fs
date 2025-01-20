import { useEffect, useState } from 'react';
import { initSocket, disconnectSocket } from '../services/socketService';

const ChatConnection = () => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const socket = initSocket();
        
        if (!socket) {
            setError('No token available. Please login.');
            return;
        }

        // Escuchar eventos de conexión
        socket.on('connect', () => {
            console.log('Connected with ID:', socket.id);
            setConnected(true);
            setError(null);
        });

        // Escuchar errores
        socket.on('connect_error', (err) => {
            console.error('Connection error:', err.message);
            setConnected(false);
            setError('Error connecting to chat server');
        });

        // Escuchar lista de usuarios conectados
        socket.on('connected-users', (users) => {
            console.log('Connected users:', users);
        });

        // Limpiar al desmontar
        return () => {
            disconnectSocket();
        };
    }, []);

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h2>Chat Connection Status</h2>
            <p>{connected ? '✅ Connected' : '❌ Disconnected'}</p>
        </div>
    );
};

export default ChatConnection;