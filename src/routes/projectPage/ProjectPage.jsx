import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectsById } from '../../utils/api/fetch';
import { getRelativeTime } from '../../utils/dateUtils';
import { useFilters } from '../../context/FilterProvider';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './ProjectPage.css';

function ProjectPage() {
    const navigate = useNavigate();
    const { _id } = useParams();
    const { setSelectedFilters } = useFilters();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            setIsLoading(true);
            try {
                const response = await getProjectsById(_id);
                if (!response.success) {
                    throw new Error('Project not found');
                }
                setProject(response.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching project:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (_id) {
            fetchProject();
        }
    }, [_id]);

    const handleFilterClick = (section, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [section]: [value.name]
        }));
    };

    if (isLoading) {
        return <div>Loading project...</div>;
    }

    if (error || !project) {
        return <div>Proyecto no encontrado</div>;
    }

    return (
        <div className='single-project-container-dsk'>
            <div className='button-back-navigation'>
                <button onClick={() => navigate(-1)}>BACK</button>
            </div>
            <div className='first-line-dsk'>
                <h1>{project.name} by {project.owner?.name} {project.owner?.lastname}</h1>
            </div>

            <div className='left-column-first-line'>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                    <img src={project.images?.[0]?.url} alt="Project" />
                </a>
            </div>

            <div className='left-column-second-line'>
                <div>
                    <h5>STYLES</h5>
                    <div className="tags-container">
                        {project.styles?.map((style) => (
                            <Link
                                to="/"
                                key={style._id}
                                className="tag"
                                onClick={() => handleFilterClick('styles', style)}
                            >
                                {style.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <h5>TYPES</h5>
                    <div className="tags-container">
                        {project.types?.map((type) => (
                            <Link
                                to="/"
                                key={type._id}
                                className="tag"
                                onClick={() => handleFilterClick('types', type)}
                            >
                                {type.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div>
                    <h5>SUBJECTS</h5>
                    <div className="tags-container">
                        {project.subjects?.map((subject) => (
                            <Link
                                to="/"
                                key={subject._id}
                                className="tag"
                                onClick={() => handleFilterClick('subjects', subject)}
                            >
                                {subject.name}
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
                    <Link to={`/myprofile/${project.owner?._id}`}>
                        <p>{project.owner?.name} {project.owner?.lastname}</p>
                    </Link>
                </div>
                {project.team_members && project.team_members.length > 0 && (
                    <div>
                        <h5>COLLABORATORS</h5>
                        <p>
                            {project.team_members.map(member => `${member.name} ${member.lastname}`).join(', ')}
                        </p>
                    </div>
                )}
                <div>
                    <h5>DESCRIPTION</h5>
                    <p>{project.description}</p>
                </div>
                <div>
                    <h5>LIKES</h5>
                    <div className="likes-wrapper">
                        <FavoriteBorderIcon className="heart-icon" />
                        <span>{project.likes}</span>
                    </div>
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