import { useState, useEffect, useRef } from 'react';
import ProjectContainer from '../projectContainer/ProjectContainer';
import { getProjects } from '../../utils/api/fetch';
import './Carousel.css';

function Carousel({ projects }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    const topProjects = [...projects]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

    const infiniteProjects = [...topProjects, topProjects[0]];

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (topProjects.length > 0) {
            timeoutRef.current = setTimeout(() => {
                if (currentIndex === infiniteProjects.length - 1) {
                    const trackElement = document.querySelector('.carousel-track');
                    if (trackElement) {
                        trackElement.style.transition = 'none';
                        trackElement.style.transform = 'translateX(0)';
                        trackElement.offsetHeight;
                        trackElement.style.transition = 'transform 1s ease-in-out';
                    }
                    setCurrentIndex(0);
                } else {
                    setCurrentIndex(currentIndex + 1);
                }
            }, 4000);
        }
    
        return () => clearTimeout(timeoutRef.current);
    }, [currentIndex, infiniteProjects.length, topProjects.length]);

    return (
        <div className="carousel-container">
            <h1 className="carousel-title">KAZOKU USERS' SELECTION</h1>

            <div className="carousel-content">
                <div
                    className="carousel-track"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: 'transform 1s ease-in-out'
                    }}
                >
                    {infiniteProjects.map((project, index) => (
                    {infiniteProjects.map((project, index) => (
                        <div
                            key={`${project._id}-${index}`}
                            className="carousel-item"
                        >
                            <ProjectContainer
                                _id={project._id}
                                img={project.images?.[0]?.url || ''}
                                owner={project.owner}
                                date={project.date}
                                url={project.url}
                                showInfo={false}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="carousel-indicators">
                {topProjects.map((_, index) => (
                    <button
                        key={`indicator-${index}`}
                        className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ir a proyecto ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Carousel;