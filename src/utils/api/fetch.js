import {jwtDecode }from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

async function fetchData(route, method = 'GET', data = null) {
    try {
        let url = new URL(route, BASE_URL);
        const token = localStorage.getItem('token');

        const fetchOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        }

        if (method === 'POST' || method === 'PUT') {
            fetchOptions.body = JSON.stringify(data);
        } else if (data) {
            for (const key in data) {
                url.searchParams.append(key, data[key]);
            }
        }

        console.log('Fetching:', url.toString(), fetchOptions);

        const response = await fetch(url.toString(), fetchOptions);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Error en la petición');
        }

        return {
            success: true,
            data: responseData
        };
    } catch (error) {
        console.error('Fetch error:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

async function login(email, password) {
    return await fetchData('login', 'POST', { email, password });
}

async function register(email, username, password, confirmedPassword) {
    return await fetchData('register', 'POST', {
        email,
        username,
        password,
        confirmedPassword
    });
}

async function getProjects() {
    return await fetchData('projects');
}

async function getProjectsById(id) {
    return await fetchData(`projects/${id}`);
}

async function getUserById(id) {
    return await fetchData(`users/${id}`, 'GET');
}

async function getUsers() {
    return await fetchData('users');
}

async function createOwnProject(id) {
    return await fetchData(`projects/${id}`, 'POST', data);
}

async function updateProject(id) {
    return await fetchData(`projects/${id}`, 'PUT', data);
}

async function getAllTypes() {
    return await fetchData('types');
}

async function getAllStyles() {
    return await fetchData('styles');
}

async function getAllSubjects() {
    return await fetchData('subjects');
}

async function getUSerByUsername(username) {
    return await fetchData(`users/username/${username}`);
}

async function getUserChats(userId) {
    try {
        if (!userId) {
            throw new Error('UserId es requerido');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No autorizado');
        }

        console.log('Fetching chats for user:', userId);

        
        const response = await fetch(`${BASE_URL}/chats/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Chats response:', data);

        if (!response.ok) {
            throw new Error(data.message || `Error: ${response.status}`);
        }

        return {
            success: true,
            data: data.data || data 
        };
    } catch (error) {
        console.error('Error getting user chats:', error);
        return {
            success: false,
            message: error.message,
            data: []
        };
    }
}

async function getAllChatsByUser(userId) {
    try {
        console.log('Getting chats for user:', userId);

        if (!userId) {
            throw new Error('UserId es requerido');
        }

        const chats = await Chat.find({
            $or: [
                { owner: userId },
                { client: userId }
            ]
        })
            .populate('owner', '-password')
            .populate('client', '-password')
            .populate('project')
            .sort({ updatedAt: -1 });

        console.log(`Found ${chats.length} chats for user ${userId}`);
        return chats;
    } catch (error) {
        console.error('Error getting user chats:', error);
        throw error;
    }
}

async function checkExistingChat(projectId) {
    const userId = localStorage.getItem('userId');
    try {
        const response = await fetchData('chats/check', 'POST', {
            project: projectId,
            userId
        });
        return response;
    } catch (error) {
        console.error('Error checking existing chat:', error);
        return { success: false, message: error.message };
    }
}


async function createChat(projectId, ownerId) {
    try {
        if (!projectId || !ownerId) {
            throw new Error('ProjectId y ownerId son requeridos');
        }

        const getUserId = () => {
            const token = localStorage.getItem(`token`);
                console.log('token: ', token)
                const decoded = jwtDecode(token)
                console.log("decoded token: ", decoded)
                return decoded?.id || null;
        }
        const userId = getUserId();
        if (!userId) {
            throw new Error('Usuario no autenticado');
        }

        console.log('Creating chat:', { projectId, ownerId, userId });

        const response = await fetch(`${BASE_URL}/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                project: projectId,
                owner: ownerId,
                client: userId
            })
        });

        const data = await response.json();
        console.log('Create chat response:', data);

        if (!response.ok) {
            throw new Error(data.message || `Error: ${response.status}`);
        }

        return {
            success: true,
            data: data.data || data
        };
    } catch (error) {
        console.error('Error in createChat:', error);
        return {
            success: false,
            message: error.message || 'Error al crear el chat'
        };
    }
}

async function getChatById(chatId) {
    return await fetchData(`chats/${chatId}`);
}

async function addMessage(chatId, message) {
    return await fetchData(`chats/${chatId}`, 'PUT', { message });
}

async function markChatAsRead(chatId) {
    return await fetchData(`chats/${chatId}/read`, 'PUT');
}



export {
    login,
    register,
    getProjects,
    getProjectsById,
    getUserById,
    getUsers,
    createChat,
    getAllChatsByUser,
    getUserChats,
    getChatById,
    checkExistingChat,
    addMessage,
    markChatAsRead,
    createOwnProject,
    updateProject,
    getAllTypes,
    getAllStyles,
    getAllSubjects,
    getUSerByUsername
};