import { useState } from 'react';
import ProjectContainer from '../../components/projectContainer/ProjectContainer';
import './Home.css'

function Home() {

    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 12;

    const projects = [
        {
            id: 1,
            img: "/path/to/image1.jpg",
            user_name: "Jonathan Grado",
            publication_date: "6 days ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 2,
            img: "/path/to/image2.jpg",
            user_name: "Another User",
            publication_date: "2 days ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 3,
            img: "/path/to/image3.jpg",
            user_name: "Emily Carter",
            publication_date: "1 day ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 4,
            img: "/path/to/image4.jpg",
            user_name: "Michael Smith",
            publication_date: "3 days ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 5,
            img: "/path/to/image5.jpg",
            user_name: "Sophia Johnson",
            publication_date: "5 hours ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 6,
            img: "/path/to/image6.jpg",
            user_name: "Daniel Lee",
            publication_date: "1 week ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 7,
            img: "/path/to/image7.jpg",
            user_name: "Isabella Martinez",
            publication_date: "4 days ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 8,
            img: "/path/to/image8.jpg",
            user_name: "Chris Brown",
            publication_date: "2 weeks ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 9,
            img: "/path/to/image9.jpg",
            user_name: "Olivia Wilson",
            publication_date: "3 weeks ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 10,
            img: "/path/to/image10.jpg",
            user_name: "James Davis",
            publication_date: "10 hours ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 11,
            img: "/path/to/image11.jpg",
            user_name: "Ava Miller",
            publication_date: "8 days ago",
            link: "https://enlace-externo.com"
        },
        {
            id: 12,
            img: "/path/to/image12.jpg",
            user_name: "William Taylor",
            publication_date: "6 days ago",
            link: "https://enlace-externo.com"
        }
    ];

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