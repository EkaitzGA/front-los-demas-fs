import { useState, useEffect, useRef } from 'react';
import ProjectContainer from '../projectContainer/ProjectContainer';
import { projects } from '../../data/projects';
import './Carousel.css';

function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const timeoutRef = useRef(null);

    const topProjects = [...projects]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

    const nextSlide = () => {
        setIsAutoPlaying(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setCurrentIndex((prevIndex) => 
            prevIndex === topProjects.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setIsAutoPlaying(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? topProjects.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        if (isAutoPlaying) {
            timeoutRef.current = setTimeout(() => {
                setCurrentIndex(prevIndex => 
                    prevIndex === topProjects.length - 1 ? 0 : prevIndex + 1
                );
            }, 4000);
        }
        
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentIndex, isAutoPlaying]);

    return (
        <div className="carousel-container">
            <button className="carousel-button prev" onClick={prevSlide}>
                &#8249;
            </button>
            
            <div className="carousel-content">
                <div 
                    className="carousel-track"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: 'transform 0.8s ease-in-out'
                    }}
                >
                    {topProjects.map((project) => (
                        <div 
                            key={project._id}
                            className="carousel-item"
                        >
                            <ProjectContainer
                                _id={project._id}
                                img={project.images?.[0]?.url}
                                owner={project.owner}
                                date={project.date}
                                url={project.url}
                                showInfo={false}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button className="carousel-button next" onClick={nextSlide}>
                &#8250;
            </button>
        </div>
    );
}

export default Carousel;