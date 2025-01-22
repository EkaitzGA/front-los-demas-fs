import React, { useState, useEffect } from 'react';
import { getProjects } from '../../utils/api/fetch';
import ProjectContainer from '../projectContainer/ProjectContainer';
import NewProjectButton from '../projectContainer/NewProjectButton';
import Modal from '../modal/Modal';
import { createOwnProject } from '../../utils/api/fetch.js'
import './ProjectsGridContainer.css'

const ProjectsGridContainer = ({ userId, projectsData, isFavorites = false, showNewProjectButton = false }) => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleNewProject = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

            // await llamar a la api oara crear proyevto
    // const handleProjectCreated =async  (newProject) => {
    //     setProjects(prevProjects => [...prevProjects, newProject]);
    //     setIsModalOpen(false);
    // };

    const handleProjectCreated = async (newProject) => {
        try {
            const response = await createOwnProject(newProject);
            
            if (!response.success) {
                throw new Error(response.message || 'Error al crear el proyecto');
            }
    
            // Si la creación fue exitosa, actualizamos el estado con el proyecto devuelto por la API
            setProjects(prevProjects => [...prevProjects, response.data]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating project:', error);
            // Aquí deberías mostrar algún mensaje de error al usuario
            // Por ejemplo, si tienes un sistema de notificaciones o alerts
        }
    };

    useEffect(() => {
        if (isFavorites && projectsData) {
            setProjects(projectsData);
            setIsLoading(false);
            return;
        }
        const fetchProjects = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getProjects();
                if (!response.success) {
                    throw new Error(response.message || 'Error fetching projects');
                }

                // Filtramos los proyectos donde el owner._id coincida con nuestro userId
                const userProjects = response.data.filter(project =>
                    project.owner && project.owner._id === userId
                );

                setProjects(userProjects);
            } catch (err) {
                setError(err.message);
                console.error('Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchProjects();
        }
    }, [userId, projectsData, isFavorites]);

    const loggedUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    // Verificar si el usuario está logueado y si está viendo su propio perfil
    const isOwnProfile = loggedUserId && token && loggedUserId === userId;

    if (isLoading) {
        return <div>Loading projects...</div>;
    }

    if (error) {
        return <div>Error loading projects: {error}</div>;
    }

    if (!projects || projects.length === 0) {
        return (
            <div>
                {/* Aquí agregamos el Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onProjectCreated={handleProjectCreated}
                    userId={userId}
                />

                {/* Resto del código existente */}
                {showNewProjectButton && isOwnProfile && (
                    <div className="mb-4-no-project">
                        <NewProjectButton onClick={handleNewProject} />
                    </div>
                )}
                {isOwnProfile ? (
                    <p>Load your first Project!</p>
                ) : (
                    <p>This user has no projects yet</p>
                )}
            </div>
        );
    }




    return (
        <section className="section-grid">
            <div className="projects-grid-dsk">
                {/* {showNewProjectButton && (
                    <div className="mb-4">
                        <NewProjectButton onClick={handleNewProject} />
                    </div>
                )} */}

                {showNewProjectButton && isOwnProfile && (
                    <div className="mb-4">
                        <NewProjectButton onClick={handleNewProject} />
                    </div>
                )}

                {projects.map(project => (
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

                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onProjectCreated={handleProjectCreated}
                    userId={userId}
                />
            </div>
        </section>
    );
};

export default ProjectsGridContainer;