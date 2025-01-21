import { useState, useEffect, useRef } from 'react';
import ProjectContainer from '../projectContainer/ProjectContainer';
import { getProjects } from '../../utils/api/fetch';
import './Carousel.css';

function Carousel() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();

                if (response.success) {
                    const validatedProjects = response.data.map(project => ({
                        _id: project._id,
                        images: project.images || [],
                        owner: project.owner || {},
                        date: project.date || new Date().toISOString(),
                        url: project.url || '',
                        likes: project.likes || 0
                    }));
                    setProjects(validatedProjects);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Error al cargar los proyectos');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const topProjects = [...projects]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (topProjects.length > 0) {
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
    }, [currentIndex, topProjects.length]);

    if (loading) {
        return <div className="carousel-loading">Cargando proyectos destacados...</div>;
    }

    if (error) {
        return <div className="carousel-error">{error}</div>;
    }

    if (!topProjects.length) {
        return null;
    }

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
                    {topProjects.map((project) => (
                        <div
                            key={project._id}
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
                        key={index}
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