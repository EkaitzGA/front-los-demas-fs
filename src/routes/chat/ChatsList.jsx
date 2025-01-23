import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserChats } from '../../utils/api/fetch';
import './ChatsList.css';
import { jwtDecode } from "jwt-decode";

function ChatsList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  
  const getUserId = () => {
    try {
      console.log("Decoding token:", token);
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      return decoded?.id || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  
  const userId = getUserId();

  const getUnreadMessages = (chat) => {
    if (!chat?.messages || !Array.isArray(chat.messages) || !userId) return 0;
    
    return chat.messages.reduce((count, msg) => {
      const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
      if (!senderId) return count;

      const isFromOtherUser = senderId.toString() !== userId.toString();
      const isUnread = msg.read === false;

      if (isFromOtherUser && isUnread) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const getLastMessage = (chat) => {
    if (!chat?.messages?.length) return { text: 'No messages', unread: false };
    
    const validMessages = chat.messages
      .filter(msg => msg && msg.message && msg.sender && msg.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (validMessages.length === 0) {
      return { text: 'No valid messages', unread: false };
    }

    const lastMessage = validMessages[0];
    const senderId = typeof lastMessage.sender === 'object' ? 
      lastMessage.sender._id : lastMessage.sender;

    return {
      text: lastMessage.message,
      timestamp: new Date(lastMessage.timestamp),
      unread: senderId.toString() !== userId?.toString() && !lastMessage.read
    };
  };

  const getParticipantName = (chat) => {
    if (!chat || !userId) return 'Usuario';

    try {
      if (chat.owner?._id === userId && chat.client) {
        return [
          chat.client.name || '',
          chat.client.lastname || ''
        ].filter(Boolean).join(' ') || 'Cliente';
      } else if (chat.owner) {
        return [
          chat.owner.name || '',
          chat.owner.lastname || ''
        ].filter(Boolean).join(' ') || 'Project Owner';
      }
    } catch (error) {
      console.error('Error getting participant name:', error);
    }
    return 'Usuario';
  };
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        
        if (!userId) {
          navigate("/auth");
          return;
        }

        const response = await getUserChats(userId);

        if (response.success && response.data) {
          const chatsArray = Array.isArray(response.data) ? response.data : [];
          
          const sortedChats = chatsArray.sort((a, b) => {
            const unreadA = getUnreadMessages(a);
            const unreadB = getUnreadMessages(b);
            
            if (unreadA !== unreadB) {
              return unreadB - unreadA;
            }
            
            const dateA = new Date(b.lastActivity || b.updatedAt);
            const dateB = new Date(a.lastActivity || a.updatedAt);
            return dateA - dateB;
          });

          setChats(sortedChats);
        } else {
          throw new Error(response.message || "No se pudieron cargar los chats");
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        setError(error.message || "Error al cargar los chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    const interval = setInterval(fetchChats, 20000);
    return () => clearInterval(interval);
  }, [userId, navigate]);

  const formatDate = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], { 
        day: '2-digit', 
        month: 'short' 
      });
    }
    
    return messageDate.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit' 
    });
  };

  if (loading) {
    return <div className="chats-loading">Loading chats...</div>;
  }

  if (error) {
    return (
      <div className="chats-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="chats-page-container">
      <div className="chats-list-container">
        <h2>My conversations</h2>
        <div className="chats-grid">
          {chats.length === 0 ? (
            <p className="no-chats">You don't have active chats</p>
          ) : (
            chats.map(chat => {
              const unreadCount = getUnreadMessages(chat);
              const lastMessage = getLastMessage(chat);
              const participantName = getParticipantName(chat);
              
              return (
                <Link 
                  to={`/chats/${chat._id}`} 
                  key={chat._id} 
                  className={`chat-card ${unreadCount > 0 ? 'has-unread' : ''}`}
                >
                  <div className="chat-card-header">
                    <h3>{chat.project?.name || 'Proyecto sin nombre'}</h3>
                    <span className="participant-name">
                      {participantName}
                    </span>
                  </div>
                  <p className={`last-message ${lastMessage.unread ? 'unread' : ''}`}>
                    {lastMessage.text}
                  </p>
                  <div className="chat-card-footer">
                    {unreadCount > 0 && (
                      <span className="unread-badge-list">
                        {unreadCount} message{unreadCount !== 1 ? 's' : ''} unread
                      </span>
                    )}
                    <span className="chat-date">
                      {formatDate(lastMessage.timestamp || chat.updatedAt)}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatsList;