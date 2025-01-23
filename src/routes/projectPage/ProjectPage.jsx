import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectsById, deleteProject} from '../../utils/api/fetch';
import { getRelativeTime } from '../../utils/dateUtils';
import { useFilters } from '../../context/FilterProvider';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createChat } from '../../utils/api/fetch';
import './ProjectPage.css';

function ProjectPage() {
    const navigate = useNavigate();
    const { _id } = useParams();
    const { setSelectedFilters } = useFilters();
    const [project, setProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        const fetchProject = async () => {
            setIsLoading(true);
            try {
                const response = await getProjectsById(_id);
                if (!response.success) {
                    throw new Error('Project not found');
                }
                setProject(response.data);
                setLikeCount(response.data.likes || 0);

                if (token) {
                    checkIfProjectLiked(response.data._id);
                }
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

    const handleDeleteProject = async () => {
        try {
            await deleteProject(project._id);
            navigate('/');
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const userId = localStorage.getItem('userId');

    const checkIfProjectLiked = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await fetch(`http://localhost:3002/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setIsLiked(userData.projectlike.some(project => project._id === projectId));
            }
        } catch (error) {
            console.error('Error checking project like status:', error);
        }
    };

    const handleLikeClick = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            setShowAuthModal(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:3002/users/like-project', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: userId,
                    projectId: project._id
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Respuesta del servidor:', result);
                const newLikeState = !isLiked;
                setIsLiked(newLikeState);
                setLikeCount(prevLikes => newLikeState ? prevLikes + 1 : prevLikes - 1);
            }
        } catch (error) {
            console.error('Error al actualizar like:', error);
        }
    };

    const handleCreateChat = async () => {
        try {
            if (!userId) {
                setShowAuthModal(true);
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

            setIsLoading(true);
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
            setIsLoading(false);
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

    const projectName = project.name || 'Sin nombre';
    const ownerName = project.owner?.name || 'Anónimo';
    const ownerLastname = project.owner?.lastname || '';
    const projectUrl = project.url || '#';
    const projectDescription = project.description || 'Sin descripción';

    return (
        <div className='single-project-container-dsk'>
            {showDeleteModal && (
                <div className="auth-modal-overlay">
                    <div className="auth-modal">
                        <button 
                            className="close-modal" 
                            onClick={() => setShowDeleteModal(false)}
                        >
                            <CloseIcon />
                        </button>
                        
                        <div className="auth-modal-content">
                            <h2>Delete Project</h2>
                            <p>Are you sure you want to delete this project? This action cannot be undone and will result in:</p>
                            <span>
                                <span>Permanent removal of your project</span>
                                <br></br>
                                <span>Loss of all associated likes</span>
                                <br></br>
                                <span>Deletion of all comments and interactions</span>
                                <br></br>
                                <span>Removal of project from your profile</span>
                                <span></span>
                            </span>
                            
                            <div className="auth-buttons">
                                <button 
                                    className="auth-button login"
                                    onClick={handleDeleteProject}
                                >
                                    Delete Project
                                </button>
                                <button 
                                    className="auth-button register"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {showAuthModal && (
                <div className="auth-modal-overlay">
                    <div className="auth-modal">
                        <button className="close-modal" onClick={() => setShowAuthModal(false)}>
                            <CloseIcon />
                        </button>
                        <div className="auth-modal-content">
                            <h2>Authentication Required</h2>
                            <p>You need to be logged in to interact with projects</p>
                            <div className="auth-buttons">
                                <Link to="/auth?mode=login" className="auth-button login">
                                    Login
                                </Link>
                                <Link to="/auth?mode=register" className="auth-button register">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className='button-back-navigation'>
                <button onClick={() => navigate(-1)}>BACK</button>
            </div>

            <div className='first-line-dsk'>
                <h1>{projectName} by {ownerName} {ownerLastname}</h1>
                {isAuthenticated && userId === project.owner._id && (
                    <div className='edit-and-delete-project'>
                        <EditIcon className='edit-project-pg' />
                        <DeleteIcon 
                        className='delete-project-pg' 
                        onClick={() => setShowDeleteModal(true)}
                        />
                    </div>
                )}
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
                        <p>{ownerName} {ownerLastname}</p>
                    </Link>
                    {isAuthenticated && userId && project.owner && userId !== project.owner._id && (
                        <button
                            onClick={handleCreateChat}
                            className="chat-button"
                            disabled={isLoading}
                            title="Chat with creator"
                        >
                            <ChatIcon />
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
                    <div
                        className="likes-wrapper"
                        onClick={handleLikeClick}
                        style={{ cursor: 'pointer' }}
                    >
                        {isAuthenticated && isLiked ? (
                            <FavoriteIcon style={{ color: '#ff0000' }} className="heart-icon" />
                        ) : (
                            <FavoriteBorderIcon className="heart-icon" />
                        )}
                        <span>{likeCount}</span>
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