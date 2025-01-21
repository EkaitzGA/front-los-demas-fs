import React, { useState, useEffect } from 'react';
import { getProjects } from '../../utils/api/fetch';
import ProjectContainer from '../projectContainer/ProjectContainer';
import NewProjectButton from '../projectContainer/NewProjectButton';
import Modal from '../modal/Modal';

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
    const handleProjectCreated = (newProject) => {
        setProjects(prevProjects => [...prevProjects, newProject]);
        setIsModalOpen(false);
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
        return <div>No projects found for this user</div>;
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