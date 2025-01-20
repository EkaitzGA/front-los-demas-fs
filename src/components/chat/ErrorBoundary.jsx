// components/chat/ErrorBoundary.jsx
import { useRouteError } from 'react-router-dom';

const ChatErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-container-dsk">
      <h1>Oops! Algo salió mal</h1>
      <p>{error?.message || 'Error inesperado'}</p>
      <button 
        onClick={() => window.history.back()}
        className="error-button-dsk"
      >
        Volver atrás
      </button>
    </div>
  );
};

export default ChatErrorBoundary;