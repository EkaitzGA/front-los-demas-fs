import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserChats } from "../../utils/api/fetch";
import "./ChatsList.css";
import { jwtDecode } from "jwt-decode";

function ChatsList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        console.log("Fetching chats for user:", userId);

        if (!userId) {
          navigate("/auth");
          return;
        }

        const response = await getUserChats(userId);
        console.log("Response from getUserChats:", response);

        if (response.success && response.data) {
          // Asegurarnos de que data es un array
          const chatsArray = Array.isArray(response.data) ? response.data : [];
          console.log("Setting chats:", chatsArray);
          setChats(chatsArray);
        } else {
          throw new Error(
            response.message || "No se pudieron cargar los chats"
          );
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        setError(error.message || "Error al cargar los chats");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchChats, 30000);
    return () => clearInterval(interval);
  }, [userId, navigate]);

  if (loading) {
    return <div className="chats-loading">Cargando chats...</div>;
  }

  if (error) {
    return (
      <div className="chats-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="chats-list-container">
      <h2>Mis Conversaciones</h2>

      <div className="chats-grid">
        {chats.length === 0 ? (
          <p className="no-chats">No tienes conversaciones activas</p>
        ) : (
          chats.map((chat) => (
            <Link
              to={`/chats/${chat._id}`}
              key={chat._id}
              className="chat-card"
            >
              <div className="chat-card-header">
                <h3>{chat.project?.name || "Proyecto sin nombre"}</h3>
                <span className="participant-name">
                  {chat.owner?._id === userId
                    ? `${chat.client?.name || ""} ${
                        chat.client?.lastname || ""
                      }`
                    : `${chat.owner?.name || ""} ${chat.owner?.lastname || ""}`}
                </span>
              </div>
              <p className="last-message">
                {chat.messages?.length > 0
                  ? chat.messages[chat.messages.length - 1].message
                  : "No hay mensajes"}
              </p>
              <div className="chat-card-footer">
                <span className="message-count">
                  {chat.messages?.length || 0} mensajes
                </span>
                <span className="chat-date">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatsList;
