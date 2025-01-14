import { useState } from 'react';
import ProjectContainer from '../../components/projectContainer/ProjectContainer';
import { projects } from '../../data/projects';
import './Home.css'

function Home() {

    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 12;
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='projects-page'>
            <div className='projects-grid'>
                {projects.map(project => (
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

            <div className='pagination'>
                <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className='pagination-button'
                >
                    Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='pagination-button'
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Home;