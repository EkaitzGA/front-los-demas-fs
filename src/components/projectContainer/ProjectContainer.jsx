import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRelativeTime } from '../../utils/dateUtils';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import './ProjectContainer.css';

function ProjectContainer({ img, owner = {}, _id, date, url, likes = 0, showInfo = true, showLikes = true }) {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const {
        username = 'Usuario',
        _id: ownerId = '',
        name = '',
        lastname = ''
    } = owner || {};

    const fullName = [name, lastname].filter(Boolean).join(' ') || username;

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        if (token) {
            checkIfProjectLiked();
        }
    }, []);

     const checkUrls = (url) => {
        if (url.startsWith("http")) {
          return url;
        } else {
          return import.meta.env.VITE_BACKEND_URL +"/"+ url;
        }
      };

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
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token || !isAuthenticated) {
            console.log('Usuario no autenticado');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await fetch('http://localhost:3002/users/like-project', {
                method: 'PUT',
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
                src={checkUrls(img)}
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
                                )}  {showLikes && (
                                    <span>{likeCount}</span>
                                )}
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