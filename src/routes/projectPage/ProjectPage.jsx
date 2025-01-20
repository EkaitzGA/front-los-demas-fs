import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectsById } from '../../utils/api/fetch';
import { getRelativeTime } from '../../utils/dateUtils';
import { useFilters } from '../../context/FilterProvider';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatIcon from '@mui/icons-material/Chat';
import { createChat } from '../../utils/api/fetch';
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
    const userId = localStorage.getItem('userId');

    const handleCreateChat = async () => {
        try {
            if (!userId) {
                navigate('/auth');
                return;
            }
    
            if (!project?._id) {
                alert('No se encontró información del proyecto');
                return;
            }
    
            if (project.owner._id === userId) {
                alert('No puedes iniciar un chat contigo mismo');
                return;
            }
    
            setLoading(true);
            console.log('Creating chat with:', {
                projectId: project._id,
                ownerId: project.owner._id,
                clientId: userId
            });
    
            const response = await createChat(project._id, project.owner._id);
            console.log('Create chat response:', response);
    
            if (response.success && response.data && response.data._id) {
                navigate(`/chats/${response.data._id}`);
            } else {
                throw new Error(response.message || 'Error al crear el chat');
            }
        } catch (error) {
            console.error('Error creating chat:', error);
            alert(error.message || 'Error al crear el chat');
        } finally {
            setLoading(false);
        }
    };

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

    // Asegurarse de que el proyecto tiene todas las propiedades necesarias
    const projectName = project.name || 'Sin nombre';
    const ownerName = project.owner?.name || 'Anónimo';
    const ownerLastname = project.owner?.lastname || '';
    const projectUrl = project.url || '#';
    const projectDescription = project.description || 'Sin descripción';
    const projectLikes = project.likes || 0;

    return (
        <div className='single-project-container-dsk'>
            <div className='button-back-navigation'>
                <button onClick={() => navigate(-1)}>BACK</button>
            </div>
            <div className='first-line-dsk'>
                <h1>{project.name} by {project.owner?.name} {project.owner?.lastname}</h1>
            </div>

            <div className='left-column-first-line'>
                {project.images && project.images[0] && (
                    <a href={projectUrl} target="_blank" rel="noopener noreferrer">
                        <img src={project.images[0].url} alt={projectName} />
                    </a>
                )}
            </div>

            <div className='left-column-second-line'>
                <div>
                    <h5>STYLES</h5>
                    <div className="tags-container">
                        {(project.styles || []).map((style) => (
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
                        {(project.types || []).map((type) => (
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
                        {(project.subjects || []).map((subject) => (
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
                    <a href={projectUrl} target="_blank" rel="noopener noreferrer">
                        {projectUrl}
                    </a>
                </div>
                <div>
                    <h5>CREATOR</h5>
                    <Link to={`/myprofile/${project.owner?._id}`}>
                        <p>{project.owner?.name} {project.owner?.lastname}</p>
                    </Link>
                    {userId && project.owner && userId !== project.owner._id && (
                        <button 
                            onClick={handleCreateChat}
                            className="chat-button"
                            disabled={loading}
                        >
                            <ChatIcon /> 
                            {loading ? 'Cargando...' : 'Chat con el creador'}
                        </button>
                    )}
                </div>
                {project.team_members && project.team_members.length > 0 && (
                    <div>
                        <h5>COLLABORATORS</h5>
                        <p>
                            {project.team_members.map(member => 
                                `${member.name || ''} ${member.lastname || ''}`
                            ).join(', ')}
                        </p>
                    </div>
                )}
                <div>
                    <h5>DESCRIPTION</h5>
                    <p>{projectDescription}</p>
                </div>
                <div>
                    <h5>LIKES</h5>
                    <div className="likes-wrapper">
                        <FavoriteBorderIcon className="heart-icon" />
                        <span>{projectLikes}</span>
                    </div>
                </div>
                <div>
                    <h5>PUBLICATION</h5>
                    <p>{project.date ? getRelativeTime(project.date) : 'Fecha no disponible'}</p>
                </div>
            </div>
        </div>
    );
}

export default ProjectPage;