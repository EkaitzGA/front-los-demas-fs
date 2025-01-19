import React, { useState, useEffect } from 'react';
import { getProjects } from '../../utils/api/fetch';
import ProjectContainer from '../projectContainer/ProjectContainer';

const ProjectsGridContainer = ({ userId }) => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
    }, [userId]);

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
            </div>
        </section>
    );
};

export default ProjectsGridContainer;