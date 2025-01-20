import { useLoaderData, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import ChatErrorBoundary from "../../components/chat/ErrorBoundary";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Chat.css";
import { jwtDecode } from "jwt-decode";

function ChatRoom() {
  const navigate = useNavigate();
  let loaderData;

  try {
    loaderData = useLoaderData();
    console.log('Loader data:', loaderData);
  } catch (error) {
    console.error("Error loading chat data:", error);
    return <ChatErrorBoundary error={error} />;
  }

  const initialChat = loaderData?.data || loaderData;
  const [messages, setMessages] = useState(initialChat?.messages || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);

  const token = localStorage.getItem("token");
  const getUserId = () => {
    console.log("token: ", token);
    const decoded = jwtDecode(token);
    console.log("decoded token: ", decoded);
    return decoded?.id || null;
  };
  const userId = getUserId();
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

  const getOtherParticipantName = () => {
    if (!initialChat || !userId) return "Usuario";
    
    try {
      if (initialChat.owner && initialChat.owner._id === userId && initialChat.client) {
        const clientName = [
          initialChat.client.name || "",
          initialChat.client.lastname || "",
        ].filter(Boolean).join(" ");
        return clientName || "Cliente";
      } else if (initialChat.owner) {
        const ownerName = [
          initialChat.owner.name || "",
          initialChat.owner.lastname || "",
        ].filter(Boolean).join(" ");
        return ownerName || "Propietario";
      }
    } catch (error) {
      console.error("Error getting participant name:", error);
    }
    return "Usuario";
  };

  const formatDate = () => {
    try {
      const now = new Date();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return now.toLocaleDateString("es-ES", options)
        .replace(/^\w/, (c) => c.toUpperCase());
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error scrolling to bottom:", error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    if (!initialChat?._id) {
      console.error("No chat ID available");
      return;
    }

    try {
      socketRef.current = io(baseUrl, {
        auth: { token },
        withCredentials: true,
        transports: ["polling", "websocket"],
        forceNew: false,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket conectado en ChatRoom");
        setConnected(true);
        socketRef.current.emit("register-socket", userId);
        socketRef.current.emit("join-chat", initialChat._id);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Error de conexión socket:", error);
        setError("Error de conexión. Reconectando...");
      });

      

      socketRef.current.on("private-message", (data) => {
        console.log('Received message:', data);
              
        setMessages(prev => {
          // Verificar si el mensaje ya existe en los mensajes actuales
          const messageExists = prev.some(msg => 
            msg.message === data.message && 
            msg.sender === data.sender && 
            new Date(msg.timestamp).getTime() === new Date(data.timestamp).getTime()
          );
                  
          if (!messageExists) {
            // Si el mensaje no existe, lo añadimos
            const newMessage = {
              message: data.message,
              sender: data.sender,
              timestamp: data.timestamp || new Date().toISOString(),
              read: false
            };
            return [...prev, newMessage];
          }
          return prev;
        });
      });

      socketRef.current.on("user-typing", ({ userId: typingUserId }) => {
        if (typingUserId !== userId) {
          setTypingUser(typingUserId);
          setTimeout(() => setTypingUser(null), 3000);
        }
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket desconectado");
        setConnected(false);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.emit("leave-chat", initialChat._id);
          socketRef.current.disconnect();
        }
      };
    } catch (error) {
      console.error("Error setting up socket connection:", error);
      setError("Error al establecer la conexión");
    }
  }, [initialChat?._id, userId, navigate, token, baseUrl]);
  

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (socketRef.current?.connected) {
      socketRef.current.emit("typing", { chatId: initialChat._id, userId });
    }
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = e.target.message.value.trim();
    
    if (!messageText || loading) return;
    
    setLoading(true);
    try {
      const messageData = {
        message: messageText,
        sender: userId,
        timestamp: new Date().toISOString(),
        read: false
      };
  
      // Añadir el mensaje localmente primero
      setMessages(prev => [...prev, messageData]);
  
      // Emitir el mensaje por socket
      if (socketRef.current?.connected) {
        socketRef.current.emit("private-message", {
          ...messageData,
          chatId: initialChat._id,
        });
      }
  
      // Guardar en la base de datos
      const response = await fetch(`${baseUrl}/chats/${initialChat._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageText
        })
      });
  
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || `Error: ${response.status}`);
      }
  
      e.target.reset();
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Error al enviar mensaje');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  
  const projectName = initialChat?.project?.name || "Chat";
  const otherParticipantName = getOtherParticipantName();

  return (
    <div className="chat-container-dsk">
      <div className="chat-top-bar">
        <Link to="/chats" className="back-to-chats">
          <ArrowBackIcon /> Mis chats
        </Link>
        <span className="current-date">{formatDate()}</span>
      </div>

      <div className="chat-header-dsk">
        <h2>Chat del Proyecto: {projectName}</h2>
        <p className="chat-participants-dsk">
          Conversación con {otherParticipantName}
        </p>
      </div>

      <div className="chat-messages-dsk">
        {messages.map((msg, index) => {
          const isOwnMessage = msg.sender?.toString() === userId?.toString();
          console.log('Message comparison:', {
            msgSender: msg.sender,
            userId,
            isOwnMessage
          });
          
          return (
            <div
              key={index}
              className={`message ${isOwnMessage ? 'message-sent' : 'message-received'}`}
            >
              <div className="message-content">{msg.message}</div>
              <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
        {typingUser && (
          <div className="typing-indicator">
            {otherParticipantName} está escribiendo...
          </div>
        )}
        {error && <div className="error-message-dsk">{error}</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container-dsk">
        <form onSubmit={handleSendMessage} className="chat-input-form-dsk">
          <input
            type="text"
            name="message"
            className="chat-input"
            placeholder="Escribe tu mensaje..."
            ref={inputRef}
            disabled={loading || !connected}
            onChange={handleTyping}
          />
          <button
            type="submit"
            className="send-button-dsk"
            disabled={loading || !connected}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;