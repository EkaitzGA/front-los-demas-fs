import { useParams, Link, useNavigate } from 'react-router-dom';
import { projects } from '../../data/projects';
import { getRelativeTime } from '../../utils/dateUtils'
import { useFilters } from '../../context/FilterProvider';
import './ProjectPage.css'

function ProjectPage() {
    const navigate = useNavigate();
    const { _id } = useParams();
    const project = projects.find(p => p._id === parseInt(_id));
    const { setSelectedFilters } = useFilters();

    const handleFilterClick = (section, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [section]: [value]
        }));
    };

    if (!project) {
        return <div>Proyecto no encontrado</div>;
    }

    return (
        <div className='single-project-container-dsk'>
            <div className='button-back-navigation'>
                <button onClick={() => navigate(-1)}>BACK</button>
            </div>
            <div className='first-line-dsk'>
                <h1>{project.name} by {project.owner}</h1>
            </div>

            <div className='left-column-first-line'>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                    <img src={project.img} alt="Project" />
                </a>
            </div>

            <div className='left-column-second-line'>
                <div>
                    <h5>STYLES</h5>
                    <div className="tags-container">
                        {project.styles.map((style, index) => (
                            <Link
                                to="/"
                                key={index}
                                className="tag"
                                onClick={() => handleFilterClick('styles', style)}
                            >
                                {style}
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <h5>TYPES</h5>
                    <div className="tags-container">
                        {project.types.map((type, index) => (
                            <Link
                                to="/"
                                key={index}
                                className="tag"
                                onClick={() => handleFilterClick('types', type)}
                            >
                                {type}
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <h5>SUBJECTS</h5>
                    <div className="tags-container">
                        {project.subjects.map((subject, index) => (
                            <Link
                                to="/"
                                key={index}
                                className="tag"
                                onClick={() => handleFilterClick('subjects', subject)}
                            >
                                {subject}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className='second-column'>
                <div>
                    <h5>VISIT WEBSITE</h5>
                    <a href={project.url}>{project.url}</a>
                </div>
                <div>
                    <h5>CREATOR</h5>
                    <p>{project.owner}</p>
                </div>
                <div>
                    <h5>COLLABORATORS</h5>
                    <p>{project.team_members}</p>
                </div>
                <div>
                    <h5>DESCRIPTION</h5>
                    <p>{project.description}</p>
                </div>
                <div>
                    <h5>LIKES</h5>
                    <p>{project.likes}</p>
                </div>
                <div>
                    <h5>PUBLICATION</h5>
                    <p>{getRelativeTime(project.date)}</p>
                </div>
            </div>

        </div>
    );
}

export default ProjectPage;