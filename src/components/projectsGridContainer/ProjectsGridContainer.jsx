import React from 'react';
import ProjectContainer from '../projectContainer/ProjectContainer';

const ProjectsGridContainer = ({ userProjects }) => {
    if (!userProjects?.length) return null;

    return (
        <section id="grid" className="section-grid">
            <div className="projects-grid-dsk">
                {userProjects.map(project => (
                    <ProjectContainer
                        key={project.id}
                        id={project.id}
                        img={project.img}
                        user_name={project.user_name}
                        publication_date={project.publication_date}
                        link={project.link}
                    />
                ))}
            </div>
        </section>
    );
};

export default ProjectsGridContainer;