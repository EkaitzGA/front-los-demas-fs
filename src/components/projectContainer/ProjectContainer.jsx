import { Link } from 'react-router-dom';
import { getRelativeTime } from '../../utils/dateUtils'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import './ProjectContainer.css'

function ProjectContainer({ img, owner = {}, _id, date, url, likes = 0, showInfo = true }) {
    // Desestructuramos owner con valores por defecto
    const { 
        username = 'Usuario',
        _id: ownerId = '',
        name = '',
        lastname = ''
    } = owner || {};

    // Creamos el nombre completo solo si hay name o lastname
    const fullName = [name, lastname].filter(Boolean).join(' ') || username;

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
                        <div className='likes-container'>
                            <FavoriteBorderIcon />
                            <span>{likes}</span>
                        </div>
                    </div>
                    {date && <p className='date-text'>{getRelativeTime(date)}</p>}
                </div>
            )}
        </div>
    )
}

export default ProjectContainer;