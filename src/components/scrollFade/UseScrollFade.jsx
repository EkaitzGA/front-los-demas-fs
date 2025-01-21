import { useState, useEffect } from 'react';

const useScrollFade = (elementRef) => {
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!elementRef.current) return;

            const element = elementRef.current;
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;

            // Comenzar a aparecer cuando el elemento está a 20% de la vista
            const fadeStart = windowHeight * 0.8;
            
            if (elementTop < fadeStart) {
                // Calcular opacidad basada en qué tan lejos ha scrolleado
                const distance = fadeStart - elementTop;
                const opacity = Math.min(distance / (windowHeight * 0.3), 1);
                setOpacity(opacity);
            } else {
                setOpacity(0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Verificar posición inicial

        return () => window.removeEventListener('scroll', handleScroll);
    }, [elementRef]);

    return opacity;
}

export default useScrollFade;