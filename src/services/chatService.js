
const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

export const getUnreadMessagesCount = async (token) => {
    try {
        const userId = getUserIdFromToken(token);
        if (!userId) return 0;

        const response = await fetch(`${baseUrl}/chats/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching chats');
        }

        const data = await response.json();
        
        // Contar mensajes no leídos
        const unreadCount = data.data.reduce((total, chat) => {
            const unreadMessages = chat.messages.filter(msg => 
                msg.sender._id !== userId && !msg.read
            ).length;
            return total + unreadMessages;
        }, 0);

        return unreadCount;
    } catch (error) {
        console.error('Error getting unread messages:', error);
        return 0;
    }
};

const getUserIdFromToken = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1])).id;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};