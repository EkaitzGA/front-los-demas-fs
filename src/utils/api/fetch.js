const BASE_URL = import.meta.env.VITE_BACKEND_URL;

async function fetchData(route, method, data) {
    try {
        let url = new URL(route, BASE_URL);
        const fetchOptions = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if (method === 'POST' || method === 'PUT') {
            fetchOptions.body = JSON.stringify(data);
        } else {
            for (const key in data) {
                url.searchParams.append(key, data[key]);
            }
        }

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
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
}

async function login(email, password) {
    return await fetchData(`login`, 'POST', { email, password });
}

async function register(email, username, password, confirmedPassword) {
    return await fetchData(`register`, 'POST', {
        email,
        username,
        password,
        confirmedPassword
    });
}

async function getProjects() {
    return await fetchData(`projects`);
}

async function getProjectsById(id) {
    return await fetchData(`projects/${id}`);
}

async function getUserById(id) {
    return await fetchData(`users/${id}`, 'GET');
}

async function getUsers() {
    return await fetchData(`users`);
}

export {
    login,
    register,
    getProjects,
    getProjectsById,
    getUserById,
    getUsers
}