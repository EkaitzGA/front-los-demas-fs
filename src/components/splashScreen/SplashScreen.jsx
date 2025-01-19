import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onDone }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        setShouldRender(false);
        onDone();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onDone]);

  if (!shouldRender) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <img 
        src="/images/gato.jpg" 
        alt="Logo"
        style={{
          width: '250px',
          height: 'auto',
          animation: 'rotateAndFadeIn 0.5s ease-in-out'
        }}
      />
    </div>
  );
};

const styles = `
  @keyframes rotateAndFadeIn {
    from {
      opacity: 0;
      transform: scale(0.3) rotate(0deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(360deg);
    }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default SplashScreen;