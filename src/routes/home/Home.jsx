import { useState } from 'react';
import ProjectContainer from '../../components/projectContainer/ProjectContainer';
import { projects } from '../../data/projects';
import { useFilters } from '../../context/FilterProvider';
import './Home.css'

function Home() {
    const { selectedFilters } = useFilters();
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 12;
    const totalPages = Math.ceil(projects.length / projectsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const filteredProjects = projects.filter(project => {
        if (!Object.values(selectedFilters).some(arr => arr.length > 0)) {
            return true;
        }

        const matchesStyles = selectedFilters.styles.length === 0 || 
            selectedFilters.styles.some(style => project.styles.includes(style));
        
        const matchesTypes = selectedFilters.types.length === 0 || 
            selectedFilters.types.some(type => project.types.includes(type));
        
        const matchesSubjects = selectedFilters.subjects.length === 0 || 
            selectedFilters.subjects.some(subject => project.subjects.includes(subject));

        return matchesStyles && matchesTypes && matchesSubjects;
    });

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    return (
        <div className='projects-page'>
            <div className='projects-grid'>
                {currentProjects.map(project => (
                    <ProjectContainer
                        key={project.id}
                        _id={project._id}          
                        img={project.img}
                        owner={project.owner}
                        date={project.date}
                        url={project.url}     
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