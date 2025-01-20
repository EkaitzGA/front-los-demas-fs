// routes/chat/ChatPhone.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ChatPhone.css';

function ChatPhone() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }

        const data = await response.json();
        setChats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [token, navigate]);

  if (loading) return <div>Loading chats...</div>;
  if (error) return <div className="error-message-mobile">{error}</div>;

  return (
    <div className="chats-list-container-mobile">
      <h2>Messages</h2>
      <div className="chats-list-mobile">
        {chats.length > 0 ? (
          chats.map(chat => (
            <Link 
              to={`/chat/${chat._id}`} 
              key={chat._id}
              className="chat-preview-mobile"
            >
              <div className="chat-preview-content">
                <h3>{chat.project}</h3>
                <span className="chat-role-mobile">
                  {chat.owner === userId ? 'Owner' : 'Client'}
                </span>
              </div>
              {chat.lastMessage && (
                <div className="chat-last-message">
                  <p>{chat.lastMessage.message}</p>
                  <span className="message-time">
                    {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </Link>
          ))
        ) : (
          <div className="no-chats-mobile">
            <p>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPhone;