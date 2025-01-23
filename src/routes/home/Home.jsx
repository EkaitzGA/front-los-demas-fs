import { useState, useEffect, useRef } from 'react';
import ProjectContainer from '../../components/projectContainer/ProjectContainer';
import { useFilters } from '../../context/FilterProvider';
import SearchFilter from '../../components/searchFilter/SearchFilter';
import Carousel from '../../components/carousel/Carousel';
import JoinKazoku from '../../components/joinKazoku/JoinKazoku';
import { getProjects } from '../../utils/api/fetch';

import './Home.css'

function Home() {
    const { selectedFilters } = useFilters();
    const [currentPage, setCurrentPage] = useState(1);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const projectsGridRef = useRef(null);

    const projectsPerPage = 12;
    const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0);

    useEffect(() => {
        if (currentPage > 1) {
            scrollToProjects();
        }
    }, [currentPage])


    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                console.log('Iniciando petición a getProjects...');
                const response = await getProjects();
                console.log('Respuesta de getProjects:', response);

                if (response.success) {
                    console.log('Datos recibidos:', response.data);
                    const validatedProjects = response.data.map(project => ({
                        _id: project._id,
                        images: project.images || [],
                        owner: project.owner || {},
                        date: project.date || new Date().toISOString(),
                        url: project.url || '',
                        likes: project.likes || 0,
                        styles: project.styles || [],
                        types: project.types || [],
                        subjects: project.subjects || []
                    }));
                    setProjects(validatedProjects);
                } else {
                    console.error('Error en la respuesta:', response.message);
                    setError(response.message);
                }
            } catch (err) {
                console.error('Error en fetchProjects:', err);
                setError('Error al cargar los proyectos');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(project => {
        if (!Object.values(selectedFilters).some(arr => arr.length > 0)) {
            return true;
        }

        const matchesStyles = selectedFilters.styles.length === 0 ||
            selectedFilters.styles.some(style =>
                project.styles?.some(projectStyle => projectStyle.name === style)
            );

        const matchesTypes = selectedFilters.types.length === 0 ||
            selectedFilters.types.some(type =>
                project.types?.some(projectType => projectType.name === type)
            );

        const matchesSubjects = selectedFilters.subjects.length === 0 ||
            selectedFilters.subjects.some(subject =>
                project.subjects?.some(projectSubject => projectSubject.name === subject)
            );

        return matchesStyles && matchesTypes && matchesSubjects;
    });

    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const scrollToProjects = () => {
        if (projectsGridRef.current) {
            const navbarHeight = 80; // Ajusta este valor según la altura de tu navbar
            const elementPosition = projectsGridRef.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const paginate = (e, pageNumber) => {
        e.preventDefault(); // Previene la navegación
        setCurrentPage(pageNumber);
        scrollToProjects();
    };

    if (loading) {
        return <div className="loading">Cargando proyectos...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className='projects-page'>
            {!hasActiveFilters && <Carousel projects={projects} /> }
            <SearchFilter />
            <div className='projects-grid' ref={projectsGridRef}>
                {currentProjects.map(project => (
                    <ProjectContainer
                        key={project._id}
                        _id={project._id}
                        img={project.images?.[0]?.url || ''}
                        owner={project.owner}
                        date={project.date}
                        url={project.url}
                        likes={project.likes}
                    />
                ))}
            </div>

            {filteredProjects.length > projectsPerPage && (
                <div className='pagination'>
                    <button
                        onClick={(e) => paginate(e, currentPage - 1)}
                        disabled={currentPage === 1}
                        className='pagination-button'
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={(e) => paginate(e, index + 1)}
                            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={(e) => {
                            paginate(e, currentPage + 1);
                        }}
                        disabled={currentPage === totalPages}
                        className='pagination-button'
                    >
                        Next
                    </button>
                </div>
            )}
            <div className='publi'>
                <JoinKazoku />
            </div>
        </div>
    )
}

export default Home;