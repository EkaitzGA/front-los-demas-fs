import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRelativeTime } from '../../utils/dateUtils';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import './ProjectContainer.css';

function ProjectContainer({ img, owner = {}, _id, date, url, likes = 0, showInfo = true }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Desestructuramos owner con valores por defecto
    const { 
        username = 'Usuario',
        _id: ownerId = '',
        name = '',
        lastname = ''
    } = owner || {};

    // Creamos el nombre completo solo si hay name o lastname
    const fullName = [name, lastname].filter(Boolean).join(' ') || username;

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        // Si está autenticado, verificar si ya le dio like al proyecto
        if (token) {
            checkIfProjectLiked();
        }
    }, []);

    const checkIfProjectLiked = async () => {
        try {
            console.log('Checking if project is liked...');
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            
            const response = await fetch(`http://localhost:3002/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setIsLiked(userData.projectlike.some(project => project._id === _id));
            }
        } catch (error) {
            console.error('Error checking project like status:', error);
        }
    };

    const handleLikeClick = async (e) => {
        e.preventDefault(); // Prevenir navegación si está dentro de un Link
        
        const token = localStorage.getItem('token');
        if (!token || !isAuthenticated) {
            console.log('Usuario no autenticado');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await fetch('http://localhost:3002/users/like-project', {
                method: 'PUT', // Cambiado a PUT para coincidir con el backend
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: userId,
                    projectId: _id
                })
            });

            if (response.ok) {
                const newLikeState = !isLiked;
                setIsLiked(newLikeState);
                setLikeCount(prevLikes => newLikeState ? prevLikes + 1 : prevLikes - 1);
            }
        } catch (error) {
            console.error('Error updating like:', error);
        }
    };

    return (
        <div className='project-container-dsk'>
            <div className='image-container'>
                <Link to={`/webproject/${_id}`} className="image-link">
                    <img
                        src={img || '/placeholder-image.jpg'}
                        alt={`Project by ${username}`}
                    />
                </Link>
                {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <button>Go!</button>
                    </a>
                )}
            </div>

            {showInfo && (
                <div className='project-info-dsk'>
                    <div className='info-main-row'>
                        <Link to={`/myprofile/${ownerId}`}>
                            <p>{fullName}</p>
                        </Link>
                        {isAuthenticated && (
                            <div 
                                className='likes-container' 
                                onClick={handleLikeClick}
                                style={{ cursor: 'pointer' }}
                            >
                                {isLiked ? (
                                    <FavoriteIcon style={{ color: '#ff0000' }} />
                                ) : (
                                    <FavoriteBorderIcon />
                                )}
                                <span>{likeCount}</span>
                            </div>
                        )}
                    </div>
                    {date && <p className='date-text'>{getRelativeTime(date)}</p>}
                </div>
            )}
        </div>
    );
}

export default ProjectContainer;