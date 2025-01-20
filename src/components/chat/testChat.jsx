import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initSocket, getSocket } from '../../services/socketService';

const TestChat = () => {
    const [status, setStatus] = useState('Disconnected');
    const [connectedUsers, setConnectedUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            console.log('No token or userId found, redirecting to login...');
            navigate('/auth');
            return;
        }

        console.log('Initializing socket in TestChat...');
        const socket = initSocket();

        if (!socket) {
            console.error('Failed to initialize socket');
            setStatus('Error: Connection failed');
            return;
        }

        // Configurar listeners específicos del componente
        const setupListeners = () => {
            socket.on('connect', () => {
                console.log('Socket connected in TestChat');
                setStatus('Connected ✅');
                
                // Re-registrar después de la conexión
                socket.emit('register-socket', userId);
            });

            socket.on('connected-users', (users) => {
                console.log('Received users update:', users);
                setConnectedUsers(users);
            });

            socket.on('connect_error', (error) => {
                console.error('Connection error in TestChat:', error);
                setStatus(`Error: ${error.message} ❌`);
            });
        };

        setupListeners();

        // Cleanup
        return () => {
            const currentSocket = getSocket();
            if (currentSocket) {
                currentSocket.off('connect');
                currentSocket.off('connected-users');
                currentSocket.off('connect_error');
            }
        };
    }, [navigate]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Socket Test</h2>
            <p style={{ 
                color: status.includes('Connected ✅') ? 'green' : 'red',
                fontWeight: 'bold'
            }}>
                Status: {status}
            </p>
            <div>
                <h3>Connected Users:</h3>
                <p>Current user ID: {localStorage.getItem('userId')}</p>
                {connectedUsers.length > 0 ? (
                    <ul>
                        {connectedUsers.map((userId, index) => (
                            <li key={index}>{userId}</li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ fontStyle: 'italic', color: 'white' }}>No users connected</p>
                )}
            </div>
        </div>
    );
};

export default TestChat;